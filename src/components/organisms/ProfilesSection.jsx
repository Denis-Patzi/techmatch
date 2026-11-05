import { useState } from 'react';
import { Icon } from '@/components/atoms/Icon';
import { ScrollScene } from '@/components/molecules/ScrollScene';
import { PreviewAppNav } from '@/components/molecules/PreviewAppNav';
import { previewAccounts, previewProducts } from '@/data/landingPreviewData';

const views = [
  { id: 'publicaciones', label: 'Publicaciones', icon: 'video' },
  { id: 'catalogo', label: 'Catálogo', icon: 'grid' },
  { id: 'subastas', label: 'Subastas', icon: 'gavel' },
];
const wishlistView = { id: 'deseos', label: 'Deseos', icon: 'heart' };
const formatNumber = new Intl.NumberFormat('es-BO');
const categories = [
  { id: 'todos', label: 'Todos' },
  { id: 'computacion', label: 'Computación' },
  { id: 'celulares', label: 'Celulares' },
  { id: 'audio', label: 'Audio' },
];

export function ProfilesSection() {
  const [accountType, setAccountType] = useState('personal');
  const [view, setView] = useState('catalogo');
  const [category, setCategory] = useState('todos');
  const account = previewAccounts[accountType];
  const accountViews = accountType === 'personal' ? [...views, wishlistView] : views;
  const selectAccount = (type) => {
    setAccountType(type);
    if (type === 'tienda' && view === 'deseos') setView('catalogo');
  };
  const products = previewProducts.filter((product) => {
    if (view === 'deseos') return account.wishlistIds?.includes(product.id);
    if (view === 'subastas') return product.sale === 'Subasta';
    if (view === 'catalogo' && category !== 'todos') return product.category === category;
    return true;
  });
  return (
    <section id="profiles" className="social-section">
      <div className="page-container social-split profile-section-grid">
        <div className="social-intro">
          <span className="eyebrow mb-5">Personas y tiendas, con su propio espacio</span>
          <h2 className="section-title">
            Tu perfil.
            <br />
            <span className="text-cyan">Tu catálogo.</span>
          </h2>
          <p className="section-copy">
            Publicá por tu cuenta o como tienda. Al entrar a tu perfil, las personas pueden ver tus
            publicaciones, recorrer tu catálogo y encontrar tus subastas.
          </p>
          <div
            className="profile-account-options"
            role="group"
            aria-label="Tipo de perfil de ejemplo"
          >
            <button
              type="button"
              aria-pressed={accountType === 'personal'}
              onClick={() => selectAccount('personal')}
            >
              <Icon name="user" size={24} />
              <span>
                <strong>Cuenta personal</strong>
                <small>Tu tecnología y tus publicaciones.</small>
              </span>
              <Icon name="check" size={17} className="account-selected" />
            </button>
            <button
              type="button"
              aria-pressed={accountType === 'tienda'}
              onClick={() => selectAccount('tienda')}
            >
              <Icon name="store" size={24} />
              <span>
                <strong>Cuenta de tienda</strong>
                <small>La identidad de tu negocio y su catálogo.</small>
              </span>
              <Icon name="check" size={17} className="account-selected" />
            </button>
          </div>
        </div>
        <ScrollScene className="profile-preview-scene" variant="phone">
          <div className="glass-panel liquid-glass profile-preview-panel">
            <div className="profile-preview-cover">
              <span>
                TechMatch <span aria-hidden="true">/</span> Perfil
              </span>
              <Icon name="search" size={20} />
            </div>
            <div className="profile-preview-body">
              <div className="profile-preview-identity">
                <span
                  className="profile-preview-avatar"
                  role="img"
                  aria-label={`Avatar de ${account.name}`}
                >
                  {account.initials}
                </span>
                <div>
                  <span className="preview-account-type">{account.type}</span>
                  <h3>{account.name}</h3>
                  <p className="profile-preview-handle">{account.handle}</p>
                  <dl
                    className="profile-preview-stats"
                    aria-label="Estadísticas de ejemplo del perfil"
                  >
                    <div>
                      <dt>Puntuación</dt>
                      <dd>
                        <Icon name="star" size={16} /> {formatNumber.format(account.rating)}
                        <small>/5</small>
                      </dd>
                    </div>
                    <div>
                      <dt>Ventas</dt>
                      <dd>{formatNumber.format(account.sales)}</dd>
                    </div>
                    <div>
                      <dt>Productos</dt>
                      <dd>{previewProducts.length}</dd>
                    </div>
                  </dl>
                </div>
              </div>
              <p className="profile-preview-bio">{account.bio}</p>
              <div
                className="profile-preview-tabs"
                role="group"
                aria-label="Contenido del perfil de ejemplo"
              >
                {accountViews.map((item) => (
                  <button
                    key={item.id}
                    className={item.id === 'deseos' ? 'profile-wishlist-tab' : undefined}
                    type="button"
                    aria-pressed={view === item.id}
                    onClick={() => setView(item.id)}
                  >
                    <Icon name={item.icon} size={15} />
                    {item.label}
                  </button>
                ))}
              </div>
              {view === 'catalogo' && (
                <div
                  className="profile-category-filters"
                  role="group"
                  aria-label="Categorías del catálogo"
                >
                  {categories.map((item) => (
                    <button
                      type="button"
                      key={item.id}
                      aria-pressed={category === item.id}
                      onClick={() => setCategory(item.id)}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              )}
              <div className="profile-gallery-toolbar">
                <span role="status">
                  {products.length}{' '}
                  {view === 'deseos'
                    ? products.length === 1
                      ? 'deseo'
                      : 'deseos'
                    : view === 'subastas'
                      ? 'subasta'
                      : view === 'publicaciones'
                        ? 'publicaciones'
                        : products.length === 1
                          ? 'producto'
                          : 'productos'}{' '}
                  · {view === 'deseos' ? 'Guardados para después' : 'La Paz'}
                </span>
              </div>
              <div
                className={`profile-products-grid is-${view}`}
                role="region"
                aria-label="Galería de productos de ejemplo"
                tabIndex={0}
              >
                {products.map((product) => (
                  <article className="profile-preview-product" key={product.id}>
                    <div className={`preview-product-art product-art-${product.id}`}>
                      {product.image ? (
                        <img
                          src={product.image}
                          alt={product.name}
                          width="540"
                          height="960"
                          loading="lazy"
                        />
                      ) : (
                        <Icon name={product.icon} size={61} />
                      )}
                      <span>{product.sale}</span>
                      <Icon
                        name={product.format === 'Video' ? 'video' : 'image'}
                        size={19}
                        className="catalog-format-icon"
                      />
                    </div>
                    <div className="profile-product-info">
                      <h4 className={view === 'publicaciones' ? 'sr-only' : ''}>{product.name}</h4>
                      <p>{product.price}</p>
                      {product.sale === 'Subasta' && view !== 'publicaciones' && (
                        <a href="#auctions">
                          Ver subasta <Icon name="arrow" size={14} />
                        </a>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            </div>
            <PreviewAppNav active="profile" />
          </div>
          <p className="preview-disclaimer">Perfil, métricas y productos de ejemplo.</p>
        </ScrollScene>
      </div>
    </section>
  );
}
