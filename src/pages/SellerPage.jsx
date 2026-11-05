import { useState } from 'react';
import { DashboardLayout } from '@/components/organisms/DashboardLayout';
import { ComingSoon } from '@/components/molecules/ComingSoon';
import SellerDashboardTab from '@/components/organisms/seller/SellerDashboardTab';
import SellerCatalogTab from '@/components/organisms/seller/SellerCatalogTab';
import SellerSubscriptionTab from '@/components/organisms/seller/SellerSubscriptionTab';

const ITEMS = [
  { id: 'dashboard', label: 'Resumen', icon: 'chart' },
  { id: 'catalog', label: 'Mi catálogo', shortLabel: 'Catálogo', icon: 'box' },
  { id: 'offers', label: 'Negociaciones', shortLabel: 'Ofertas', icon: 'chat' },
  { id: 'ai', label: 'Tasador IA', shortLabel: 'Tasador', icon: 'sparkles' },
  { id: 'subscription', label: 'Mi suscripción', shortLabel: 'Plan', icon: 'bag' },
  { id: 'settings', label: 'Ajustes de tienda', shortLabel: 'Ajustes', icon: 'settings' },
];
const PENDING = {
  offers: {
    title: 'Las mejores conexiones están por llegar.',
    description: 'Acá vas a poder conversar con compradores y dar seguimiento a tus negociaciones.',
    icon: 'chat',
  },
  ai: {
    title: 'Una nueva perspectiva para tu tecnología.',
    description:
      'Estamos preparando la herramienta de tasación para ayudarte a definir el precio de tus equipos.',
    icon: 'sparkles',
  },
  settings: {
    title: 'Tu tienda, a tu manera.',
    description:
      'Pronto vas a poder personalizar la información y la presentación de tu tienda desde este espacio.',
    icon: 'settings',
  },
};
export default function SellerPage() {
  const [section, setSection] = useState('dashboard');
  return (
    <DashboardLayout
      items={ITEMS}
      section={section}
      onSectionChange={setSection}
      roleLabel="Vendedor"
    >
      {section === 'dashboard' && <SellerDashboardTab onNavigate={setSection} />}
      {section === 'catalog' && <SellerCatalogTab />}
      {section === 'subscription' && <SellerSubscriptionTab />}
      {PENDING[section] && (
        <ComingSoon {...PENDING[section]} onBack={() => setSection('dashboard')} />
      )}
    </DashboardLayout>
  );
}
