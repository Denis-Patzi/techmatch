import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { NavBrand } from '@/components/molecules/NavBrand';
import { ThemeToggle } from '@/components/atoms/ThemeToggle';
import { Icon } from '@/components/atoms/Icon';
import { useScrollAware } from '@/hooks/useScrollAware';
import { useScrollSpy } from '@/hooks/useScrollSpy';
import { useAuth } from '@/hooks/useAuth';
import { getAccountHome } from '@/lib/account';
import toast from 'react-hot-toast';

const LINKS = [
  { href: '#features', label: 'El feed' },
  { href: '#profiles', label: 'Perfiles' },
  { href: '#ai-assistant', label: 'Tasador IA' },
  { href: '#auctions', label: 'Subastas' },
  { href: '#how', label: 'Cómo funciona' },
  { href: '#plans', label: 'Planes' },
];
const IDS = ['hero', 'features', 'profiles', 'ai-assistant', 'auctions', 'how', 'plans'];

export function Navbar({ isDark, onToggleTheme }) {
  const { scrolled, scrollingDown } = useScrollAware(12);
  const activeId = useScrollSpy(IDS, 0.3);
  const [open, setOpen] = useState(false);
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const menuRef = useRef(null);
  const triggerRef = useRef(null);
  const profilePath = getAccountHome(profile);

  useEffect(() => {
    if (!open) return;
    const onKey = (event) => {
      if (event.key === 'Escape') {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };
    const onOutside = (event) => {
      if (!menuRef.current?.contains(event.target) && !triggerRef.current?.contains(event.target))
        setOpen(false);
    };
    const onResize = () => {
      if (window.innerWidth >= 1100) setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onOutside);
    window.addEventListener('resize', onResize);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerdown', onOutside);
      window.removeEventListener('resize', onResize);
    };
  }, [open]);

  const handleSignOut = async () => {
    try {
      await signOut();
      setOpen(false);
      navigate('/');
    } catch {
      toast.error('No pudimos cerrar la sesión. Intentá de nuevo.');
    }
  };

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-4 focus:z-[100] btn-primary"
      >
        Ir al contenido
      </a>
      <header
        className={`site-header ${scrolled ? 'is-scrolled' : ''} ${scrollingDown && !open ? 'is-hidden' : ''}`}
      >
        <nav className="site-nav liquid-glass" aria-label="Navegación principal">
          <a href="#hero" aria-label="TechMatch Bolivia, inicio" onClick={() => setOpen(false)}>
            <NavBrand />
          </a>
          <div className="hidden min-[1100px]:flex items-center gap-1">
            {LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={`nav-link ${activeId === link.href.slice(1) ? 'is-active' : ''}`}
              >
                {link.label}
              </a>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle isDark={isDark} onToggle={onToggleTheme} />
            <div className="hidden min-[1100px]:flex items-center gap-3 ml-2">
              {user ? (
                <>
                  <Link to={profilePath} className="btn-primary">
                    Mi espacio <Icon name="arrowUp" size={15} />
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="icon-button"
                    aria-label="Cerrar sesión"
                  >
                    <Icon name="logout" size={17} />
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="text-sm text-slate-sub px-2 hover:text-cyan">
                    Ingresar
                  </Link>
                  <Link to="/signup" className="btn-primary">
                    Crear cuenta <Icon name="arrowUp" size={15} />
                  </Link>
                </>
              )}
            </div>
            <button
              ref={triggerRef}
              className="icon-button min-[1100px]:hidden"
              onClick={() => setOpen((value) => !value)}
              aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
              aria-expanded={open}
              aria-controls="mobile-site-menu"
            >
              <Icon name={open ? 'close' : 'menu'} />
            </button>
          </div>
        </nav>
      </header>
      <AnimatePresence>
        {open && (
          <motion.nav
            ref={menuRef}
            id="mobile-site-menu"
            aria-label="Navegación móvil"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="nav-links-mobile liquid-glass min-[1100px]:hidden"
          >
            {[...LINKS, { href: '#contact', label: 'Contacto' }].map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="nav-link py-3"
              >
                {link.label}
              </a>
            ))}
            <div className="flex gap-3 border-t border-cyan/10 pt-4 mt-2">
              {user ? (
                <>
                  <Link to={profilePath} className="btn-primary flex-1">
                    Mi espacio
                  </Link>
                  <button onClick={handleSignOut} className="btn-secondary">
                    Salir
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="btn-secondary flex-1">
                    Ingresar
                  </Link>
                  <Link to="/signup" className="btn-primary flex-1">
                    Crear cuenta
                  </Link>
                </>
              )}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  );
}
