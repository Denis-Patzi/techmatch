/**
 * PhoneBadge — Molécula
 * Badge flotante posicionado sobre el mockup del celular en el Hero.
 *
 * @param {'ai'|'success'} variant
 * @param {string}         text
 * @param {string}         className - clases de posicionamiento (absolute top-X left-X)
 */
export function PhoneBadge({ variant = 'ai', text, className = '' }) {
  const variants = {
    ai: {
      wrapper: 'bg-navy-light border-cyan/20 text-slate-body animate-badge-float1',
      dot:     'bg-cyan animate-pulse-dot',
    },
    success: {
      wrapper: 'bg-brand-green/10 border-brand-green/30 text-brand-green animate-badge-float2',
      dot:     null,
    },
  };

  const v = variants[variant] ?? variants.ai;

  return (
    <div
      className={`
        absolute flex items-center gap-2 px-4 py-2 rounded-full
        text-xs font-semibold border backdrop-blur-sm
        shadow-navy-md whitespace-nowrap
        ${v.wrapper} ${className}
      `}
    >
      {v.dot && <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${v.dot}`} />}
      {text}
    </div>
  );
}
