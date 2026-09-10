import { useCountUp } from '@/hooks/useCountUp';

/**
 * StatCounter — Átomo
 * Contador animado que se activa cuando entra en el viewport.
 * Reemplaza el sistema data-target + animateCounters() del script.js legacy.
 *
 * @param {number} target   - Número final al que llegar
 * @param {string} label    - Etiqueta descriptiva debajo del número
 * @param {string} suffix   - Sufijo opcional (ej. '+', 'K')
 * @param {string} locale   - Locale para formatear el número (default 'es-BO')
 */
export function StatCounter({ target, label, suffix = '', locale = 'es-BO' }) {
  const { ref, count } = useCountUp(target, 1600);

  return (
    <div ref={ref} className="flex flex-col">
      <span className="font-display text-3xl font-extrabold text-slate-body tracking-tight leading-none">
        {count.toLocaleString(locale)}{suffix}
      </span>
      <span className="text-xs text-slate-muted font-medium mt-1">{label}</span>
    </div>
  );
}
