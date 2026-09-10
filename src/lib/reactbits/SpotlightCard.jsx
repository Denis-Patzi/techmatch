import { useRef } from 'react';

/**
 * SpotlightCard — React Bits
 * Tarjeta con efecto de spotlight que sigue el cursor del mouse.
 * Aplica un gradiente radial centrado en la posición del cursor usando CSS custom properties.
 *
 * Inspirado en: https://www.reactbits.dev/components/spotlight-card
 *
 * @param {string}      className   - Clases adicionales de Tailwind
 * @param {string}      spotColor   - Color del spotlight (default cian)
 * @param {ReactNode}   children    - Contenido interno
 */
export function SpotlightCard({ children, className = '', spotColor = 'rgba(100,255,218,0.07)' }) {
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.setProperty('--mouse-x', `${x}px`);
    card.style.setProperty('--mouse-y', `${y}px`);
    card.style.setProperty('--spot-color', spotColor);
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      className={`spotlight-card relative overflow-hidden ${className}`}
      style={{
        '--mouse-x': '50%',
        '--mouse-y': '50%',
        '--spot-color': spotColor,
      }}
    >
      {/* Spotlight overlay */}
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background:
            'radial-gradient(500px circle at var(--mouse-x) var(--mouse-y), var(--spot-color), transparent 40%)',
        }}
        aria-hidden
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
