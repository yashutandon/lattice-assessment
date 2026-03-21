import  { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { TemperatureProvider } from './context/TemperatureContext';
import Layout from './components/layout/Layout';
import LoadingSpinner from './components/ui/LoadingSpinner';

const CurrentWeatherPage = lazy(() => import('./pages/CurrentWeatherPage'));
const HistoricalPage = lazy(() => import('./pages/HistoricalPage'));

export default function App() {
  return (
    <TemperatureProvider>
      <BrowserRouter>
        <Layout>
          <Suspense fallback={<LoadingSpinner size="lg" label="Loading..." />}>
            <Routes>
              <Route path="/" element={<CurrentWeatherPage />} />
              <Route path="/historical" element={<HistoricalPage />} />
            </Routes>
          </Suspense>
        </Layout>
      </BrowserRouter>
    </TemperatureProvider>
  );
}