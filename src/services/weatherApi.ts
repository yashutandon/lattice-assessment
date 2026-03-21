import { format, parseISO, isBefore, startOfDay } from 'date-fns';
import {
  OPEN_METEO_BASE,
  OPEN_METEO_ARCHIVE,
  CACHE_TTL_MS,
} from '../utils/constants';
import {
  getCached,
  setCached,
  formatHourLabel,
  toFahrenheit,
  toISTTimeString,
} from '../utils/formatters';
import type {
  CurrentWeather,
  DailyWeather,
  HourlyDataPoint,
  HistoricalDayData,
} from '../types';

const HOURLY_PARAMS = [
  'temperature_2m',
  'relative_humidity_2m',
  'precipitation',
  'visibility',
  'wind_speed_10m',
  'precipitation_probability',
  'uv_index',
].join(',');

const DAILY_PARAMS = [
  'temperature_2m_max',
  'temperature_2m_min',
  'temperature_2m_mean',
  'precipitation_sum',
  'wind_speed_10m_max',
  'wind_direction_10m_dominant',
  'sunrise',
  'sunset',
  'uv_index_max',
  'precipitation_probability_max',
].join(',');

function buildUrl(
  base: string,
  lat: number,
  lon: number,
  params: Record<string, string>
): string {
  const url = new URL(`${base}/forecast`);
  url.searchParams.set('latitude', lat.toFixed(4));
  url.searchParams.set('longitude', lon.toFixed(4));
  url.searchParams.set('timezone', 'auto');
  for (const [k, v] of Object.entries(params)) {
    url.searchParams.set(k, v);
  }
  return url.toString();
}

function buildArchiveUrl(
  lat: number,
  lon: number,
  startDate: string,
  endDate: string,
  params: Record<string, string>
): string {
  const url = new URL(`${OPEN_METEO_ARCHIVE}/archive`);
  url.searchParams.set('latitude', lat.toFixed(4));
  url.searchParams.set('longitude', lon.toFixed(4));
  url.searchParams.set('timezone', 'auto');
  url.searchParams.set('start_date', startDate);
  url.searchParams.set('end_date', endDate);
  for (const [k, v] of Object.entries(params)) {
    url.searchParams.set(k, v);
  }
  return url.toString();
}

// Determine if a date is in the past (before today)
function isInPast(dateStr: string): boolean {
  const today = startOfDay(new Date());
  return isBefore(startOfDay(parseISO(dateStr)), today);
}

