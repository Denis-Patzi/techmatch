import { motion } from 'framer-motion';

/**
 * StepCard — Molécula
 * Tarjeta de paso numerado para la sección "Cómo funciona".
 * Anima con Framer Motion al entrar en viewport.
 *
 * @param {string|number} number - Número del paso (ej. '01')
 * @param {string}        title  - Título del paso
 * @param {string}        desc   - Descripción
 * @param {number}        index  - Índice para stagger delay
 */
export function StepCard({ number, title, desc, index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1], delay: index * 0.12 }}
      className="
        relative flex-1 bg-navy-light border border-cyan/10 rounded-2xl p-8
        hover:border-cyan/25 hover:-translate-y-1 transition-all duration-300
        hover:shadow-[0_12px_40px_rgba(0,0,0,0.3)]
      "
    >
      {/* Step number */}
      <div className="
        font-display text-5xl font-black leading-none mb-6
        bg-gradient-to-br from-cyan/30 to-transparent bg-clip-text text-transparent
        select-none
      ">
        {String(number).padStart(2, '0')}
      </div>

      <h3 className="font-display text-xl font-bold text-slate-body mb-3 tracking-tight">
        {title}
      </h3>
      <p className="text-sm text-slate-sub leading-relaxed">{desc}</p>
    </motion.div>
  );
}

/** Conector decorativo entre pasos */
export function StepConnector() {
  return (
    <div className="hidden md:flex items-center justify-center flex-shrink-0 w-8 mt-14">
      <div className="w-full h-px bg-gradient-to-r from-cyan/20 via-cyan/40 to-cyan/20" />
    </div>
  );
}
