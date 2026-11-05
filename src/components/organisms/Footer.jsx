import { Link } from 'react-router-dom';
import { NavBrand } from '@/components/molecules/NavBrand';
import { Icon } from '@/components/atoms/Icon';

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
              Oficina de referencia: Escuela Militar de Ingeniería (EMI), Av. Rafael Pabón.
            </p>
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
