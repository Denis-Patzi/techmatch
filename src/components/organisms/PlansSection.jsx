import { useState } from 'react';
import { PlanCard } from '@/components/molecules/PlanCard';
import { plans } from '@/data/plansData';
import { ScrollBackdrop } from '@/components/molecules/ScrollBackdrop';
import { ScrollScene } from '@/components/molecules/ScrollScene';

export function PlansSection() {
  const [isAnnual, setIsAnnual] = useState(false);
  return (
    <section id="plans" className="scene-section">
      <ScrollBackdrop image="/images/tech-workspace.webp" variant="plans" />
      <div className="page-container">
        <div className="section-heading">
          <div>
            <span className="eyebrow mb-5">Un plan para cada etapa</span>
            <h2 className="section-title">
              Empezá gratis.
              <br />
              Crecé a tu ritmo.
            </h2>
            <p className="section-copy">
              De tu primera publicación al próximo paso de tu tienda. Elegí el espacio que
              necesitás.
            </p>
          </div>
          <div
            className="billing-toggle glass-panel"
            role="group"
            aria-label="Período de facturación"
          >
            <button
              onClick={() => setIsAnnual(false)}
              aria-pressed={!isAnnual}
              className={!isAnnual ? 'is-active' : ''}
            >
              Mensual
            </button>
            <button
              onClick={() => setIsAnnual(true)}
              aria-pressed={isAnnual}
              className={isAnnual ? 'is-active' : ''}
            >
              Anual <span>−20%</span>
            </button>
          </div>
        </div>
        <ScrollScene surfaceClassName="grid grid-cols-1 md:grid-cols-3 gap-5 pt-4" variant="plans">
          {plans.map((plan, index) => (
            <PlanCard key={plan.id} plan={plan} isAnnual={isAnnual} index={index} />
          ))}
        </ScrollScene>
        <p className="text-xs text-slate-muted mt-6 text-center">
          {isAnnual
            ? 'Precio equivalente por mes con facturación anual.'
            : 'Precios expresados en bolivianos por mes.'}
        </p>
      </div>
    </section>
  );
}
