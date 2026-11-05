import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '@/components/atoms/Icon';
import { ScrollScene } from '@/components/molecules/ScrollScene';
import { VideoLoop } from '@/components/molecules/VideoLoop';
import { PreviewAppNav } from '@/components/molecules/PreviewAppNav';

const highlights = [
  {
    icon: 'video',
    title: 'El producto, en primer plano.',
    copy: 'Fotos para ver los detalles. Videos para mostrar cómo se usa.',
  },
  {
    icon: 'file',
    title: 'Toda la información, en su publicación.',
    copy: 'Una descripción y un precio para conocer mejor lo que estás viendo.',
  },
  {
    icon: 'user',
    title: 'Del descubrimiento al catálogo.',
    copy: 'Entrá al perfil de quien publica y explorá sus demás productos.',
  },
];

export function SocialFeedSection() {
  const [format, setFormat] = useState('video');
  const [liked, setLiked] = useState(false);
  return (
    <section id="features" className="social-section">
      <div className="page-container social-split feed-section-grid">
        <div className="social-intro">
          <span className="eyebrow mb-5">Un feed para descubrir tecnología</span>
          <h2 className="section-title">
            Deslizá.
            <br />
            Descubrí.
            <br />
            <span className="text-cyan">Hacé match.</span>
          </h2>
          <p className="section-copy">
            Tu próximo equipo puede aparecer en la siguiente publicación. Explorá productos en un
            feed visual de fotos y videos, de personas y tiendas.
          </p>
          <div className="social-highlight-list">
            {highlights.map((item) => (
              <div key={item.title} className="social-highlight">
                <Icon name={item.icon} size={23} />
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.copy}</p>
                </div>
              </div>
            ))}
          </div>
          <a href="#profiles" className="social-text-link">
            Conocé los perfiles y catálogos <Icon name="arrow" size={17} />
          </a>
        </div>
        <ScrollScene className="feed-preview-scene" variant="phone">
          <div className="feed-preview-shell">
            <div
              className="preview-format-control"
              role="group"
              aria-label="Formato de la vista previa"
            >
              <button
                type="button"
                aria-pressed={format === 'video'}
                onClick={() => setFormat('video')}
              >
                <Icon name="video" size={16} /> Video
              </button>
              <button
                type="button"
                aria-pressed={format === 'fotos'}
                onClick={() => setFormat('fotos')}
              >
                <Icon name="image" size={16} /> Fotos
              </button>
            </div>
            <figure className="social-feed-frame">
              {format === 'video' ? (
                <VideoLoop
                  src="/videos/hardware-portrait-loop.mp4"
                  poster="/videos/hardware-portrait-poster.webp"
                  label="Ejemplo de video de un componente tecnológico"
                  className="social-feed-media"
                />
              ) : (
                <img
                  className="social-feed-photo"
                  src="/videos/hardware-portrait-poster.webp"
                  alt="Ejemplo de fotografía de una tarjeta gráfica"
                  width="540"
                  height="960"
                  loading="lazy"
                />
              )}
              <div className="social-feed-top">
                <span className="feed-top-tabs">
                  <span>Siguiendo</span>
                  <strong>Para vos</strong>
                </span>
                <span className="post-sale-badge">Venta</span>
              </div>
              <div className="social-feed-rail">
                <button
                  type="button"
                  aria-label="Me gusta esta publicación de ejemplo"
                  aria-pressed={liked}
                  onClick={() => setLiked((value) => !value)}
                >
                  <Icon name="heart" size={27} />
                  <span>Me gusta</span>
                </button>
                <Link to="/signup" aria-label="Registrarme para consultar el producto">
                  <Icon name="chat" size={25} />
                  <span>Consultar</span>
                </Link>
                <a href="#profiles" aria-label="Ver el catálogo del perfil de ejemplo">
                  <Icon name="user" size={25} />
                  <span>Perfil</span>
                </a>
              </div>
              <figcaption className="social-feed-caption">
                <div className="feed-owner">
                  <span className="feed-avatar">NT</span>
                  <div>
                    <strong>NovaTech</strong>
                    <small>Cuenta de tienda</small>
                  </div>
                </div>
                <h3>Un upgrade para tu setup.</h3>
                <p>
                  Tarjeta gráfica de 8 GB. Mirá los detalles y encontrá más equipos en mi catálogo.
                </p>
                <a href="#profiles" className="feed-product-label">
                  <span>
                    <Icon name="bag" size={17} /> Bs. 2.900
                  </span>
                  <span>
                    Ver catálogo <Icon name="arrow" size={15} />
                  </span>
                </a>
              </figcaption>
              <PreviewAppNav />
            </figure>
            <p className="preview-disclaimer">
              Vista ilustrativa del feed · Publicación y precio de ejemplo.
            </p>
          </div>
        </ScrollScene>
      </div>
    </section>
  );
}
