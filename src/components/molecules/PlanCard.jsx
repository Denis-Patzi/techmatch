import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { PlanFeatureItem } from '@/components/atoms/PlanFeatureItem';

/**
 * PlanCard — Molécula
 * Tarjeta de plan completamente parametrizada con props.
 * Soporta 3 variantes visuales: free, personal, business.
 *
 * @param {object}   plan       - Objeto del plan (ver plansData.js)
 * @param {boolean}  isAnnual   - Controla si se muestra precio anual o mensual
 * @param {number}   index      - Para stagger animation
 */
export function PlanCard({ plan, isAnnual, index = 0 }) {
  const { name, priceMonthly, priceAnnual, tagline, limitChip, cta, variant, featured, features } = plan;
  const displayPrice = isAnnual ? priceAnnual : priceMonthly;

  const cardStyles = {
    free: `
      bg-navy-light border border-cyan/15
      hover:border-cyan/30 hover:shadow-[0_16px_48px_rgba(0,0,0,0.3)]
    `,
    personal: `
      bg-navy-light border border-brand-blue/40
      hover:border-brand-blue/70 hover:shadow-[0_16px_48px_rgba(0,113,227,0.2)]
    `,
    business: `
      bg-gradient-to-br from-brand-blue/90 to-brand-purple/90
      border border-white/20 shadow-[0_20px_60px_rgba(0,113,227,0.35)]
    `,
  };

  const ctaStyles = {
    free:     'border border-cyan/40 text-cyan hover:bg-cyan/10',
    personal: 'bg-brand-blue text-white hover:bg-brand-hover shadow-blue-glow',
    business: 'bg-white text-navy hover:bg-white/90 shadow-navy-md',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1], delay: index * 0.1 }}
      className={`
        relative rounded-2xl p-8 flex flex-col transition-all duration-300
        ${cardStyles[variant] ?? cardStyles.free}
      `}
    >
      {/* Featured badge */}
      {featured && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 whitespace-nowrap
                        bg-white text-navy text-xs font-extrabold px-4 py-1 rounded-full shadow-navy-sm">
          Para negocios
        </div>
      )}

      {/* Plan type */}
      <div className={`text-xs font-bold uppercase tracking-widest mb-4 ${variant === 'business' ? 'text-white/60' : 'text-slate-sub'}`}>
        {name}
      </div>

      {/* Price */}
      <div className="flex items-baseline gap-1 mb-2">
        <span className={`text-sm font-bold ${variant === 'business' ? 'text-white/70' : 'text-slate-sub'}`}>Bs.</span>
        <motion.span
          key={displayPrice}
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className={`font-display text-5xl font-black tracking-tight leading-none ${variant === 'business' ? 'text-white' : 'text-slate-body'}`}
        >
          {displayPrice}
        </motion.span>
        <span className={`text-sm ${variant === 'business' ? 'text-white/60' : 'text-slate-muted'}`}>/mes</span>
      </div>

      {/* Tagline */}
      <p className={`text-sm mb-4 leading-snug ${variant === 'business' ? 'text-white/70' : 'text-slate-sub'}`}>
        {tagline}
      </p>

      {/* Limit chip */}
      <div className={`
        text-xs font-bold px-3 py-1.5 rounded-full inline-block mb-6 self-start
        ${variant === 'business'
          ? 'bg-white/20 text-white'
          : variant === 'personal'
            ? 'bg-brand-blue/20 text-brand-blue border border-brand-blue/30'
            : 'bg-cyan/10 text-cyan border border-cyan/20'
        }
      `}>
        {limitChip}
      </div>

      {/* Features list */}
      <ul className="flex flex-col gap-3 mb-8 flex-1">
        {features.map((f, i) => (
          <PlanFeatureItem key={i} included={f.included} text={f.text} white={variant === 'business'} />
        ))}
      </ul>

      {/* CTA */}
      <Link
        to="/signup"
        className={`
          w-full text-center py-3.5 rounded-full text-sm font-bold
          transition-all duration-200 hover:-translate-y-0.5 inline-block
          ${ctaStyles[variant] ?? ctaStyles.free}
        `}
      >
        {cta}
      </Link>
    </motion.div>
  );
}
