import { SectionLabel } from '@/components/atoms/SectionLabel';
import { StepCard } from '@/components/molecules/StepCard';

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
 * Tres pasos con distribución adaptable a móvil y escritorio.
 * StepCard usa Framer Motion whileInView con stagger.
 */
export function HowItWorksSection() {
  return (
    <section id="how" className="social-section">
      <div className="page-container">
        <SectionLabel>Simple y rápido</SectionLabel>
        <h2 className="section-title">
          De tu primera publicación a tu próximo match.
        </h2>
        <p className="section-copy">
          Una forma visual de mostrar lo que vendés y conectar con quienes buscan tecnología.
        </p>

        <div className="how-steps">
          {STEPS.map((step, i) => (
            <StepCard key={step.number} number={step.number} title={step.title} desc={step.desc} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
