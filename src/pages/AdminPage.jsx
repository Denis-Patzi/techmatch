import { useSearchParams } from 'react-router-dom';
import { DashboardLayout } from '@/components/organisms/DashboardLayout';
import { Icon } from '@/components/atoms/Icon';
import { useAdminData } from '@/hooks/useAdminData';
import AdminSummaryTab from '@/components/organisms/admin/AdminSummaryTab';
import AdminUsersTab from '@/components/organisms/admin/AdminUsersTab';
import AdminProductsTab from '@/components/organisms/admin/AdminProductsTab';

const ITEMS = [
  { id: 'summary', label: 'Resumen', icon: 'chart' },
  { id: 'users', label: 'Usuarios', icon: 'users' },
  { id: 'products', label: 'Publicaciones', shortLabel: 'Catálogo', icon: 'box' },
  { id: 'auctions', label: 'Subastas', icon: 'gavel' },
  { id: 'verifications', label: 'Verificaciones', shortLabel: 'Verificar', icon: 'shield' },
  { id: 'review', label: 'Revisión', icon: 'flag' },
];
export default function AdminPage() {
  const data = useAdminData();
  const [params, setParams] = useSearchParams();
  const requested = params.get('section');
  const section = ITEMS.some((item) => item.id === requested) ? requested : 'summary';
  const navigate = (id, extra = {}) => setParams({ section: id, ...extra });
  return (
    <div className="admin-app">
      <DashboardLayout
        items={ITEMS}
        section={section}
        onSectionChange={navigate}
        roleLabel="Administración"
        mobileItemIds={['summary', 'users', 'products', 'auctions']}
      >
        <div className="admin-data-toolbar">
          <span>
            <i className="market-online-dot" />
            {data.updatedAt
              ? `Actualizado ${data.updatedAt.toLocaleTimeString('es-BO', { hour: '2-digit', minute: '2-digit' })}`
              : 'Conectando con Supabase'}
          </span>
          <button className="market-text-button" disabled={data.refreshing} onClick={data.reload}>
            <Icon name="arrow" size={16} />
            {data.refreshing ? 'Actualizando…' : 'Actualizar datos'}
          </button>
        </div>
        {data.error && (
          <div className="admin-load-error" role="alert">
            <Icon name="flag" />
            <p>
              {data.error}{' '}
              {data.updatedAt ? 'Se conservan los datos de la última actualización.' : ''}
            </p>
            <button onClick={data.reload}>Reintentar</button>
          </div>
        )}
        {data.loading ? (
          <div className="market-loading" role="status">
            <span />
            Cargando datos de administración…
          </div>
        ) : !data.updatedAt ? null : section === 'summary' ? (
          <AdminSummaryTab data={data} onNavigate={navigate} />
        ) : ['users', 'verifications'].includes(section) ? (
          <AdminUsersTab
            key={`${section}-${params.get('q') || ''}`}
            data={data}
            verifications={section === 'verifications'}
            initialQuery={params.get('q') || ''}
          />
        ) : (
          <AdminProductsTab
            key={`${section}-${params.get('q') || ''}`}
            data={data}
            mode={section}
            initialQuery={params.get('q') || ''}
          />
        )}
      </DashboardLayout>
    </div>
  );
}
