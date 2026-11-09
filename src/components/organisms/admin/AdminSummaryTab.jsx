import { useMemo, useState } from 'react';
import { Icon } from '@/components/atoms/Icon';
import {
  accountName,
  dateLabel,
  downloadCsv,
  getAdminAnalytics,
  statusLabel,
} from '@/lib/adminAnalytics';
import { mediaUrl, money } from '@/lib/products';
import { ActivityChart, AccountDonut, CategoryBars } from './AdminCharts';
import { AdminHeading } from './AdminUi';

export default function AdminSummaryTab({ data, onNavigate }) {
  const [days, setDays] = useState(30);
  const metrics = useMemo(
    () => getAdminAnalytics(data.profiles, data.products, days),
    [data.profiles, data.products, days],
  );
  const recent = [...data.products]
    .sort((a, b) => b.created_at.localeCompare(a.created_at))
    .slice(0, 5);
  const exportSummary = () =>
    downloadCsv(
      'techmatch-resumen.csv',
      [
        { label: 'Indicador', value: (r) => r.label },
        { label: 'Cantidad', value: (r) => r.value },
      ],
      [
        { label: 'Usuarios', value: metrics.totalUsers },
        { label: 'Cuentas personales', value: metrics.personal },
        { label: 'Tiendas', value: metrics.stores },
        { label: 'Perfiles verificados', value: metrics.verified },
        { label: 'Publicaciones totales', value: data.products.length },
        { label: 'Publicaciones activas', value: metrics.active.length },
        { label: 'Subastas publicadas', value: metrics.activeAuctions },
        ...metrics.statuses,
      ],
    );
  return (
    <div className="admin-summary">
      <AdminHeading
        eyebrow="El pulso de TechMatch"
        title="Resumen general"
        description="Tu comunidad, sus publicaciones y las oportunidades que están creciendo."
      >
        <button className="market-secondary" onClick={exportSummary}>
          <Icon name="file" size={17} />
          Exportar resumen
        </button>
      </AdminHeading>
      <div className="admin-stat-grid">
        {[
          {
            label: 'Usuarios registrados',
            value: metrics.totalUsers,
            detail: `${metrics.personal} personales · ${metrics.stores} tiendas`,
            icon: 'users',
            section: 'users',
          },
          {
            label: 'Publicaciones activas',
            value: metrics.active.length,
            detail: `${data.products.length} publicaciones en total`,
            icon: 'box',
            section: 'products',
          },
          {
            label: 'Subastas publicadas',
            value: metrics.activeAuctions,
            detail: `${metrics.auctions.length} anuncios en total`,
            icon: 'gavel',
            section: 'auctions',
          },
          {
            label: 'Perfiles verificados',
            value: metrics.verified,
            detail: `${metrics.totalUsers - metrics.verified} sin verificar`,
            icon: 'shield',
            section: 'verifications',
          },
        ].map((stat) => (
          <button
            key={stat.label}
            className="glass-panel admin-stat"
            onClick={() => onNavigate(stat.section)}
          >
            <span className="admin-stat-label">
              {stat.label}
              <Icon name={stat.icon} size={21} />
            </span>
            <strong>{stat.value.toLocaleString('es-BO')}</strong>
            <span className="admin-stat-detail">
              {stat.detail}
              <Icon name="arrowUp" size={15} />
            </span>
          </button>
        ))}
      </div>
      <div className="admin-overview-grid">
        <section className="glass-panel admin-chart-panel admin-activity-panel">
          <div className="admin-panel-heading">
            <div>
              <span className="eyebrow">Actividad de la comunidad</span>
              <h2>Usuarios y publicaciones</h2>
            </div>
            <select
              aria-label="Período de la gráfica"
              value={days}
              onChange={(e) => setDays(Number(e.target.value))}
            >
              <option value={7}>Últimos 7 días</option>
              <option value={30}>Últimos 30 días</option>
              <option value={90}>Últimos 90 días</option>
            </select>
          </div>
          <ActivityChart data={metrics.activity} />
          <p className="admin-chart-note">
            Altas por fecha de creación de los registros actuales. Hora de
            Bolivia.
          </p>
        </section>
        <section className="glass-panel admin-chart-panel">
          <div className="admin-panel-heading">
            <div>
              <span className="eyebrow">Quiénes nos eligen</span>
              <h2>Tipos de cuenta</h2>
            </div>
            <Icon name="users" size={20} />
          </div>
          <AccountDonut personal={metrics.personal} stores={metrics.stores} />
          <p className="admin-chart-note">
            Las cuentas de administrador se excluyen de este total.
          </p>
        </section>
      </div>
      <div className="admin-bottom-grid">
        <section className="glass-panel admin-chart-panel">
          <div className="admin-panel-heading">
            <div>
              <span className="eyebrow">Lo que se está publicando</span>
              <h2>Catálogo por categoría</h2>
            </div>
            <Icon name="chart" size={20} />
          </div>
          <CategoryBars data={metrics.categories} />
          <p className="admin-chart-note">
            Cantidad de publicaciones activas, sin estimaciones de ventas.
          </p>
        </section>
        <section className="glass-panel admin-chart-panel">
          <div className="admin-panel-heading">
            <div>
              <span className="eyebrow">Estado del catálogo</span>
              <h2>Publicaciones</h2>
            </div>
            <Icon name="box" size={20} />
          </div>
          <div className="admin-status-bars">
            {metrics.statuses.map((item) => (
              <div key={item.key}>
                <span className={`admin-badge status-${item.key}`}>
                  {item.label}
                </span>
                <strong>{item.value}</strong>
                <div>
                  <span
                    style={{
                      width: `${data.products.length ? (item.value / data.products.length) * 100 : 0}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
          <p className="admin-chart-note">
            Vendido significa marcado por su propietario; no representa un pago
            registrado.
          </p>
        </section>
        <section className="admin-review-card glass-panel">
          <span className="eyebrow">Una comunidad más confiable</span>
          <Icon name="shield" size={37} />
          <h2>Revisión del catálogo</h2>
          <strong>{metrics.review.length}</strong>
          <p>
            Borradores y publicaciones de perfiles sin verificar para revisar
            manualmente.
          </p>
          <button
            className="market-secondary"
            onClick={() => onNavigate('review')}
          >
            Ir a revisión
            <Icon name="arrow" size={16} />
          </button>
        </section>
      </div>
      <section className="glass-panel admin-recent-panel">
        <div className="admin-panel-heading">
          <div>
            <span className="eyebrow">Lo más reciente</span>
            <h2>Últimas publicaciones</h2>
          </div>
          <button
            className="market-text-button"
            onClick={() => onNavigate('products')}
          >
            Ver todas
            <Icon name="arrow" size={16} />
          </button>
        </div>
        <div className="admin-table-scroll">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Publicación</th>
                <th>Vendedor</th>
                <th>Tipo</th>
                <th>Precio</th>
                <th>Estado</th>
                <th>Fecha</th>
                <th>
                  <span className="sr-only">Acciones</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {recent.map((item) => (
                <tr key={item.id}>
                  <td>
                    <div className="admin-product-cell">
                      {item.media_type === 'image' ? (
                        <img src={mediaUrl(item)} alt="" />
                      ) : (
                        <span className="admin-video-thumb">
                          <Icon name="video" />
                        </span>
                      )}
                      <strong>{item.title}</strong>
                    </div>
                  </td>
                  <td>{accountName(metrics.ownerMap[item.owner_id])}</td>
                  <td>
                    {item.listing_type === 'auction' ? 'Subasta' : 'Venta'}
                  </td>
                  <td className="admin-price">{money(item.price)}</td>
                  <td>
                    <span className={`admin-badge status-${item.status}`}>
                      {statusLabel(item.status)}
                    </span>
                  </td>
                  <td>{dateLabel(item.created_at)}</td>
                  <td>
                    <button
                      className="market-text-button"
                      onClick={() =>
                        onNavigate(
                          item.listing_type === 'auction'
                            ? 'auctions'
                            : 'products',
                          {
                            q: item.title,
                          },
                        )
                      }
                    >
                      Gestionar
                    </button>
                  </td>
                </tr>
              ))}
              {!recent.length && (
                <tr>
                  <td colSpan={7} className="admin-empty-inline">
                    Todavía no hay publicaciones registradas.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
