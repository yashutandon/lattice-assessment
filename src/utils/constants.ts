export const OPEN_METEO_BASE = import.meta.env.VITE_OPEN_METEO_URL;
export const OPEN_METEO_ARCHIVE = import.meta.env.VITE_OPEN_METEO_ARCHIVE_URL;
export const AIR_QUALITY_BASE = import.meta.env.VITE_AIR_QUALITY_BASE_URL;

export const MAX_HISTORY_YEARS = 2;

export const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

// Wind direction labels
export const WIND_DIRECTIONS = [
  'N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE',
  'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW',
];

export const AQI_LEVELS = [
  { max: 20,  label: 'Good',       color: '#22c55e' },
  { max: 40,  label: 'Fair',       color: '#84cc16' },
  { max: 60,  label: 'Moderate',   color: '#eab308' },
  { max: 80,  label: 'Poor',       color: '#f97316' },
  { max: 100, label: 'Very Poor',  color: '#ef4444' },
  { max: Infinity, label: 'Hazardous', color: '#7f1d1d' },
];

export const CHART_COLORS = {
  temperature: '#f97316',
  temperatureMax: '#ef4444',
  temperatureMin: '#60a5fa',
  temperatureMean: '#f97316',
  humidity: '#06b6d4',
  precipitation: '#3b82f6',
  visibility: '#8b5cf6',
  windSpeed: '#10b981',
  windDirection: '#6366f1',
  pm10: '#f59e0b',
  pm25: '#ec4899',
  sunrise: '#fbbf24',
  sunset: '#f97316',
  uvIndex: '#a855f7',
};

// // IST offset in minutes: UTC+5:30 = 330
// export const IST_OFFSET_MINUTES = 330;