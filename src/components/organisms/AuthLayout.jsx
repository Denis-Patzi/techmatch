import { Link } from 'react-router-dom';
import { NavBrand } from '@/components/molecules/NavBrand';
import { ThemeToggle } from '@/components/atoms/ThemeToggle';
import { Icon } from '@/components/atoms/Icon';
import { useTheme } from '@/contexts/ThemeContext';

export function AuthLayout({ children, title, subtitle, footerText, footerLink, footerLinkTo }) {
  const { isDark, toggleTheme } = useTheme();
  return (
    <div className="auth-page">
      <aside className="auth-story">
        <Link to="/" aria-label="Volver a TechMatch">
          <NavBrand />
        </Link>
        <div className="py-10">
          <span className="text-[.65rem] uppercase tracking-[.18em] text-blue-200 block mb-7">
            Tu comunidad tech en Bolivia
          </span>
          <h2>
            Las buenas
            <br />
            conexiones
            <br />
            <span>empiezan acá.</span>
          </h2>
          <p>
            Un equipo para tu próximo proyecto. Una nueva oportunidad para el que ya tenés. Encontrá
            tu lugar en TechMatch.
          </p>
          <div className="auth-story-art" aria-hidden="true">
            <svg viewBox="0 0 400 170" fill="none">
              <rect
                x="60"
                y="10"
                width="280"
                height="145"
                rx="24"
                stroke="currentColor"
                strokeOpacity=".2"
              />
              <rect
                x="90"
                y="28"
                width="220"
                height="110"
                rx="18"
                fill="currentColor"
                fillOpacity=".07"
                stroke="currentColor"
                strokeOpacity=".3"
              />
              <rect
                x="120"
                y="46"
                width="160"
                height="73"
                rx="14"
                fill="currentColor"
                fillOpacity=".12"
                stroke="currentColor"
                strokeOpacity=".6"
              />
              <path
                d="m180 82 14 14 28-29"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle
                cx="73"
                cy="117"
                r="25"
                fill="#153b68"
                stroke="currentColor"
                strokeOpacity=".5"
              />
              <circle
                cx="323"
                cy="46"
                r="25"
                fill="#153b68"
                stroke="currentColor"
                strokeOpacity=".5"
              />
              <path
                d="M64 117h18m-9-9v18M314 46h18m-9-9v18"
                stroke="currentColor"
                strokeWidth="2"
              />
            </svg>
          </div>
        </div>
        <div className="auth-story-footer">
          <span>Hecho en Bolivia.</span>
          <span className="ml-auto">Pensado para conectar.</span>
          <Icon name="arrowUp" size={16} />
        </div>
      </aside>
      <main className="auth-form-side">
        <div className="glass-panel auth-form-card">
          <div className="flex items-center justify-between gap-4">
            <Link to="/" aria-label="TechMatch, volver al inicio">
              <NavBrand />
            </Link>
            <ThemeToggle isDark={isDark} onToggle={toggleTheme} />
          </div>
          <h1>{title}</h1>
          {subtitle && <p className="text-slate-sub text-sm mb-7">{subtitle}</p>}
          {children}
          {footerText && (
            <p className="text-center text-sm text-slate-sub mt-6">
              {footerText}{' '}
              <Link to={footerLinkTo} className="text-cyan font-medium hover:underline">
                {footerLink}
              </Link>
            </p>
          )}
        </div>
      </main>
    </div>
  );
}
