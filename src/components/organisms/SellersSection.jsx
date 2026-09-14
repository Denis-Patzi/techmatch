import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { SectionLabel } from '@/components/atoms/SectionLabel';
import { Button } from '@/components/atoms/Button';

const SELLER_BENEFITS = [
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v20M2 12h20"/></svg>
    ),
    title: 'Publicar es gratis',
    desc: 'Empezá sin costo con hasta 25 productos activos. Sin comisiones por venta en el plan Básico.',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>
    ),
    title: 'IA que vende por vos',
    desc: 'Reconocimiento automático de producto, descripción generada por IA y precio sugerido según el mercado boliviano.',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>
    ),
    title: 'Más alcance que las redes sociales',
    desc: 'Tu producto llega a compradores que realmente buscan tecnología, no a un feed genérico.',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>
    ),
    title: 'Perfil de tienda oficial',
    desc: 'Con el plan Negocio, tené tu escaparate digital con logo, banner, verificación y estadísticas.',
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

export function SellersSection() {
  const navigate = useNavigate();
  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 72, behavior: 'smooth' });
  };

  return (
    <section id="sellers" className="min-h-screen flex flex-col justify-center py-16 bg-navy">
      <div className="max-w-[1080px] mx-auto px-6 w-full">
        <SectionLabel>Para Vendedores</SectionLabel>
        <h2 className="font-display text-[clamp(1.9rem,4vw,2.7rem)] font-extrabold text-slate-body tracking-tight mb-4">
          ¿Tenés una tienda de tecnología?
        </h2>
        <p className="text-lg text-slate-sub max-w-[560px] mb-14 leading-relaxed">
          Unite a la plataforma que ya conecta a más de 8,500 usuarios con productos tech en Bolivia.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 md:mb-12 md:auto-rows-[240px]">

          {SELLER_BENEFITS.map((b, i) => {
            const isLarge = i === 0 || i === 3;
            return (
              <motion.div
                key={i}
                {...revealProps(i)}
                className={`bento-card p-8 flex flex-col ${isLarge ? 'md:col-span-2' : 'md:col-span-1'} group hover:border-brand-purple/50 transition-colors`}
              >
                <div className="w-12 h-12 rounded-2xl bg-brand-purple/10 text-brand-purple flex items-center justify-center mb-auto group-hover:scale-110 transition-transform">
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

        <motion.div
          {...revealProps(4)}
          className="flex items-center gap-5 flex-wrap"
        >
          <Button variant="cyan" onClick={() => navigate('/signup')}>
            Registrar mi tienda gratis
          </Button>
          <button
            onClick={() => scrollTo('plans')}
            className="text-base font-semibold text-cyan hover:opacity-75 transition-opacity flex items-center gap-2"
          >
            Ver todos los planes
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </button>
        </motion.div>
      </div>
    </section>
  );
}
