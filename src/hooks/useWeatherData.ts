import { useState, useEffect } from 'react';
import { fetchWeatherForDate } from '../services/weatherApi';
import type { WeatherDataState, Coordinates } from '../types';

type DataType = {
  current: WeatherDataState['current'];
  daily: WeatherDataState['daily'];
  hourly: WeatherDataState['hourly'];
};

export function useWeatherData(
  coords: Coordinates | null,
  date: string
): WeatherDataState {
  const isValid = !!coords && !!date;

  const [data, setData] = useState<DataType>({
    current: null,
    daily: null,
    hourly: [],
  });

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(isValid);

  useEffect(() => {
    if (!isValid) return;

    let cancelled = false;

    const loadData = async () => {
      try {
        setError(null);

        const result = await fetchWeatherForDate(
          coords!.latitude,
          coords!.longitude,
          date
        );

        if (cancelled) return;

        setData({
          current: result.current,
          daily: result.daily,
          hourly: result.hourly,
        });

        setLoading(false);
      } catch (err: any) {
        if (cancelled) return;

        setData({
          current: null,
          daily: null,
          hourly: [],
        });

        setError(err?.message || 'Something went wrong');
        setLoading(false);
      }
    };

    loadData();

    return () => {
      cancelled = true;
    };
  }, [coords, date, isValid]);

  return {
    current: data.current,
    daily: data.daily,
    hourly: data.hourly,
    loading,
    error,
  };
}