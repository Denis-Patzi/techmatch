/**
 * NavBrand — Molécula
 * Logo real (logo.png) + nombre + "Bolivia" — consistente en Navbar y Footer.
 * @param {'nav'|'footer'} size
 */
export function NavBrand({ size = 'nav' }) {
  const isNav = size === 'nav';
  return (
    <div className="flex items-center gap-3">
      <img
        src="/logo.png"
        alt="TechMatch Bolivia"
        className={`flex-shrink-0 rounded-xl ${isNav ? 'w-10 h-10' : 'w-12 h-12'}`}
      />
      <div className="flex flex-col leading-none">
        <span className={`font-display font-extrabold text-slate-body tracking-tight ${isNav ? 'text-[1.25rem]' : 'text-base'}`}>
          TechMatch
        </span>
          {/*<span className={`text-cyan/70 tracking-wide font-medium ${isNav ? 'text-[0.62rem]' : 'text-[0.6rem]'} mt-0.5`}>
          Bolivia
        </span>*/}
      </div>
    </div>
  );
}
