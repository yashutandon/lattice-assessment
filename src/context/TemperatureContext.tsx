import  {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from 'react';
import { toFahrenheit } from '../utils/formatters';
import type { TemperatureContextValue, TemperatureUnit } from '../types';

const TemperatureContext = createContext<TemperatureContextValue | null>(null);

export function TemperatureProvider({ children }: { children: ReactNode }) {
  const [unit, setUnit] = useState<TemperatureUnit>('C');

  const toggleUnit = useCallback(() => {
    setUnit((u) => (u === 'C' ? 'F' : 'C'));
  }, []);

  const convert = useCallback(
    (celsius: number) => (unit === 'F' ? toFahrenheit(celsius) : celsius),
    [unit]
  );

  const unitLabel = unit === 'C' ? '°C' : '°F';

  return (
    <TemperatureContext.Provider value={{ unit, toggleUnit, convert, unitLabel }}>
      {children}
    </TemperatureContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useTemperature(): TemperatureContextValue {
  const ctx = useContext(TemperatureContext);
  if (!ctx) throw new Error('useTemperature must be used inside TemperatureProvider');
  return ctx;
}