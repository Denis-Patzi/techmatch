import { useState, useRef, useEffect } from 'react';
import { motion, animate, useMotionValue } from 'framer-motion';
import { SectionLabel } from '@/components/atoms/SectionLabel';
import { SpotlightCard } from '@/lib/reactbits/SpotlightCard';
import { AITasadorDemo } from './AITasadorDemo';

/* ══════════════════════════════════════════════════════
   VISUALES DE CADA SLIDE
   Contenido decorativo que aparece como "fondo de imagen"
   en la zona superior de cada tarjeta del carrusel.
   ══════════════════════════════════════════════════════ */

function FeedVisual() {
  const items = [
    { name: 'Laptop Gaming MSI', price: 'Bs. 8.500', match: '98%', active: true  },
    { name: 'iPhone 14 Pro',     price: 'Bs. 6.200', match: '95%', active: false },
    { name: 'RTX 4060 Ti',       price: 'Bs. 3.100', match: '91%', active: false },
  ];
  return (
    <div className="absolute inset-0 flex flex-col justify-center p-5 gap-2.5 pointer-events-none">
      {items.map((item, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.15 + i * 0.1, duration: 0.4 }}
          className={`
            flex items-center gap-3 rounded-xl px-3.5 py-2.5 backdrop-blur-sm
            ${item.active
              ? 'bg-navy-lighter/20 border border-cyan/20 shadow-cyan-glow'
              : 'bg-navy/50 border border-cyan/10'}
          `}
        >
          <div className="w-8 h-8 rounded-lg bg-cyan/20 flex-shrink-0 flex items-center justify-center text-cyan">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="2" y="3" width="20" height="14" rx="2"/><path d="M0 21h24"/>
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-semibold text-slate-body truncate leading-none">{item.name}</div>
            <div className="text-[0.65rem] text-slate-sub mt-0.5">{item.price}</div>
          </div>
          <div className="text-[0.65rem] font-bold text-navy bg-cyan px-2 py-0.5 rounded-full flex-shrink-0">
            {item.match}
          </div>
        </motion.div>
      ))}
    </div>
  );
}

function PrecioVisual() {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center p-5 pointer-events-none">
      <div className="w-full bg-navy/80 backdrop-blur-sm rounded-2xl p-4 border border-cyan/15">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-7 h-7 rounded-lg bg-cyan/20 flex items-center justify-center flex-shrink-0 text-cyan">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="5" y="2" width="14" height="20" rx="2"/>
            </svg>
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-body leading-none">Samsung Galaxy A54</div>
            <div className="text-[0.62rem] text-slate-sub/80 mt-0.5">Sin ventas · 12 días</div>
          </div>
        </div>
        <div className="text-[0.62rem] text-slate-sub/80 mb-1.5">Precio sugerido por IA</div>
        <div className="flex items-center gap-2.5">
          <span className="text-sm text-slate-sub/50 line-through">Bs. 1.800</span>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#30d158" strokeWidth="2.5">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
          <span className="text-xl font-bold font-display" style={{ color: '#30d158' }}>Bs. 1.550</span>
        </div>
        <div className="mt-2 text-[0.62rem]" style={{ color: '#30d158' }}>
          ↗ Reducí 14% · vendés en &lt;3 días
        </div>
      </div>
    </div>
  );
}

const CMP_ROWS = [
  { label: 'Procesador', a: { v: 'Apple M2',   w: true  }, b: { v: 'i5-1235U',    w: false } },
  { label: 'RAM',        a: { v: '8 GB',        w: false }, b: { v: '16 GB',       w: true  } },
  { label: 'Precio',     a: { v: 'Bs. 9.800',   w: false }, b: { v: 'Bs. 4.200',   w: true  } },
];

