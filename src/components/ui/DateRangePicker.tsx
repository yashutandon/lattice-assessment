import { Calendar } from 'lucide-react';
import { getMinHistoricalDate, getTodayString } from '../../utils/formatters';

interface Props {
  startDate: string;
  endDate: string;
  onStartChange: (d: string) => void;
  onEndChange: (d: string) => void;
  maxRangeYears?: number;
}

export default function DateRangePicker({
  startDate,
  endDate,
  onStartChange,
  onEndChange,
  maxRangeYears = 2,
}: Props) {
  const today = getTodayString();
  const minDate = getMinHistoricalDate();

  function handleStartChange(val: string) {
    onStartChange(val);
    // Enforce max range
    const start = new Date(val);
    const maxEnd = new Date(start);
    maxEnd.setFullYear(maxEnd.getFullYear() + maxRangeYears);
    const maxEndStr = maxEnd.toISOString().split('T')[0];
    if (endDate > maxEndStr) onEndChange(maxEndStr);
    if (endDate < val) onEndChange(val);
  }

  function handleEndChange(val: string) {
    const start = new Date(startDate);
    const maxEnd = new Date(start);
    maxEnd.setFullYear(maxEnd.getFullYear() + maxRangeYears);
    const maxEndStr = maxEnd.toISOString().split('T')[0];
    onEndChange(val > maxEndStr ? maxEndStr : val);
  }

  // Compute max end date based on start
  const maxEndDate = (() => {
    const s = new Date(startDate);
    s.setFullYear(s.getFullYear() + maxRangeYears);
    const str = s.toISOString().split('T')[0];
    return str > today ? today : str;
  })();

  return (
    <div className="glass-card p-4">
      <div className="flex items-center gap-2 mb-4">
        <Calendar className="w-4 h-4 text-brand-400" />
        <h3 className="text-sm font-medium text-gray-200">Date Range</h3>
        <span className="text-xs text-gray-500">(max {maxRangeYears} years)</span>
      </div>
      <div className="flex flex-wrap gap-4">
        <div className="flex flex-col gap-1.5 flex-1 min-w-[140px]">
          <label className="text-xs text-gray-400">Start Date</label>
          <input
            type="date"
            value={startDate}
            min={minDate}
            max={endDate || today}
            onChange={(e) => handleStartChange(e.target.value)}
            className="input-field"
          />
        </div>
        <div className="flex flex-col gap-1.5 flex-1 min-w-[140px]">
          <label className="text-xs text-gray-400">End Date</label>
          <input
            type="date"
            value={endDate}
            min={startDate}
            max={maxEndDate}
            onChange={(e) => handleEndChange(e.target.value)}
            className="input-field"
          />
        </div>
      </div>
    </div>
  );
}