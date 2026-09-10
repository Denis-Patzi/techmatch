/**
 * MiniProductCard — Molécula
 * Tarjeta mini del feed personalizado (sección Features - Recomendaciones).
 *
 * @param {string}  name     - Nombre del producto
 * @param {string}  price    - Precio formateado (ej. 'Bs. 8.500')
 * @param {number}  match    - Porcentaje de match (ej. 98)
 * @param {string}  type     - Tipo de producto: 'laptop'|'phone'|'gpu'|'tablet'
 * @param {boolean} active   - Resalta la tarjeta con borde cyan
 */
export function MiniProductCard({ name, price, match, type, active = false }) {
  const typeColors = {
    laptop: 'from-brand-blue/20 to-brand-purple/20',
    phone:  'from-navy-lighter to-navy-light',
    gpu:    'from-brand-green/20 to-cyan/10',
    tablet: 'from-brand-neon/20 to-brand-purple/10',
  };

  const typeIcons = {
    laptop: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="2" y="3" width="20" height="14" rx="2"/><path d="M0 21h24"/>
      </svg>
    ),
    phone: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18"/>
      </svg>
    ),
    gpu: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="2" y="7" width="20" height="10" rx="2"/><path d="M6 7V4M10 7V4M14 7V4M18 7V4M6 17v3M10 17v3M14 17v3M18 17v3"/>
      </svg>
    ),
    tablet: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="4" y="2" width="16" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18"/>
      </svg>
    ),
  };

  return (
    <div className={`
      flex items-center gap-3 p-3 rounded-xl border transition-all duration-200
      ${active
        ? 'bg-navy-light border-cyan/30 shadow-[0_0_12px_rgba(100,255,218,0.1)]'
        : 'bg-navy-lighter border-cyan/10 hover:border-cyan/20'
      }
    `}>
      {/* Product icon placeholder */}
      <div className={`
        w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0
        bg-gradient-to-br ${typeColors[type] ?? typeColors.laptop} text-cyan
      `}>
        {typeIcons[type] ?? typeIcons.laptop}
      </div>
      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="text-sm font-semibold text-slate-body truncate">{name}</div>
        <div className="text-xs text-cyan font-bold">{price}</div>
      </div>
      {/* Match */}
      <div className={`
        text-xs font-bold px-2 py-0.5 rounded-full flex-shrink-0
        ${active ? 'bg-cyan/20 text-cyan' : 'bg-navy-lighter text-slate-sub border border-cyan/10'}
      `}>
        {match}% match
      </div>
    </div>
  );
}
