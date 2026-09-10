import { motion, AnimatePresence } from 'framer-motion';

const PRICE_STEP = 50;

/**
 * PriceAdjuster — Molécula
 * Control interactivo +/- para ajustar el precio sugerido por IA.
 * Incluye barra de posición de mercado y animación de salto al cambiar precio.
 *
 * @param {number}   price       - Precio actual
 * @param {number}   priceMin    - Precio mínimo del rango
 * @param {number}   priceMax    - Precio máximo del rango
 * @param {string}   range       - Texto del rango (ej. 'Bs. 3.600 — Bs. 4.900')
 * @param {function} onChange    - Callback con el nuevo precio
 */
export function PriceAdjuster({ price, priceMin, priceMax, range, onChange }) {
  const pct =
    priceMax > priceMin
      ? Math.max(0, Math.min(1, (price - priceMin) / (priceMax - priceMin)))
      : 0.5;

  const handleDown = () => onChange(Math.max(Math.floor(priceMin * 0.7), price - PRICE_STEP));
  const handleUp   = () => onChange(Math.min(priceMax + 500, price + PRICE_STEP));

  return (
    <div className="bg-navy-lighter rounded-2xl p-4 border border-cyan/10">
      {/* Label */}
      <div className="text-xs font-bold text-slate-sub uppercase tracking-wider mb-3">
        Precio sugerido por IA
      </div>

      {/* Price control */}
      <div className="flex items-center gap-3 mb-3">
        <button
          onClick={handleDown}
          className="w-9 h-9 rounded-full border border-cyan/20 flex items-center justify-center
                     text-slate-sub hover:border-cyan/50 hover:text-cyan transition-colors duration-150"
          type="button"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M5 12h14"/>
          </svg>
        </button>

        <div className="flex-1 text-center">
          <div className="flex items-baseline justify-center gap-1">
            <span className="text-xs text-slate-muted font-semibold">Bs.</span>
            <AnimatePresence mode="popLayout">
              <motion.span
                key={price}
                initial={{ opacity: 0, y: -8, scale: 0.9 }}
                animate={{ opacity: 1, y: 0,  scale: 1 }}
                exit={{    opacity: 0, y:  8,  scale: 0.9 }}
                transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
                className="font-display text-3xl font-extrabold text-slate-body tracking-tight inline-block"
              >
                {price.toLocaleString('es-BO')}
              </motion.span>
            </AnimatePresence>
          </div>
        </div>

        <button
          onClick={handleUp}
          className="w-9 h-9 rounded-full border border-cyan/20 flex items-center justify-center
                     text-slate-sub hover:border-cyan/50 hover:text-cyan transition-colors duration-150"
          type="button"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M12 5v14M5 12h14"/>
          </svg>
        </button>
      </div>

      {/* Range text */}
      <div className="text-[0.72rem] text-slate-muted text-center mb-3">
        Rango de mercado: {range}
      </div>

      {/* Meter bar */}
      <div className="relative h-1.5 bg-navy rounded-full mb-2">
        {/* Track gradient */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-brand-green/40 via-cyan/50 to-brand-neon/40" />
        {/* Indicator */}
        <motion.div
          className="absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-white border-2 border-cyan shadow-cyan-glow z-10"
          animate={{ left: `calc(${pct * 100}% - 7px)` }}
          transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>

      {/* Meter labels */}
      <div className="flex justify-between text-[0.62rem] text-slate-muted">
        <span>Precio bajo</span>
        <span className="text-cyan font-semibold">Óptimo</span>
        <span>Precio alto</span>
      </div>
    </div>
  );
}
