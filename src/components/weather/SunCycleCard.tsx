import { Sunrise, Sunset } from 'lucide-react';
import { toISTTimeString } from '../../utils/formatters';

interface Props {
  sunrise: string;
  sunset: string;
}

export default function SunCycleCard({ sunrise, sunset }: Props) {
  const sunriseIST = toISTTimeString(sunrise);
  const sunsetIST = toISTTimeString(sunset);

  return (
    <div className="glass-card p-4 flex gap-6 items-center justify-around animate-slide-up">
      <div className="flex flex-col items-center gap-1">
        <Sunrise className="w-8 h-8 text-amber-400" />
        <span className="text-xs text-gray-400 uppercase tracking-wider">Sunrise</span>
        <span className="text-lg font-semibold text-amber-300">{sunriseIST}</span>
        <span className="text-xs text-gray-500">IST</span>
      </div>
      <div className="w-px h-12 bg-gray-700" />
      <div className="flex flex-col items-center gap-1">
        <Sunset className="w-8 h-8 text-orange-400" />
        <span className="text-xs text-gray-400 uppercase tracking-wider">Sunset</span>
        <span className="text-lg font-semibold text-orange-300">{sunsetIST}</span>
        <span className="text-xs text-gray-500">IST</span>
      </div>
    </div>
  );
}