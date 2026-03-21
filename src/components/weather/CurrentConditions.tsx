import {
  Thermometer,
  Droplets,
  Wind,
  CloudRain,
  Sun,
} from 'lucide-react';
import MetricCard from '../ui/MetricCard';
import { useTemperature } from '../../context/TemperatureContext';
import { windDegToDirection } from '../../utils/formatters';
import type { CurrentWeather, DailyWeather } from '../../types';

interface Props {
  current: CurrentWeather;
  daily: DailyWeather;
}

export default function CurrentConditions({ current, daily }: Props) {
  const { convert, unitLabel } = useTemperature();

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
      <MetricCard
        label="Current Temp"
        value={convert(current.temperature).toFixed(1)}
        unit={unitLabel}
        icon={<Thermometer className="w-4 h-4 text-orange-400" />}
        color="text-orange-300"
        className="col-span-1"
      />
      <MetricCard
        label="Max / Min"
        value={`${convert(daily.tempMax).toFixed(1)} / ${convert(daily.tempMin).toFixed(1)}`}
        unit={unitLabel}
        icon={<Thermometer className="w-4 h-4 text-red-400" />}
        color="text-red-300"
      />
      <MetricCard
        label="Humidity"
        value={current.humidity.toFixed(0)}
        unit="%"
        icon={<Droplets className="w-4 h-4 text-cyan-400" />}
        color="text-cyan-300"
      />
      <MetricCard
        label="Precipitation"
        value={daily.precipitation.toFixed(1)}
        unit="mm"
        icon={<CloudRain className="w-4 h-4 text-blue-400" />}
        color="text-blue-300"
        subValue={`Prob: ${daily.precipitationProbabilityMax.toFixed(0)}%`}
      />
      <MetricCard
        label="UV Index"
        value={daily.uvIndexMax.toFixed(1)}
        icon={<Sun className="w-4 h-4 text-yellow-400" />}
        color="text-yellow-300"
        subValue={
          daily.uvIndexMax <= 2
            ? 'Low'
            : daily.uvIndexMax <= 5
            ? 'Moderate'
            : daily.uvIndexMax <= 7
            ? 'High'
            : 'Very High'
        }
      />
      <MetricCard
        label="Max Wind"
        value={daily.windSpeedMax.toFixed(1)}
        unit="km/h"
        icon={<Wind className="w-4 h-4 text-green-400" />}
        color="text-green-300"
        subValue={windDegToDirection(daily.windDirectionDominant)}
      />
    </div>
  );
}