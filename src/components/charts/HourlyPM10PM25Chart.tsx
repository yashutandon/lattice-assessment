import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Brush,
  Legend,
} from 'recharts';
import ChartWrapper from './ChartWrapper';
import { CHART_COLORS } from '../../utils/constants';
import type { HourlyAirQualityDataPoint } from '../../types';

interface TooltipProps {
  active?: boolean;
  payload?: { name: string; value: number; color: string }[];
  label?: string;
}

function CustomTooltip({ active, payload, label }: TooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-slate-800 border border-gray-600/50 rounded-lg px-3 py-2 text-xs shadow-xl">
      <p className="text-gray-400 mb-1">{label}</p>
      {payload.map((p) => (
        <p key={p.name} className="font-medium" style={{ color: p.color }}>
          {p.name}: {p.value?.toFixed(1)} µg/m³
        </p>
      ))}
    </div>
  );
}

export default function HourlyPM10PM25Chart({ data }: { data: HourlyAirQualityDataPoint[] }) {
  return (
    <ChartWrapper title="PM10 & PM2.5 (µg/m³)" minWidth={700}>
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis dataKey="label" tick={{ fill: '#9ca3af', fontSize: 11 }} interval={2} />
          <YAxis tick={{ fill: '#9ca3af', fontSize: 11 }} tickFormatter={(v) => `${v}`} />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            iconType="circle"
            iconSize={8}
            wrapperStyle={{ fontSize: '11px', paddingTop: '4px' }}
          />
          <Bar
            dataKey="pm10"
            name="PM10"
            fill={CHART_COLORS.pm10}
            fillOpacity={0.7}
            radius={[2, 2, 0, 0]}
          />
          <Line
            type="monotone"
            dataKey="pm25"
            name="PM2.5"
            stroke={CHART_COLORS.pm25}
            strokeWidth={2}
            dot={false}
          />
          <Brush dataKey="label" height={20} stroke="#374151" fill="#1a2235" travellerWidth={8} />
        </ComposedChart>
      </ResponsiveContainer>
    </ChartWrapper>
  );
}