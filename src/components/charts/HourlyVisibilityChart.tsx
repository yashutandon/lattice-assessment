import {
  ResponsiveContainer,
  LineChart,
  Line,
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
      <p className="text-purple-300 font-medium">{payload[0]?.value?.toFixed(1)} km</p>
    </div>
  );
}

export default function HourlyVisibilityChart({ data }: { data: HourlyDataPoint[] }) {
  return (
    <ChartWrapper title="Visibility (km)" minWidth={700}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis dataKey="label" tick={{ fill: '#9ca3af', fontSize: 11 }} interval={2} />
          <YAxis tick={{ fill: '#9ca3af', fontSize: 11 }} tickFormatter={(v) => `${v}km`} />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="visibility"
            stroke={CHART_COLORS.visibility}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, strokeWidth: 0 }}
          />
          <Brush dataKey="label" height={20} stroke="#374151" fill="#1a2235" travellerWidth={8} />
        </LineChart>
      </ResponsiveContainer>
    </ChartWrapper>
  );
}