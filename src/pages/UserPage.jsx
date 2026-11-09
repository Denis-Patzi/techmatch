import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import SocialLayout from '@/components/organisms/market/SocialLayout';
import ProductEditor from '@/components/organisms/market/ProductEditor';
import {
  CategoryFilter,
  EmptyProducts,
  MarketDialog,
  ProductDetail,
  ProductGrid,
  ProfileCatalog,
} from '@/components/organisms/market/MarketViews';
import FeedViewer from '@/components/organisms/market/FeedViewer';
import BuyerProfileTab from '@/components/organisms/buyer/BuyerProfileTab';
import SellerSubscriptionTab from '@/components/organisms/seller/SellerSubscriptionTab';
import { AITasadorDemo } from '@/components/organisms/AITasadorDemo';
import { Icon } from '@/components/atoms/Icon';
import { useProducts } from '@/hooks/useProducts';
import { useAuth } from '@/hooks/useAuth';
import { getAccountType } from '@/lib/account';
import { productError } from '@/lib/products';
import { useAuctions } from '@/hooks/useAuctions';
import { useInbox } from '@/hooks/useInbox';
import { commerceError, commerceRpc } from '@/lib/commerce';
import MessagesView from '@/components/organisms/market/MessagesView';

const SECTIONS = [
  'explore',
  'discovery',
  'catalog',
  'publish',
  'auctions',
  'profile',
  'favorites',
  'ai',
  'subscription',
  'settings',
  'messages',
];
export default function UserPage() {
  const { user, profile } = useAuth();
  const [params, setParams] = useSearchParams();
  const requested = params.get('section');
  const section = SECTIONS.includes(requested) ? requested : 'explore';
  const sharedProductId = params.get('product');
  const market = useProducts(sharedProductId);
  const auctionData = useAuctions(market.products);
  const inbox = useInbox();
  const contactLock = useRef(false);
  const [auctionFilter, setAuctionFilter] = useState('active');
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('Todos');
  const [editing, setEditing] = useState(null);
  const [detailId, setDetailId] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [busyDelete, setBusyDelete] = useState(false);
  const [deleteError, setDeleteError] = useState('');
  useEffect(() => {
    if (sharedProductId && !market.loading && !market.error) {
      if (market.products.some((item) => item.id === sharedProductId))
        setDetailId(sharedProductId);
      else toast.error('La publicación compartida ya no está disponible.');
    }
  }, [sharedProductId, market.loading, market.error, market.products]);
  const shareProduct = async (product) => {
    const url = new URL('/app', window.location.origin);
    url.searchParams.set('product', product.id);
    try {
      if (navigator.share)
        await navigator.share({ title: product.title, url: url.href });
      else {
        await navigator.clipboard.writeText(url.href);
        toast.success('Enlace copiado.');
      }
    } catch (error) {
      if (error.name !== 'AbortError')
        toast.error('No pudimos compartir el enlace.');
    }
  };
  const navigate = (id) => {
    setEditing(null);
    setDetailId(null);
    setParams({ section: id });
    window.scrollTo({ top: 0 });
  };
  const ownSeller = {
    id: user.id,
    display_name:
      (getAccountType(profile) === 'store'
        ? profile.store_name
        : profile.full_name) || 'Mi perfil',
    account_type: getAccountType(profile),
    city: profile.city,
    is_verified: profile.is_verified,
  };
  const sellerId =
    section === 'profile' ? params.get('seller') || user.id : user.id;
  const seller = sellerId === user.id ? ownSeller : market.sellers[sellerId];
  const detail = market.products.find((item) => item.id === detailId);
  const published = market.products.filter(
    (item) => item.status === 'published',
  );
  const visible = published.filter(
    (item) =>
      (category === 'Todos' || item.category === category) &&
      `${item.title} ${item.description} ${item.city}`
        .toLocaleLowerCase()
        .includes(query.toLocaleLowerCase().trim()),
  );
  const favoriteProducts = published.filter((item) =>
    market.favorites.includes(item.id),
  );
  const openSeller = (id) => {
    setDetailId(null);
    setParams({
      section: 'profile',
      ...(id !== user.id ? { seller: id } : {}),
    });
  };
  const editProduct = (product) => {
    setDetailId(null);
    setEditing(product);
    setParams({ section: 'publish' });
  };
  const requestDelete = (product) => {
    setDeleteError('');
    setDeleting(product);
  };
  const remove = async () => {
    setBusyDelete(true);
    setDeleteError('');
    try {
      await market.remove(deleting);
      setDeleting(null);
      toast.success('Publicación eliminada.');
    } catch (error) {
      setDeleteError(productError(error));
    } finally {
      setBusyDelete(false);
    }
  };
  const create = () => navigate('publish');
  const contact = async (product, winner = false) => {
    if (contactLock.current) return;
    contactLock.current = true;
    const notification = toast.loading('Abriendo conversación…');
    try {
      const id = await commerceRpc(
        winner ? 'contact_auction_winner' : 'open_product_conversation',
        { p_product_id: product.id },
      );
      await inbox.refresh();
      setDetailId(null);
      setParams({ section: 'messages', conversation: id });
    } catch (err) {
      toast.error(commerceError(err));
    } finally {
      toast.dismiss(notification);
      contactLock.current = false;
    }
  };
  const auctionProducts = published
    .filter((item) => item.listing_type === 'auction')
    .filter((item) => {
      const auction = auctionData.auctions[item.id];
      if (auctionFilter === 'mine') return item.owner_id === user.id;
      if (auctionFilter === 'ended') return auction?.state === 'ended';
      return !auction || auction.state === 'active';
    });
  const productSections = [
    'explore',
    'discovery',
    'catalog',
    'profile',
    'favorites',
    'auctions',
    'publish',
  ];
  let content;
  if (market.loading && productSections.includes(section))
    content = (
      <div className="market-loading" role="status">
        <span />
        Cargando tu comunidad…
      </div>
    );
  else if (market.error && productSections.includes(section))
    content = (
      <div className="market-empty">
        <Icon name="box" size={38} />
        <h1>El catálogo necesita un paso más</h1>
        <p role="alert">{market.error}</p>
        <button className="btn-primary" onClick={market.reload}>
          Volver a intentar
        </button>
        <button
          className="market-text-button"
          onClick={() => navigate('settings')}
        >
          Ir a mi cuenta
        </button>
      </div>
    );
  else if (section === 'explore')
    content = (
      <FeedViewer
        products={published}
        sellers={{ ...market.sellers, [user.id]: ownSeller }}
        favorites={market.favorites}
        onFavorite={market.toggleFavorite}
        onOpen={(item) => setDetailId(item.id)}
        onSeller={openSeller}
        onCreate={create}
        onShare={shareProduct}
        onContact={contact}
        userId={user.id}
        auctions={auctionData.auctions}
      />
    );
  else if (section === 'discovery')
    content = (
      <section className="market-discovery">
        <div className="market-discovery-header">
          <h1>Explorar</h1>
          <button
            className="market-text-button"
            onClick={market.reload}
            aria-label="Actualizar catálogo"
          >
            <Icon name="arrow" size={17} />
            Actualizar
          </button>
        </div>
        <CategoryFilter value={category} onChange={setCategory} />
        {query && (
          <p className="market-search-results">
            Resultados para «{query}»
            <button onClick={() => setQuery('')}>Limpiar búsqueda</button>
          </p>
        )}
        {visible.length ? (
          <ProductGrid
            products={visible}
            auctions={auctionData.auctions}
            publications
            onOpen={(item) => setDetailId(item.id)}
          />
        ) : (
          <EmptyProducts
            title="No encontramos productos"
            description="Probá con otra categoría o cambiá los términos de búsqueda."
          />
        )}
      </section>
    );
  else if (section === 'publish')
    content = (
      <ProductEditor
        key={editing?.id || params.get('type') || 'new'}
        original={editing}
        listingType={params.get('type') === 'auction' ? 'auction' : 'sale'}
        onCancel={() => navigate('catalog')}
        onSave={async (input) => {
          await market.save(input);
          navigate('catalog');
        }}
      />
    );
  else if (['profile', 'catalog'].includes(section))
    content = seller ? (
      <ProfileCatalog
        key={`${sellerId}-${section}`}
        profile={profile}
        seller={seller}
        own={sellerId === user.id}
        products={market.products}
        favorites={market.favorites}
        onEditProfile={() => navigate('settings')}
        onOpen={(item) => setDetailId(item.id)}
        onEdit={editProduct}
        onDelete={requestDelete}
        onCreate={create}
        defaultTab={section === 'profile' ? 'publications' : 'catalog'}
        auctions={auctionData.auctions}
      />
    ) : (
      <EmptyProducts
        title="Este catálogo no está disponible"
        description="El vendedor no tiene publicaciones visibles o retiró su perfil."
      />
    );
  else if (section === 'favorites')
    content = (
      <section className="market-browse">
        <div className="market-section-heading">
          <div>
            <span className="eyebrow">Guardados para vos</span>
            <h1>Tu lista de deseos</h1>
            <p>Los productos que querés volver a encontrar.</p>
          </div>
          <Icon name="heart" size={28} />
        </div>
        {favoriteProducts.length ? (
          <ProductGrid
            products={favoriteProducts}
            auctions={auctionData.auctions}
            onOpen={(item) => setDetailId(item.id)}
          />
        ) : (
          <EmptyProducts
            title="Tu próximo deseo está en el feed"
            description="Tocá el corazón de un producto para guardarlo en tu cuenta."
          />
        )}
      </section>
    );
  else if (section === 'auctions')
    content = (
      <section className="market-browse">
        <div className="market-section-heading">
          <div>
            <span className="eyebrow">Tu próxima oportunidad</span>
            <h1>Subastas</h1>
            <p>Ofertá, seguí el contador y encontrá tu próximo match.</p>
          </div>
          <button
            className="btn-primary"
            onClick={() => {
              setEditing(null);
              setParams({ section: 'publish', type: 'auction' });
            }}
          >
            <Icon name="plus" size={18} />
            Crear subasta
          </button>
        </div>
        <p className="market-notice">
          De 3 a 5 días para participar. La oferta más alta gana al terminar el
          plazo; si nadie la supera, se mantiene. Coordiná la compra por
          mensajes. Los pagos se acuerdan entre comprador y vendedor.
        </p>
        <nav className="market-categories" aria-label="Filtrar subastas">
          {[
            ['active', 'En curso'],
            ['ended', 'Finalizadas'],
            ['mine', 'Mis subastas'],
          ].map(([id, label]) => (
            <button
              key={id}
              aria-pressed={auctionFilter === id}
              onClick={() => setAuctionFilter(id)}
            >
              {label}
            </button>
          ))}
        </nav>
        {auctionData.error && (
          <p className="market-error" role="alert">
            {auctionData.error}
          </p>
        )}
        <ProductGrid
          products={auctionProducts}
          auctions={auctionData.auctions}
          onOpen={(item) => setDetailId(item.id)}
        />
        {!auctionProducts.length && (
          <EmptyProducts
            title="No hay subastas en esta sección"
            description="Las próximas oportunidades aparecerán acá."
          />
        )}
      </section>
    );
  else if (section === 'messages')
    content = (
      <MessagesView
        inbox={inbox}
        selectedId={params.get('conversation')}
        onSelect={(id) =>
          setParams({
            section: 'messages',
            ...(id ? { conversation: id } : {}),
          })
        }
        onProduct={(id) => {
          if (id) setParams({ section: 'discovery', product: id });
        }}
      />
    );
  else if (section === 'settings')
    content = (
      <div className="market-settings">
        <button
          className="market-text-button"
          onClick={() => navigate('profile')}
        >
          ← Volver a mi perfil
        </button>
        <BuyerProfileTab />
      </div>
    );
  else if (section === 'subscription')
    content = (
      <div className="market-settings">
        <SellerSubscriptionTab />
      </div>
    );
  else if (section === 'ai')
    content = (
      <div className="market-settings">
        <span className="eyebrow">Asistente de publicación</span>
        <h1>Presentá mejor tu producto.</h1>
        <p className="market-muted">
          Demostración del análisis de características, descripción y precio.
        </p>
        <div className="glass-panel ai-demo-shell">
          <AITasadorDemo publicationHref="/app?section=publish" />
        </div>
      </div>
    );
  return (
    <SocialLayout
      section={section}
      navigate={navigate}
      query={query}
      setQuery={setQuery}
      unreadMessages={inbox.unread}
    >
      {content}
      {detail && (
        <MarketDialog title={detail.title} onClose={() => setDetailId(null)}>
          <ProductDetail
            product={detail}
            seller={
              detail.owner_id === user.id
                ? ownSeller
                : market.sellers[detail.owner_id]
            }
            favorite={market.favorites.includes(detail.id)}
            onFavorite={market.toggleFavorite}
            onSeller={openSeller}
            onEdit={detail.owner_id === user.id ? editProduct : undefined}
            onContact={contact}
            onContactWinner={(product) => contact(product, true)}
            auction={auctionData.auctions[detail.id]}
            auctionError={auctionData.error}
            onAuctionRefresh={auctionData.refresh}
          />
        </MarketDialog>
      )}
      {deleting && (
        <MarketDialog
          title="Eliminar publicación"
          onClose={() => {
            if (!busyDelete) setDeleting(null);
          }}
        >
          <div className="market-confirm">
            <Icon name="box" size={32} />
            <h2>¿Eliminar esta publicación?</h2>
            <p>
              Se retirará «{deleting.title}» del feed y de tu catálogo. Esta
              acción no se puede deshacer.
            </p>
            {deleteError && (
              <p role="alert" className="market-error">
                {deleteError}
              </p>
            )}
            <div className="market-form-actions">
              <button
                className="market-secondary"
                disabled={busyDelete}
                onClick={() => setDeleting(null)}
              >
                Conservar
              </button>
              <button
                className="market-delete-button"
                disabled={busyDelete}
                onClick={remove}
              >
                {busyDelete ? 'Eliminando…' : 'Eliminar publicación'}
              </button>
            </div>
          </div>
        </MarketDialog>
      )}
    </SocialLayout>
  );
}
