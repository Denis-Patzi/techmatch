import { useState, useEffect } from 'react';

/**
 * useScrollAware — Detecta si el usuario ha hecho scroll más allá de `threshold` píxeles.
 * Reemplaza el listener nativo de script.js:5 con estado declarativo de React.
 * @param {number} threshold - Píxeles de scroll necesarios para activar `scrolled`
 * @returns {{ scrolled: boolean, scrollY: number, scrollingDown: boolean }}
 */
export function useScrollAware(threshold = 12) {
  const [scrolled, setScrolled] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [scrollingDown, setScrollingDown] = useState(false);

  useEffect(() => {
    let previousY = Math.max(0, window.scrollY);
    const onScroll = () => {
      const maxY = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
      const y = Math.max(0, Math.min(window.scrollY, maxY));
      setScrollY(y);
      setScrolled(y > threshold);
      // Keep the header at the top and ignore small trackpad or touch movements.
      if (y <= 120) {
        setScrollingDown(false);
        previousY = y;
      } else if (Math.abs(y - previousY) >= 10) {
        setScrollingDown(y > previousY);
        previousY = y;
      }
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [threshold]);

  return { scrolled, scrollY, scrollingDown };
}
