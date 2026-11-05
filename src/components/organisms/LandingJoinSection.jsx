import { Link } from 'react-router-dom';
import { Icon } from '@/components/atoms/Icon';

export function LandingJoinSection() {
  return (
    <section id="contact" className="social-section">
      <div className="page-container">
        <div className="glass-panel liquid-glass landing-join-panel">
          <div>
            <span className="eyebrow mb-5">Tu próximo match empieza con vos</span>
            <h2 className="section-title">
              Mostrá lo que tenés.
              <br />
              <span className="text-cyan">Encontrá lo que querés.</span>
            </h2>
            <p className="section-copy">
              Un perfil personal o de tienda. Fotos, videos y un catálogo para darles más espacio a
              tus productos.
            </p>
          </div>
          <div className="landing-join-actions">
            <Link to="/signup" className="btn-primary">
              Crear mi perfil <Icon name="arrow" size={17} />
            </Link>
            <Link to="/login" className="social-text-link">
              Ya tengo una cuenta <Icon name="arrowUp" size={15} />
            </Link>
            <a className="landing-contact-link" href="mailto:hola@techmatch.bo">
              ¿Tenés una consulta? Escribinos.
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
