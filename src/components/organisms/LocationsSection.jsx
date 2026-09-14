import { useEffect, useRef } from 'react';
import { motion, useAnimationControls } from 'framer-motion';
import { SectionLabel } from '@/components/atoms/SectionLabel';

/* ══════════════════════════════════════════════════════
   DATOS DE SUCURSALES
   ══════════════════════════════════════════════════════ */

const LOCATIONS = [
  {
    city: 'La Paz',
    type: 'Oficina Central',
    address: 'Av. 16 de Julio #1456, Edif. TechMatch, Piso 3',
    zone: 'El Prado',
    gradient: 'from-blue-600 via-indigo-500 to-purple-600',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 21h18" />
        <path d="M5 21V7l8-4v18" />
        <path d="M19 21V11l-6-4" />
        <path d="M9 9v.01M9 12v.01M9 15v.01M9 18v.01" />
      </svg>
    ),
  },
  {
    city: 'Santa Cruz',
    type: 'Punto de Entrega',
    address: 'Av. Monseñor Rivero #340',
    zone: 'Zona Equipetrol',
    gradient: 'from-emerald-500 via-teal-500 to-cyan-500',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 21h18" />
        <path d="M9 21V9h6v12" />
        <path d="M5 21V5a2 2 0 012-2h10a2 2 0 012 2v16" />
        <path d="M12 7v.01" />
      </svg>
    ),
  },
  {
    city: 'Cochabamba',
    type: 'Punto de Entrega',
    address: 'Calle Nataniel Aguirre #425',
    zone: 'Zona Central',
    gradient: 'from-orange-500 via-amber-500 to-yellow-500',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 21h18" />
        <path d="M12 3l8 6v12H4V9z" />
        <path d="M9 21v-6h6v6" />
      </svg>
    ),
  },
];

/* Duplicamos el arreglo para crear el efecto de loop infinito */
const LOOP_ITEMS = [...LOCATIONS, ...LOCATIONS, ...LOCATIONS];

/* ══════════════════════════════════════════════════════
   LOCATION CARD — Pill blanca con foto circular
   ══════════════════════════════════════════════════════ */

function LocationCard({ location }) {
  return (
    <div
      className="
        flex items-center gap-4 px-5 py-4
        bg-white/95 dark:bg-white rounded-full
        shadow-[0_4px_24px_rgba(0,0,0,0.12)]
        min-w-[280px] flex-shrink-0 select-none
      "
    >
      {/* Circular city thumbnail */}
      <div
        className={`
          w-14 h-14 rounded-full flex-shrink-0 flex items-center justify-center
          bg-gradient-to-br ${location.gradient}
          shadow-lg
        `}
      >
        {location.icon}
      </div>

      {/* Text */}
      <div>
        <div className="text-base font-bold text-gray-900 leading-tight">
          {location.city}
        </div>
        <div className="text-sm text-gray-500 leading-snug">
          {location.type}
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   INFINITE MARQUEE — Movimiento continuo tipo ruleta
   ══════════════════════════════════════════════════════ */

function InfiniteMarquee() {
  const trackRef = useRef(null);
  const controls = useAnimationControls();
  const animRef = useRef(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    /* Medimos el ancho de un set de 3 tarjetas (1/3 del track) */
    const oneSetWidth = track.scrollWidth / 3;

    const startAnimation = async () => {
      /* Reseteamos al inicio */
      await controls.set({ x: 0 });
      /* Animamos un set completo hacia la izquierda, luego loop */
      animRef.current = controls.start({
        x: -oneSetWidth,
        transition: {
          duration: 18,
          ease: 'linear',
          repeat: Infinity,
          repeatType: 'loop',
        },
      });
    };

    startAnimation();

    return () => {
      if (animRef.current && animRef.current.stop) {
        animRef.current.stop();
      }
    };
  }, [controls]);

  return (
    <div className="overflow-hidden w-full">
      <motion.div
        ref={trackRef}
        animate={controls}
        className="flex gap-6"
        onHoverStart={() => controls.stop()}
        onHoverEnd={() => {
          const track = trackRef.current;
          if (!track) return;
          const oneSetWidth = track.scrollWidth / 3;
          controls.start({
            x: -oneSetWidth,
            transition: {
              duration: 18,
              ease: 'linear',
              repeat: Infinity,
              repeatType: 'loop',
            },
          });
        }}
      >
        {LOOP_ITEMS.map((loc, i) => (
          <LocationCard key={`${loc.city}-${i}`} location={loc} />
        ))}
      </motion.div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   LOCATIONS SECTION — Organismo
   ══════════════════════════════════════════════════════ */

export function LocationsSection() {
  return (
    <section id="locations" className="py-20 bg-navy-light border-t border-cyan/15 overflow-hidden">

      <div className="max-w-[1080px] mx-auto px-6 mb-10">
        <SectionLabel>Presencia Nacional</SectionLabel>
        <h2 className="font-display text-[clamp(1.9rem,4vw,2.7rem)] font-extrabold text-slate-body tracking-tight mb-3">
          Nuestras Sucursales
        </h2>
        <p className="text-lg text-slate-sub max-w-[520px] leading-relaxed">
          Operamos en las 3 ciudades principales de Bolivia con oficinas y puntos de entrega.
        </p>
      </div>

      {/* Marquee/Ruleta */}
      <div className="mb-12">
        <InfiniteMarquee />
      </div>

      {/* Detalle de direcciones */}
      <div className="max-w-[1080px] mx-auto px-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {LOCATIONS.map((loc, i) => (
            <motion.div
              key={loc.city}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: i * 0.1 }}
              className="flex items-start gap-3"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-cyan flex-shrink-0 mt-0.5">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <div>
                <div className="text-sm font-bold text-slate-body">{loc.type} — {loc.city}</div>
                <div className="text-sm text-slate-sub">{loc.address}</div>
                <div className="text-sm text-slate-muted">{loc.zone}, {loc.city}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
