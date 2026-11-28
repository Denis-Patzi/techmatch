import { PlanCard } from '@/components/molecules/PlanCard';
import { PlanExtras } from '@/components/molecules/PlanExtras';
import { plans } from '@/data/plansData';
import { ScrollBackdrop } from '@/components/molecules/ScrollBackdrop';
import { ScrollScene } from '@/components/molecules/ScrollScene';

export function PlansSection() {
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
              <span className="text-cyan">Crecé a tu medida.</span>
            </h2>
            <p className="section-copy">
              Publicá sin costo o conocé los planes Vendedor individual, Tienda
              y Custom para ampliar tu espacio y destacar tus productos.
            </p>
          </div>
        </div>
        <ScrollScene surfaceClassName="landing-plans-grid" variant="plans">
          {plans.map((plan, index) => (
            <PlanCard key={plan.id} plan={plan} index={index} showCta={false} />
          ))}
        </ScrollScene>
        <PlanExtras />
        <p className="plans-availability-note">
          Vista previa de tarifas y beneficios. La contratación y activación de
          los planes de pago estarán disponibles próximamente.
        </p>
      </div>
    </section>
  );
}
