import { type ReactNode } from 'react';

interface Props {
  title: string;
  minWidth?: number;
  height?: number;
  children: ReactNode;
  className?: string;
}

export default function ChartWrapper({
  title,
  minWidth = 600,
  height = 260,
  children,
  className = '',
}: Props) {
  return (
    <div className={`glass-card p-4 ${className}`}>
      <h4 className="text-sm font-medium text-gray-300 mb-3">{title}</h4>
      <div className="chart-scroll-wrapper">
        <div style={{ minWidth: `${minWidth}px`, height: `${height}px` }}>
          {children}
        </div>
      </div>
    </div>
  );
}