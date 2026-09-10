/**
 * SectionLabel — Átomo
 * Eyebrow label uppercase reutilizable en todas las secciones.
 * Consistent con el sistema de diseño de TechMatch Bolivia.
 */
export function SectionLabel({ children, className = '' }) {
  return (
    <p
      className={`
        text-sm font-bold tracking-widest uppercase text-cyan mb-3 block
        ${className}
      `}
    >
      {children}
    </p>
  );
}
