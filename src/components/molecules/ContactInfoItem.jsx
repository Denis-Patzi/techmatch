/**
 * ContactInfoItem — Molécula
 * Ítem de información de contacto: ícono + label + valor.
 *
 * @param {ReactNode} icon  - SVG ícono
 * @param {string}    label - Etiqueta (ej. 'Correo')
 * @param {string}    value - Valor mostrado
 * @param {string}    href  - Enlace opcional (mailto:, https:, etc.)
 */
export function ContactInfoItem({ icon, label, value, href }) {
  return (
    <div className="flex items-start gap-4">
      <div className="bare-icon w-10 h-10 flex items-center justify-center flex-shrink-0 text-cyan mt-0.5">
        {icon}
      </div>
      <div>
        <div className="text-xs text-slate-muted font-semibold uppercase tracking-wider mb-0.5">
          {label}
        </div>
        {href ? (
          <a
            href={href}
            className="text-slate-body hover:text-cyan transition-colors duration-150 font-medium text-sm"
          >
            {value}
          </a>
        ) : (
          <span className="text-slate-body font-medium text-sm">{value}</span>
        )}
      </div>
    </div>
  );
}
