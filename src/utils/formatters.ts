import { format, parseISO } from 'date-fns';
import {
  WIND_DIRECTIONS,
  AQI_LEVELS,
} from './constants';

// ==================== TEMPERATURE ====================

export function toFahrenheit(celsius: number): number {
  return (celsius * 9) / 5 + 32;
}

export function formatTemp(
  celsius: number,
  unit: 'C' | 'F',
  decimals = 1
): string {
  const value = unit === 'F' ? toFahrenheit(celsius) : celsius;
  return `${value.toFixed(decimals)}°${unit}`;
}

// ==================== DATE ====================

export function formatDate(dateStr: string): string {
  return format(parseISO(dateStr), 'MMM d, yyyy');
}

export function formatShortDate(dateStr: string): string {
  return format(parseISO(dateStr), 'MMM d');
}

export function formatHourLabel(isoTime: string): string {
  return format(parseISO(isoTime), 'HH:mm');
}

export function getTodayString(): string {
  return format(new Date(), 'yyyy-MM-dd');
}

// FIXED: previously useless (-0)
export function getMaxDateString(): string {
  const d = new Date();
  d.setFullYear(d.getFullYear() + 1); // allow 1 year ahead
  return format(d, 'yyyy-MM-dd');
}

export function getMinHistoricalDate(): string {
  const d = new Date();
  d.setFullYear(d.getFullYear() - 2);
  return format(d, 'yyyy-MM-dd');
}

// ==================== WIND ====================

export function windDegToDirection(deg: number): string {
  const index = Math.round(deg / 22.5) % 16;
  return WIND_DIRECTIONS[index];
}

// ==================== AQI ====================

export function getAqiInfo(
  aqi: number
): { label: string; color: string } {
  for (const level of AQI_LEVELS) {
    if (aqi <= level.max) {
      return {
        label: level.label,
        color: level.color,
      };
    }
  }

  return { label: 'Hazardous', color: '#7f1d1d' };
}

// ==================== TIME====================

// NOTE:
// API already gives time in Asia/Kolkata (IST)


export function toISTTimeString(isoTime: string): string {
  try {
    return format(parseISO(isoTime), 'h:mm a');
  } catch {
    return isoTime;
  }
}

export function isoToMinutesSinceMidnight(isoTime: string): number {
  try {
    const date = parseISO(isoTime);
    return date.getHours() * 60 + date.getMinutes();
  } catch {
    return 0;
  }
}

export function minutesToTimeString(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;

  const ampm = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 || 12;

  return `${h12}:${String(m).padStart(2, '0')} ${ampm}`;
}

// ==================== UTILS ====================

export function clamp(
  value: number,
  min: number,
  max: number
): number {
  return Math.min(Math.max(value, min), max);
}

// ==================== CACHE ====================

// Simple in-memory cache with TTL

const cache = new Map<
  string,
  { data: unknown; ts: number }
>();

export function getCached<T>(
  key: string,
  ttl: number
): T | null {
  const entry = cache.get(key);

  if (!entry) return null;

  if (Date.now() - entry.ts > ttl) {
    cache.delete(key);
    return null;
  }

  return entry.data as T;
}

export function setCached<T>(
  key: string,
  data: T
): void {
  cache.set(key, {
    data,
    ts: Date.now(),
  });
}