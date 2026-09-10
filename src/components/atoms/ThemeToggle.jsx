import { motion, AnimatePresence } from 'framer-motion';

/**
 * ThemeToggle — Átomo
 * Botón fijo en esquina inferior izquierda.
 * Muestra ícono de luna (modo oscuro activo → click cambia a claro)
 * y sol (modo claro activo → click cambia a oscuro).
 *
 * @param {boolean}  isDark   - true = tema oscuro actual
 * @param {function} onToggle - callback para cambiar el tema
 */
export function ThemeToggle({ isDark, onToggle, className = '' }) {
  return (
    <motion.button
      onClick={onToggle}
      whileHover={{ scale: 1.12 }}
      whileTap={{ scale: 0.9 }}
      className={`
        w-11 h-11 rounded-full
        bg-navy-light border border-cyan/25
        flex items-center justify-center
        shadow-navy-md hover:border-cyan/60
        transition-colors duration-200
        overflow-hidden
        ${className}
      `}
      aria-label={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
      title={isDark ? 'Modo claro' : 'Modo oscuro'}
    >
      <AnimatePresence mode="wait" initial={false}>
        {isDark ? (
          /* Sol — click para ir a modo claro */
          <motion.span
            key="sun"
            initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
            animate={{ rotate: 0,   opacity: 1, scale: 1 }}
            exit={{    rotate:  90, opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.25, ease: [0.34, 1.56, 0.64, 1] }}
            className="text-cyan flex items-center justify-center"
          >
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <circle cx="12" cy="12" r="5"/>
              <line x1="12" y1="1"   x2="12" y2="3"/>
              <line x1="12" y1="21"  x2="12" y2="23"/>
              <line x1="4.22" y1="4.22"   x2="5.64" y2="5.64"/>
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
              <line x1="1"  y1="12" x2="3"  y2="12"/>
              <line x1="21" y1="12" x2="23" y2="12"/>
              <line x1="4.22"  y1="19.78" x2="5.64"  y2="18.36"/>
              <line x1="18.36" y1="5.64"  x2="19.78" y2="4.22"/>
            </svg>
          </motion.span>
        ) : (
          /* Luna — click para ir a modo oscuro */
          <motion.span
            key="moon"
            initial={{ rotate: 90,  opacity: 0, scale: 0.5 }}
            animate={{ rotate: 0,   opacity: 1, scale: 1 }}
            exit={{    rotate: -90, opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.25, ease: [0.34, 1.56, 0.64, 1] }}
            className="text-brand-blue flex items-center justify-center"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
            </svg>
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
}
