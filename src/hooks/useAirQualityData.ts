import { useState, useEffect, useTransition } from 'react';
import { fetchAirQuality } from '../services/airQualityApi';
import type {
  AirQualityState,
  Coordinates,
  AirQualityCurrentMetrics,
  HourlyAirQualityDataPoint,
} from '../types';

type DataType = {
  current: AirQualityCurrentMetrics | null;
  hourly: HourlyAirQualityDataPoint[];
};

export function useAirQualityData(
  coords: Coordinates | null,
  date: string
): AirQualityState {
  const [data, setData] = useState<DataType>({
    current: null,
    hourly: [],
  });

  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (!coords) return;

    let cancelled = false;

    const loadData = async () => {
      try {
        setError(null);

        const result = await fetchAirQuality(
          coords.latitude,
          coords.longitude,
          date
        );

        if (!cancelled) {
          startTransition(() => {
            setData({
              current: result.current,
              hourly: result.hourly,
            });
          });
        }
      } catch (err: any) {
        if (!cancelled) {
          setError(err?.message || 'Something went wrong');
        }
      }
    };

    loadData();

    return () => {
      cancelled = true;
    };
  }, [coords, date]);

  return {
    current: data.current,
    hourly: data.hourly,
    loading: isPending,
    error,
  };
}