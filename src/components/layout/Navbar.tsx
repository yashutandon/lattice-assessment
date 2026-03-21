import { NavLink } from 'react-router-dom';
import { Cloud, History, Thermometer, Menu, X, Wind } from 'lucide-react';
import { useTemperature } from '../../context/TemperatureContext';
import { useCallback, useEffect, useRef, useState } from 'react';


interface NavItem {
  to: string;
  end?: boolean;
  icon: React.ElementType;
  label: string;
  ariaLabel: string;
}



const NAV_ITEMS: NavItem[] = [
  {
    to: '/',
    end: true,
    icon: Cloud,
    label: 'Current',
    ariaLabel: 'Go to current weather',
  },
  {
    to: '/historical',
    icon: History,
    label: 'Historical',
    ariaLabel: 'Go to historical weather data',
  },
];



interface NavItemLinkProps {
  item: NavItem;
  onClick?: () => void;
  isMobile?: boolean;
}

function NavItemLink({ item, onClick, isMobile = false }: NavItemLinkProps) {
  const Icon = item.icon;

  if (isMobile) {
    return (
      <NavLink
        to={item.to}
        end={item.end}
        aria-label={item.ariaLabel}
        onClick={onClick}
        className={({ isActive }) =>
          [
            'flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium',
            'transition-all duration-200 focus-visible:outline-none focus-visible:ring-2',
            'focus-visible:ring-cyan-400/60 focus-visible:ring-offset-2',
            'focus-visible:ring-offset-slate-900',
            isActive
              ? 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/25'
              : 'text-slate-400 hover:text-slate-100 hover:bg-white/5 border border-transparent',
          ].join(' ')
        }
      >
        {({ isActive }) => (
          <>
            <Icon
              className={`w-4 h-4 shrink-0 transition-colors ${
                isActive ? 'text-cyan-400' : 'text-slate-500'
              }`}
              aria-hidden="true"
            />
            <span>{item.label}</span>
          </>
        )}
      </NavLink>
    );
  }

  return (
    <NavLink
      to={item.to}
      end={item.end}
      aria-label={item.ariaLabel}
      className={({ isActive }) =>
        [
          'relative flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium',
          'transition-all duration-200 focus-visible:outline-none focus-visible:ring-2',
          'focus-visible:ring-cyan-400/60 focus-visible:ring-offset-2',
          'focus-visible:ring-offset-slate-900 group',
          isActive
            ? 'text-cyan-300'
            : 'text-slate-400 hover:text-slate-100',
        ].join(' ')
      }
    >
      {({ isActive }) => (
        <>
          {/* Animated background */}
          <span
            className={[
              'absolute inset-0 rounded-lg transition-all duration-200',
              isActive
                ? 'bg-cyan-500/10 border border-cyan-500/25'
                : 'bg-transparent group-hover:bg-white/5 border border-transparent',
            ].join(' ')}
            aria-hidden="true"
          />
          <Icon
            className={`relative w-4 h-4 shrink-0 transition-colors ${
              isActive ? 'text-cyan-400' : 'text-slate-500 group-hover:text-slate-300'
            }`}
            aria-hidden="true"
          />
          <span className="relative">{item.label}</span>
          {/* Active dot indicator */}
          {isActive && (
            <span
              className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-cyan-400"
              aria-hidden="true"
            />
          )}
        </>
      )}
    </NavLink>
  );
}


interface TempToggleProps {
  unit: string;
  onToggle: () => void;
}

function TempToggle({ unit, onToggle }: TempToggleProps) {
  const isCelsius = unit === '°C';

  return (
    <button
      onClick={onToggle}
      aria-label={`Switch to ${isCelsius ? 'Fahrenheit' : 'Celsius'}`}
      aria-pressed={isCelsius}
      title={`Currently showing ${isCelsius ? 'Celsius' : 'Fahrenheit'} — click to switch`}
      className={[
        'relative flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium',
        'border transition-all duration-200 cursor-pointer select-none',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60',
        'focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900',
        'bg-slate-800 border-slate-700/70 text-slate-200',
        'hover:border-slate-600 hover:bg-slate-700/80',
        'active:scale-95',
      ].join(' ')}
    >
      <Thermometer className="w-4 h-4 text-orange-400" aria-hidden="true" />
      <span className="font-mono tracking-tight w-5 text-center">{unit}</span>
    </button>
  );
}

// ─── Main Navbar ──────────────────────────────────────────────────────────────

