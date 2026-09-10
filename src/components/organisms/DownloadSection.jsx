import { motion } from 'framer-motion';
import { SectionLabel } from '@/components/atoms/SectionLabel';

/**
 * DownloadSection — Organismo (actualizado)
 * Badges de App Store y Google Play ahora son rectangulares y más grandes,
 * con un diseño estilizado que imita el look oficial de cada tienda.
 */
export function DownloadSection() {
  return (
    <section id="download" className="min-h-screen flex flex-col justify-center py-16 bg-navy-light border-t border-cyan/8">
      <div className="max-w-[1080px] mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

          {/* ── Left ── */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <SectionLabel>Disponible ahora</SectionLabel>
            <h2 className="font-display text-[clamp(1.9rem,4vw,2.7rem)] font-extrabold text-slate-body tracking-tight mb-4">
              Lleváte TechMatch en tu bolsillo
            </h2>
            <p className="text-sm text-slate-sub leading-relaxed mb-10 max-w-md">
              Disponible como app web en cualquier navegador y próximamente en Google Play y App Store. Sin instalar nada, funciona directo desde tu celular.
            </p>

            {/* ── Store Badges (rectangulares y grandes) ── */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">

              {/* Google Play */}
              <motion.a
                href="#"
                whileHover={{ y: -3, scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                className="
                  flex items-center gap-4 px-5 py-4 rounded-2xl
                  bg-navy border border-cyan/20
                  hover:border-cyan/45 hover:shadow-[0_8px_32px_rgba(0,0,0,0.3)]
                  transition-colors duration-200 group flex-1 min-w-[200px]
                "
              >
                {/* Play Store logo */}
                <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center">
                  <img src="/playstore.png" alt="" className="w-full h-full object-contain" />
                </div>
                <div className="text-left">
                  <div className="text-[0.65rem] text-slate-muted uppercase tracking-widest font-semibold leading-none mb-1">
                    Disponible en
                  </div>
                  <div className="font-display text-lg font-bold text-slate-body leading-tight group-hover:text-cyan transition-colors duration-200">
                    Google Play
                  </div>
                </div>
                <svg
                  width="16" height="16"
                  viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                  className="ml-auto text-slate-muted group-hover:text-cyan transition-colors duration-200 flex-shrink-0"
                >
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </motion.a>

              {/* App Store */}
              <motion.a
                href="#"
                whileHover={{ y: -3, scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                className="
                  flex items-center gap-4 px-5 py-4 rounded-2xl
                  bg-navy border border-cyan/20
                  hover:border-cyan/45 hover:shadow-[0_8px_32px_rgba(0,0,0,0.3)]
                  transition-colors duration-200 group flex-1 min-w-[200px]
                "
              >
                {/* App Store logo */}
                <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center">
                  <img src="/appstore.png" alt="" className="w-full h-full object-contain" />
                </div>
                <div className="text-left">
                  <div className="text-[0.65rem] text-slate-muted uppercase tracking-widest font-semibold leading-none mb-1">
                    Próximamente en
                  </div>
                  <div className="font-display text-lg font-bold text-slate-body leading-tight group-hover:text-cyan transition-colors duration-200">
                    App Store
                  </div>
                </div>
                <svg
                  width="16" height="16"
                  viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                  className="ml-auto text-slate-muted group-hover:text-cyan transition-colors duration-200 flex-shrink-0"
                >
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </motion.a>
            </div>

            {/* Web availability note */}
            <div className="flex items-center gap-2.5">
              <div className="w-5 h-5 rounded-full bg-brand-green/15 text-brand-green flex items-center justify-center text-[10px] font-bold flex-shrink-0">
                ✓
              </div>
              <span className="text-xs text-slate-muted">
                App web disponible ahora mismo — funcioná directo desde tu navegador sin instalar nada
              </span>
            </div>
          </motion.div>

          {/* ── Right — Phone mockup ── */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            className="flex justify-center"
          >
            <div className="relative">
              {/* Glow detrás del celular */}
              <div className="absolute inset-0 bg-gradient-radial from-cyan/10 to-transparent blur-2xl scale-110 pointer-events-none" />
              <img
                src="/phone_mockup.png"
                alt="TechMatch en tu celular"
                className="relative max-h-[380px] w-auto object-contain drop-shadow-[0_24px_48px_rgba(0,0,0,0.5)] animate-phone-float"
              />
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
