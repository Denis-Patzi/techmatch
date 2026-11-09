import { useEffect, useRef, useState } from 'react';
import { Icon } from '@/components/atoms/Icon';
import { COVERS, mediaUrl, money } from '@/lib/products';
import { EmptyProducts } from './MarketViews';

const clock = (seconds) =>
  `${Math.floor((seconds || 0) / 60)}:${String(Math.floor((seconds || 0) % 60)).padStart(2, '0')}`;
function FeedCard({ product, seller, favorite, onFavorite, onOpen, onSeller, onShare }) {
  const stage = useRef(null);
  const video = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [failed, setFailed] = useState(false);
  const isVideo = product.media_type === 'video';
  useEffect(() => {
    if (!isVideo) return;
    const element = video.current;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (
          entry.isIntersecting &&
          !document.hidden &&
          !window.matchMedia('(prefers-reduced-motion: reduce)').matches
        )
          element.play().catch(() => {});
        else element.pause();
      },
      { threshold: 0.65 }
    );
    const hide = () => {
      if (document.hidden) element.pause();
    };
    observer.observe(stage.current);
    document.addEventListener('visibilitychange', hide);
    return () => {
      observer.disconnect();
      document.removeEventListener('visibilitychange', hide);
      element.pause();
    };
  }, [isVideo]);
  const togglePlay = () => {
    if (!video.current) return;
    if (video.current.paused) video.current.play().catch(() => setFailed(true));
    else video.current.pause();
  };
  const fullscreen = () => {
    stage.current?.requestFullscreen?.().catch(() => {});
  };
  return (
    <article
      className={`market-feed-stage ${isVideo ? 'has-video' : ''}`}
      ref={stage}
      aria-label={product.title}
    >
      <div
        className="market-feed-ambient"
        style={{
          backgroundImage: `url("${isVideo ? COVERS[product.cover_key]?.src || COVERS.phone.src : mediaUrl(product)}")`,
        }}
      />
      <div className="market-feed-media">
        {isVideo ? (
          <video
            ref={video}
            src={mediaUrl(product)}
            playsInline
            muted={muted}
            loop
            preload="metadata"
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
            onTimeUpdate={(event) => setProgress(event.currentTarget.currentTime)}
            onLoadedMetadata={(event) =>
              setDuration(
                Number.isFinite(event.currentTarget.duration) ? event.currentTarget.duration : 0
              )
            }
            onError={() => setFailed(true)}
          />
        ) : (
          <img src={mediaUrl(product)} alt={product.title} />
        )}
      </div>
      {isVideo && (
        <button
          className={`market-player-hitarea ${!playing ? 'is-paused' : ''}`}
          onClick={togglePlay}
          aria-label={playing ? `Pausar ${product.title}` : `Reproducir ${product.title}`}
        >
          <span>
            <Icon name="play" size={52} />
          </span>
        </button>
      )}
      <div className="market-feed-caption">
        <button className="market-feed-seller" onClick={() => onSeller(product.owner_id)}>
          <span className="market-avatar">
            {(seller?.display_name || 'TM').slice(0, 2).toUpperCase()}
          </span>
          <span>
            {seller?.display_name || 'Vendedor'}
            {seller?.is_verified && <Icon name="shield" size={15} />}
          </span>
          <span className="market-seller-type">
            {seller?.account_type === 'store' ? 'Tienda' : 'Personal'}
          </span>
        </button>
        <h2>{product.title}</h2>
        <p>{product.description}</p>
        <div className="market-feed-tags">
          <span>{product.condition}</span>
          <span>
            <Icon name="pin" size={12} />
            {product.city}
          </span>
          {!product.media_path && <span>Imagen de referencia</span>}
        </div>
        <button className="market-feed-product-link" onClick={() => onOpen(product)}>
          <Icon name={product.listing_type === 'auction' ? 'gavel' : 'bag'} size={18} />
          <strong>{money(product.price)}</strong>
          <span>{product.listing_type === 'auction' ? 'Ver precio base' : 'Ver producto'}</span>
          <Icon name="chevron" size={16} />
        </button>
        {failed && (
          <p role="status">
            No pudimos reproducir este video. Podés consultar los detalles del producto.
          </p>
        )}
      </div>
      <div className="market-feed-actions">
        <button
          className="market-feed-owner"
          onClick={() => onSeller(product.owner_id)}
          aria-label="Ver catálogo del vendedor"
        >
          <span className="market-avatar">
            {(seller?.display_name || 'TM').slice(0, 2).toUpperCase()}
          </span>
        </button>
        <button
          aria-label={favorite ? 'Quitar de deseos' : 'Guardar en deseos'}
          aria-pressed={favorite}
          onClick={() => onFavorite(product)}
        >
          <Icon name="heart" size={31} />
          <span>Deseos</span>
        </button>
        <button onClick={() => onOpen(product)} aria-label={`Detalles de ${product.title}`}>
          <Icon name="bag" size={29} />
          <span>Producto</span>
        </button>
        <button onClick={() => onShare(product)} aria-label={`Compartir ${product.title}`}>
          <Icon name="share" size={28} />
          <span>Compartir</span>
        </button>
      </div>
      <div className="market-player-controls">
        {isVideo ? (
          <>
            <input
              className="market-player-timeline"
              aria-label={`Progreso de ${product.title}`}
              type="range"
              min="0"
              max={duration || 1}
              step="0.1"
              value={progress}
              onChange={(event) => {
                if (video.current && duration) {
                  video.current.currentTime = Number(event.target.value);
                  setProgress(Number(event.target.value));
                }
              }}
              style={{ '--played': `${duration ? (progress / duration) * 100 : 0}%` }}
            />
            <button onClick={togglePlay} aria-label={playing ? 'Pausar video' : 'Reproducir video'}>
              <Icon name={playing ? 'pause' : 'play'} size={19} />
            </button>
            <span className="market-player-time">
              {clock(progress)} / {clock(duration)}
            </span>
          </>
        ) : (
          <span className="market-player-type">
            <Icon name="image" size={17} />
            Publicación con foto
          </span>
        )}
        <span className="market-player-hint">Deslizá para descubrir más</span>
        {isVideo && (
          <button
            onClick={() => setMuted((value) => !value)}
            aria-label={muted ? 'Activar sonido' : 'Silenciar video'}
          >
            <Icon name={muted ? 'muted' : 'volume'} size={21} />
          </button>
        )}
        <button
          className="market-player-fullscreen"
          onClick={fullscreen}
          aria-label="Pantalla completa"
        >
          <Icon name="fullscreen" size={20} />
        </button>
      </div>
    </article>
  );
}
export default function FeedViewer({
  products,
  sellers,
  favorites,
  onFavorite,
  onOpen,
  onSeller,
  onShare,
  onCreate,
}) {
  const feed = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  if (!products.length) return <EmptyProducts onCreate={onCreate} />;
  const move = (direction) =>
    feed.current?.scrollBy({
      top: direction * feed.current.clientHeight,
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
        ? 'instant'
        : 'smooth',
    });
  return (
    <div className="market-feed-layout">
      <h1 className="sr-only">Para vos · Productos de la comunidad</h1>
      <div
        className="market-feed-scroll"
        ref={feed}
        tabIndex={0}
        aria-label="Feed de productos"
        onScroll={(event) =>
          setActiveIndex(
            Math.round(event.currentTarget.scrollTop / event.currentTarget.clientHeight)
          )
        }
        onKeyDown={(event) => {
          if (
            event.target === event.currentTarget &&
            ['ArrowDown', 'ArrowUp'].includes(event.key)
          ) {
            event.preventDefault();
            move(event.key === 'ArrowDown' ? 1 : -1);
          }
        }}
      >
        {products.map((product) => (
          <FeedCard
            key={product.id}
            product={product}
            seller={sellers[product.owner_id]}
            favorite={favorites.includes(product.id)}
            onFavorite={onFavorite}
            onOpen={onOpen}
            onSeller={onSeller}
            onShare={onShare}
          />
        ))}
      </div>
      <div className="market-feed-pagination">
        <button
          disabled={activeIndex === 0}
          aria-label="Producto anterior"
          onClick={() => move(-1)}
        >
          <Icon name="chevron" />
        </button>
        <button
          disabled={activeIndex >= products.length - 1}
          aria-label="Siguiente producto"
          onClick={() => move(1)}
        >
          <Icon name="chevron" />
        </button>
      </div>
    </div>
  );
}
