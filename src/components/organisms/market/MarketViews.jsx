import { useEffect, useRef, useState } from 'react';
import { Icon } from '@/components/atoms/Icon';
import { CATEGORIES, COVERS, mediaUrl, money } from '@/lib/products';

export function EmptyProducts({
  title = 'Tu próximo match está por llegar',
  description = 'Publicá el primer producto y dale vida a tu comunidad.',
  onCreate,
}) {
  return (
    <div className="market-empty">
      <span className="market-empty-orbit">
        <Icon name="box" size={42} />
      </span>
      <span className="eyebrow">Un nuevo comienzo</span>
      <h2>{title}</h2>
      <p>{description}</p>
      {onCreate && (
        <button className="btn-primary" onClick={onCreate}>
          <Icon name="plus" size={18} />
          Publicar producto
        </button>
      )}
    </div>
  );
}
export function CategoryFilter({ value, onChange }) {
  return (
    <div className="market-categories" aria-label="Filtrar por categoría">
      {['Todos', ...CATEGORIES].map((category) => (
        <button key={category} aria-pressed={value === category} onClick={() => onChange(category)}>
          {category}
        </button>
      ))}
    </div>
  );
}
function ProductImage({ product }) {
  return product.media_type === 'video' ? (
    <video src={`${mediaUrl(product)}#t=0.1`} preload="metadata" muted playsInline />
  ) : (
    <img src={mediaUrl(product)} alt={product.title} loading="lazy" />
  );
}
export function ProductGrid({ products, onOpen, onEdit, onDelete, publications = false }) {
  return (
    <div className={`market-product-grid ${publications ? 'market-publications-grid' : ''}`}>
      {products.map((product) => (
        <article className="market-product-card" key={product.id}>
          <button
            className="market-product-cover"
            onClick={() => onOpen(product)}
            aria-label={`Ver ${product.title}`}
          >
            <ProductImage product={product} />
            <span className="market-product-badge">
              {product.status === 'draft'
                ? 'Borrador'
                : product.status === 'sold'
                  ? 'Vendido'
                  : product.listing_type === 'auction'
                    ? 'Subasta'
                    : 'Venta'}
            </span>
            <span className="market-media-kind">
              <Icon name={product.media_type === 'video' ? 'video' : 'image'} size={17} />
            </span>
            {!product.media_path && <small className="market-reference">Referencia</small>}
            {publications && (
              <span className="market-post-caption">
                <strong>{money(product.price)}</strong>
                <span>{product.title}</span>
              </span>
            )}
          </button>
          <div className="market-product-info">
            <button onClick={() => onOpen(product)}>
              <h3>{product.title}</h3>
            </button>
            <strong>{money(product.price)}</strong>
            {onEdit && (
              <div className="market-product-actions">
                <button onClick={() => onEdit(product)} aria-label={`Editar ${product.title}`}>
                  Editar
                </button>
                <button
                  className="market-danger"
                  onClick={() => onDelete(product)}
                  aria-label={`Eliminar ${product.title}`}
                >
                  Eliminar
                </button>
              </div>
            )}
          </div>
        </article>
      ))}
    </div>
  );
}
export function ProfileCatalog({
  profile,
  seller,
  products,
  favorites,
  own,
  onEditProfile,
  onOpen,
  onEdit,
  onDelete,
  onCreate,
  defaultTab = 'catalog',
}) {
  const [tab, setTab] = useState(defaultTab);
  const [category, setCategory] = useState('Todos');
  const [order, setOrder] = useState('recent');
  const mine = products.filter((item) => item.owner_id === seller?.id);
  const sold = mine.filter((item) => item.status === 'sold').length;
  const list = (
    tab === 'favorites'
      ? products.filter((item) => favorites.includes(item.id) && item.status === 'published')
      : mine.filter((item) => tab !== 'auctions' || item.listing_type === 'auction')
  )
    .filter((item) => category === 'Todos' || item.category === category)
    .sort((a, b) =>
      order === 'price'
        ? Number(a.price) - Number(b.price)
        : order === 'oldest'
          ? a.created_at.localeCompare(b.created_at)
          : b.created_at.localeCompare(a.created_at)
    );
  const tabs = [
    { id: 'publications', label: 'Publicaciones', icon: 'video' },
    { id: 'catalog', label: 'Catálogo', icon: 'grid' },
    { id: 'auctions', label: 'Subastas', icon: 'gavel' },
    ...(own ? [{ id: 'favorites', label: 'Deseos', icon: 'heart' }] : []),
  ];
  return (
    <section className="market-profile">
      <div className="market-profile-heading">
        <span className="eyebrow">
          {seller?.account_type === 'store' ? 'Cuenta de tienda' : 'Cuenta personal'}
        </span>
      </div>
      <div className="market-profile-identity">
        <span className="market-profile-avatar">
          {(seller?.display_name || 'TM')
            .split(' ')
            .map((word) => word[0])
            .slice(0, 2)
            .join('')
            .toUpperCase()}
        </span>
        <div>
          <h1>
            {seller?.display_name || 'Mi perfil'}
            {seller?.is_verified && <Icon name="shield" size={21} />}
          </h1>
          <p>{seller?.city || profile?.city || 'Bolivia'}</p>
          <div className="market-profile-stats">
            <div>
              <strong>
                —<small>/5</small>
              </strong>
              <span>Sin reseñas</span>
            </div>
            <div>
              <strong>{own ? sold : '—'}</strong>
              <span title="Publicaciones que marcaste como vendidas">Vendidos</span>
            </div>
            <div>
              <strong>{mine.length}</strong>
              <span>Productos</span>
            </div>
          </div>
          {own && (
            <div className="market-profile-buttons">
              <button className="market-secondary" onClick={onEditProfile}>
                Editar perfil
              </button>
              <button className="btn-primary" onClick={onCreate}>
                <Icon name="plus" size={17} />
                Publicar producto
              </button>
            </div>
          )}
        </div>
      </div>
      <p className="market-profile-description">Tecnología que busca una nueva historia.</p>
      <nav className="market-profile-tabs" aria-label="Contenido del perfil">
        {tabs.map((item) => (
          <button
            key={item.id}
            aria-current={tab === item.id ? 'page' : undefined}
            onClick={() => setTab(item.id)}
          >
            <Icon name={item.icon} size={17} />
            {item.label}
          </button>
        ))}
      </nav>
      <CategoryFilter value={category} onChange={setCategory} />
      <div className="market-catalog-heading">
        <p>
          {list.length} productos · {seller?.city || 'Bolivia'}
        </p>
        <label className="market-sort-label">
          <span>Ordenar</span>
          <select
            aria-label="Ordenar productos"
            value={order}
            onChange={(event) => setOrder(event.target.value)}
          >
            <option value="recent">Recientes</option>
            <option value="oldest">Más antiguos</option>
            <option value="price">Menor precio</option>
          </select>
        </label>
      </div>
      {tab === 'auctions' && (
        <p className="market-notice">
          Anuncios con precio base. Las pujas todavía no están habilitadas.
        </p>
      )}
      {list.length ? (
        <ProductGrid
          products={list}
          publications={tab === 'publications'}
          onOpen={onOpen}
          onEdit={own && tab !== 'favorites' ? onEdit : undefined}
          onDelete={own && tab !== 'favorites' ? onDelete : undefined}
        />
      ) : (
        <EmptyProducts
          title={
            tab === 'favorites' ? 'Tus deseos tienen su lugar' : 'Todavía no hay productos aquí'
          }
          description={
            tab === 'favorites'
              ? 'Guardá productos desde el feed para volver a verlos.'
              : 'Las publicaciones aparecerán en este catálogo.'
          }
          onCreate={own && tab !== 'favorites' ? onCreate : undefined}
        />
      )}
    </section>
  );
}
export function MarketDialog({ title, onClose, children, compact = false }) {
  const ref = useRef(null);
  const closeRef = useRef(onClose);
  closeRef.current = onClose;
  useEffect(() => {
    const previous = document.activeElement;
    const scroll = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    ref.current?.querySelector('button')?.focus();
    const handler = (event) => {
      if (event.key === 'Escape') closeRef.current();
      if (event.key === 'Tab') {
        const controls = [
          ...ref.current.querySelectorAll(
            'button:not(:disabled),input,select,textarea,a[href],video[controls],[tabindex="0"]'
          ),
        ];
        const first = controls[0],
          last = controls.at(-1);
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last?.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first?.focus();
        }
      }
    };
    document.addEventListener('keydown', handler);
    return () => {
      document.body.style.overflow = scroll;
      document.removeEventListener('keydown', handler);
      if (previous?.isConnected) previous.focus();
    };
  }, []);
  return (
    <div
      className="market-dialog-backdrop"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        className={`market-dialog ${compact ? 'market-dialog-compact' : ''}`}
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        <button className="market-icon market-dialog-close" onClick={onClose} aria-label="Cerrar">
          <Icon name="close" />
        </button>
        {children}
      </section>
    </div>
  );
}
export function ProductDetail({ product, seller, favorite, onFavorite, onSeller, onEdit }) {
  return (
    <div className="market-detail">
      <div className="market-detail-media">
        {product.media_type === 'video' ? (
          <video src={mediaUrl(product)} controls playsInline />
        ) : (
          <img src={mediaUrl(product)} alt={product.title} />
        )}
        {!product.media_path && <span>Imagen de referencia</span>}
      </div>
      <div className="market-detail-info">
        <span className="eyebrow">
          {product.listing_type === 'auction'
            ? 'Anuncio de subasta'
            : product.status === 'sold'
              ? 'Vendido'
              : product.status === 'draft'
                ? 'Borrador'
                : 'En venta'}
        </span>
        <h2>{product.title}</h2>
        <strong className="market-detail-price">{money(product.price)}</strong>
        <p className="market-detail-description">{product.description}</p>
        <dl>
          <div>
            <dt>Categoría</dt>
            <dd>{product.category}</dd>
          </div>
          <div>
            <dt>Estado</dt>
            <dd>{product.condition}</dd>
          </div>
          <div>
            <dt>Ubicación</dt>
            <dd>{product.city}</dd>
          </div>
        </dl>
        <button className="market-detail-seller" onClick={() => onSeller(product.owner_id)}>
          <Icon name="store" />
          <span>
            {seller?.display_name || 'Ver vendedor'}
            <small>Ver catálogo</small>
          </span>
          <Icon name="chevron" />
        </button>
        {product.status === 'published' && onFavorite && (
          <button
            className="market-secondary"
            aria-pressed={favorite}
            onClick={() => onFavorite(product)}
          >
            <Icon name="heart" size={18} />
            {favorite ? 'Quitar de deseos' : 'Guardar en deseos'}
          </button>
        )}
        {onEdit && (
          <button className="btn-primary" onClick={() => onEdit(product)}>
            Editar publicación
          </button>
        )}
        {product.listing_type === 'auction' && (
          <p className="market-notice">
            Precio base informativo. Las pujas todavía no están habilitadas.
          </p>
        )}
      </div>
    </div>
  );
}
