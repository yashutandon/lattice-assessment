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
import { CHART_COLORS } from '../../utils/constants';
import type { HourlyDataPoint } from '../../types';

interface TooltipProps {
  active?: boolean;
  payload?: { value: number }[];
  label?: string;
}

function CustomTooltip({ active, payload, label }: TooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-slate-800 border border-gray-600/50 rounded-lg px-3 py-2 text-xs shadow-xl">
      <p className="text-gray-400 mb-1">{label}</p>
      <p className="text-cyan-300 font-medium">{payload[0]?.value?.toFixed(0)}%</p>
    </div>
  );
}

export default function HourlyHumidityChart({ data }: { data: HourlyDataPoint[] }) {
  return (
    <ChartWrapper title="Relative Humidity (%)" minWidth={700}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 20 }}>
          <defs>
            <linearGradient id="humidGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={CHART_COLORS.humidity} stopOpacity={0.3} />
              <stop offset="95%" stopColor={CHART_COLORS.humidity} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis dataKey="label" tick={{ fill: '#9ca3af', fontSize: 11 }} interval={2} />
          <YAxis domain={[0, 100]} tick={{ fill: '#9ca3af', fontSize: 11 }} tickFormatter={(v) => `${v}%`} />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="humidity"
            stroke={CHART_COLORS.humidity}
            fill="url(#humidGrad)"
            strokeWidth={2}
            dot={false}
          />
          <Brush dataKey="label" height={20} stroke="#374151" fill="#1a2235" travellerWidth={8} />
        </AreaChart>
      </ResponsiveContainer>
    </ChartWrapper>
  );
}