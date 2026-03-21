import  { useState, useMemo } from 'react';
import { History, MapPin, AlertCircle, Info } from 'lucide-react';
import { useGeolocation } from '../hooks/useGeolocation';
import { useHistoricalData } from '../hooks/useHistoricalData';
import DateRangePicker from '../components/ui/DateRangePicker';
import HistoricalTemperatureChart from '../components/historical/HistoricalTemperatureChart';
import HistoricalSunCycleChart from '../components/historical/HistoricalSunCycleChart';
import HistoricalPrecipitationChart from '../components/historical/HistoricalPrecipitationChart';
import HistoricalWindChart from '../components/historical/HistoricalWindChart';
import HistoricalAirQualityChart from '../components/historical/HistoricalAirQualityChart';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import ErrorMessage from '../components/ui/ErrorMessage';
import { getTodayString,  formatDate } from '../utils/formatters';

const DEFAULT_COORDS = { latitude: 28.6139, longitude: 77.209 };

function getDefaultStartDate() {
  const d = new Date();
  d.setMonth(d.getMonth() - 3);
  return d.toISOString().split('T')[0];
}

export default function HistoricalPage() {
  const today = getTodayString();
  const [startDate, setStartDate] = useState(getDefaultStartDate());
  const [endDate, setEndDate] = useState(today);

  const geo = useGeolocation();
  const coords = geo.coords ?? (geo.loading ? null : DEFAULT_COORDS);

  const historical = useHistoricalData(coords, startDate, endDate);

  const summaryStats = useMemo(() => {
    if (!historical.data.length) return null;
    const d = historical.data;
    return {
      totalPrecipitation: d.reduce((s, x) => s + x.precipitation, 0).toFixed(1),
      avgTempMax: (d.reduce((s, x) => s + x.tempMax, 0) / d.length).toFixed(1),
      avgTempMin: (d.reduce((s, x) => s + x.tempMin, 0) / d.length).toFixed(1),
      maxWindSpeed: Math.max(...d.map((x) => x.windSpeedMax)).toFixed(1),
      avgPM10: (d.reduce((s, x) => s + x.pm10, 0) / d.length).toFixed(1),
      avgPM25: (d.reduce((s, x) => s + x.pm25, 0) / d.length).toFixed(1),
      days: d.length,
    };
  }, [historical.data]);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-white flex items-center gap-2">
            <History className="w-6 h-6 text-brand-400" />
            Historical Analysis
          </h1>
          <div className="flex items-center gap-1.5 mt-1">
            <MapPin className="w-3.5 h-3.5 text-brand-400" />
            <span className="text-sm text-gray-400">
              {geo.coords
                ? `${geo.coords.latitude.toFixed(3)}, ${geo.coords.longitude.toFixed(3)}`
                : geo.loading
                ? 'Detecting...'
                : 'New Delhi (default)'}
            </span>
          </div>
        </div>
      </div>

      {/* Location warning */}
      {geo.error && (
        <div className="flex items-start gap-2 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
          <AlertCircle className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
          <p className="text-xs text-amber-300">{geo.error} Showing New Delhi.</p>
        </div>
      )}

      {/* Date Range Picker */}
      <DateRangePicker
        startDate={startDate}
        endDate={endDate}
        onStartChange={setStartDate}
        onEndChange={setEndDate}
        maxRangeYears={2}
      />

      {/* Info note */}
      <div className="flex items-start gap-2 p-3 rounded-lg bg-brand-600/10 border border-brand-600/20">
        <Info className="w-4 h-4 text-brand-400 mt-0.5 shrink-0" />
        <p className="text-xs text-brand-300">
          Showing data from <strong>{formatDate(startDate)}</strong> to <strong>{formatDate(endDate)}</strong>.
          Drag the brush on each chart to zoom into a specific period.
          Sunrise/Sunset times are in IST (UTC+5:30).
        </p>
      </div>

      {/* Loading */}
      {historical.loading && (
        <LoadingSpinner label={`Loading historical data...`} />
      )}

      {/* Error */}
      {historical.error && !historical.loading && (
        <ErrorMessage message={historical.error} />
      )}

      {/* Summary Stats */}
      {!historical.loading && summaryStats && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            { label: 'Days', value: summaryStats.days.toString(), color: 'text-gray-300' },
            { label: 'Avg Max Temp', value: `${summaryStats.avgTempMax}°C`, color: 'text-red-300' },
            { label: 'Avg Min Temp', value: `${summaryStats.avgTempMin}°C`, color: 'text-blue-300' },
            { label: 'Total Rain', value: `${summaryStats.totalPrecipitation}mm`, color: 'text-cyan-300' },
            { label: 'Max Wind', value: `${summaryStats.maxWindSpeed} km/h`, color: 'text-green-300' },
            { label: 'Avg PM2.5', value: `${summaryStats.avgPM25} µg/m³`, color: 'text-pink-300' },
          ].map((stat) => (
            <div key={stat.label} className="glass-card p-3 text-center">
              <p className="metric-label">{stat.label}</p>
              <p className={`text-lg font-semibold mt-1 ${stat.color}`}>{stat.value}</p>
            </div>
          ))}
        </div>
      )}

      {/* Charts */}
      {!historical.loading && historical.data.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Historical Charts
          </h2>
          <HistoricalTemperatureChart data={historical.data} />
          <HistoricalSunCycleChart data={historical.data} />
          <HistoricalPrecipitationChart data={historical.data} />
          <HistoricalWindChart data={historical.data} />
          <HistoricalAirQualityChart data={historical.data} />
        </div>
      )}
    </div>
  );
}