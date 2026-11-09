import { useState } from 'react';
import toast from 'react-hot-toast';
import { Icon } from '@/components/atoms/Icon';
import { useAuth } from '@/hooks/useAuth';
import {
  accountName,
  dateLabel,
  downloadCsv,
  getAdminAnalytics,
  statusLabel,
} from '@/lib/adminAnalytics';
import { deleteProduct, mediaUrl, money, saveProduct } from '@/lib/products';
import ProductEditor from '@/components/organisms/market/ProductEditor';
import { MarketDialog, ProductDetail } from '@/components/organisms/market/MarketViews';
import { AdminConfirm, AdminHeading, AdminPagination } from './AdminUi';

export default function AdminProductsTab({ data, mode = 'products', initialQuery = '' }) {
  const { user } = useAuth();
  const [query, setQuery] = useState(initialQuery),
    [status, setStatus] = useState('all'),
    [kind, setKind] = useState('all'),
    [page, setPage] = useState(1);
  const [editing, setEditing] = useState(null),
    [creating, setCreating] = useState(false),
    [detailId, setDetailId] = useState(null),
    [action, setAction] = useState(null);
  const metrics = getAdminAnalytics(data.profiles, data.products, 7);
  const source =
    mode === 'auctions' ? metrics.auctions : mode === 'review' ? metrics.review : data.products;
  const rows = source
    .filter(
      (item) =>
        (status === 'all' || item.status === status) &&
        (kind === 'all' || item.listing_type === kind) &&
        `${item.title} ${accountName(metrics.ownerMap[item.owner_id])} ${item.city}`
          .toLocaleLowerCase()
          .includes(query.toLocaleLowerCase())
    )
    .sort((a, b) => b.created_at.localeCompare(a.created_at));
  const currentPage = Math.min(page, Math.max(1, Math.ceil(rows.length / 10)));
  const detail = data.products.find((item) => item.id === detailId);
  const changeFilter = (setter) => (event) => {
    setter(event.target.value);
    setPage(1);
  };
  const edit = (item) => {
    setDetailId(null);
    setEditing(item);
  };
  const exportProducts = () =>
    downloadCsv(
      `techmatch-${mode === 'auctions' ? 'subastas' : 'publicaciones'}.csv`,
      [
        { label: 'Título', value: (r) => r.title },
        { label: 'Vendedor', value: (r) => accountName(metrics.ownerMap[r.owner_id]) },
        { label: 'Tipo', value: (r) => (r.listing_type === 'auction' ? 'Subasta' : 'Venta') },
        { label: 'Categoría', value: (r) => r.category },
        { label: 'Precio Bs', value: (r) => r.price },
        { label: 'Estado', value: (r) => statusLabel(r.status) },
        { label: 'Ciudad', value: (r) => r.city },
        { label: 'Creación', value: (r) => r.created_at },
      ],
      rows
    );
  if (creating || editing)
    return (
      <ProductEditor
        original={editing}
        listingType={mode === 'auctions' ? 'auction' : 'sale'}
        onCancel={() => {
          setCreating(false);
          setEditing(null);
        }}
        onSave={async (input) => {
          const saved = await saveProduct({
            ...input,
            ownerId: input.original?.owner_id || user.id,
          });
          data.putProduct(saved);
          setCreating(false);
          setEditing(null);
        }}
      />
    );
  return (
    <section>
      <AdminHeading
        eyebrow={mode === 'review' ? 'Control del catálogo' : 'Gestión de publicaciones'}
        title={
          mode === 'auctions'
            ? 'Subastas'
            : mode === 'review'
              ? 'Revisión de publicaciones'
              : 'Publicaciones'
        }
        description={
          mode === 'auctions'
            ? 'Administrá los anuncios de subasta y sus precios base.'
            : mode === 'review'
              ? 'Revisá borradores y publicaciones de cuentas sin verificar.'
              : 'Fotos, videos y productos publicados por las cuentas actuales.'
        }
      >
        <button className="market-secondary" onClick={exportProducts}>
          <Icon name="file" size={17} />
          Exportar CSV
        </button>
        {mode !== 'review' && (
          <button className="btn-primary" onClick={() => setCreating(true)}>
            <Icon name="plus" size={17} />
            {mode === 'auctions' ? 'Crear anuncio de subasta' : 'Crear publicación'}
          </button>
        )}
      </AdminHeading>
      {mode === 'auctions' && (
        <p className="market-notice">
          Son anuncios con precio base. Las pujas, adjudicaciones y pagos todavía no están
          habilitados.
        </p>
      )}
      {mode === 'review' && (
        <p className="market-notice">
          Un perfil sin verificar o un borrador es un criterio de revisión, no una prueba de fraude
          o robo. Retirar una publicación la pasa a borrador; su propietario puede editarla y volver
          a publicarla.
        </p>
      )}
      <div className="admin-filters glass-panel">
        <label className="admin-search-field">
          <Icon name="search" size={18} />
          <input
            aria-label="Buscar publicaciones"
            placeholder="Título, vendedor o ciudad…"
            value={query}
            onChange={changeFilter(setQuery)}
          />
        </label>
        <label>
          Estado
          <select
            aria-label="Filtrar estado de publicación"
            value={status}
            onChange={changeFilter(setStatus)}
          >
            <option value="all">Todos</option>
            <option value="published">Publicado</option>
            <option value="draft">Borrador</option>
            <option value="sold">Vendido</option>
          </select>
        </label>
        {mode !== 'auctions' && (
          <label>
            Tipo
            <select
              aria-label="Filtrar tipo de publicación"
              value={kind}
              onChange={changeFilter(setKind)}
            >
              <option value="all">Todos</option>
              <option value="sale">Venta</option>
              <option value="auction">Subasta</option>
            </select>
          </label>
        )}
      </div>
      <div className="glass-panel admin-table-panel">
        <div className="admin-panel-heading">
          <h2>
            {rows.length} {mode === 'auctions' ? 'anuncios de subasta' : 'publicaciones'}
          </h2>
          <span className="admin-subtle">Catálogo conectado a Supabase</span>
        </div>
        <div className="admin-table-scroll">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Publicación</th>
                <th>Vendedor</th>
                <th>Tipo</th>
                <th>Precio {mode === 'auctions' ? 'base' : ''}</th>
                <th>Estado</th>
                <th>Creación</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {rows.slice((currentPage - 1) * 10, currentPage * 10).map((item) => (
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
                      <div>
                        <strong>{item.title}</strong>
                        <small>
                          {item.category} · {item.media_type === 'video' ? 'Video' : 'Foto'}
                        </small>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="admin-owner-cell">
                      <span>{accountName(metrics.ownerMap[item.owner_id])}</span>
                      <small>
                        {metrics.ownerMap[item.owner_id]?.is_verified
                          ? 'Perfil verificado'
                          : 'Sin verificar'}
                      </small>
                    </div>
                  </td>
                  <td>
                    <span className="admin-badge">
                      {item.listing_type === 'auction' ? 'Subasta' : 'Venta'}
                    </span>
                  </td>
                  <td className="admin-price">{money(item.price)}</td>
                  <td>
                    <span className={`admin-badge status-${item.status}`}>
                      {statusLabel(item.status)}
                    </span>
                  </td>
                  <td>{dateLabel(item.created_at)}</td>
                  <td>
                    <div className="admin-row-actions">
                      <button
                        className="market-text-button"
                        onClick={() => setDetailId(item.id)}
                        aria-label={`Ver ${item.title}`}
                      >
                        Ver
                      </button>
                      <button
                        className="market-text-button"
                        onClick={() => edit(item)}
                        aria-label={`Editar ${item.title}`}
                      >
                        Editar
                      </button>
                      {item.status !== 'sold' && (
                        <button
                          className="market-text-button"
                          onClick={() => setAction({ kind: 'visibility', product: item })}
                          aria-label={`${item.status === 'published' ? 'Retirar' : 'Publicar'} ${item.title}`}
                        >
                          {item.status === 'published' ? 'Retirar' : 'Publicar'}
                        </button>
                      )}
                      <button
                        className="market-text-button market-danger"
                        onClick={() => setAction({ kind: 'delete', product: item })}
                        aria-label={`Eliminar ${item.title}`}
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {!rows.length && (
                <tr>
                  <td colSpan={7} className="admin-empty-inline">
                    No hay publicaciones que coincidan con los filtros.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <AdminPagination count={rows.length} page={currentPage} onChange={setPage} />
      </div>
      {detail && (
        <MarketDialog title={detail.title} onClose={() => setDetailId(null)}>
          <ProductDetail
            product={detail}
            seller={{ display_name: accountName(metrics.ownerMap[detail.owner_id]) }}
            onEdit={edit}
            onSeller={() => {
              setDetailId(null);
              setQuery(accountName(metrics.ownerMap[detail.owner_id]));
              setPage(1);
            }}
          />
        </MarketDialog>
      )}
      {action && (
        <AdminConfirm
          title={
            action.kind === 'delete'
              ? 'Eliminar publicación'
              : action.product.status === 'published'
                ? 'Retirar del feed'
                : 'Publicar en el feed'
          }
          label={
            action.kind === 'delete'
              ? 'Eliminar publicación'
              : action.product.status === 'published'
                ? 'Pasar a borrador'
                : 'Publicar'
          }
          danger={action.kind === 'delete'}
          description={
            action.kind === 'delete'
              ? `Se eliminará «${action.product.title}» y se retirará de los deseos asociados. Esta acción no se puede deshacer.`
              : action.product.status === 'published'
                ? `«${action.product.title}» pasará a borrador y dejará de aparecer en el feed. El propietario podrá editarla y volver a publicarla.`
                : `«${action.product.title}» aparecerá en el feed de la comunidad.`
          }
          onClose={() => setAction(null)}
          onConfirm={async () => {
            if (action.kind === 'delete') {
              await deleteProduct(action.product.id);
              data.removeProduct(action.product.id);
              toast.success('Publicación eliminada.');
            } else {
              await data.updateProduct(action.product.id, {
                status: action.product.status === 'published' ? 'draft' : 'published',
              });
              toast.success('Visibilidad actualizada.');
            }
          }}
        />
      )}
    </section>
  );
}
