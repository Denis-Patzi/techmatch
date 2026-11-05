import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { supabase } from '@/lib/supabaseClient';
import { DashboardLayout } from '@/components/organisms/DashboardLayout';
import AdminSummaryTab from '@/components/organisms/admin/AdminSummaryTab';
import AdminUsersTab from '@/components/organisms/admin/AdminUsersTab';
import AdminVerificationsTab from '@/components/organisms/admin/AdminVerificationsTab';
import AdminModerationTab from '@/components/organisms/admin/AdminModerationTab';
import AdminSecurityTab from '@/components/organisms/admin/AdminSecurityTab';

const ITEMS = [
  { id: 'summary', label: 'Resumen', icon: 'chart' },
  { id: 'users', label: 'Usuarios', icon: 'users' },
  { id: 'verifications', label: 'Verificaciones', shortLabel: 'Verificar', icon: 'shield' },
  { id: 'moderation', label: 'Moderación', icon: 'flag' },
  { id: 'security', label: 'Seguridad IMEI', shortLabel: 'Seguridad', icon: 'phone' },
];

export default function AdminPage() {
  const [section, setSection] = useState('summary');
  const [counts, setCounts] = useState({ total: 0, buyers: 0, sellers: 0 });
  useEffect(() => {
    let active = true;
    supabase
      .from('profiles')
      .select('role')
      .then(({ data, error }) => {
        if (!active) return;
        if (error) toast.error('Error al cargar usuarios');
        else
          setCounts({
            total: data.length,
            buyers: data.filter((item) => item.role === 'buyer').length,
            sellers: data.filter((item) => item.role === 'seller').length,
          });
      });
    return () => {
      active = false;
    };
  }, [section]);
  return (
    <DashboardLayout
      items={ITEMS}
      section={section}
      onSectionChange={setSection}
      roleLabel="Administración"
    >
      {section === 'summary' && <AdminSummaryTab counts={counts} />}
      {section === 'users' && <AdminUsersTab />}
      {section === 'verifications' && <AdminVerificationsTab />}
      {section === 'moderation' && <AdminModerationTab />}
      {section === 'security' && <AdminSecurityTab />}
    </DashboardLayout>
  );
}
