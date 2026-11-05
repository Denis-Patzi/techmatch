import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { NavBrand } from '@/components/molecules/NavBrand';
import { Icon } from '@/components/atoms/Icon';
import { ThemeToggle } from '@/components/atoms/ThemeToggle';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/contexts/ThemeContext';

export function DashboardLayout({
  children,
  items,
  section,
  onSectionChange,
  roleLabel,
  profileSection,
}) {
  const { user, profile, signOut } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const popoverRef = useRef(null);
  const triggerRef = useRef(null);
  const contentRef = useRef(null);
  const navigate = useNavigate();
  const name =
    profile?.store_name || profile?.full_name || user?.email?.split('@')[0] || 'Mi cuenta';
  const currentItem = items.find((item) => item.id === section);

  useEffect(() => {
    if (!menuOpen) return;
    const onOutside = (event) => {
      if (!popoverRef.current?.contains(event.target)) setMenuOpen(false);
    };
    const onKey = (event) => {
      if (event.key === 'Escape') {
        setMenuOpen(false);
        triggerRef.current?.focus();
      }
    };
    document.addEventListener('pointerdown', onOutside);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onOutside);
      document.removeEventListener('keydown', onKey);
    };
  }, [menuOpen]);

  const changeSection = (id) => {
    onSectionChange(id);
    setMenuOpen(false);
    contentRef.current?.scrollIntoView({ block: 'start', behavior: 'instant' });
  };
  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };
  const avatar = (
    <span className="user-avatar">
      {profile?.avatar_url ? (
        <img src={profile.avatar_url} alt="" className="w-full h-full object-cover" />
      ) : (
        name[0].toUpperCase()
      )}
    </span>
  );

  return (
    <div className="workspace">
      <aside className="workspace-sidebar glass-panel">
        <Link to="/" className="px-2" aria-label="TechMatch, volver al inicio">
          <NavBrand />
        </Link>
        <p className="sidebar-caption">{roleLabel}</p>
        <nav className="space-y-1" aria-label={`Navegación de ${roleLabel}`}>
          {items.map((item) => (
            <button
              key={item.id}
              onClick={() => changeSection(item.id)}
              className={`sidebar-link ${section === item.id ? 'is-active' : ''}`}
              aria-current={section === item.id ? 'page' : undefined}
            >
              <Icon name={item.icon} size={19} />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
        <div className="sidebar-user">
          {avatar}
          <div className="min-w-0">
            <p className="text-xs font-medium truncate">{name}</p>
            <p className="text-[.65rem] text-slate-muted truncate">{user?.email}</p>
          </div>
        </div>
        <button onClick={handleSignOut} className="sidebar-link text-slate-muted">
          <Icon name="logout" size={18} />
          Cerrar sesión
        </button>
      </aside>
      <main className="workspace-main" ref={contentRef} id="workspace-main">
        <header className="workspace-header">
          <div className="workspace-breadcrumb">
            <Link to="/" className="md:hidden" aria-label="TechMatch, inicio">
              <span className="brand-mark brand-logo">
                <img src="/logo-blue.png" alt="" width="38" height="38" />
              </span>
            </Link>
            <span>Mi espacio</span>
            <Icon name="chevron" size={12} />
            <span className="breadcrumb-role">{roleLabel}</span>
            <Icon name="chevron" size={12} />
            <strong>{currentItem?.label || 'Mi perfil'}</strong>
          </div>
          <div className="workspace-tools">
            <Link
              to="/"
              className="text-xs text-slate-sub flex items-center gap-2"
              aria-label="Volver al inicio"
            >
              <Icon name="arrowUp" size={15} />
              <span className="home-label">Ir al inicio</span>
            </Link>
            <ThemeToggle isDark={isDark} onToggle={toggleTheme} />
            <div className="relative" ref={popoverRef}>
              <button
                ref={triggerRef}
                aria-label="Abrir menú de cuenta"
                aria-expanded={menuOpen}
                aria-controls="account-popover"
                onClick={() => setMenuOpen((value) => !value)}
              >
                {avatar}
              </button>
              {menuOpen && (
                <div className="user-popover" id="account-popover">
                  <div className="p-3 border-b border-cyan/10 mb-1">
                    <p className="text-sm font-medium truncate">{name}</p>
                    <p className="text-xs text-slate-muted truncate">{user?.email}</p>
                  </div>
                  {profileSection && (
                    <button onClick={() => changeSection(profileSection)} className="sidebar-link">
                      <Icon name="user" size={16} />
                      Mi perfil
                    </button>
                  )}
                  <button onClick={handleSignOut} className="sidebar-link text-red-500">
                    <Icon name="logout" size={16} />
                    Cerrar sesión
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>
        <div className="workspace-content">{children}</div>
      </main>
      <nav className="mobile-workspace-nav" aria-label="Secciones del panel">
        {items.map((item) => (
          <button
            key={item.id}
            className={section === item.id ? 'is-active' : ''}
            onClick={() => changeSection(item.id)}
            aria-label={item.label}
            aria-current={section === item.id ? 'page' : undefined}
          >
            <Icon name={item.icon} size={20} />
            <span>{item.shortLabel || item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}
