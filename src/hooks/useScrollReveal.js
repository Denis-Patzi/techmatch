import { useEffect } from 'react';

/** Reveal static section introductions once, without hiding content for reduced motion. */
export function useScrollReveal(rootRef) {
  useEffect(() => {
    const root = rootRef.current;
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (!root || !('IntersectionObserver' in window)) return;

    const elements = root.querySelectorAll(
      [
        'section:not(#hero) > div > h2',
        'section > div > .section-heading',
        '#about .grid > div:first-child',
        '#contact .grid > div:first-child',
        '.download-panel > div:first-child',
        '.footer-top',
      ].join(',')
    );
    let observer;

    const configure = () => {
      observer?.disconnect();
      if (preference.matches) {
        elements.forEach((element) => {
          element.classList.remove('scroll-reveal');
          delete element.dataset.revealed;
        });
        return;
      }
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.dataset.revealed = 'true';
            observer.unobserve(entry.target);
          });
        },
        { threshold: 0.08, rootMargin: '0px 0px -32px 0px' }
      );
      elements.forEach((element) => {
        element.classList.add('scroll-reveal');
        if (element.dataset.revealed !== 'true') observer.observe(element);
      });
    };

    configure();
    preference.addEventListener('change', configure);
    return () => {
      observer?.disconnect();
      preference.removeEventListener('change', configure);
      elements.forEach((element) => {
        element.classList.remove('scroll-reveal');
        delete element.dataset.revealed;
      });
    };
  }, [rootRef]);
}
