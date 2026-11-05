import { Link } from 'react-router-dom';
import { Icon } from '@/components/atoms/Icon';
import { ScrollScene } from '@/components/molecules/ScrollScene';
import { PreviewAppNav } from '@/components/molecules/PreviewAppNav';

export function AuctionsSection() {
  return (
    <section id="auctions" className="social-section">
      <div className="page-container social-split auction-section-grid">
        <div className="social-intro">
          <span className="eyebrow mb-5">Otra forma de hacer match</span>
          <h2 className="section-title">
            También hay lugar
            <br />
            <span className="text-cyan">para una buena oferta.</span>
          </h2>
          <p className="section-copy">
            Además de las publicaciones de venta, descubrí productos en subasta y participá con tus
            ofertas.
          </p>
          <p className="section-copy">
            Encontralas en el feed y dentro del perfil de quien publica, junto a su catálogo. Revisá
            los detalles del producto antes de participar.
          </p>
          <Link to="/signup" className="btn-secondary mt-7">
            Crear mi perfil <Icon name="arrow" size={17} />
          </Link>
        </div>
        <ScrollScene className="auction-preview-scene" variant="phone">
          <article className="auction-preview-panel">
            <img
              className="auction-product-photo"
              src="/images/product-headphones.webp"
              alt="Auriculares inalámbricos de color grafito con detalles azules"
              width="940"
              height="1672"
              loading="lazy"
            />
            <div className="auction-preview-heading">
              <a href="#profiles" aria-label="Ver perfil del vendedor">
                <Icon name="chevron" size={22} className="gallery-previous" />
              </a>
              <span>
                <Icon name="gavel" size={18} /> Subastas
              </span>
              <span className="post-sale-badge">Vista previa</span>
            </div>
            <div className="auction-preview-details">
              <a href="#profiles" className="feed-owner auction-owner">
                <span className="feed-avatar">VT</span>
                <span>
                  <strong>Valeria</strong>
                  <small>Cuenta personal · La Paz</small>
                </span>
                <Icon name="chevron" size={18} />
              </a>
              <h3>Auriculares inalámbricos</h3>
              <p>Sonido para acompañarte todos los días. Usados, en buen estado.</p>
              <div className="auction-condition-tags">
                <span>Bluetooth</span>
                <span>Buen estado</span>
              </div>
              <div className="auction-start-price">
                <div>
                  <span>Precio de salida</span>
                  <strong>Bs. 350</strong>
                </div>
                <span className="auction-price-note">
                  Vos elegís
                  <br />
                  tu oferta
                </span>
              </div>
              <Link to="/signup" className="auction-bid-action">
                Quiero participar <Icon name="gavel" size={18} />
              </Link>
            </div>
            <PreviewAppNav active="auctions" />
          </article>
          <p className="preview-disclaimer">Vista ilustrativa · Subasta y precio de ejemplo.</p>
        </ScrollScene>
      </div>
    </section>
  );
}
