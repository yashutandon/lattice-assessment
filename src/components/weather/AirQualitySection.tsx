import { Wind } from 'lucide-react';
import MetricCard from '../ui/MetricCard';
import { getAqiInfo } from '../../utils/formatters';
import type { AirQualityCurrentMetrics } from '../../types';

interface Props {
  data: AirQualityCurrentMetrics;
}

export default function AirQualitySection({ data }: Props) {
  const aqiInfo = getAqiInfo(data.aqi);

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Wind className="w-4 h-4 text-brand-400" />
        <h3 className="text-sm font-semibold text-gray-200 uppercase tracking-wider">
          Air Quality
        </h3>
        <span
          className="text-xs font-medium px-2 py-0.5 rounded-full"
          style={{
            backgroundColor: aqiInfo.color + '33',
            color: aqiInfo.color,
            border: `1px solid ${aqiInfo.color}55`,
          }}
        >
          {aqiInfo.label}
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <MetricCard
          label="AQI (EU)"
          value={data.aqi.toFixed(0)}
          color="text-white"
          subValue={aqiInfo.label}
        />
        <MetricCard
          label="PM10"
          value={data.pm10.toFixed(1)}
          unit="µg/m³"
          color="text-amber-300"
        />
        <MetricCard
          label="PM2.5"
          value={data.pm25.toFixed(1)}
          unit="µg/m³"
          color="text-pink-300"
        />
        <MetricCard
          label="CO"
          value={data.carbonMonoxide.toFixed(0)}
          unit="µg/m³"
          color="text-red-300"
        />
        <MetricCard
          label="CO₂"
          value="N/A"
          color="text-gray-500"
          subValue="Not in API"
        />
        <MetricCard
          label="NO₂"
          value={data.nitrogenDioxide.toFixed(1)}
          unit="µg/m³"
          color="text-purple-300"
        />
        <MetricCard
          label="SO₂"
          value={data.sulphurDioxide.toFixed(1)}
          unit="µg/m³"
          color="text-yellow-300"
        />
      </div>
    </div>
  );
}