import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { NavBrand } from '@/components/molecules/NavBrand';
import { Button } from '@/components/atoms/Button';
import { useScrollAware } from '@/hooks/useScrollAware';
import { useScrollSpy } from '@/hooks/useScrollSpy';
import { navLinks } from '@/data/navLinks';
import { ThemeToggle } from '@/components/atoms/ThemeToggle';

const SECTION_IDS = ['hero', 'features', 'sellers', 'buyers', 'about', 'plans', 'contact'];

/**
 * Navbar — Organismo
 * Barra de navegación fija con:
 * - Glassmorphism al hacer scroll (useScrollAware)
 * - Link activo resaltado (useScrollSpy)
 * - Menú hamburguesa para mobile (useState)
 * - Smooth scroll hacia las secciones
 */
export function Navbar({ isDark, onToggleTheme }) {
  const { scrolled } = useScrollAware(12);
  const activeId     = useScrollSpy(SECTION_IDS, 0.4);
  const [open, setOpen] = useState(false);

  const scrollTo = (href) => {
    const id = href.replace('#', '');
    const el = document.getElementById(id);
    if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 72, behavior: 'smooth' });
    setOpen(false);
  };

  return (
    <>
      <header
        className={`
          fixed top-0 left-0 right-0 z-50 transition-all duration-300
          ${scrolled
            ? 'bg-navy/90 backdrop-blur-xl border-b border-cyan/10 shadow-navy-sm'
            : 'bg-transparent'
          }
        `}
      >
        <nav className="max-w-[1200px] mx-auto px-6 h-16 flex items-center justify-between">
          {/* Brand */}
          <a href="#hero" onClick={(e) => { e.preventDefault(); scrollTo('#hero'); }}>
            <NavBrand size="nav" />
          </a>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(({ href, label }) => {
              const id       = href.replace('#', '');
              const isActive = activeId === id;
              return (
                <a
                  key={href}
                  href={href}
                  onClick={(e) => { e.preventDefault(); scrollTo(href); }}
                  className={`
                    relative px-3.5 py-2 rounded-lg text-[0.84rem] font-medium
                    transition-colors duration-150
                    ${isActive ? 'text-cyan' : 'text-slate-sub hover:text-slate-body'}
                  `}
                >
                  {label}
                  {isActive && (
                    <motion.div
                      layoutId="nav-active-pill"
                      className="absolute inset-0 bg-cyan/10 rounded-lg -z-10"
                      transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
                    />
                  )}
                </a>
              );
            })}
            <ThemeToggle isDark={isDark} onToggle={onToggleTheme} className="ml-2 w-9 h-9" />
            <Button
              variant="cyan"
              href="#hero"
              onClick={(e) => { e.preventDefault(); scrollTo('#hero'); }}
              className="ml-3 text-[0.84rem] py-2.5 px-5"
            >
              Crear mi Cuenta
            </Button>
          </div>

          {/* Mobile controls */}
          <div className="flex md:hidden items-center gap-2">
            <ThemeToggle isDark={isDark} onToggle={onToggleTheme} className="w-9 h-9" />
            <button
              onClick={() => setOpen(o => !o)}
              className="flex flex-col gap-[5px] p-2 text-slate-sub hover:text-slate-body"
              aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
            >
              <motion.span
                animate={{ rotate: open ? 45 : 0, y: open ? 7 : 0 }}
                className="block w-5.5 h-px bg-current rounded origin-center transition-none"
                style={{ width: 22, height: 1.5, borderRadius: 2 }}
              />
              <motion.span
                animate={{ opacity: open ? 0 : 1 }}
                className="block bg-current rounded"
                style={{ width: 22, height: 1.5, borderRadius: 2 }}
              />
              <motion.span
                animate={{ rotate: open ? -45 : 0, y: open ? -7 : 0 }}
                className="block bg-current rounded origin-center transition-none"
                style={{ width: 22, height: 1.5, borderRadius: 2 }}
              />
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="nav-links-mobile md:hidden"
          >
            {navLinks.map(({ href, label }) => {
              const id = href.replace('#', '');
              return (
                <a
                  key={href}
                  href={href}
                  onClick={(e) => { e.preventDefault(); scrollTo(href); }}
                  className={`
                    px-4 py-3 rounded-xl text-sm font-medium transition-colors duration-150
                    ${activeId === id ? 'text-cyan bg-cyan/10' : 'text-slate-sub hover:text-slate-body hover:bg-navy-lighter'}
                  `}
                >
                  {label}
                </a>
              );
            })}
            <Button
              variant="cyan"
              href="#hero"
              onClick={(e) => { e.preventDefault(); scrollTo('#hero'); setOpen(false); }}
              className="mt-2 w-full justify-center"
            >
              Crear mi Cuenta
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
