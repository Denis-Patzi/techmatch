/**
 * NavBrand — Molécula
 * Logo real (logo.png) + nombre + "Bolivia" — consistente en Navbar y Footer.
 * @param {'nav'|'footer'} size
 */
export function NavBrand({ size = 'nav' }) {
  const isNav = size === 'nav';
  return (
    <div className="flex items-center gap-3">
      <span className="brand-mark brand-logo">
        <img src="/logo-blue.png" alt="" width="40" height="40" />
      </span>
      <div className="flex flex-col leading-none">
        <span
          className={`brand-name font-display font-semibold text-slate-body tracking-tight ${isNav ? 'text-[1.2rem]' : 'text-base'}`}
        >
          TechMatch
        </span>
        <span className="text-slate-muted tracking-[.16em] uppercase font-medium text-[0.5rem] mt-1">
          Bolivia
        </span>
      </div>
    </div>
  );
}
