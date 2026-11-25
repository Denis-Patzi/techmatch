import { useState, useEffect } from 'react';

/**
 * useScrollSpy — Detecta cuál sección está activa durante el scroll.
 * @param {string[]} sectionIds - Array de IDs de secciones a observar
 * @returns {string} activeId — ID de la sección actualmente visible
 */
export function useScrollSpy(sectionIds) {
  const [activeId, setActiveId] = useState('');

  useEffect(() => {
    const sections = sectionIds.map((id) => document.getElementById(id)).filter(Boolean);
    let frame = null;
    // Use a reading line instead of a percentage of each section: tall mobile
    // sections may never reach an IntersectionObserver's ratio threshold.
    const update = () => {
      frame = null;
      const readingLine = Math.min(window.innerHeight * 0.3, 200);
      let current = sections[0]?.id || '';
      for (const section of sections) {
        if (section.getBoundingClientRect().top > readingLine) break;
        current = section.id;
      }
      setActiveId(current);
    };
    const schedule = () => {
      if (frame === null) frame = window.requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);

    return () => {
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      if (frame !== null) window.cancelAnimationFrame(frame);
    };
  }, [sectionIds]);

  return activeId;
}
