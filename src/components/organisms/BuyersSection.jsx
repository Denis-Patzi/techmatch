import { motion } from 'framer-motion';
import { SectionLabel } from '@/components/atoms/SectionLabel';
import { Button } from '@/components/atoms/Button';

const BUYER_BENEFITS = [
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
    ),
    title: 'Feed personalizado con IA',
    desc: 'Recibí recomendaciones basadas en tus intereses, búsquedas y el tipo de tecnología que te gusta.',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
    ),
    title: 'Comparador de productos',
    desc: 'Compará especificaciones técnicas lado a lado de hasta 4 productos al mismo tiempo.',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>
    ),
    title: 'Precios justos garantizados',
    desc: 'Nuestra IA analiza el mercado boliviano para que sepas si el precio que ves es justo antes de comprar.',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
    ),
    title: 'Chat directo con el vendedor',
    desc: 'Contactá al vendedor sin intermediarios. Negociá el precio, coordiná la entrega y cerrá el trato.',
  },
];

function revealProps(i) {
  return {
    initial: { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-50px' },
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: i * 0.1 },
  };
}

export function BuyersSection() {
  return (
    <section id="buyers" className="min-h-screen flex flex-col justify-center py-16 bg-navy-light">
      <div className="max-w-[1080px] mx-auto px-6 w-full">
        <SectionLabel>Para Compradores</SectionLabel>
        <h2 className="font-display text-[clamp(1.9rem,4vw,2.7rem)] font-extrabold text-slate-body tracking-tight mb-4">
          Encontrá exactamente lo que buscás
        </h2>
        <p className="text-lg text-slate-sub max-w-[560px] mb-14 leading-relaxed">
          La plataforma que aprende tus gustos y te muestra solo lo que te interesa.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12 auto-rows-[240px]">
          {BUYER_BENEFITS.map((b, i) => {
            const isLarge = i === 0 || i === 3;
            return (
              <motion.div
                key={i}
                {...revealProps(i)}
                className={`bento-card p-8 flex flex-col ${isLarge ? 'md:col-span-2' : 'md:col-span-1'} group hover:border-cyan/50 transition-colors`}
              >
                <div className="w-12 h-12 rounded-2xl bg-cyan/10 text-cyan flex items-center justify-center mb-auto group-hover:scale-110 transition-transform">
                  {b.icon}
                </div>
                <div className="mt-6">
                  <h3 className="font-display text-xl font-bold text-slate-body mb-2">{b.title}</h3>
                  <p className="text-sm text-slate-sub leading-relaxed">{b.desc}</p>
                </div>
              </motion.div>
            )
          })}
        </div>

        <motion.div {...revealProps(4)}>
          <Button variant="cyan" href="#">
            Crear mi cuenta gratis
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
