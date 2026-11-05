import { useRef } from 'react';
import { motion, useMotionValue, useSpring, useReducedMotion } from 'framer-motion';

/**
 * MagneticButton — React Bits
 * Botón con efecto magnético: sigue el cursor del mouse dentro de su área de influencia.
 * Usa Framer Motion useMotionValue + useSpring para movimiento fluido con inercia.
 *
 * Inspirado en: https://www.reactbits.dev/components/magnetic
 *
 * @param {ReactNode}  children   - Contenido del botón
 * @param {number}     strength   - Fuerza del efecto magnético (default 0.35)
 * @param {string}     className  - Clases adicionales de Tailwind
 * @param {function}   onClick    - Handler de click
 * @param {string}     href       - Si se provee, renderiza un <a>
 */
export function MagneticButton({
  children,
  strength = 0.35,
  className = '',
  onClick,
  href,
  disabled = false,
  type = 'button',
}) {
  const ref = useRef(null);
  const reducedMotion = useReducedMotion();

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 300, damping: 20, mass: 0.5 });
  const springY = useSpring(y, { stiffness: 300, damping: 20, mass: 0.5 });

  const handleMouseMove = (e) => {
    const el = ref.current;
    if (!el || reducedMotion || disabled || !window.matchMedia('(pointer: fine)').matches) return;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    x.set((e.clientX - cx) * strength);
    y.set((e.clientY - cy) * strength);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const Tag = href ? motion.a : motion.button;

  return (
    <Tag
      ref={ref}
      href={href}
      type={href ? undefined : type}
      disabled={href ? undefined : disabled}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: springX, y: springY }}
      className={className}
      whileTap={reducedMotion || disabled ? undefined : { scale: 0.98 }}
    >
      {children}
    </Tag>
  );
}
