# WeatherInsights 🌤️

A responsive, real-time and historical weather analytics application built with React, TypeScript, Tailwind CSS, and the Open-Meteo API.

## ✨ Features

### Page 1 — Current Weather & Hourly Forecast
- **Auto GPS detection** on app load with graceful fallback to New Delhi
- **Date picker** — view any past date (uses archive API automatically)
- **Individual Metrics:** Temperature (Min/Max/Current), Precipitation, Humidity, UV Index, Sunrise/Sunset (IST), Max Wind Speed, Precipitation Probability Max
- **Air Quality:** AQI (EU standard), PM10, PM2.5, CO, NO₂, SO₂ _(CO₂ not provided by Open-Meteo — displayed as N/A)_
- **6 Hourly Charts** with zoom (Brush) and horizontal scroll:
  - Temperature (with °C / °F toggle)
  - Relative Humidity
  - Precipitation
  - Visibility
  - Wind Speed (10m)
  - PM10 & PM2.5 (combined)

### Page 2 — Historical Analysis (up to 2 years)
- **Date Range Picker** with max 2-year enforcement
- **Summary statistics** for selected period
- **5 Historical Charts** with zoom and scroll:
  - Temperature (Mean, Max, Min)
  - Sunrise & Sunset trends (IST)
  - Total Precipitation
  - Max Wind Speed + Dominant Direction
  - PM10 & PM2.5 air quality trends

### UI Standards
- All charts support **horizontal scrolling** and **Brush zoom**
- Fully **mobile-responsive** (responsive grid layouts)
- **Dark theme** with glassmorphism card design
- **500ms performance** via `Promise.all` concurrent fetching + in-memory caching (5 min TTL)
- Clean, modular TypeScript components

## 🛠️ Tech Stack

| Tool | Version | Purpose |
|------|---------|---------|
| React | 18.3.x | UI framework |
| TypeScript | 5.7.x | Type safety |
| Vite | 6.x | Build tool |
| Tailwind CSS | 3.4.x | Styling |
| Recharts | 2.15.x | Data visualization |
| React Router | 6.28.x | Client-side routing |
| date-fns | 3.6.x | Date utilities |
| lucide-react | 0.474.x | Icons |

## 📡 APIs Used

| API | Purpose |
|-----|---------|
| `api.open-meteo.com/v1/forecast` | Today/future weather + hourly |
| `archive-api.open-meteo.com/v1/archive` | Historical weather data |
| `air-quality-api.open-meteo.com/v1/air-quality` | Air quality (current + historical) |

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm 9+

### Installation
```bash
# Clone the repository
git clone https://github.com/your-username/weather-insights.git
cd weather-insights

# Install dependencies
npm install

# Start development server
npm run dev
```

Open `http://localhost:5173` in your browser.

### Build for Production
``bash
npm run build
npm run preview
```

## 📁 Project Structure

src/
├── components/
│   ├── charts/          # Hourly chart components
│   ├── historical/      # Historical chart components  
│   ├── layout/          # Navbar + Layout wrapper
│   ├── ui/              # Reusable UI primitives
│   └── weather/         # Weather metric display components
├── context/             # Temperature unit context (°C/°F)
├── hooks/               # Custom React hooks (data fetching)
├── pages/               # Page-level components
├── services/            # Open-Meteo API service functions
├── types/               # TypeScript interfaces
└── utils/               # Formatters, constants, cache
```

## ⚡ Performance Approach

- **Concurrent fetching:** Weather + Air Quality APIs called in parallel via `Promise.all`
- **In-memory cache:** 5-minute TTL keyed by `{lat}:{lon}:{date}` to avoid redundant requests
- **Code splitting:** Pages lazy-loaded via `React.lazy` + `Suspense`
- **Manual chunk splitting:** Vendor, charts, and utility bundles separated in Vite config
- **Stable selectors:** `React.useMemo` on derived chart data to prevent unnecessary re-renders

## 📝 Known Limitations

- **CO₂ (Carbon Dioxide)** is not available in the Open-Meteo Air Quality API — displayed as "N/A"
- Forecast data is limited to ±16 days. Dates beyond that automatically use the archive API
- Air quality historical data is hourly, averaged to daily for the historical view
- Sunrise/Sunset on the historical chart uses IST (UTC+5:30)

## 🗺️ Environment

No API key required. Open-Meteo is fully open and free for non-commercial use.

## 📄 License

MIT