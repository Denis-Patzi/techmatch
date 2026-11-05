import { useState } from 'react';
import { DashboardLayout } from '@/components/organisms/DashboardLayout';
import BuyerProfileTab from '@/components/organisms/buyer/BuyerProfileTab';
import BuyerMarketplaceTab from '@/components/organisms/buyer/BuyerMarketplaceTab';
import BuyerOffersTab from '@/components/organisms/buyer/BuyerOffersTab';

const ITEMS = [
  { id: 'marketplace', label: 'Marketplace', icon: 'grid' },
  { id: 'offers', label: 'Mis ofertas', icon: 'chat' },
  { id: 'profile', label: 'Mi perfil', icon: 'user' },
];

export default function ProfilePage() {
  const [section, setSection] = useState('marketplace');
  return (
    <DashboardLayout
      items={ITEMS}
      section={section}
      onSectionChange={setSection}
      roleLabel="Comprador"
      profileSection="profile"
    >
      {section === 'marketplace' && <BuyerMarketplaceTab />}
      {section === 'offers' && <BuyerOffersTab />}
      {section === 'profile' && <BuyerProfileTab />}
    </DashboardLayout>
  );
}
