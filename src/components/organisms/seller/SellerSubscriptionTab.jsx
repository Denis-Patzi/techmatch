import { useState } from 'react';
import { Icon } from '@/components/atoms/Icon';
import { plans } from '@/data/plansData';

export default function SellerSubscriptionTab() {
  const [isAnnual, setIsAnnual] = useState(false);
  return (
    <div>
      <span className="eyebrow mb-3">Un espacio para cada etapa</span>
      <h1 className="mb-2">Tu tienda. Tu siguiente paso.</h1>
      <p className="text-sm text-slate-sub mb-7">
        Conocé las opciones disponibles para acompañar el crecimiento de tu tienda.
      </p>
      <div className="glass-panel p-6 flex flex-col sm:flex-row gap-5 sm:items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <span className="bare-icon w-12 h-12 grid place-items-center text-cyan">
            <Icon name="bag" size={24} />
          </span>
          <div>
            <p className="text-[.65rem] uppercase tracking-widest text-slate-muted">
              Plan mostrado
            </p>
            <h2 className="text-lg font-medium">Básico · Gratis</h2>
          </div>
        </div>
        <span className="text-xs text-slate-muted">Vista previa de suscripciones</span>
      </div>
      <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
        <h2 className="text-lg font-medium">Elegí cómo querés crecer</h2>
        <div
          className="billing-toggle glass-panel"
          role="group"
          aria-label="Período de suscripción"
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
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {plans.map((plan) => (
          <article
            className={`plan-card rounded-[28px] p-6 flex flex-col ${plan.featured ? 'is-featured' : ''}`}
            key={plan.id}
          >
            <p className="text-xs uppercase tracking-widest opacity-70 mb-4">{plan.name}</p>
            <p className="text-4xl font-medium tracking-tight mb-2">
              Bs. {isAnnual ? plan.priceAnnual : plan.priceMonthly}
              <span className="text-xs ml-1 opacity-60 font-normal">/mes</span>
            </p>
            <p className="text-xs opacity-70 mb-6 leading-relaxed">{plan.tagline}</p>
            <ul className="space-y-3 mb-7 flex-1">
              {plan.features
                .filter((feature) => feature.included)
                .slice(0, 5)
                .map((feature) => (
                  <li key={feature.text} className="flex items-start gap-2 text-xs leading-relaxed">
                    <Icon name="check" size={14} className="shrink-0 mt-1" />
                    {feature.text}
                  </li>
                ))}
            </ul>
            <span className="text-center text-xs rounded-full border border-current/20 px-4 py-3 opacity-70">
              {plan.id === 'free' ? 'Sin costo' : 'Disponible próximamente'}
            </span>
          </article>
        ))}
      </div>
    </div>
  );
}
