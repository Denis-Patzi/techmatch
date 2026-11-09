/**
 * PlanFeatureItem — Átomo
 * Ítem de lista de características de un plan con ícono ✓ o ✗.
 *
 * @param {boolean} included - Si la característica está incluida o no
 * @param {string}  text     - Descripción de la característica
 * @param {boolean} white    - Versión blanca (para plan Business oscuro)
 */
export function PlanFeatureItem({ included, text, white = false }) {
  return (
    <li className={`flex items-start gap-3 text-sm ${included ? '' : 'opacity-40'}`}>
      <span
        className={`
          w-4 h-4 rounded-full flex-shrink-0 mt-0.5 flex items-center justify-center text-xs font-bold
          ${
            included
              ? white
                ? 'text-white'
                : 'text-cyan'
              : white
                ? 'text-white/50'
                : 'text-slate-muted'
          }
        `}
      >
        {included ? '✓' : '✕'}
      </span>
      <span className={white ? 'text-white/80' : 'text-slate-sub'}>{text}</span>
    </li>
  );
}
