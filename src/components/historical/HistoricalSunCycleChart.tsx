import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Brush,
  Legend,
} from 'recharts';
import ChartWrapper from '../charts/ChartWrapper';
import { CHART_COLORS } from '../../utils/constants';
import { minutesToTimeString } from '../../utils/formatters';
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
          {p.name}: {minutesToTimeString(p.value)} IST
        </p>
      ))}
    </div>
  );
}

export default function HistoricalSunCycleChart({ data }: { data: HistoricalDayData[] }) {
  const minWidth = Math.max(800, data.length * 8);

  return (
    <ChartWrapper title="Sunrise & Sunset (IST)" minWidth={minWidth} height={300}>
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data} margin={{ top: 10, right: 20, left: 20, bottom: 30 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis
            dataKey="label"
            tick={{ fill: '#9ca3af', fontSize: 10 }}
            interval={Math.floor(data.length / 20)}
            angle={-30}
            textAnchor="end"
          />
          <YAxis
            domain={[300, 1200]}
            tick={{ fill: '#9ca3af', fontSize: 10 }}
            tickFormatter={(v) => minutesToTimeString(v)}
            width={60}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend iconSize={8} wrapperStyle={{ fontSize: '11px' }} />
          <Line
            type="monotone"
            dataKey="sunriseMinutes"
            name="Sunrise"
            stroke={CHART_COLORS.sunrise}
            strokeWidth={2}
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="sunsetMinutes"
            name="Sunset"
            stroke={CHART_COLORS.sunset}
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