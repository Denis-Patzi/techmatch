import { useState, useEffect, useRef } from 'react';

/**
 * useCountUp — Anima un número de 0 a `target` cuando el elemento entra en viewport.
 * Reemplaza animateCounters() de script.js:61.
 * @param {number} target   - Valor final
 * @param {number} duration - Duración en ms (default 1600)
 * @returns {{ ref: React.Ref, count: number }}
 */
export function useCountUp(target, duration = 1600) {
  const [count, setCount]     = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef(null);

  // Observer: dispara cuando el elemento es visible
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting && !started) setStarted(true); },
      { threshold: 0.5 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [started]);

  // Animación de conteo
  useEffect(() => {
    if (!started) return;
    const t0 = performance.now();
    let raf;
    const tick = now => {
      const p = Math.min((now - t0) / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - p, 3);
      setCount(Math.round(eased * target));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [started, target, duration]);

  return { ref, count };
}
