import  { useMemo } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Brush,
 
} from 'recharts';
import ChartWrapper from './ChartWrapper';
import { useTemperature } from '../../context/TemperatureContext';
import { CHART_COLORS } from '../../utils/constants';
import type { HourlyDataPoint } from '../../types';

interface Props {
  data: HourlyDataPoint[];
}

interface TooltipPayload {
  value: number;
  name: string;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayload[];
  label?: string;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  const { unitLabel } = useTemperature();
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-slate-800 border border-gray-600/50 rounded-lg px-3 py-2 text-xs shadow-xl">
      <p className="text-gray-400 mb-1">{label}</p>
      <p className="text-orange-300 font-medium">
        {payload[0]?.value?.toFixed(1)}{unitLabel}
      </p>
    </div>
  );
}

export default function HourlyTemperatureChart({ data }: Props) {
  const { unit } = useTemperature();

  const chartData = useMemo(
    () =>
      data.map((d) => ({
        ...d,
        temp: unit === 'F' ? d.temperatureF : d.temperature,
      })),
    [data, unit]
  );

  const { unitLabel } = useTemperature();

  return (
    <ChartWrapper title={`Temperature (${unitLabel})`} minWidth={700}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 20 }}>
          <defs>
            <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={CHART_COLORS.temperature} stopOpacity={0.3} />
              <stop offset="95%" stopColor={CHART_COLORS.temperature} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis dataKey="label" tick={{ fill: '#9ca3af', fontSize: 11 }} interval={2} />
          <YAxis
            tick={{ fill: '#9ca3af', fontSize: 11 }}
            tickFormatter={(v) => `${v.toFixed(0)}°`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="temp"
            stroke={CHART_COLORS.temperature}
            fill="url(#tempGradient)"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, strokeWidth: 0 }}
          />
          <Brush
            dataKey="label"
            height={20}
            stroke="#374151"
            fill="#1a2235"
            travellerWidth={8}
          />
        </AreaChart>
      </ResponsiveContainer>
    </ChartWrapper>
  );
}