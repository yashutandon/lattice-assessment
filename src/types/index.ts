// ─── Geolocation ──────────────────────────────────────────────────────────────

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface GeolocationState {
  coords: Coordinates | null;
  loading: boolean;
  error: string | null;
}

// ─── Current / Daily Weather ──────────────────────────────────────────────────

export interface CurrentWeather {
  temperature: number;
  humidity: number;
  precipitation: number;
  windSpeed: number;
  weatherCode: number;
}

export interface DailyWeather {
  date: string;
  tempMax: number;
  tempMin: number;
  tempMean: number;
  precipitation: number;
  windSpeedMax: number;
  windDirectionDominant: number;
  sunrise: string;
  sunset: string;
  uvIndexMax: number;
  precipitationProbabilityMax: number;
}

// ─── Hourly Weather ───────────────────────────────────────────────────────────

export interface HourlyWeatherRaw {
  time: string[];
  temperature_2m: number[];
  relative_humidity_2m: number[];
  precipitation: number[];
  visibility: number[];
  wind_speed_10m: number[];
  precipitation_probability: number[];
  uv_index: number[];
}

export interface HourlyDataPoint {
  time: string;
  label: string;
  temperature: number;
  temperatureF: number;
  humidity: number;
  precipitation: number;
  visibility: number;
  windSpeed: number;
  precipitationProbability: number;
  uvIndex: number;
}

// ─── Air Quality ──────────────────────────────────────────────────────────────

export interface AirQualityCurrentMetrics {
  aqi: number;
  pm10: number;
  pm25: number;
  carbonMonoxide: number;
  nitrogenDioxide: number;
  sulphurDioxide: number;
}

export interface HourlyAirQualityDataPoint {
  time: string;
  label: string;
  pm10: number;
  pm25: number;
}

// ─── Weather Data State ───────────────────────────────────────────────────────

export interface WeatherDataState {
  current: CurrentWeather | null;
  daily: DailyWeather | null;
  hourly: HourlyDataPoint[];
  loading: boolean;
  error: string | null;
}

export interface AirQualityState {
  current: AirQualityCurrentMetrics | null;
  hourly: HourlyAirQualityDataPoint[];
  loading: boolean;
  error: string | null;
}

// ─── Historical ───────────────────────────────────────────────────────────────

export interface HistoricalDayData {
  date: string;
  label: string;
  tempMax: number;
  tempMin: number;
  tempMean: number;
  precipitation: number;
  windSpeedMax: number;
  windDirectionDominant: number;
  sunrise: string;
  sunset: string;
  sunriseMinutes: number;
  sunsetMinutes: number;
  pm10: number;
  pm25: number;
}

export interface HistoricalDataState {
  data: HistoricalDayData[];
  loading: boolean;
  error: string | null;
}

// ─── Temperature Unit ─────────────────────────────────────────────────────────

export type TemperatureUnit = 'C' | 'F';

export interface TemperatureContextValue {
  unit: TemperatureUnit;
  toggleUnit: () => void;
  convert: (celsius: number) => number;
  unitLabel: string;
}