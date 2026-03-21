import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Brush,
  Cell,
} from 'recharts';
import ChartWrapper from '../charts/ChartWrapper';
import { CHART_COLORS } from '../../utils/constants';
import type { HistoricalDayData } from '../../types';

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
      <p className="text-blue-300 font-medium">{payload[0]?.value?.toFixed(1)} mm</p>
    </div>
  );
}

export default function HistoricalPrecipitationChart({ data }: { data: HistoricalDayData[] }) {
  const minWidth = Math.max(800, data.length * 8);

  return (
    <ChartWrapper title="Total Precipitation (mm)" minWidth={minWidth} height={280}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 30 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis
            dataKey="label"
            tick={{ fill: '#9ca3af', fontSize: 10 }}
            interval={Math.floor(data.length / 20)}
            angle={-30}
            textAnchor="end"
          />
          <YAxis tick={{ fill: '#9ca3af', fontSize: 11 }} tickFormatter={(v) => `${v}mm`} />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="precipitation" radius={[2, 2, 0, 0]}>
            {data.map((d, i) => (
              <Cell
                key={i}
                fill={CHART_COLORS.precipitation}
                fillOpacity={d.precipitation > 0 ? 0.85 : 0.3}
              />
            ))}
          </Bar>
          <Brush dataKey="label" height={20} stroke="#374151" fill="#1a2235" travellerWidth={8} />
        </BarChart>
      </ResponsiveContainer>
    </ChartWrapper>
  );
}