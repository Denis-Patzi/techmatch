import { Link } from 'react-router-dom';
import { NavBrand } from '@/components/molecules/NavBrand';
import { Icon } from '@/components/atoms/Icon';

const locationQuery = encodeURIComponent(
  'EMI Escuela Militar de Ingeniería (Irpavi), La Paz, Bolivia'
);
// Embed published by the EMI's official La Paz campus page.
const locationEmbedUrl =
  'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3247.3821184979874!2d-68.09013166522328!3d-16.53565927061645!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x915f21239926c7cd%3A0x2a399dfb88c485d6!2sEMI%20Escuela%20Militar%20de%20Ingenier%C3%ADa%20(Irpavi)!5e0!3m2!1ses!2sbo!4v1651602800462!5m2!1ses!2sbo';

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="page-container">
        <div className="footer-grid">
          <div>
            <NavBrand size="footer" />
            <p className="text-sm text-slate-sub mt-5 max-w-xs leading-relaxed">
              Fotos, videos y catálogos para conectar a quienes compran y venden tecnología.
            </p>
          </div>
          <div>
            <h3>Explorá</h3>
            <a href="#features">El feed</a>
            <a href="#profiles">Perfiles y catálogos</a>
            <a href="#auctions">Subastas</a>
          </div>
          <div>
            <h3>TechMatch</h3>
            <a href="#ai-assistant">Tasador con IA</a>
            <a href="#how">Cómo funciona</a>
            <a href="#plans">Planes</a>
            <a href="#locations">Ubicación y sucursales</a>
            <Link to="/signup">Crear mi perfil</Link>
            <Link to="/login">Ingresar</Link>
          </div>
          <div id="locations">
            <h3>Desde La Paz</h3>
            <a href="mailto:hola@techmatch.bo">hola@techmatch.bo</a>
            <a href="#contact">
              Conocé TechMatch <Icon name="arrowUp" size={12} />
            </a>
            <p className="text-xs text-slate-sub mt-4">
              Oficina de referencia: Escuela Militar de Ingeniería (EMI), Av. Rafael Pabón, Irpavi,
              La Paz.
            </p>
            <figure className="footer-location-map">
              <iframe
                title="Ubicación de referencia de TechMatch: EMI, Campus Irpavi, La Paz"
                src={locationEmbedUrl}
                width="320"
                height="200"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
              <figcaption>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${locationQuery}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Abrir en Google Maps <Icon name="arrowUp" size={13} />
                </a>
              </figcaption>
            </figure>
            <p className="text-xs text-slate-muted mt-2">Santa Cruz y Cochabamba, próximamente.</p>
          </div>
        </div>
        <div className="footer-wordmark" aria-hidden="true">
          TECHMATCH
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} TechMatch Bolivia.</span>
          <span>Hecho con propósito. Hecho en Bolivia.</span>
          <a href="#hero" className="flex items-center gap-2">
            Volver arriba
            <Icon name="arrowUp" size={13} />
          </a>
        </div>
      </div>
    </footer>
  );
}
