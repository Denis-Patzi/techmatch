/**
 * SectionLabel — Átomo
 * Eyebrow label uppercase reutilizable en todas las secciones.
 * Consistent con el sistema de diseño de TechMatch Bolivia.
 */
export function SectionLabel({ children, className = '' }) {
  return (
    <p
      className={`
        eyebrow mb-5
        ${className}
      `}
    >
      {children}
    </p>
  );
}
