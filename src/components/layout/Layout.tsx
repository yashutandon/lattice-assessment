import { type ReactNode, useId } from 'react';
import { ExternalLink } from 'lucide-react';
import Navbar from './Navbar';


interface LayoutProps {
  children: ReactNode;
  fullWidth?: boolean;
}

interface FooterLinkProps {
  href: string;
  children: ReactNode;
  describedById?: string;
}

function FooterLink({ href, children, describedById }: FooterLinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-describedby={describedById}
      className={[
        'inline-flex items-center gap-0.5 text-cyan-400/80',
        'underline underline-offset-2 decoration-cyan-400/30',
        'hover:text-cyan-300 hover:decoration-cyan-300/60',
        'focus-visible:outline-none focus-visible:ring-2',
        'focus-visible:ring-cyan-400/60 focus-visible:ring-offset-1',
        'focus-visible:ring-offset-slate-900 rounded',
        'transition-colors duration-150',
      ].join(' ')}
    >
      {children}
      <ExternalLink className="w-2.5 h-2.5 opacity-60 shrink-0" aria-hidden="true" />
    </a>
  );
}



export default function Layout({ children, fullWidth = false }: LayoutProps) {
  const newTabNoticeId = useId();

  return (
    <div className="flex flex-col min-h-screen bg-slate-900 text-slate-100">

      <a
        href="#main-content"
        className={[
          'sr-only focus:not-sr-only',
          'focus:fixed focus:top-4 focus:left-4 focus:z-100',
          'focus:px-4 focus:py-2 focus:rounded-lg focus:text-sm focus:font-medium',
          'focus:bg-cyan-500 focus:text-slate-900',
          'focus:outline-none focus:ring-2 focus:ring-offset-2',
          'focus:ring-cyan-400 focus:ring-offset-slate-900',
        ].join(' ')}
      >
        Skip to main content
      </a>

      <Navbar />

      <main
        id="main-content"
        role="main"
        aria-label="Page content"
        className="flex-1"
        tabIndex={-1}  
      >
        <div
          className={[
            fullWidth ? 'w-full' : 'max-w-7xl mx-auto',
            'px-4 sm:px-6 lg:px-8 py-6 sm:py-8',
          ].join(' ')}
        >
          {children}
        </div>
      </main>


      <span id={newTabNoticeId} className="sr-only">
        Opens in a new tab
      </span>

      <footer
        role="contentinfo"
        aria-label="Site footer"
        className="mt-auto border-t border-slate-700/50 bg-slate-900/60"
      >
        {/* Top accent */}
        <div
          className="h-px bg-linear-to-r from-transparent via-cyan-500/20 to-transparent"
          aria-hidden="true"
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">

            {/* Attribution */}
            <p>
              Weather data by{' '}
              <FooterLink
                href="https://open-meteo.com"
                describedById={newTabNoticeId}
              >
                Open-Meteo
              </FooterLink>
            </p>

            {/* Divider on desktop */}
            <span
              className="hidden sm:block w-px h-3 bg-slate-700"
              aria-hidden="true"
            />

            {/* Caveats */}
            <ul className="flex items-center gap-3 list-none m-0 p-0">
              <li>CO₂ data unavailable via Open-Meteo</li>
              <li aria-hidden="true" className="text-slate-700">·</li>
              <li>Sunrise/Sunset times in IST</li>
            </ul>

          </div>
        </div>
      </footer>
    </div>
  );
}