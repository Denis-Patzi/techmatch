import { useState, useEffect } from 'react';

/**
 * useScrollAware — Detecta si el usuario ha hecho scroll más allá de `threshold` píxeles.
 * Reemplaza el listener nativo de script.js:5 con estado declarativo de React.
 * @param {number} threshold - Píxeles de scroll necesarios para activar `scrolled`
 * @returns {{ scrolled: boolean, scrollY: number }}
 */
export function useScrollAware(threshold = 12) {
  const [scrolled, setScrolled] = useState(false);
  const [scrollY, setScrollY]   = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrollY(y);
      setScrolled(y > threshold);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [threshold]);

  return { scrolled, scrollY };
}
