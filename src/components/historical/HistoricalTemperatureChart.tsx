import { useMemo } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Brush,
  Legend,
} from 'recharts';
import ChartWrapper from '../charts/ChartWrapper';
import { useTemperature } from '../../context/TemperatureContext';
import { CHART_COLORS } from '../../utils/constants';
import { toFahrenheit } from '../../utils/formatters';
import type { HistoricalDayData } from '../../types';

interface TooltipProps {
  active?: boolean;
  payload?: { name: string; value: number; color: string }[];
  label?: string;
}

function CustomTooltip({ active, payload, label }: TooltipProps) {
  const { unitLabel } = useTemperature();
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-slate-800 border border-gray-600/50 rounded-lg px-3 py-2 text-xs shadow-xl">
      <p className="text-gray-400 mb-1">{label}</p>
      {payload.map((p) => (
        <p key={p.name} style={{ color: p.color }} className="font-medium">
          {p.name}: {p.value?.toFixed(1)}{unitLabel}
        </p>
      ))}
    </div>
  );
}

export default function HistoricalTemperatureChart({ data }: { data: HistoricalDayData[] }) {
  const { unit } = useTemperature();
  const { unitLabel } = useTemperature();

  const chartData = useMemo(
    () =>
      data.map((d) => ({
        label: d.label,
        Max: parseFloat((unit === 'F' ? toFahrenheit(d.tempMax) : d.tempMax).toFixed(1)),
        Min: parseFloat((unit === 'F' ? toFahrenheit(d.tempMin) : d.tempMin).toFixed(1)),
        Mean: parseFloat((unit === 'F' ? toFahrenheit(d.tempMean) : d.tempMean).toFixed(1)),
      })),
    [data, unit]
  );

  const minWidth = Math.max(800, data.length * 8);

  return (
    <ChartWrapper title={`Temperature Trends (${unitLabel})`} minWidth={minWidth} height={300}>
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 30 }}>
          <defs>
            <linearGradient id="tempRangeGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={CHART_COLORS.temperatureMax} stopOpacity={0.15} />
              <stop offset="95%" stopColor={CHART_COLORS.temperatureMin} stopOpacity={0.05} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis
            dataKey="label"
            tick={{ fill: '#9ca3af', fontSize: 10 }}
            interval={Math.floor(data.length / 20)}
            angle={-30}
            textAnchor="end"
          />
          <YAxis tick={{ fill: '#9ca3af', fontSize: 11 }} tickFormatter={(v) => `${v}°`} />
          <Tooltip content={<CustomTooltip />} />
          <Legend iconSize={8} wrapperStyle={{ fontSize: '11px' }} />
          <Area
            type="monotone"
            dataKey="Max"
            stroke={CHART_COLORS.temperatureMax}
            fill="url(#tempRangeGrad)"
            strokeWidth={1.5}
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="Mean"
            stroke={CHART_COLORS.temperatureMean}
            strokeWidth={2}
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="Min"
            stroke={CHART_COLORS.temperatureMin}
            strokeWidth={1.5}
            dot={false}
            strokeDasharray="4 2"
          />
          <Brush
            dataKey="label"
            height={20}
            stroke="#374151"
            fill="#1a2235"
            travellerWidth={8}
            startIndex={0}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </ChartWrapper>
  );
}