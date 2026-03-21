import React, { useState, useCallback } from 'react';
import { Calendar, MapPin, AlertCircle } from 'lucide-react';
import { useGeolocation } from '../hooks/useGeolocation';
import { useWeatherData } from '../hooks/useWeatherData';
import { useAirQualityData } from '../hooks/useAirQualityData';
import CurrentConditions from '../components/weather/CurrentConditions';
import AirQualitySection from '../components/weather/AirQualitySection';
import SunCycleCard from '../components/weather/SunCycleCard';
import HourlyTemperatureChart from '../components/charts/HourlyTemperatureChart';
import HourlyHumidityChart from '../components/charts/HourlyHumidityChart';
import HourlyPrecipitationChart from '../components/charts/HourlyPrecipitationChart';
import HourlyVisibilityChart from '../components/charts/HourlyVisibilityChart';
import HourlyWindSpeedChart from '../components/charts/HourlyWindSpeedChart';
import HourlyPM10PM25Chart from '../components/charts/HourlyPM10PM25Chart';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import ErrorMessage from '../components/ui/ErrorMessage';
import { getTodayString, formatDate } from '../utils/formatters';

// Default to New Delhi if geolocation fails
const DEFAULT_COORDS = { latitude: 28.6139, longitude: 77.209 };

export default function CurrentWeatherPage() {
  const [selectedDate, setSelectedDate] = useState(getTodayString());
  const geo = useGeolocation();

  const coords = geo.coords ?? (geo.loading ? null : DEFAULT_COORDS);

  const weather = useWeatherData(coords, selectedDate);
  const airQuality = useAirQualityData(coords, selectedDate);

  const isLoading = weather.loading || airQuality.loading || geo.loading;

  const handleDateChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(e.target.value);
  }, []);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-white">
            Current Weather
          </h1>
          <div className="flex items-center gap-1.5 mt-1">
            <MapPin className="w-3.5 h-3.5 text-brand-400" />
            <span className="text-sm text-gray-400">
              {geo.coords
                ? `${geo.coords.latitude.toFixed(3)}, ${geo.coords.longitude.toFixed(3)}`
                : geo.loading
                ? 'Detecting location...'
                : 'New Delhi (default)'}
            </span>
          </div>
        </div>

        {/* Date Picker */}
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-brand-400" />
          <input
            type="date"
            value={selectedDate}
            max={getTodayString()}
            onChange={handleDateChange}
            className="input-field"
          />
        </div>
      </div>

      {/* Location warning */}
      {geo.error && (
        <div className="flex items-start gap-2 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
          <AlertCircle className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
          <p className="text-xs text-amber-300">{geo.error} Showing New Delhi.</p>
        </div>
      )}

      {/* Date label */}
      <p className="text-xs text-gray-500">{formatDate(selectedDate)}</p>

      {/* Loading */}
      {isLoading && <LoadingSpinner label="Fetching weather data..." />}

      {/* Weather Error */}
      {weather.error && !weather.loading && (
        <ErrorMessage message={weather.error} />
      )}

      {/* Main Content */}
      {!isLoading && weather.current && weather.daily && (
        <>
          {/* Current Conditions */}
          <section className="space-y-2">
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Conditions
            </h2>
            <CurrentConditions current={weather.current} daily={weather.daily} />
          </section>

          {/* Sun Cycle */}
          <section className="space-y-2">
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Sun Cycle
            </h2>
            <SunCycleCard
              sunrise={weather.daily.sunrise}
              sunset={weather.daily.sunset}
            />
          </section>

          {/* Air Quality */}
          {airQuality.current && !airQuality.error && (
            <section>
              <AirQualitySection data={airQuality.current} />
            </section>
          )}
          {airQuality.error && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
              <p className="text-xs text-red-400">Air quality data unavailable: {airQuality.error}</p>
            </div>
          )}

          {/* Hourly Charts */}
          {weather.hourly.length > 0 && (
            <section className="space-y-3">
              <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Hourly Breakdown
              </h2>
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                <HourlyTemperatureChart data={weather.hourly} />
                <HourlyHumidityChart data={weather.hourly} />
                <HourlyPrecipitationChart data={weather.hourly} />
                <HourlyVisibilityChart data={weather.hourly} />
                <HourlyWindSpeedChart data={weather.hourly} />
                {airQuality.hourly.length > 0 && (
                  <HourlyPM10PM25Chart data={airQuality.hourly} />
                )}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}