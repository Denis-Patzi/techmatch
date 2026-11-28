import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { Icon } from '@/components/atoms/Icon';
import { COVERS, mediaUrl, money } from '@/lib/products';
import { EmptyProducts } from './MarketViews';
import { AuctionCountdown } from './AuctionPanel';
import { FeedOverlayContext } from '@/contexts/FeedOverlayContext';
import FeedLoadingScreen from './FeedLoadingScreen';

const clock = (seconds) =>
  `${Math.floor((seconds || 0) / 60)}:${String(Math.floor((seconds || 0) % 60)).padStart(2, '0')}`;
function FeedCard({
  product,
  seller,
  favorite,
  onFavorite,
  onOpen,
  onSeller,
  onShare,
  onContact,
  own,
  auction,
  active,
  suspended,
  autoAdvance,
  photoSeconds,
  onAdvance,
  pageReady,
  preloadNext,
  onMediaSettled,
}) {
  const stage = useRef(null);
  const video = useRef(null);
  const image = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [failed, setFailed] = useState(false);
  const [manualPaused, setManualPaused] = useState(false);
  const [ready, setReady] = useState(false);
  const [imageAttempt, setImageAttempt] = useState(0);
  const [autoplayBlocked, setAutoplayBlocked] = useState(false);
  const isVideo = product.media_type === 'video';
  useEffect(() => {
    if (
      (isVideo && video.current?.readyState >= 2) ||
      (!isVideo && image.current?.complete && image.current.naturalWidth > 0)
    )
      setReady(true);
  }, [isVideo, imageAttempt]);
  useEffect(() => {
    if (ready || failed) onMediaSettled(product.id);
  }, [ready, failed, product.id, onMediaSettled]);
  useEffect(() => {
    if (!active || ready || failed) return;
    const timer = window.setTimeout(() => setFailed(true), 20000);
    return () => window.clearTimeout(timer);
  }, [active, ready, failed]);
  useEffect(() => {
    if (!active) {
      setManualPaused(false);
    }
  }, [active]);
  useEffect(() => {
    if (!isVideo) return;
    const element = video.current;
    let cancelled = false;
    if (
      active &&
      !suspended &&
      !manualPaused &&
      pageReady &&
      ready &&
      !failed
    ) {
      element.play().catch((error) => {
        if (!cancelled && error.name !== 'AbortError') setAutoplayBlocked(true);
      });
    } else element.pause();
    return () => {
      cancelled = true;
      element.pause();
    };
  }, [active, suspended, isVideo, manualPaused, pageReady, ready, failed]);
  useEffect(() => {
    if (
      !active ||
      suspended ||
      !autoAdvance ||
      (!ready && !failed) ||
      (isVideo && !failed)
    )
      return;
    const timer = window.setTimeout(onAdvance, photoSeconds * 1000);
    return () => window.clearTimeout(timer);
  }, [
    active,
    suspended,
    autoAdvance,
    isVideo,
    failed,
    photoSeconds,
    onAdvance,
    ready,
  ]);
  const togglePlay = () => {
    if (!video.current) return;
    if (video.current.paused) {
      setManualPaused(false);
      video.current.play().catch(() => setAutoplayBlocked(true));
    } else {
      setManualPaused(true);
      video.current.pause();
    }
  };
  const fullscreen = () => {
    stage.current?.requestFullscreen?.().catch(() => {});
  };
  const retry = () => {
    setFailed(false);
    setReady(false);
    setAutoplayBlocked(false);
    if (isVideo) video.current?.load();
    else setImageAttempt((value) => value + 1);
  };
  return (
    <article
      className={`market-feed-stage ${isVideo ? 'has-video' : ''}`}
      ref={stage}
      aria-label={product.title}
      data-active={active}
    >
      <div
        className="market-feed-ambient"
        style={{
          backgroundImage: `url("${isVideo ? COVERS[product.cover_key]?.src || COVERS.phone.src : mediaUrl(product)}")`,
        }}
      />
      <div
        className={`market-feed-media ${ready && !failed ? 'is-ready' : 'is-loading'}`}
      >
        {isVideo ? (
          <video
            ref={video}
            src={mediaUrl(product)}
            playsInline
            muted={muted}
            autoPlay={
              active &&
              pageReady &&
              ready &&
              !suspended &&
              !manualPaused &&
              !failed
            }
            loop={!autoAdvance}
            preload={active || preloadNext ? 'auto' : 'none'}
            onLoadedData={() => {
              setReady(true);
              setFailed(false);
            }}
            onCanPlay={() => {
              setReady(true);
              setFailed(false);
            }}
            onPlay={() => {
              setPlaying(true);
              setAutoplayBlocked(false);
            }}
            onPause={() => setPlaying(false)}
            onEnded={() => {
              if (active && autoAdvance && !suspended) onAdvance();
            }}
            onTimeUpdate={(event) =>
              setProgress(event.currentTarget.currentTime)
            }
            onLoadedMetadata={(event) =>
              setDuration(
                Number.isFinite(event.currentTarget.duration)
                  ? event.currentTarget.duration
                  : 0
              )
            }
            onError={() => {
              setReady(false);
              setFailed(true);
            }}
          />
        ) : (
          <img
            ref={image}
            key={imageAttempt}
            src={mediaUrl(product)}
            alt={product.title}
            loading={active ? 'eager' : 'lazy'}
            onLoad={() => {
              setReady(true);
              setFailed(false);
            }}
            onError={() => {
              setReady(false);
              setFailed(true);
            }}
          />
        )}
      </div>
      {failed && (
        <img
          className="market-feed-fallback"
          src={(COVERS[product.cover_key] || COVERS.phone).src}
          alt="Imagen de referencia del producto"
        />
      )}
      {active && !ready && !failed && (
        <div className="market-feed-media-loading" role="status">
          <span className="market-feed-loading-spinner" aria-hidden="true" />
          <span>Cargando publicación…</span>
        </div>
      )}
      {isVideo && ready && !failed && (
        <button
          className="market-player-hitarea"
          onClick={togglePlay}
          aria-label={
            playing ? `Pausar ${product.title}` : `Reproducir ${product.title}`
          }
        />
      )}
      <div className="market-feed-caption">
        <button
          className="market-feed-seller"
          onClick={() => onSeller(product.owner_id)}
        >
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
        <button
          className="market-feed-product-link"
          onClick={() => onOpen(product)}
        >
          <Icon
            name={product.listing_type === 'auction' ? 'gavel' : 'bag'}
            size={18}
          />
          <strong>{money(auction?.current_price ?? product.price)}</strong>
          <span>
            {product.listing_type === 'auction'
              ? 'Ver subasta'
              : 'Ver producto'}
          </span>
          <Icon name="chevron" size={16} />
        </button>
        {product.listing_type === 'auction' && (
          <AuctionCountdown auction={auction} />
        )}
        {failed && (
          <p role="status">
            No pudimos cargar {isVideo ? 'este video' : 'esta imagen'}.{' '}
            <button className="market-media-retry" onClick={retry}>
              Volver a cargar
            </button>
          </p>
        )}
        {autoplayBlocked && !failed && (
          <p role="status">Tocá el video para reproducirlo.</p>
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
        <button
          onClick={() => onOpen(product)}
          aria-label={`Detalles de ${product.title}`}
        >
          <Icon name="bag" size={29} />
          <span>Producto</span>
        </button>
        {!own && (
          <button
            onClick={() => onContact(product)}
            aria-label={`Contactar al vendedor de ${product.title}`}
          >
            <Icon name="chat" size={29} />
            <span>Contactar</span>
          </button>
        )}
        <button
          onClick={() => onShare(product)}
          aria-label={`Compartir ${product.title}`}
        >
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
              style={{
                '--played': `${duration ? (progress / duration) * 100 : 0}%`,
              }}
            />
            <button
              onClick={togglePlay}
              aria-label={playing ? 'Pausar video' : 'Reproducir video'}
            >
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
  onContact,
  userId,
  auctions = {},
  suspended = false,
}) {
  const feed = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [autoAdvance, setAutoAdvance] = useState(false);
  const [photoSeconds, setPhotoSeconds] = useState(8);
  const [status, setStatus] = useState('');
  const [visible, setVisible] = useState(() => !document.hidden);
  const [pageReady, setPageReady] = useState(false);
  const [settledFirstId, setSettledFirstId] = useState(null);
  const firstId = products[0]?.id;
  const booting = !pageReady || settledFirstId !== firstId;
  const onMediaSettled = useCallback(
    (id) => {
      if (id === firstId) setSettledFirstId(id);
    },
    [firstId]
  );
  const overlay = useContext(FeedOverlayContext);
  const blocked = suspended || overlay || !visible || booting;
  const indexRef = useRef(activeIndex);
  indexRef.current = activeIndex;
  useEffect(() => {
    let cancelled = false;
    let frame;
    let paint;
    const finish = () => {
      if (cancelled) return;
      window.clearTimeout(timeout);
      frame = window.requestAnimationFrame(() => {
        paint = window.requestAnimationFrame(() => {
          if (!cancelled) setPageReady(true);
        });
      });
    };
    // Wait for typography/layout without trapping the feed on a slow font CDN.
    const timeout = window.setTimeout(finish, 5000);
    Promise.resolve(document.fonts?.ready).then(finish);
    return () => {
      cancelled = true;
      window.clearTimeout(timeout);
      window.cancelAnimationFrame(frame);
      window.cancelAnimationFrame(paint);
    };
  }, []);
  useEffect(() => {
    const change = () => setVisible(!document.hidden);
    document.addEventListener('visibilitychange', change);
    return () => document.removeEventListener('visibilitychange', change);
  }, []);
  const scrollToIndex = useCallback(
    (index) => {
      if (!feed.current) return;
      feed.current.scrollTo({
        top:
          Math.max(0, Math.min(index, products.length - 1)) *
          feed.current.clientHeight,
        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
          ? 'instant'
          : 'smooth',
      });
    },
    [products.length]
  );
  const advance = useCallback(() => {
    if (activeIndex >= products.length - 1) {
      setAutoAdvance(false);
      setStatus('Llegaste a la última publicación.');
    } else scrollToIndex(activeIndex + 1);
  }, [activeIndex, products.length, scrollToIndex]);
  useEffect(() => {
    if (!feed.current) return;
    const observer = new ResizeObserver(() => {
      const index = Math.max(
        0,
        Math.min(indexRef.current, products.length - 1)
      );
      feed.current?.scrollTo({
        top: index * feed.current.clientHeight,
        behavior: 'instant',
      });
      setActiveIndex(index);
    });
    observer.observe(feed.current);
    return () => observer.disconnect();
  }, [products.length]);
  if (!products.length) return <EmptyProducts onCreate={onCreate} />;
  const move = (direction) => scrollToIndex(activeIndex + direction);
  return (
    <div
      className={`market-feed-layout ${booting ? 'market-feed-booting' : ''}`}
      aria-busy={booting}
    >
      {booting && <FeedLoadingScreen />}
      <h1 className="sr-only">Para ti · Productos de la comunidad</h1>
      <div className="market-feed-options">
        <button
          type="button"
          aria-label="Desplazamiento automático"
          aria-pressed={autoAdvance}
          disabled={products.length < 2}
          onClick={() => {
            setAutoAdvance((value) => !value);
            setStatus('');
          }}
          title="Pasar fotos por tiempo y videos al terminar"
        >
          <Icon name={autoAdvance ? 'pause' : 'refresh'} size={16} />
          Desplazamiento automático{' '}
          <span>{autoAdvance ? 'activado' : 'desactivado'}</span>
        </button>
        {autoAdvance && (
          <label>
            Fotos{' '}
            <select
              aria-label="Tiempo por foto"
              value={photoSeconds}
              onChange={(event) => setPhotoSeconds(Number(event.target.value))}
            >
              <option value={5}>5 s</option>
              <option value={8}>8 s</option>
              <option value={12}>12 s</option>
            </select>
          </label>
        )}
      </div>
      <span className="sr-only" role="status">
        {status}
      </span>
      <div
        className="market-feed-scroll"
        ref={feed}
        tabIndex={0}
        aria-label="Feed de productos"
        onScroll={(event) =>
          setActiveIndex(
            Math.round(
              event.currentTarget.scrollTop / event.currentTarget.clientHeight
            )
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
        {products.map((product, index) => (
          <FeedCard
            key={product.id}
            product={product}
            seller={sellers[product.owner_id]}
            favorite={favorites.includes(product.id)}
            onFavorite={onFavorite}
            onOpen={onOpen}
            onSeller={onSeller}
            onShare={onShare}
            onContact={onContact}
            own={product.owner_id === userId}
            auction={auctions[product.id]}
            active={index === activeIndex}
            suspended={blocked}
            autoAdvance={autoAdvance}
            photoSeconds={photoSeconds}
            onAdvance={advance}
            pageReady={pageReady}
            preloadNext={index === activeIndex + 1}
            onMediaSettled={onMediaSettled}
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