export async function fetchWeatherForDate(
  lat: number,
  lon: number,
  date: string
): Promise<{
  current: CurrentWeather;
  daily: DailyWeather;
  hourly: HourlyDataPoint[];
}> {
  const cacheKey = `weather:${lat.toFixed(2)}:${lon.toFixed(2)}:${date}`;
  const cached = getCached<{
    current: CurrentWeather;
    daily: DailyWeather;
    hourly: HourlyDataPoint[];
  }>(cacheKey, CACHE_TTL_MS);
  if (cached) return cached;

  const past = isInPast(date);

  let rawData: Response;

  if (past) {
    // Use archive API for past dates
    rawData = await fetch(
      buildArchiveUrl(lat, lon, date, date, {
        hourly: HOURLY_PARAMS,
        daily: DAILY_PARAMS,
      })
    );
  } else {
    // Use forecast API for today / future
    rawData = await fetch(
      buildUrl(OPEN_METEO_BASE, lat, lon, {
        hourly: HOURLY_PARAMS,
        daily: DAILY_PARAMS,
        current: [
          'temperature_2m',
          'relative_humidity_2m',
          'precipitation',
          'wind_speed_10m',
          'weather_code',
        ].join(','),
        start_date: date,
        end_date: date,
      })
    );
  }

  if (!rawData.ok) {
    throw new Error(`Weather API error: ${rawData.status}`);
  }

  const json = await rawData.json();
  const d = json.daily;
  const h = json.hourly;

  // Filter hourly to the selected date
  const dateHourly = h.time
    .map((t: string, i: number) => {
      if (!t.startsWith(date)) return null;
      return {
        time: t,
        label: formatHourLabel(t),
        temperature: h.temperature_2m[i] ?? 0,
        temperatureF: toFahrenheit(h.temperature_2m[i] ?? 0),
        humidity: h.relative_humidity_2m[i] ?? 0,
        precipitation: h.precipitation[i] ?? 0,
        visibility: (h.visibility[i] ?? 0) / 1000, // convert m → km
        windSpeed: h.wind_speed_10m[i] ?? 0,
        precipitationProbability: h.precipitation_probability?.[i] ?? 0,
        uvIndex: h.uv_index[i] ?? 0,
      } satisfies HourlyDataPoint;
    })
    .filter(Boolean) as HourlyDataPoint[];

  const idx = d.time.indexOf(date);
  const safeD = (arr: number[], i: number) => arr?.[i] ?? 0;
  const safeS = (arr: string[], i: number) => arr?.[i] ?? '';

  const daily: DailyWeather = {
    date,
    tempMax: safeD(d.temperature_2m_max, idx),
    tempMin: safeD(d.temperature_2m_min, idx),
    tempMean: safeD(d.temperature_2m_mean, idx),
    precipitation: safeD(d.precipitation_sum, idx),
    windSpeedMax: safeD(d.wind_speed_10m_max, idx),
    windDirectionDominant: safeD(d.wind_direction_10m_dominant, idx),
    sunrise: safeS(d.sunrise, idx),
    sunset: safeS(d.sunset, idx),
    uvIndexMax: safeD(d.uv_index_max, idx),
    precipitationProbabilityMax: safeD(d.precipitation_probability_max, idx),
  };

  // For past dates, derive "current" from mean hourly values
  const current: CurrentWeather = json.current
    ? {
        temperature: json.current.temperature_2m ?? 0,
        humidity: json.current.relative_humidity_2m ?? 0,
        precipitation: json.current.precipitation ?? 0,
        windSpeed: json.current.wind_speed_10m ?? 0,
        weatherCode: json.current.weather_code ?? 0,
      }
    : {
        temperature: daily.tempMean,
        humidity: dateHourly[Math.floor(dateHourly.length / 2)]?.humidity ?? 0,
        precipitation: daily.precipitation,
        windSpeed: daily.windSpeedMax,
        weatherCode: 0,
      };

  const result = { current, daily, hourly: dateHourly };
  setCached(cacheKey, result);
  return result;
}

export async function fetchHistoricalWeather(
  lat: number,
  lon: number,
  startDate: string,
  endDate: string
): Promise<HistoricalDayData[]> {
  const cacheKey = `hist:${lat.toFixed(2)}:${lon.toFixed(2)}:${startDate}:${endDate}`;
  const cached = getCached<HistoricalDayData[]>(cacheKey, CACHE_TTL_MS);
  if (cached) return cached;

  const res = await fetch(
    buildArchiveUrl(lat, lon, startDate, endDate, {
      daily: DAILY_PARAMS,
    })
  );

  if (!res.ok) throw new Error(`Archive API error: ${res.status}`);
  const json = await res.json();
  const d = json.daily;

  const data: HistoricalDayData[] = (d.time as string[]).map(
    (dateStr: string, i: number) => {
      const sunriseIso: string = d.sunrise?.[i] ?? '';
      const sunsetIso: string = d.sunset?.[i] ?? '';
      // Parse sunrise/sunset as minutes since midnight in IST
      const parseISTMinutes = (iso: string): number => {
        if (!iso) return 0;
        try {
          const date = new Date(iso);
          const istH = (date.getUTCHours() + 5) % 24;
          const istM = (date.getUTCMinutes() + 30) % 60;
          const carry = date.getUTCMinutes() + 30 >= 60 ? 1 : 0;
          return (istH + carry) * 60 + istM;
        } catch {
          return 0;
        }
      };

      return {
        date: dateStr,
        label: format(parseISO(dateStr), 'MMM d'),
        tempMax: d.temperature_2m_max?.[i] ?? 0,
        tempMin: d.temperature_2m_min?.[i] ?? 0,
        tempMean: d.temperature_2m_mean?.[i] ?? 0,
        precipitation: d.precipitation_sum?.[i] ?? 0,
        windSpeedMax: d.wind_speed_10m_max?.[i] ?? 0,
        windDirectionDominant: d.wind_direction_10m_dominant?.[i] ?? 0,
        sunrise: toISTTimeString(sunriseIso),
        sunset: toISTTimeString(sunsetIso),
        sunriseMinutes: parseISTMinutes(sunriseIso),
        sunsetMinutes: parseISTMinutes(sunsetIso),
        pm10: 0, // filled in by combined fetch
        pm25: 0,
      };
    }
  );

  setCached(cacheKey, data);
  return data;
}