function ComparadorVisual() {
  return (
    <div className="absolute inset-0 flex flex-col justify-center p-5 pointer-events-none">
      <div className="w-full bg-navy/80 backdrop-blur-sm rounded-2xl overflow-hidden border border-cyan/15">
        {/* header */}
        <div className="grid grid-cols-3 bg-navy-lighter/30 px-3 py-2 text-[0.62rem] font-bold">
          <span className="text-slate-sub/50"></span>
          <span className="text-slate-body text-center">MacBook M2</span>
          <span className="text-slate-body text-center">ASUS i5</span>
        </div>
        {/* rows */}
        {CMP_ROWS.map((row, i) => (
          <div
            key={i}
            className={`grid grid-cols-3 px-3 py-2 items-center text-[0.62rem] ${i < CMP_ROWS.length - 1 ? 'border-b border-cyan/10' : ''}`}
          >
            <span className="text-slate-sub/50">{row.label}</span>
            <span className={`text-center font-bold ${row.a.w ? 'text-yellow-300' : 'text-slate-sub'}`}>
              {row.a.w ? '★ ' : ''}{row.a.v}
            </span>
            <span className={`text-center font-bold ${row.b.w ? 'text-yellow-300' : 'text-slate-sub'}`}>
              {row.b.w ? '★ ' : ''}{row.b.v}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   DATOS DE LOS SLIDES
   ══════════════════════════════════════════════════════ */

const SLIDES = [
  {
    id:       'feed',
    badge:    'Recomendaciones',
    badgeBg:  'bg-brand-purple text-slate-body',
    category: 'Personalización IA',
    title:    'Tu feed, personalizado',
    desc:     'El algoritmo aprende tus preferencias y te muestra solo lo que te interesa.',
    bgClass:  'from-brand-purple/40 to-transparent',
    Visual:   FeedVisual,
  },
  {
    id:       'precio',
    badge:    'Precio Dinámico',
    badgeBg:  'bg-brand-green text-navy',
    category: 'Alertas inteligentes',
    title:    'Si no se vende, te avisamos',
    desc:     'Te sugerimos el precio ideal para vender rápido basado en el mercado boliviano.',
    bgClass:  'from-brand-neon/30 to-transparent',
    Visual:   PrecioVisual,
  },
  {
    id:       'comparador',
    badge:    'Comparador',
    badgeBg:  'bg-cyan text-navy',
    category: 'Decisiones informadas',
    title:    'Compará antes de comprar',
    desc:     'Especificaciones técnicas lado a lado de hasta 4 productos al mismo tiempo.',
    bgClass:  'from-brand-blue/40 to-transparent',
    Visual:   ComparadorVisual,
  },
];

/* ══════════════════════════════════════════════════════
   SLIDE CARD — Tarjeta visual estilo "imagen + overlay"
   Coincide con el estilo del carrusel de referencia:
   · Fondo de imagen (visual) cubriendo toda la tarjeta
   · Badge de categoría arriba a la izquierda
   · Gradiente oscuro en la parte inferior
   · Título y descripción overlaid al pie
   ══════════════════════════════════════════════════════ */

function SlideCard({ slide, index, isDragging }) {
  return (
    <motion.div
      className="relative flex-shrink-0 w-[78%] md:w-[46%] rounded-3xl overflow-hidden select-none"
      style={{ height: 420 }}
      whileHover={isDragging ? {} : { scale: 1.015 }}
      transition={{ duration: 0.25 }}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      {/* ── Background gradient (simula la "imagen") ── */}
      <div className={`absolute inset-0 bg-gradient-to-b ${slide.bgClass}`} />

      {/* ── Visual content ── */}
      <slide.Visual />

      {/* ── Badge (category tag arriba-izquierda como en la referencia) ── */}
      <div className="absolute top-4 left-4 z-20">
        <span className={`text-[0.65rem] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full ${slide.badgeBg}`}>
          {slide.badge}
        </span>
      </div>

      {/* ── Gradiente oscuro inferior + texto (como en la referencia) ── */}
      <div className="absolute bottom-0 inset-x-0 z-10"
           style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.55) 55%, transparent 100%)' }}
      >
        <div className="p-5 pt-16">
          <p className="text-[0.62rem] font-bold uppercase tracking-widest text-slate-sub/60 mb-1.5">
            {slide.category}
          </p>
          <h3 className="font-display text-[1.2rem] font-bold text-slate-body leading-tight mb-1.5">
            {slide.title}
          </h3>
          <p className="text-xs text-slate-sub leading-snug">
            {slide.desc}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

/* ══════════════════════════════════════════════════════
   FEATURE CAROUSEL — Carrusel peek horizontal
   · Arrastrá para navegar (drag)
   · Snap automático al soltar
   · Dots de navegación abajo
   · Muestra 1 tarjeta completa + peek de la siguiente
   ══════════════════════════════════════════════════════ */

function FeatureCarousel() {
  const containerRef = useRef(null);
  const [current, setCurrent]     = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [cardW, setCardW]         = useState(320); // width de cada card + gap
  const x = useMotionValue(0);

  /* Medir el ancho del container y recalcular el tamaño de cada tarjeta */
  useEffect(() => {
    const measure = () => {
      if (!containerRef.current) return;
      const cw = containerRef.current.offsetWidth;
      const isDesktop = window.innerWidth >= 768;
      const pct = isDesktop ? 0.46 : 0.78; // % del container
      setCardW(Math.round(cw * pct) + 16);  // card width + gap
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  /* Snap animado hacia un índice */
  const snapTo = (index) => {
    const clamped = Math.max(0, Math.min(SLIDES.length - 1, index));
    setCurrent(clamped);
    animate(x, -clamped * cardW, {
      type: 'spring', stiffness: 320, damping: 32, mass: 0.7,
    });
  };

  /* Al soltar el drag: snap al más cercano o al siguiente/anterior por velocidad */
  const handleDragEnd = (_, info) => {
    setIsDragging(false);
    const curX = x.get();
    const velocity = info.velocity.x;
    let nearest = Math.round(-curX / cardW);
    if (velocity < -300) nearest = current + 1;
    else if (velocity > 300) nearest = current - 1;
    snapTo(nearest);
  };

  const maxDrag = -(SLIDES.length - 1) * cardW;

  return (
    <div className="flex flex-col gap-5">
      {/* Hint de arrastre */}
      <p className="text-xs text-slate-muted flex items-center gap-1.5">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M5 12h14M12 5l7 7-7 7"/>
        </svg>
        Deslizá para ver más funciones
      </p>

      {/* Track del carrusel */}
      <div ref={containerRef} className="overflow-hidden">
        <motion.div
          style={{ x }}
          drag="x"
          dragElastic={0.06}
          dragConstraints={{ left: maxDrag, right: 0 }}
          onDragStart={() => setIsDragging(true)}
          onDragEnd={handleDragEnd}
          className="flex gap-4 carousel-track"
        >
          {SLIDES.map((slide, i) => (
            <SlideCard key={slide.id} slide={slide} index={i} isDragging={isDragging} />
          ))}
          {/* Spacer para que el último card no quede pegado al borde */}
          <div className="flex-shrink-0 w-4" />
        </motion.div>
      </div>

      {/* ── Dot indicators (como en la referencia) ── */}
      <div className="flex items-center justify-between px-1">
        <div className="flex gap-2">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => snapTo(i)}
              aria-label={`Slide ${i + 1}`}
              className={`
                rounded-full transition-all duration-300
                ${i === current
                  ? 'w-6 h-2 bg-cyan'
                  : 'w-2 h-2 bg-slate-muted/30 hover:bg-slate-muted/60'
                }
              `}
            />
          ))}
        </div>
        {/* Flechas */}
        <div className="flex gap-2">
          <motion.button
            onClick={() => snapTo(current - 1)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            disabled={current === 0}
            className="w-8 h-8 rounded-full border border-cyan/20 flex items-center justify-center
                       text-slate-sub hover:border-cyan/50 hover:text-cyan
                       transition-colors duration-150 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M15 18l-6-6 6-6"/>
            </svg>
          </motion.button>
          <motion.button
            onClick={() => snapTo(current + 1)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            disabled={current === SLIDES.length - 1}
            className="w-8 h-8 rounded-full border border-cyan/20 flex items-center justify-center
                       text-slate-sub hover:border-cyan/50 hover:text-cyan
                       transition-colors duration-150 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M9 18l6-6-6-6"/>
            </svg>
          </motion.button>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   FEATURES SECTION — Organismo
   ══════════════════════════════════════════════════════ */

export function FeaturesSection() {
  return (
    <section id="features" className="min-h-screen flex flex-col justify-center py-16 bg-navy-light border-t border-b border-cyan/8">
      <div className="max-w-[1080px] mx-auto px-6">

        <SectionLabel>Por qué TechMatch</SectionLabel>
        <h2 className="font-display text-[clamp(1.9rem,4vw,2.7rem)] font-extrabold text-slate-body tracking-tight mb-3">
          Lo que nos hace diferentes
        </h2>
        <p className="text-[1.03rem] text-slate-sub max-w-[520px] mb-14 leading-relaxed">
          Más que un marketplace. Una plataforma inteligente que trabaja para que tus productos se vendan rápido.
        </p>

        {/* ── AI Demo — tarjeta grande full-width ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mb-12"
        >
          <SpotlightCard className="bg-navy border border-cyan/10 rounded-2xl p-8 hover:border-cyan/25 transition-all duration-300">
            <AITasadorDemo />
          </SpotlightCard>
        </motion.div>

        {/* ── Bento Box Grid ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Feed AI - Large Card */}
          <motion.div className="bento-card col-span-1 md:col-span-2 p-8 flex flex-col md:flex-row gap-6 items-center overflow-hidden relative">
            <div className={`absolute inset-0 bg-gradient-to-br ${SLIDES[0].bgClass} opacity-50`} />
            <div className="relative z-10 flex-1">
              <span className={`text-[0.65rem] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full ${SLIDES[0].badgeBg} mb-4 inline-block`}>
                {SLIDES[0].badge}
              </span>
              <p className="text-[0.62rem] font-bold uppercase tracking-widest text-slate-muted mb-1.5">
                {SLIDES[0].category}
              </p>
              <h3 className="font-display text-[1.5rem] font-bold text-slate-body leading-tight mb-2">
                {SLIDES[0].title}
              </h3>
              <p className="text-sm text-slate-sub leading-snug">
                {SLIDES[0].desc}
              </p>
            </div>
            <div className="relative w-full md:w-1/2 min-h-[220px] flex-shrink-0 mt-4 md:mt-0">
              <FeedVisual />
            </div>
          </motion.div>
          
          {/* Comparador - Standard Card */}
          <motion.div className="bento-card p-8 flex flex-col gap-4 overflow-hidden relative">
            <div className={`absolute inset-0 bg-gradient-to-br ${SLIDES[2].bgClass} opacity-50`} />
            <div className="relative z-10">
              <span className={`text-[0.65rem] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full ${SLIDES[2].badgeBg} mb-4 inline-block`}>
                {SLIDES[2].badge}
              </span>
              <p className="text-[0.62rem] font-bold uppercase tracking-widest text-slate-muted mb-1.5">
                {SLIDES[2].category}
              </p>
              <h3 className="font-display text-[1.2rem] font-bold text-slate-body leading-tight mb-2">
                {SLIDES[2].title}
              </h3>
              <p className="text-xs text-slate-sub leading-snug">
                {SLIDES[2].desc}
              </p>
            </div>
            <div className="relative w-full min-h-[170px] mt-4">
              <ComparadorVisual />
            </div>
          </motion.div>

          {/* Precio - Wide Card spanning full width below */}
          <motion.div className="bento-card col-span-1 md:col-span-3 p-8 flex flex-col md:flex-row gap-6 justify-between items-center bg-gradient-to-r from-navy-light to-brand-blue/20 overflow-hidden relative">
            <div className={`absolute inset-0 bg-gradient-to-br ${SLIDES[1].bgClass} opacity-30`} />
            <div className="relative z-10 md:w-1/2">
              <span className={`text-[0.65rem] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full ${SLIDES[1].badgeBg} mb-4 inline-block`}>
                {SLIDES[1].badge}
              </span>
              <p className="text-[0.62rem] font-bold uppercase tracking-widest text-slate-muted mb-1.5">
                {SLIDES[1].category}
              </p>
              <h3 className="font-display text-[1.5rem] font-bold text-slate-body leading-tight mb-2">
                {SLIDES[1].title}
              </h3>
              <p className="text-sm text-slate-sub leading-snug">
                {SLIDES[1].desc}
              </p>
            </div>
            <div className="relative w-full md:w-1/2 min-h-[220px] flex-shrink-0">
              <PrecioVisual />
            </div>
          </motion.div>
        </div>

      </div>
    </section>
  );
}
