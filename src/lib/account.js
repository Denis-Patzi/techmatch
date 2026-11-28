import { plans } from '../data/plansData.js';

// Las cuentas mantienen Gratis hasta implementar la contratación de suscripciones.
export function getCurrentPlan() {
  return plans.find((plan) => plan.id === 'free');
}

export function getAccountType(profile) {
  if (
    profile?.account_type === 'store' ||
    profile?.account_type === 'personal'
  ) {
    return profile.account_type;
  }
  return profile?.store_name?.trim() ? 'store' : 'personal';
}

export function getAccountLabel(profile) {
  return getAccountType(profile) === 'store'
    ? 'Cuenta de tienda'
    : 'Cuenta personal';
}

export function getAccountHome(profile) {
  return profile?.role === 'admin' ? '/admin' : '/app';
}
