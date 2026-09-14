/**
 * FormField — Átomo
 * Encapsula label + input + mensaje de error con estilos de validación.
 * Compatible con react-hook-form (register + errors).
 */
export function FormField({ label, name, type = 'text', placeholder, register, error, disabled, children }) {
  const hasError = !!error;

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={name} className="text-sm font-medium text-slate-body">
        {label}
      </label>

      {children ?? (
        <input
          id={name}
          type={type}
          placeholder={placeholder}
          disabled={disabled}
          {...(register ? register(name) : {})}
          className={`
            w-full px-4 py-3 rounded-xl bg-navy-light border text-slate-body
            placeholder:text-slate-muted text-sm
            focus:outline-none focus:ring-2 transition-all duration-150
            disabled:opacity-50 disabled:cursor-not-allowed
            ${hasError
              ? 'border-red-400 focus:ring-red-400/20'
              : 'border-cyan/15 focus:border-cyan/50 focus:ring-cyan/10'
            }
          `}
        />
      )}

      {hasError && (
        <p className="text-xs text-red-400 flex items-center gap-1.5 mt-0.5 animate-[fadeUp_0.2s_ease_both]">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          {error.message}
        </p>
      )}
    </div>
  );
}
