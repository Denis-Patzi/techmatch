import { SectionLabel } from '@/components/atoms/SectionLabel';
import { StepCard, StepConnector } from '@/components/molecules/StepCard';

const STEPS = [
  {
    number: '01',
    title: 'Elegí tu perfil',
    desc: 'Una cuenta personal para tus productos o una cuenta de tienda para el catálogo de tu negocio.',
  },
  {
    number: '02',
    title: 'Mostrá tu producto',
    desc: 'Sumá fotos o videos. Apoyate en la IA para preparar la descripción y recibir una recomendación de precio.',
  },
  {
    number: '03',
    title: 'Publicá a tu manera',
    desc: 'Elegí una publicación de venta o una subasta. Tu perfil reúne el contenido y el catálogo para que puedan descubrirte.',
  },
];

/**
 * HowItWorksSection — Organismo
 * 3 pasos con conectores decorativos entre ellos.
 * StepCard usa Framer Motion whileInView con stagger.
 */
export function HowItWorksSection() {
  return (
    <section id="how" className="min-h-screen flex flex-col justify-center py-16 bg-navy">
      <div className="max-w-[1080px] mx-auto px-6">
        <SectionLabel>Simple y rápido</SectionLabel>
        <h2 className="font-display text-[clamp(1.9rem,4vw,2.7rem)] font-extrabold text-slate-body tracking-tight mb-3">
          De tu primera publicación a tu próximo match.
        </h2>
        <p className="text-[1.03rem] text-slate-sub max-w-[520px] mb-14 leading-relaxed">
          Una forma visual de mostrar lo que vendés y conectar con quienes buscan tecnología.
        </p>

        <div className="flex flex-col md:flex-row items-stretch gap-0 md:gap-0">
          {STEPS.map((step, i) => (
            <div key={i} className="flex md:flex-row items-stretch flex-1">
              <StepCard number={step.number} title={step.title} desc={step.desc} index={i} />
              {i < STEPS.length - 1 && <StepConnector />}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
