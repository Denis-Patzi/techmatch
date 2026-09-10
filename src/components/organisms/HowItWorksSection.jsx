import { SectionLabel } from '@/components/atoms/SectionLabel';
import { StepCard, StepConnector } from '@/components/molecules/StepCard';

const STEPS = [
  {
    number: '01',
    title:  'Crea tu cuenta',
    desc:   'Registrate con tu correo o número de celular. Después elegís si querés una cuenta personal o de negocio, según cómo quieras vender.',
  },
  {
    number: '02',
    title:  'Sacá una foto',
    desc:   'Fotografiás tu producto y nuestra IA se encarga de reconocerlo, completar las especificaciones técnicas y sugerirte un precio justo de mercado.',
  },
  {
    number: '03',
    title:  'Publicá y vendé',
    desc:   'Tu producto llega a compradores que realmente lo buscan. La plataforma te avisa si debés ajustar el precio para vender más rápido.',
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
          Publicar dura menos de un minuto
        </h2>
        <p className="text-[1.03rem] text-slate-sub max-w-[520px] mb-14 leading-relaxed">
          Sin formularios interminables. Sin complicaciones. Solo vos y tu tecnología.
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
