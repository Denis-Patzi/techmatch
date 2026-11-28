import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import SocialLayout from '@/components/organisms/market/SocialLayout';
import FeedViewer from '@/components/organisms/market/FeedViewer';
import FeedLoadingScreen from '@/components/organisms/market/FeedLoadingScreen';
import {
  EmptyProducts,
  MarketDialog,
  ProductDetail,
  ProductGrid,
  ProfileCatalog,
} from '@/components/organisms/market/MarketViews';
import LoginOptionsDialog from '@/components/organisms/market/LoginOptionsDialog';
import PublicExplore from '@/components/organisms/market/PublicExplore';
import { Icon } from '@/components/atoms/Icon';
import { usePublicProducts } from '@/hooks/usePublicProducts';

export default function PublicFeedPage({ emailLogin = false }) {
  const location = useLocation();
  const routerNavigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const requested = params.get('section');
  const section = ['explore', 'discovery', 'auctions', 'profile'].includes(
    requested
  )
    ? requested
    : 'discovery';
  const sellerId = section === 'profile' ? params.get('seller') : null;
  const sharedId = params.get('product');
  const market = usePublicProducts(sellerId, sharedId);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('Todos');
  const [detailId, setDetailId] = useState(null);
  const [loginReason, setLoginReason] = useState(() =>
    location.state?.loginOptions
      ? 'Elegí cómo querés ingresar a tu cuenta.'
      : ''
  );
  const detail = market.products.find((item) => item.id === detailId);
  const requireLogin = (
    reason = 'Ingresá para publicar, guardar tus deseos y conversar con vendedores.'
  ) => setLoginReason(reason);
  const navigate = (id) => {
    setDetailId(null);
    if (['explore', 'discovery', 'auctions'].includes(id)) {
      if (id === 'explore') setCategory('Todos');
      setParams(id === 'discovery' ? {} : { section: id });
    } else requireLogin();
  };
  useEffect(() => {
    if (!sharedId || market.loading || market.error) return;
    if (market.products.some((item) => item.id === sharedId))
      setDetailId(sharedId);
    else toast.error('Esta publicación ya no está disponible.');
  }, [sharedId, market.loading, market.error, market.products]);
  const closeDetail = () => {
    setDetailId(null);
    if (sharedId) {
      const next = new URLSearchParams(params);
      next.delete('product');
      setParams(next, { replace: true });
    }
  };
  const openSeller = (id) => {
    setDetailId(null);
    setCategory('Todos');
    setParams({ section: 'profile', seller: id });
  };
  const share = async (product) => {
    const url = new URL('/', window.location.origin);
    url.searchParams.set('product', product.id);
    try {
      if (navigator.share)
        await navigator.share({ title: product.title, url: url.href });
      else {
        await navigator.clipboard.writeText(url.href);
        toast.success('Enlace copiado.');
      }
    } catch (err) {
      if (err.name !== 'AbortError')
        toast.error('No pudimos compartir el enlace.');
    }
  };
  const contact = () =>
    requireLogin(
      'Iniciá sesión para contactar al vendedor o participar en la subasta.'
    );
  const favorite = () =>
    requireLogin('Iniciá sesión para guardar este producto en tus deseos.');
  const products = market.products.filter(
    (item) =>
      (category === 'Todos' || item.category === category) &&
      `${item.title} ${item.description} ${item.city}`
        .toLocaleLowerCase()
        .includes(query.trim().toLocaleLowerCase()) &&
      (section !== 'auctions' || item.listing_type === 'auction')
  );
  let content;
  if (market.loading && section === 'explore') content = <FeedLoadingScreen />;
  else if (market.loading)
    content = (
      <div className="market-loading" role="status">
        <span />
        Cargando publicaciones…
      </div>
    );
  else if (market.error)
    content = (
      <div className="market-empty">
        <Icon name="box" size={40} />
        <h1>El feed estará disponible en un momento</h1>
        <p role="alert">{market.error}</p>
        <button className="btn-primary" onClick={market.reload}>
          Volver a intentar
        </button>
      </div>
    );
  else if (section === 'explore')
    content = (
      <FeedViewer
        products={market.products}
        sellers={market.sellers}
        favorites={[]}
        onFavorite={favorite}
        onOpen={(item) => setDetailId(item.id)}
        onSeller={openSeller}
        onShare={share}
        onContact={contact}
        onCreate={() =>
          requireLogin(
            'Creá tu cuenta o ingresá para publicar tu primer producto.'
          )
        }
        auctions={market.auctions}
        suspended={Boolean(detail || loginReason || emailLogin)}
      />
    );
  else if (section === 'profile')
    content = market.sellers[sellerId] ? (
      <ProfileCatalog
        key={sellerId}
        seller={market.sellers[sellerId]}
        products={market.products}
        favorites={[]}
        own={false}
        onOpen={(item) => setDetailId(item.id)}
        auctions={market.auctions}
      />
    ) : (
      <EmptyProducts
        title="Este catálogo no está disponible"
        description="Las publicaciones visibles del vendedor aparecerán aquí."
      />
    );
  else if (section === 'discovery')
    content = (
      <PublicExplore
        products={products}
        sellers={market.sellers}
        auctions={market.auctions}
        onOpen={(item) => setDetailId(item.id)}
        onSeller={openSeller}
        onReload={market.reload}
        suspended={Boolean(detail || loginReason || emailLogin)}
      />
    );
  else
    content = (
      <section className="market-discovery">
        <div className="market-discovery-header">
          <h1>{section === 'auctions' ? 'Subastas' : 'Explorar'}</h1>
          <button className="market-text-button" onClick={market.reload}>
            Actualizar
          </button>
        </div>
        {products.length ? (
          <ProductGrid
            products={products}
            publications
            auctions={market.auctions}
            onOpen={(item) => setDetailId(item.id)}
          />
        ) : (
          <EmptyProducts
            title="Todavía no hay publicaciones aquí"
            description="Probá con otra categoría o volvé más tarde."
          />
        )}
      </section>
    );
  return (
    <SocialLayout
      section={section}
      navigate={navigate}
      query={query}
      setQuery={setQuery}
      guest
      onLogin={() => requireLogin()}
      category={category}
      onCategoryChange={(value) => {
        setCategory(value);
        if (!['discovery', 'auctions'].includes(section)) {
          setDetailId(null);
          setParams({});
        }
      }}
    >
      {content}
      {detail && !loginReason && !emailLogin && (
        <MarketDialog title={detail.title} onClose={closeDetail}>
          <ProductDetail
            product={detail}
            seller={market.sellers[detail.owner_id]}
            favorite={false}
            onFavorite={favorite}
            onSeller={openSeller}
            onContact={contact}
            auction={market.auctions[detail.id]}
          />
          {detail.listing_type === 'auction' && (
            <div className="market-guest-auction">
              <button className="btn-primary" onClick={contact}>
                Iniciar sesión para pujar
              </button>
            </div>
          )}
        </MarketDialog>
      )}
      {(loginReason || emailLogin) && (
        <LoginOptionsDialog
          reason={loginReason}
          emailLogin={emailLogin}
          onClose={() => {
            setLoginReason('');
            if (emailLogin) routerNavigate('/', { replace: true });
          }}
          onBack={() => {
            setLoginReason('Elegí cómo querés ingresar a tu cuenta.');
            routerNavigate('/', {
              replace: true,
              state: { loginOptions: true },
            });
          }}
        />
      )}
    </SocialLayout>
  );
}
