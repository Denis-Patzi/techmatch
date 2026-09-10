import { useState } from 'react';
import { motion } from 'framer-motion';
import { SectionLabel } from '@/components/atoms/SectionLabel';
import { PlanCard } from '@/components/molecules/PlanCard';
import { plans } from '@/data/plansData';

/**
 * PlansSection — Organismo
 * 3 planes con toggle mensual/anual.
 * `isAnnual` se pasa como prop a cada PlanCard para animar el precio.
 */
export function PlansSection() {
  const [isAnnual, setIsAnnual] = useState(false);

  return (
    <section id="plans" className="min-h-screen flex flex-col justify-center py-16 bg-navy">
      <div className="max-w-[1080px] mx-auto px-6">
        <SectionLabel>Planes</SectionLabel>
        <h2 className="font-display text-[clamp(1.9rem,4vw,2.7rem)] font-extrabold text-slate-body tracking-tight mb-3">
          Empezá gratis, crecé cuando quieras
        </h2>
        <p className="text-[1.03rem] text-slate-sub max-w-[540px] mb-14 leading-relaxed">
          Elegí el plan que se adapta a cómo querés vender. Todos incluyen IA de reconocimiento de productos.
        </p>

        {/* Plans grid */}
        <div className="plans-grid-3 grid grid-cols-3 gap-6 mb-10">
          {plans.map((plan, i) => (
            <PlanCard key={plan.id} plan={plan} isAnnual={isAnnual} index={i} />
          ))}
        </div>

        {/* Billing toggle */}
        <div className="flex justify-center">
          <motion.button
            onClick={() => setIsAnnual(a => !a)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-2 text-sm font-semibold text-slate-sub hover:text-slate-body
                       border border-cyan/15 hover:border-cyan/35 rounded-full px-5 py-2.5
                       bg-navy-light transition-colors duration-200"
          >
            <motion.span
              key={isAnnual ? 'annual' : 'monthly'}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              {isAnnual ? 'Ver precios mensuales' : 'Ver precios anuales — Ahorrá un 20%'}
            </motion.span>
            <motion.svg
              animate={{ rotate: isAnnual ? 180 : 0 }}
              transition={{ duration: 0.25 }}
              width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
            >
              <path d="M6 9l6 6 6-6"/>
            </motion.svg>
          </motion.button>
        </div>
      </div>
    </section>
  );
}
