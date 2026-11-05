import { Link } from 'react-router-dom';
import { Icon } from '@/components/atoms/Icon';

/** Working landing anchors inside the illustrative app views. */
export function PreviewAppNav({ active = 'feed' }) {
  return (
    <nav className="preview-app-nav" aria-label="Navegación de la vista previa">
      <a href="#features" className={active === 'feed' ? 'is-current' : ''}>
        <Icon name="home" size={21} />
        <span>Inicio</span>
      </a>
      <a href="#profiles">
        <Icon name="grid" size={21} />
        <span>Catálogo</span>
      </a>
      <Link to="/signup">
        <Icon name="plus" size={25} />
        <span>Publicar</span>
      </Link>
      <a href="#auctions" className={active === 'auctions' ? 'is-current' : ''}>
        <Icon name="gavel" size={21} />
        <span>Subastas</span>
      </a>
      <a href="#profiles" className={active === 'profile' ? 'is-current' : ''}>
        <Icon name="user" size={21} />
        <span>Perfil</span>
      </a>
    </nav>
  );
}
