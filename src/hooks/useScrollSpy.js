import { useState, useEffect } from 'react';

/**
 * useScrollSpy — Detecta cuál sección está activa durante el scroll.
 * Reemplaza el IntersectionObserver de script.js:428 con estado React.
 * @param {string[]} sectionIds - Array de IDs de secciones a observar
 * @param {number}   threshold  - Umbral de intersección (0–1)
 * @returns {string} activeId — ID de la sección actualmente visible
 */
export function useScrollSpy(sectionIds, threshold = 0.4) {
  const [activeId, setActiveId] = useState('');

  useEffect(() => {
    const observers = sectionIds.map(id => {
      const el = document.getElementById(id);
      if (!el) return null;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveId(id); },
        { threshold }
      );
      obs.observe(el);
      return obs;
    });

    return () => {
      observers.forEach((obs, i) => {
        const el = document.getElementById(sectionIds[i]);
        if (obs && el) obs.unobserve(el);
      });
    };
  }, [sectionIds, threshold]);

  return activeId;
}