export default function Navbar() {
  const { unit, toggleUnit } = useTemperature();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  // Trap focus inside mobile menu when open
  useEffect(() => {
    if (!mobileOpen) return;

    const focusable = mobileMenuRef.current?.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled])'
    );
    focusable?.[0]?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileOpen(false);
        menuButtonRef.current?.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [mobileOpen]);

  // Scroll shadow
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close menu on outside click
  useEffect(() => {
    if (!mobileOpen) return;

    const handleClick = (e: MouseEvent) => {
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(e.target as Node) &&
        !menuButtonRef.current?.contains(e.target as Node)
      ) {
        setMobileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [mobileOpen]);

  const handleToggleMobile = useCallback(() => {
    setMobileOpen((prev) => !prev);
  }, []);

  return (
    <>
      <nav
        role="navigation"
        aria-label="Main navigation"
        className={[
          'sticky top-0 z-50 w-full',
          'bg-slate-900/80 backdrop-blur-md',
          'border-b border-slate-700/50',
          'transition-shadow duration-300',
          scrolled ? 'shadow-lg shadow-black/30' : '',
        ].join(' ')}
      >
        {/* Subtle top accent line */}
        <div
          className="absolute top-0 inset-x-0 h-px bg-linear-to-r from-transparent via-cyan-500/30 to-transparent"
          aria-hidden="true"
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">

            {/* ── Brand ─────────────────────────────────────────── */}
            <a
              href="/"
              aria-label="WeatherInsights — go to home"
              className="flex items-center gap-2.5 group focus-visible:outline-none
                         focus-visible:ring-2 focus-visible:ring-cyan-400/60 rounded-lg px-1"
            >
              <span
                className="flex items-center justify-center w-7 h-7 rounded-lg
                           bg-linear-to-r from-cyan-500/20 to-blue-600/20
                           border border-cyan-500/25 group-hover:border-cyan-400/40
                           transition-colors duration-200"
                aria-hidden="true"
              >
                <Wind className="w-3.5 h-3.5 text-cyan-400" />
              </span>
              <span
                className="hidden sm:block text-sm font-semibold tracking-tight
                           text-slate-100 group-hover:text-white transition-colors duration-200"
              >
                WeatherInsights
              </span>
            </a>

            {/* ── Desktop Nav Links ──────────────────────────────── */}
            <div
              role="list"
              aria-label="Navigation links"
              className="hidden sm:flex items-center gap-1"
            >
              {NAV_ITEMS.map((item) => (
                <div role="listitem" key={item.to}>
                  <NavItemLink item={item} />
                </div>
              ))}
            </div>

            {/* ── Right Controls ────────────────────────────────── */}
            <div className="flex items-center gap-2">
              <TempToggle unit={unit} onToggle={toggleUnit} />

              {/* Mobile hamburger */}
              <button
                ref={menuButtonRef}
                onClick={handleToggleMobile}
                aria-expanded={mobileOpen}
                aria-controls="mobile-menu"
                aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
                className={[
                  'sm:hidden flex items-center justify-center w-8 h-8 rounded-lg',
                  'border transition-all duration-200 focus-visible:outline-none',
                  'focus-visible:ring-2 focus-visible:ring-cyan-400/60',
                  'focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900',
                  'active:scale-95',
                  mobileOpen
                    ? 'bg-slate-700/80 border-slate-600 text-slate-100'
                    : 'bg-slate-800 border-slate-700/70 text-slate-400 hover:text-slate-200 hover:border-slate-600',
                ].join(' ')}
              >
                {mobileOpen
                  ? <X className="w-4 h-4" aria-hidden="true" />
                  : <Menu className="w-4 h-4" aria-hidden="true" />
                }
              </button>
            </div>
          </div>
        </div>

        {/* ── Mobile Menu ───────────────────────────────────────── */}
        <div
          id="mobile-menu"
          role="menu"
          aria-label="Mobile navigation menu"
          className={[
            'sm:hidden overflow-hidden transition-all duration-200 ease-in-out',
            mobileOpen ? 'max-h-56 opacity-100' : 'max-h-0 opacity-0 pointer-events-none',
          ].join(' ')}
        >
          <div
            ref={mobileMenuRef}
            className="px-4 pb-4 pt-2 flex flex-col gap-1 border-t border-slate-700/50"
          >
            {NAV_ITEMS.map((item) => (
              <NavItemLink
                key={item.to}
                item={item}
                isMobile
                onClick={() => setMobileOpen(false)}
              />
            ))}
          </div>
        </div>
      </nav>

      {/* Backdrop overlay for mobile */}
      {mobileOpen && (
        <div
          aria-hidden="true"
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm sm:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}
    </>
  );
}