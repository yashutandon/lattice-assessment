import  { type ReactNode } from 'react';

interface MetricCardProps {
  label: string;
  value: string | number;
  unit?: string;
  icon?: ReactNode;
  color?: string;
  subValue?: string;
  className?: string;
}

export default function MetricCard({
  label,
  value,
  unit,
  icon,
  color = 'text-white',
  subValue,
  className = '',
}: MetricCardProps) {
  return (
    <div
      className={`glass-card p-4 flex flex-col gap-2 animate-slide-up ${className}`}
    >
      <div className="flex items-center justify-between">
        <span className="metric-label">{label}</span>
        {icon && <span className="text-gray-500">{icon}</span>}
      </div>
      <div className="flex items-baseline gap-1">
        <span className={`metric-value ${color}`}>{value}</span>
        {unit && <span className="text-xs text-gray-400">{unit}</span>}
      </div>
      {subValue && <span className="text-xs text-gray-500">{subValue}</span>}
    </div>
  );
}