import { Icon } from '@/components/atoms/Icon';
import { getPlansForAccount } from '@/data/plansData';
import { PlanCard } from '@/components/molecules/PlanCard';
import { PlanExtras } from '@/components/molecules/PlanExtras';
import { useAuth } from '@/hooks/useAuth';
import { getAccountType, getCurrentPlan } from '@/lib/account';

export default function SellerSubscriptionTab() {
  const { profile } = useAuth();
  const accountType = getAccountType(profile);
  const currentPlan = getCurrentPlan();
  return (
    <div>
      <span className="eyebrow mb-3">Un espacio para cada etapa</span>
      <h1 className="mb-2">Mi plan</h1>
      <p className="text-sm text-slate-sub mb-7">
        {accountType === 'store'
          ? 'Planes para tu tienda.'
          : 'Planes para tu cuenta personal.'}{' '}
        Conocé las nuevas tarifas y elegí cómo querés crecer.
      </p>
      <div className="glass-panel p-6 flex flex-col sm:flex-row gap-5 sm:items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <span className="bare-icon w-12 h-12 grid place-items-center text-cyan">
            <Icon name="bag" size={24} />
          </span>
          <div>
            <p className="text-[.65rem] uppercase tracking-widest text-slate-muted">
              Plan actual
            </p>
            <h2 className="text-lg font-medium">
              {currentPlan.name} · Bs. {currentPlan.priceMonthly}/mes
            </h2>
            <p className="text-sm text-slate-sub">
              {currentPlan.limitChip} según el nuevo catálogo de planes.
            </p>
          </div>
        </div>
        <span className="text-xs text-cyan">Activo</span>
      </div>
      <p className="glass-panel p-4 text-sm text-slate-sub mb-8" role="note">
        Vista previa de los nuevos planes. La contratación, los pagos y la
        aplicación de sus beneficios y cupos estarán disponibles próximamente.
      </p>
      <h2 className="text-lg font-medium mb-6">
        Planes disponibles · precios en bolivianos
      </h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5 pt-4">
        {getPlansForAccount(accountType).map((plan, index) => (
          <PlanCard key={plan.id} plan={plan} index={index} showCta={false} />
        ))}
      </div>
      <PlanExtras accountType={accountType} />
    </div>
  );
}
