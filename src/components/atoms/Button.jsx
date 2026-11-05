import { MagneticButton } from '@/lib/reactbits/MagneticButton';

/**
 * Button — Átomo
 * Botón principal de TechMatch con efecto magnético (React Bits).
 *
 * @param {'primary'|'outline'|'ghost'|'cyan'} variant
 * @param {string}   href      - Renderiza como <a> si se provee
 * @param {function} onClick
 * @param {string}   className - Clases adicionales
 * @param {boolean}  disabled
 * @param {boolean}  magnetic  - Activa efecto magnético (default true para primary)
 */
export function Button({
  children,
  variant = 'primary',
  href,
  onClick,
  className = '',
  disabled = false,
  magnetic = true,
  type = 'button',
}) {
  const base =
    'inline-flex items-center justify-center gap-2 font-bold rounded-full cursor-pointer transition-all duration-200 select-none whitespace-nowrap';

  const variants = {
    primary: `
      btn-primary
      disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
    `,
    cyan: `
      btn-primary
      disabled:opacity-50
    `,
    outline: `
      text-cyan border border-cyan/40 px-7 py-3.5 text-sm bg-transparent
      hover:bg-cyan/10 hover:border-cyan hover:-translate-y-0.5
      disabled:opacity-50
    `,
    ghost: `
      text-cyan px-4 py-2 text-sm bg-transparent
      hover:text-white hover:bg-cyan/10
    `,
  };

  const classes = `${base} ${variants[variant] ?? variants.primary} ${className}`;

  if (magnetic && (variant === 'primary' || variant === 'cyan')) {
    return (
      <MagneticButton
        href={href}
        onClick={onClick}
        className={classes}
        strength={0.3}
        disabled={disabled}
        type={type}
      >
        {children}
      </MagneticButton>
    );
  }

  if (href) {
    return (
      <a href={href} className={classes} onClick={onClick}>
        {children}
      </a>
    );
  }

  return (
    <button type={type} className={classes} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
}
