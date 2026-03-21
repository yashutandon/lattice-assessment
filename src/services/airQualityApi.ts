import { AIR_QUALITY_BASE, CACHE_TTL_MS } from '../utils/constants';
import { getCached, setCached, formatHourLabel } from '../utils/formatters';
import type {
  AirQualityCurrentMetrics,
  HourlyAirQualityDataPoint,
} from '../types';

const AQ_HOURLY_PARAMS = [
  'european_aqi',
  'pm10',
  'pm2_5',
  'carbon_monoxide',
  'nitrogen_dioxide',
  'sulphur_dioxide',
].join(',');

function buildAqUrl(
  lat: number,
  lon: number,
  startDate: string,
  endDate: string
): string {
  const url = new URL(`${AIR_QUALITY_BASE}/air-quality`);
  url.searchParams.set('latitude', lat.toFixed(4));
  url.searchParams.set('longitude', lon.toFixed(4));
  url.searchParams.set('timezone', 'auto');
  url.searchParams.set('start_date', startDate);
  url.searchParams.set('end_date', endDate);
  url.searchParams.set('hourly', AQ_HOURLY_PARAMS);
  return url.toString();
}

export async function fetchAirQuality(
  lat: number,
  lon: number,
  date: string
): Promise<{
  current: AirQualityCurrentMetrics;
  hourly: HourlyAirQualityDataPoint[];
}> {
  const cacheKey = `aq:${lat.toFixed(2)}:${lon.toFixed(2)}:${date}`;
  const cached = getCached<{
    current: AirQualityCurrentMetrics;
    hourly: HourlyAirQualityDataPoint[];
  }>(cacheKey, CACHE_TTL_MS);
  if (cached) return cached;

  const res = await fetch(buildAqUrl(lat, lon, date, date));
  if (!res.ok) throw new Error(`Air Quality API error: ${res.status}`);

  const json = await res.json();
  const h = json.hourly;

  const hourly: HourlyAirQualityDataPoint[] = (h.time as string[])
    .map((t: string, i: number) => ({
      time: t,
      label: formatHourLabel(t),
      pm10: h.pm10?.[i] ?? 0,
      pm25: h.pm2_5?.[i] ?? 0,
    }))
    .filter((pt) => pt.time.startsWith(date));

  // Use noon value or first non-null value for "current"
  const noonIndex = h.time.findIndex(
    (t: string) => t.startsWith(date) && t.includes('T12:00')
  );
  const idx = noonIndex >= 0 ? noonIndex : h.time.findIndex((t: string) => t.startsWith(date));

  const current: AirQualityCurrentMetrics = {
    aqi: h.european_aqi?.[idx] ?? 0,
    pm10: h.pm10?.[idx] ?? 0,
    pm25: h.pm2_5?.[idx] ?? 0,
    carbonMonoxide: h.carbon_monoxide?.[idx] ?? 0,
    nitrogenDioxide: h.nitrogen_dioxide?.[idx] ?? 0,
    sulphurDioxide: h.sulphur_dioxide?.[idx] ?? 0,
  };

  const result = { current, hourly };
  setCached(cacheKey, result);
  return result;
}

export async function fetchHistoricalAirQuality(
  lat: number,
  lon: number,
  startDate: string,
  endDate: string
): Promise<{ date: string; pm10: number; pm25: number }[]> {
  const cacheKey = `aq-hist:${lat.toFixed(2)}:${lon.toFixed(2)}:${startDate}:${endDate}`;
  const cached = getCached<{ date: string; pm10: number; pm25: number }[]>(
    cacheKey,
    CACHE_TTL_MS
  );
  if (cached) return cached;

  const res = await fetch(buildAqUrl(lat, lon, startDate, endDate));
  if (!res.ok) throw new Error(`AQ Archive error: ${res.status}`);

  const json = await res.json();
  const h = json.hourly;

  // Aggregate hourly → daily averages
  const dailyMap = new Map<string, { pm10Sum: number; pm25Sum: number; count: number }>();
  (h.time as string[]).forEach((t: string, i: number) => {
    const day = t.split('T')[0];
    const existing = dailyMap.get(day) ?? { pm10Sum: 0, pm25Sum: 0, count: 0 };
    const pm10Val = h.pm10?.[i];
    const pm25Val = h.pm2_5?.[i];
    if (pm10Val != null && pm25Val != null) {
      existing.pm10Sum += pm10Val;
      existing.pm25Sum += pm25Val;
      existing.count += 1;
    }
    dailyMap.set(day, existing);
  });

  const result = Array.from(dailyMap.entries()).map(([date, vals]) => ({
    date,
    pm10: vals.count > 0 ? parseFloat((vals.pm10Sum / vals.count).toFixed(1)) : 0,
    pm25: vals.count > 0 ? parseFloat((vals.pm25Sum / vals.count).toFixed(1)) : 0,
  }));

  setCached(cacheKey, result);
  return result;
}