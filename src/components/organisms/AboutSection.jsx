import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SectionLabel } from '@/components/atoms/SectionLabel';

const PILLARS = [
  { color: 'bg-brand-blue',   title: 'Disponible en todo Bolivia',  desc: 'Con sucursales en La Paz, Cochabamba y Santa Cruz' },
  { color: 'bg-brand-purple', title: '100% web y mobile',           desc: 'Funciona en cualquier celular sin necesidad de instalar nada' },
  { color: 'bg-brand-green',  title: 'Publicar es gratis',          desc: 'La cuenta básica no tiene costo. Publicar tu primer producto tampoco' },
];

function revealProps(i) {
  return {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-50px' },
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: i * 0.1 },
  };
}

function ExpandableMissionVision() {
  const [expanded, setExpanded] = useState(false);
  return (
    <div>
      <button
        onClick={() => setExpanded(e => !e)}
        className="flex items-center gap-2 text-sm font-semibold text-cyan hover:opacity-75 transition-opacity mt-2"
      >
        {expanded ? 'Ocultar misión y visión' : 'Ver nuestra misión y visión →'}
        <motion.svg
          animate={{ rotate: expanded ? 180 : 0 }}
          transition={{ duration: 0.25 }}
          width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
        >
          <path d="M6 9l6 6 6-6"/>
        </motion.svg>
      </button>
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="flex flex-col gap-4 pt-4">
              <div className="bg-navy rounded-2xl p-6 border border-cyan/10 hover:border-cyan/25 transition-colors duration-300">
                <div className="text-sm font-bold uppercase tracking-widest text-cyan mb-3">Misión</div>
                <p className="text-base text-slate-sub leading-relaxed">
                  Conectar a compradores y vendedores de tecnología en Bolivia con herramientas inteligentes que hacen el proceso rápido, justo y confiable.
                </p>
              </div>
              <div className="bg-navy rounded-2xl p-6 border border-brand-purple/20 hover:border-brand-purple/40 transition-colors duration-300">
                <div className="text-sm font-bold uppercase tracking-widest text-brand-purple mb-3">Visión</div>
                <p className="text-base text-slate-sub leading-relaxed">
                  Ser el marketplace de referencia para tecnología en toda Bolivia y expandirnos a Latinoamérica antes del 2028.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/**
 * AboutSection — Organismo
 * Misión, visión, pilares y estadísticas de la empresa.
 */
export function AboutSection() {
  return (
    <section id="about" className="min-h-screen flex flex-col justify-center py-16 bg-navy border-t border-b border-cyan/15">
      <div className="max-w-[1080px] mx-auto px-6 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">

          {/* ── LEFT ── */}
          <div>
            <SectionLabel>Nosotros</SectionLabel>
            <h2 className="font-display text-[clamp(1.9rem,4vw,2.7rem)] font-extrabold text-slate-body tracking-tight mb-5">
              Nacimos para ordenar el mercado tech boliviano
            </h2>
            <p className="text-base text-slate-sub leading-relaxed mb-4">
              TechMatch Bolivia es una aplicación web y mobile diseñada para que cualquier persona en Bolivia pueda comprar y vender tecnología de manera rápida, confiable y con soporte de inteligencia artificial.
            </p>
            <p className="text-base text-slate-sub leading-relaxed mb-8">
              Vimos que el mercado tecnológico boliviano no tenía un espacio serio y organizado. Las redes sociales no son un marketplace. Nosotros sí lo somos.
            </p>

            {/* Pillars */}
            <div className="flex flex-col gap-4">
              {PILLARS.map((p, i) => (
                <motion.div key={i} {...revealProps(i)} className="flex items-start gap-4">
                  <span className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${p.color}`} />
                  <div>
                    <div className="text-base font-bold text-slate-body mb-0.5">{p.title}</div>
                    <div className="text-sm text-slate-sub">{p.desc}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* ── RIGHT ── */}
          <div className="flex flex-col gap-4">

            {/* Stats row */}
            <motion.div {...revealProps(0)} className="grid grid-cols-3 gap-4">
              {[
                { num: '2025',  label: 'Fundación' },
                { num: '100%',  label: 'Boliviano' },
                { num: 'Mobile', label: 'Primero' },
              ].map((s, i) => (
                <div key={i} className="bg-navy rounded-xl p-4 border border-cyan/10 text-center">
                  <div className="font-display text-xl font-extrabold text-cyan tracking-tight">{s.num}</div>
                  <div className="text-sm text-slate-muted mt-1">{s.label}</div>
                </div>
              ))}
            </motion.div>

            {/* Expandable Mission/Vision */}
            <ExpandableMissionVision />
          </div>

        </div>
      </div>
    </section>
  );
}
