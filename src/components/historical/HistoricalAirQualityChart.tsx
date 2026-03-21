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
import ChartWrapper from '../charts/ChartWrapper';
import { CHART_COLORS } from '../../utils/constants';
import type { HistoricalDayData } from '../../types';

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
        <p key={p.name} style={{ color: p.color }} className="font-medium">
          {p.name}: {p.value?.toFixed(1)} µg/m³
        </p>
      ))}
    </div>
  );
}

export default function HistoricalAirQualityChart({ data }: { data: HistoricalDayData[] }) {
  const minWidth = Math.max(800, data.length * 8);

  return (
    <ChartWrapper title="PM10 & PM2.5 Trends (µg/m³)" minWidth={minWidth} height={280}>
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 30 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis
            dataKey="label"
            tick={{ fill: '#9ca3af', fontSize: 10 }}
            interval={Math.floor(data.length / 20)}
            angle={-30}
            textAnchor="end"
          />
          <YAxis tick={{ fill: '#9ca3af', fontSize: 11 }} />
          <Tooltip content={<CustomTooltip />} />
          <Legend iconSize={8} wrapperStyle={{ fontSize: '11px' }} />
          <Bar
            dataKey="pm10"
            name="PM10"
            fill={CHART_COLORS.pm10}
            fillOpacity={0.65}
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
          <Brush
            dataKey="label"
            height={20}
            stroke="#374151"
            fill="#1a2235"
            travellerWidth={8}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </ChartWrapper>
  );
}