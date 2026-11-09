import { useState } from 'react';
import { PlanCard } from '@/components/molecules/PlanCard';
import { plans } from '@/data/plansData';
import { ScrollBackdrop } from '@/components/molecules/ScrollBackdrop';
import { ScrollScene } from '@/components/molecules/ScrollScene';

export function PlansSection() {
  const [isAnnual, setIsAnnual] = useState(false);
  return (
    <section id="plans" className="scene-section social-section">
      <ScrollBackdrop image="/images/tech-workspace.webp" variant="plans" />
      <div className="page-container">
        <div className="section-heading">
          <div>
            <span className="eyebrow mb-5">Un plan para cada etapa</span>
            <h2 className="section-title">
              Empezá gratis.
              <br />
              <span className="text-cyan">Publicá a tu ritmo.</span>
            </h2>
            <p className="section-copy">
              Fotos y videos desde el plan Básico. Elegí más capacidad para tu cuenta personal o tu
              tienda, con límites claros para cada etapa.
            </p>
          </div>
          <div
            className="billing-toggle glass-panel"
            role="group"
            aria-label="Período de facturación"
          >
            <button
              type="button"
              onClick={() => setIsAnnual(false)}
              aria-pressed={!isAnnual}
              className={!isAnnual ? 'is-active' : ''}
            >
              Mensual
            </button>
            <button
              type="button"
              onClick={() => setIsAnnual(true)}
              aria-pressed={isAnnual}
              className={isAnnual ? 'is-active' : ''}
            >
              Anual <span>Ahorrá</span>
            </button>
          </div>
        </div>
        <ScrollScene surfaceClassName="landing-plans-grid" variant="plans">
          {plans.map((plan, index) => (
            <PlanCard key={plan.id} plan={plan} isAnnual={isAnnual} index={index} />
          ))}
        </ScrollScene>
        <p className="text-xs text-slate-muted mt-6 text-center">
          {isAnnual
            ? 'Precio equivalente por mes. El total anual se indica en cada plan.'
            : 'Precios expresados en bolivianos por mes.'}
        </p>
        <p className="plans-availability-note">
          Planes de pago disponibles próximamente. La verificación de personas y tiendas requiere
          revisión.
        </p>
      </div>
    </section>
  );
}
