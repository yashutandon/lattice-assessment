import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
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
import { windDegToDirection } from '../../utils/formatters';
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
          {p.name === 'windSpeedMax'
            ? `Speed: ${p.value?.toFixed(1)} km/h`
            : `Dir: ${windDegToDirection(p.value)} (${p.value?.toFixed(0)}°)`}
        </p>
      ))}
    </div>
  );
}

export default function HistoricalWindChart({ data }: { data: HistoricalDayData[] }) {
  const minWidth = Math.max(800, data.length * 8);

  return (
    <ChartWrapper title="Max Wind Speed & Direction" minWidth={minWidth} height={280}>
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data} margin={{ top: 10, right: 40, left: 0, bottom: 30 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis
            dataKey="label"
            tick={{ fill: '#9ca3af', fontSize: 10 }}
            interval={Math.floor(data.length / 20)}
            angle={-30}
            textAnchor="end"
          />
          <YAxis
            yAxisId="speed"
            tick={{ fill: '#9ca3af', fontSize: 11 }}
            tickFormatter={(v) => `${v}`}
          />
          <YAxis
            yAxisId="dir"
            orientation="right"
            domain={[0, 360]}
            tick={{ fill: '#9ca3af', fontSize: 10 }}
            tickFormatter={(v) => windDegToDirection(v)}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend iconSize={8} wrapperStyle={{ fontSize: '11px' }} />
          <Bar
            yAxisId="speed"
            dataKey="windSpeedMax"
            name="windSpeedMax"
            fill={CHART_COLORS.windSpeed}
            fillOpacity={0.7}
            radius={[2, 2, 0, 0]}
          />
          <Line
            yAxisId="dir"
            type="monotone"
            dataKey="windDirectionDominant"
            name="windDirectionDominant"
            stroke={CHART_COLORS.windDirection}
            strokeWidth={1.5}
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