import { useState } from 'react';
import { Icon } from '@/components/atoms/Icon';
import { getPlansForAccount } from '@/data/plansData';
import { PlanCard } from '@/components/molecules/PlanCard';
import { useAuth } from '@/hooks/useAuth';
import { getAccountType, getCurrentPlan } from '@/lib/account';

export default function SellerSubscriptionTab() {
  const [isAnnual, setIsAnnual] = useState(false);
  const { profile } = useAuth();
  const accountType = getAccountType(profile);
  const currentPlan = getCurrentPlan();
  const accountPlans = getPlansForAccount(accountType);
  return (
    <div>
      <span className="eyebrow mb-3">Un espacio para cada etapa</span>
      <h1 className="mb-2">Tu cuenta. Tu siguiente paso.</h1>
      <p className="text-sm text-slate-sub mb-7">
        {accountType === 'store'
          ? 'Planes para tu tienda.'
          : 'Planes para tu cuenta personal.'}{' '}
        El Básico también incluye videos. En esta versión podés mantener 25
        publicaciones activas, incluidas hasta 5 con video. Los cupos mensuales
        y las prestaciones Pro están en preparación.
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
            <h2 className="text-lg font-medium">{currentPlan.name} · Gratis</h2>
          </div>
        </div>
        <span className="text-xs text-cyan">Activo</span>
      </div>
      <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
        <h2 className="text-lg font-medium">Elegí cómo querés crecer</h2>
        <div
          className="billing-toggle glass-panel"
          role="group"
          aria-label="Período de suscripción"
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 pt-4">
        {accountPlans.map((plan, index) => (
          <PlanCard
            key={plan.id}
            plan={plan}
            isAnnual={isAnnual}
            index={index}
            showCta={false}
          />
        ))}
      </div>
    </div>
  );
}
