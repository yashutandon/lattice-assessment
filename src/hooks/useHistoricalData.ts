import { useState, useEffect } from 'react';
import { fetchHistoricalWeather } from '../services/weatherApi';
import { fetchHistoricalAirQuality } from '../services/airQualityApi';
import type { HistoricalDataState, Coordinates } from '../types';

export function useHistoricalData(
  coords: Coordinates | null,
  startDate: string,
  endDate: string
): HistoricalDataState {
  const isValid = !!coords && !!startDate && !!endDate && startDate <= endDate;

  const [data, setData] = useState<HistoricalDataState['data']>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(isValid);

  useEffect(() => {
    if (!isValid) return;

    let cancelled = false;

    const loadData = async () => {
      try {
        setError(null);

        const [weatherData, aqData] = await Promise.all([
          fetchHistoricalWeather(
            coords!.latitude,
            coords!.longitude,
            startDate,
            endDate
          ),
          fetchHistoricalAirQuality(
            coords!.latitude,
            coords!.longitude,
            startDate,
            endDate
          ),
        ]);

        if (cancelled) return;

        const aqMap = new Map(aqData.map((d) => [d.date, d]));

        const merged = weatherData.map((day) => {
          const aq = aqMap.get(day.date);
          return {
            ...day,
            pm10: aq?.pm10 ?? 0,
            pm25: aq?.pm25 ?? 0,
          };
        });

        setData(merged);
        setError(null);
        setLoading(false);
      } catch (err: any) {
        if (cancelled) return;

        setData([]);
        setError(err?.message || 'Something went wrong');
        setLoading(false);
      }
    };

    loadData();

    return () => {
      cancelled = true;
    };
  }, [coords, startDate, endDate, isValid]);

  return {
    data,
    loading,
    error,
  };
}