import { Link } from 'react-router-dom';

/**
 * AuthLayout — Organismo compartido entre SignUp y Login
 * Desktop: panel izquierdo decorativo + panel derecho con formulario
 * Mobile: solo formulario con logo pequeño arriba
 */
export function AuthLayout({ children, title, subtitle, footerText, footerLink, footerLinkTo }) {
  return (
    <div className="min-h-screen bg-navy flex">

      {/* ── Panel Izquierdo — Decorativo (solo desktop) ── */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden flex-col items-center justify-center p-12">
        {/* Glows de fondo */}
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] glow-purple opacity-40 blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] glow-blue opacity-40 blur-[100px] pointer-events-none" />

        <div className="relative z-10 text-center max-w-md">
          {/* Logo */}
          <Link to="/">
            <img src="/logo.png" alt="TechMatch Bolivia" className="w-20 h-20 mx-auto mb-8 rounded-2xl" />
          </Link>

          <h2 className="font-display text-3xl font-black text-slate-body mb-4 leading-tight">
            El marketplace de tecnología
            <span className="text-cyan block">más inteligente de Bolivia</span>
          </h2>
          <p className="text-slate-sub text-base leading-relaxed mb-10">
            Compra, vende y conectá con compradores y vendedores reales usando inteligencia artificial.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { value: '8.500+', label: 'Usuarios' },
              { value: '23.000+', label: 'Productos' },
              { value: '3', label: 'Sucursales' },
            ].map(stat => (
              <div key={stat.label} className="bg-navy-light/60 border border-cyan/15 rounded-2xl p-4">
                <div className="font-display text-xl font-black text-cyan">{stat.value}</div>
                <div className="text-xs text-slate-muted mt-0.5">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Panel Derecho — Formulario ── */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 lg:p-12">
        {/* Logo mobile */}
        <Link to="/" className="lg:hidden mb-8">
          <img src="/logo.png" alt="TechMatch Bolivia" className="w-14 h-14 rounded-xl" />
        </Link>

        <div className="w-full max-w-md">
          <h1 className="font-display text-2xl font-extrabold text-slate-body mb-1">{title}</h1>
          {subtitle && <p className="text-slate-sub text-sm mb-8">{subtitle}</p>}

          {children}

          {footerText && (
            <p className="text-center text-sm text-slate-muted mt-6">
              {footerText}{' '}
              <Link to={footerLinkTo} className="text-cyan font-semibold hover:opacity-80 transition-opacity">
                {footerLink}
              </Link>
            </p>
          )}
        </div>
      </div>

    </div>
  );
}
