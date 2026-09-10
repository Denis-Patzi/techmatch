import { NavBrand } from '@/components/molecules/NavBrand';

const SOCIAL_LINKS = [
  {
    label: 'Facebook',
    href: '#',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/>
      </svg>
    ),
  },
  {
    label: 'Instagram',
    href: '#',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="2" y="2" width="20" height="20" rx="5"/>
        <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/>
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
      </svg>
    ),
  },
  {
    label: 'WhatsApp',
    href: 'https://wa.me/59171234567',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"/>
      </svg>
    ),
  },
  {
    label: 'TikTok',
    href: '#',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 0010.86 4.46V13a8.28 8.28 0 005.58 2.15V11.7a4.81 4.81 0 01-3.58-1.43V6.69h3.58z"/>
      </svg>
    ),
  },
];

/**
 * Footer — Organismo
 * Diseño inspirado en la referencia AGETIC:
 * - Título "Contacto" con línea decorativa
 * - Info de empresa + contacto a la izquierda
 * - Redes sociales grandes a la derecha
 * - Logo centrado
 * - Barra decorativa de colores
 * - Links legales en la parte baja
 */
export function Footer() {
  const scrollTo = (href) => {
    const id = href.replace('#', '');
    const el = document.getElementById(id);
    if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 72, behavior: 'smooth' });
  };

  return (
    <footer className="bg-navy border-t border-cyan/15">
      <div className="max-w-[1080px] mx-auto px-6 pt-14 pb-6">

        {/* ── Header: "Contacto" con línea ── */}
        <div className="flex items-center gap-4 mb-10">
          <span className="w-4 h-px bg-cyan/40" />
          <h3 className="font-display text-xl font-bold text-slate-body">Contacto</h3>
          <span className="flex-1 h-px bg-cyan/10" />
        </div>

        {/* ── Main grid: Info left + Social right ── */}
        <div className="grid grid-cols-1 md:grid-cols-[1.4fr_1fr] gap-12 mb-12">

          {/* Left column — Company info + Contact */}
          <div>
            <h4 className="text-base font-bold text-slate-body mb-4 leading-snug">
              TechMatch Bolivia — Marketplace de Tecnología e Inteligencia Artificial
            </h4>

            {/* Address */}
            <div className="flex items-start gap-2.5 mb-3">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-cyan flex-shrink-0 mt-0.5">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
              <span className="text-sm text-slate-sub">
                Direcciones: Ver todas las sucursales →
              </span>
            </div>

            {/* Phone */}
            <div className="flex items-center gap-2.5 mb-5">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-cyan flex-shrink-0">
                <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/>
              </svg>
              <span className="text-sm text-slate-sub">
                <strong className="text-slate-body">Teléfono:</strong> (+591) 7123-4567
              </span>
            </div>

            {/* WhatsApp */}
            <a href="https://wa.me/59171234567" className="flex items-center gap-2.5 mb-2 text-sm text-cyan hover:text-cyan/80 transition-colors">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="flex-shrink-0">
                <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"/>
              </svg>
              WhatsApp Soporte: +591 7123-4567
            </a>
            <p className="text-sm text-slate-muted ml-[26px] mb-5">
              Soporte para <strong className="text-slate-sub">Compradores y Vendedores</strong>
            </p>

            {/* Email */}
            <div className="flex items-center gap-2.5">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-cyan flex-shrink-0">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
              <span className="text-sm text-slate-sub">
                Correo electrónico: <a href="mailto:hola@techmatch.bo" className="text-cyan hover:text-cyan/80 transition-colors">hola@techmatch.bo</a> — <a href="mailto:soporte@techmatch.bo" className="text-cyan hover:text-cyan/80 transition-colors">soporte@techmatch.bo</a>
              </span>
            </div>
          </div>

          {/* Right column — Social media */}
          <div className="flex flex-col items-start md:items-end">
            <h4 className="font-display text-lg font-bold text-slate-body mb-5">
              Síguenos en redes sociales
            </h4>
            <div className="flex gap-4">
              {SOCIAL_LINKS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="
                    w-12 h-12 rounded-xl bg-navy border border-cyan/15
                    flex items-center justify-center
                    text-slate-sub hover:text-cyan hover:border-cyan/40
                    hover:shadow-[0_4px_16px_rgba(100,255,218,0.15)]
                    transition-all duration-200
                  "
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>
        </div>


        {/* ── Barra decorativa de colores (rojo, amarillo, verde — colores Bolivia) ── */}
        <div className="flex h-1 rounded-full overflow-hidden mb-6">
          <div className="flex-1 bg-red-500" />
          <div className="flex-1 bg-yellow-400" />
          <div className="flex-1 bg-green-500" />
        </div>

        {/* ── Bottom bar — Legal links ── */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-8 py-3">
          <a href="#" className="text-sm text-slate-muted hover:text-slate-body transition-colors flex items-center gap-1.5">
            Términos y condiciones
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </a>
          <a href="#" className="text-sm text-slate-muted hover:text-slate-body transition-colors flex items-center gap-1.5">
            Política de privacidad
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </a>
          <a
            href="#"
            onClick={(e) => { e.preventDefault(); scrollTo('#hero'); }}
            className="text-sm text-slate-muted hover:text-slate-body transition-colors flex items-center gap-1.5"
          >
            Mapa del sitio
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </a>
        </div>

        {/* ── Copyright ── */}
        <div className="text-center pt-3 border-t border-cyan/5">
          <span className="text-sm text-slate-muted">© 2025 TechMatch Bolivia. Hecho con 💙 en Bolivia.</span>
        </div>
      </div>
    </footer>
  );
}
