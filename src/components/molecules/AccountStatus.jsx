import { Icon } from '@/components/atoms/Icon';
import { getAccountLabel, getAccountType, getCurrentPlan } from '@/lib/account';

export function AccountStatus({ profile }) {
  const plan = getCurrentPlan();
  return (
    <div className="account-status" aria-label="Tipo de cuenta y plan actual">
      <span className="account-status-type">
        <Icon
          name={getAccountType(profile) === 'store' ? 'store' : 'user'}
          size={16}
        />
        {getAccountLabel(profile)}
      </span>
      <span className="account-status-plan">
        <Icon name="bag" size={16} />
        Plan {plan.name} · Gratis
      </span>
    </div>
  );
}
