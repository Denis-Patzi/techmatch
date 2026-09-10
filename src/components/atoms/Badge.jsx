/**
 * Badge — Átomo
 * Pequeña píldora de estado con variantes de color y punto pulsante opcional.
 *
 * @param {'ai'|'verified'|'success'|'warning'|'info'|'default'} variant
 * @param {boolean} pulse  - Muestra punto pulsante animado
 * @param {string}  className
 */
export function Badge({ children, variant = 'default', pulse = false, className = '' }) {
  const variants = {
    ai:       'bg-brand-blue/20 text-brand-blue border-brand-blue/30',
    verified: 'bg-cyan/10 text-cyan border-cyan/20',
    success:  'bg-brand-green/20 text-brand-green border-brand-green/30',
    warning:  'bg-brand-neon/20 text-brand-neon border-brand-neon/30',
    info:     'bg-brand-purple/20 text-brand-purple border-brand-purple/30',
    default:  'bg-navy-lighter text-slate-sub border-slate-muted/30',
  };

  const dotColors = {
    ai:       'bg-brand-blue',
    verified: 'bg-cyan',
    success:  'bg-brand-green',
    warning:  'bg-brand-neon',
    info:     'bg-brand-purple',
    default:  'bg-slate-sub',
  };

  return (
    <span
      className={`
        inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold
        border ${variants[variant] ?? variants.default} ${className}
      `}
    >
      {pulse && (
        <span
          className={`w-1.5 h-1.5 rounded-full flex-shrink-0 animate-pulse-dot ${dotColors[variant] ?? dotColors.default}`}
        />
      )}
      {children}
    </span>
  );
}
