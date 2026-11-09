import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Icon } from '@/components/atoms/Icon';
import { NavBrand } from '@/components/molecules/NavBrand';
import { ThemeToggle } from '@/components/atoms/ThemeToggle';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/hooks/useAuth';
import { getAccountLabel, getAccountType } from '@/lib/account';
import { MarketDialog } from './MarketViews';

const MAIN = [
  { id: 'explore', label: 'Para vos', mobile: 'Inicio', icon: 'home' },
  { id: 'discovery', label: 'Explorar', mobile: 'Explorar', icon: 'search' },
  { id: 'publish', label: 'Publicar', mobile: 'Publicar', icon: 'plus' },
  { id: 'auctions', label: 'Subastas', mobile: 'Subastas', icon: 'gavel' },
  { id: 'profile', label: 'Mi perfil', mobile: 'Perfil', icon: 'user' },
];
const EXTRA = [
  { id: 'catalog', label: 'Mi catálogo', icon: 'grid' },
  { id: 'favorites', label: 'Deseos', icon: 'heart' },
  { id: 'ai', label: 'Tasador IA', icon: 'sparkles' },
  { id: 'subscription', label: 'Mi plan', icon: 'bag' },
  { id: 'settings', label: 'Editar mi cuenta', icon: 'settings' },
];
const SIDEBAR_KEY = 'techmatch-sidebar-collapsed';
export default function SocialLayout({ section, navigate, children, query, setQuery }) {
  const { profile, signOut } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const routerNavigate = useNavigate();
  const [more, setMore] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [collapsed, setCollapsed] = useState(() => {
    try {
      return localStorage.getItem(SIDEBAR_KEY) === 'true';
    } catch {
      return false;
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem(SIDEBAR_KEY, String(collapsed));
    } catch {
      /* The sidebar still works when storage is unavailable. */
    }
  }, [collapsed]);
  const name =
    (getAccountType(profile) === 'store' ? profile.store_name : profile.full_name) || 'Mi cuenta';
  const isFeed = section === 'explore';
  const search = (event) => {
    event.preventDefault();
    setSearchOpen(false);
    change('discovery');
  };
  const change = (id) => {
    setMore(false);
    navigate(id);
  };
  const logout = async () => {
    setLeaving(true);
    try {
      await signOut();
      routerNavigate('/');
    } catch {
      toast.error('No pudimos cerrar la sesión. Intentá de nuevo.');
    } finally {
      setLeaving(false);
    }
  };
  const navButton = (item, mobile = false) => (
    <button
      key={item.id}
      onClick={() => change(item.id)}
      aria-label={item.label}
      title={collapsed && !mobile ? item.label : undefined}
      aria-current={section === item.id ? 'page' : undefined}
      className={`${section === item.id ? 'is-active' : ''} ${item.id === 'publish' ? 'market-publish-nav' : ''}`}
    >
      <Icon name={item.icon} size={mobile ? 23 : 22} />
      <span>{mobile ? item.mobile : item.label}</span>
    </button>
  );
  return (
    <div
      className={`market-app ${isFeed ? 'market-feed-page' : ''} ${collapsed ? 'market-sidebar-collapsed' : ''}`}
    >
      <aside className="market-sidebar">
        <div className="market-sidebar-header">
          <Link to="/" className="market-sidebar-brand" aria-label="TechMatch, inicio">
            <NavBrand />
          </Link>
          <button
            className="market-sidebar-toggle"
            type="button"
            onClick={() => setCollapsed((value) => !value)}
            aria-label={collapsed ? 'Expandir barra lateral' : 'Contraer barra lateral'}
            aria-expanded={!collapsed}
            aria-controls="market-sidebar-navigation"
            title={collapsed ? 'Expandir barra lateral' : 'Contraer barra lateral'}
          >
            <Icon name={collapsed ? 'panelOpen' : 'panelClose'} size={20} />
          </button>
        </div>
        <p className="market-sidebar-caption">Tu tecnología. Tu comunidad.</p>
        {collapsed ? (
          <button
            className="market-sidebar-search-toggle"
            onClick={() => setSearchOpen(true)}
            aria-label="Buscar productos"
            title="Buscar productos"
          >
            <Icon name="search" size={21} />
          </button>
        ) : (
          <form className="market-sidebar-search" role="search" onSubmit={search}>
            <Icon name="search" size={19} />
            <input
              aria-label="Buscar productos"
              placeholder="Buscar"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
            <button type="submit" aria-label="Buscar">
              <Icon name="arrow" size={16} />
            </button>
          </form>
        )}
        <nav aria-label="Navegación principal" id="market-sidebar-navigation">
          {MAIN.map((item) => navButton(item))}
          <div className="market-nav-divider" />
          {EXTRA.map((item) => navButton(item))}
        </nav>
        <div className="market-sidebar-bottom">
          <button
            className="market-sidebar-account"
            onClick={() => change('profile')}
            aria-label={`Mi perfil de ${name}`}
            title={collapsed ? name : undefined}
          >
            <span className="market-avatar">{name.slice(0, 2).toUpperCase()}</span>
            <span>
              <strong>{name}</strong>
              <small>{getAccountLabel(profile)}</small>
            </span>
          </button>
          <button
            className="market-logout"
            onClick={logout}
            disabled={leaving}
            aria-label="Cerrar sesión"
            title={collapsed ? 'Cerrar sesión' : undefined}
          >
            <Icon name="logout" size={18} />
            <span>Cerrar sesión</span>
          </button>
        </div>
      </aside>
      <div className="market-main">
        <header className={`market-topbar ${isFeed ? 'market-feed-topbar' : ''}`}>
          {isFeed ? (
            <>
              <button
                className="market-icon market-feed-menu"
                onClick={() => setMore(true)}
                aria-label="Más opciones"
              >
                <Icon name="menu" size={24} />
              </button>
              <nav className="market-feed-tabs" aria-label="Vistas del feed">
                <button onClick={() => change('discovery')}>Explorar</button>
                <button aria-current="page" onClick={() => change('explore')}>
                  Para vos
                </button>
              </nav>
              <div className="market-feed-topbar-tools">
                <ThemeToggle isDark={isDark} onToggle={toggleTheme} />
                <button
                  className="market-icon"
                  onClick={() => setSearchOpen(true)}
                  aria-label="Abrir búsqueda"
                >
                  <Icon name="search" size={24} />
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="market-mobile-brand">
                <img src="/logo-blue.png" width="32" height="32" alt="" />
                <strong>TechMatch</strong>
              </div>
              <span className="market-page-title">
                {[...MAIN, ...EXTRA].find((item) => item.id === section)?.label}
              </span>
              <div className="market-topbar-tools">
                <span className="market-online-dot" />{' '}
                <span className="market-community-label">Hecho para conectar</span>
                <ThemeToggle isDark={isDark} onToggle={toggleTheme} />
                <button
                  className="market-icon"
                  onClick={() => setSearchOpen(true)}
                  aria-label="Abrir búsqueda"
                >
                  <Icon name="search" />
                </button>
                <button
                  className="market-icon"
                  onClick={() => setMore(true)}
                  aria-label="Más opciones"
                >
                  <Icon name="menu" />
                </button>
              </div>
            </>
          )}
        </header>
        <main id="market-content" className="market-content">
          {children}
        </main>
      </div>
      <nav className="market-mobile-nav" aria-label="Secciones de la aplicación">
        {MAIN.map((item) => navButton(item, true))}
      </nav>
      {searchOpen && (
        <MarketDialog title="Buscar productos" onClose={() => setSearchOpen(false)} compact>
          <form className="market-search-dialog" role="search" onSubmit={search}>
            <h2>Encontrá tu próximo match</h2>
            <label>
              Buscar productos
              <input
                autoFocus
                aria-label="Buscar productos"
                value={query}
                placeholder="Celulares, laptops, audio…"
                onChange={(event) => setQuery(event.target.value)}
              />
            </label>
            <button className="btn-primary" type="submit">
              Buscar
            </button>
          </form>
        </MarketDialog>
      )}
      {more && (
        <MarketDialog title="Opciones de cuenta" onClose={() => setMore(false)} compact>
          <div className="market-more-dialog">
            <div className="market-section-heading">
              <h2>Tu espacio</h2>
            </div>
            {EXTRA.map((item) => (
              <button className="market-more-link" key={item.id} onClick={() => change(item.id)}>
                <Icon name={item.icon} />
                {item.label}
              </button>
            ))}
            <button className="market-more-link" onClick={toggleTheme}>
              <Icon name="sparkles" />
              {isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
            </button>
            <button className="market-more-link" onClick={logout} disabled={leaving}>
              <Icon name="logout" />
              Cerrar sesión
            </button>
          </div>
        </MarketDialog>
      )}
    </div>
  );
}
