import { useState, useEffect } from 'react';
import type { GeolocationState } from '../types';

export function useGeolocation(): GeolocationState {
  const isSupported = typeof navigator !== 'undefined' && !!navigator.geolocation;

  const [coords, setCoords] = useState<GeolocationState['coords']>(null);
  const [error, setError] = useState<string | null>(
    isSupported ? null : 'Geolocation is not supported by your browser.'
  );
  const [loading, setLoading] = useState(isSupported);

  useEffect(() => {
    if (!isSupported) return;

    let active = true;

    const id = navigator.geolocation.watchPosition(
      (pos) => {
        if (!active) return;

        setCoords({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        });

        setError(null);
        setLoading(false);
      },
      (err) => {
        if (!active) return;

        setError(`Location error: ${err.message}`);
        setLoading(false);
      },
      {
        enableHighAccuracy: false,
        timeout: 8000,
        maximumAge: 60_000,
      }
    );

    return () => {
      active = false;
      navigator.geolocation.clearWatch(id);
    };
  }, [isSupported]);

  return {
    coords,
    loading,
    error,
  };
}