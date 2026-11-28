import { useContext, useEffect, useRef, useState } from 'react';
import { FeedOverlayContext } from '@/contexts/FeedOverlayContext';
import { Icon } from '@/components/atoms/Icon';
import { COVERS, mediaUrl, money } from '@/lib/products';
import { EmptyProducts } from './MarketViews';

function ExploreMedia({ product, featured, suspended }) {
  const video = useRef(null);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const overlay = useContext(FeedOverlayContext);
  useEffect(() => {
    const element = video.current;
    if (!element || !featured) return;
    let visible = false;
    const update = () => {
      if (visible && !overlay && !suspended && !document.hidden)
        element.play().catch(() => {});
      else element.pause();
    };
    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        update();
      },
      { threshold: 0.4 }
    );
    observer.observe(element);
    document.addEventListener('visibilitychange', update);
    return () => {
      observer.disconnect();
      document.removeEventListener('visibilitychange', update);
      element.pause();
    };
  }, [featured, overlay, suspended, failed]);
  const cover = (COVERS[product.cover_key] || COVERS.phone).src;
  return (
    <>
      {product.media_type === 'video' && !failed ? (
        <video
          ref={video}
          src={mediaUrl(product)}
          muted
          loop
          playsInline
          preload={featured ? 'auto' : 'metadata'}
          onLoadedData={() => setReady(true)}
          onError={() => setFailed(true)}
          className={ready ? 'is-ready' : ''}
        />
      ) : (
        <img
          src={failed ? cover : mediaUrl(product)}
          alt={product.title}
          loading={featured ? 'eager' : 'lazy'}
          onLoad={() => setReady(true)}
          onError={(event) => {
            if (!failed) {
              setFailed(true);
              event.currentTarget.src = cover;
            }
          }}
        />
      )}
      {product.media_type === 'video' && !ready && !failed && (
        <span className="public-explore-media-wait" aria-label="Cargando video">
          <span className="market-feed-loading-spinner" />
        </span>
      )}
      {(failed || !product.media_path) && (
        <span className="public-explore-reference">Imagen de referencia</span>
      )}
    </>
  );
}

function ExploreCard({
  product,
  seller,
  auction,
  featured = false,
  onOpen,
  onSeller,
  suspended,
}) {
  return (
    <article className={`public-explore-card ${featured ? 'is-featured' : ''}`}>
      <button
        className="public-explore-cover"
        aria-label={`Ver ${product.title}`}
        onClick={() => onOpen(product)}
      >
        <ExploreMedia
          product={product}
          featured={featured}
          suspended={suspended}
        />
        <span className="public-explore-kind">
          <Icon
            name={product.media_type === 'video' ? 'video' : 'image'}
            size={17}
          />
          {product.listing_type === 'auction' ? 'Subasta' : 'Venta'}
        </span>
        <span className="public-explore-price">
          {money(auction?.current_price ?? product.price)}
        </span>
      </button>
      <div className="public-explore-caption">
        <button onClick={() => onOpen(product)}>
          <h2>{product.title}</h2>
        </button>
        <button
          className="public-explore-seller"
          onClick={() => onSeller(product.owner_id)}
        >
          <span className="public-explore-avatar">
            {(seller?.display_name || 'TM').slice(0, 2).toUpperCase()}
          </span>
          <span>{seller?.display_name || 'Ver vendedor'}</span>
          {seller?.is_verified && <Icon name="shield" size={14} />}
        </button>
      </div>
    </article>
  );
}

export default function PublicExplore({
  products,
  sellers,
  auctions,
  onOpen,
  onSeller,
  onReload,
  suspended,
}) {
  if (!products.length)
    return (
      <EmptyProducts
        title="Todavía no hay publicaciones aquí"
        description="Probá con otra categoría o cambiá la búsqueda."
      />
    );
  const [featured, ...rest] = products;
  const side = rest.slice(0, 2);
  const card = (product, isFeatured = false) => (
    <ExploreCard
      key={product.id}
      product={product}
      seller={sellers[product.owner_id]}
      auction={auctions[product.id]}
      featured={isFeatured}
      onOpen={onOpen}
      onSeller={onSeller}
      suspended={suspended}
    />
  );
  return (
    <section className="public-explore" aria-label="Explorar productos">
      <div className="public-explore-heading">
        <div>
          <span>Descubrí tu próximo equipo</span>
          <h1>Explorar</h1>
        </div>
        <button className="market-text-button" onClick={onReload}>
          <Icon name="refresh" size={16} />
          Actualizar
        </button>
      </div>
      <div
        className={`public-explore-feature ${side.length ? '' : 'is-single'}`}
      >
        {card(featured, true)}
        {side.length > 0 && (
          <div className="public-explore-side">
            {side.map((product) => card(product))}
          </div>
        )}
      </div>
      {rest.length > 2 && (
        <div className="public-explore-grid">
          {rest.slice(2).map((product) => card(product))}
        </div>
      )}
    </section>
  );
}
