import { useEffect } from 'react';

/** Align section content, rather than the section's decorative padding. */
export function useSectionNavigation(rootRef) {
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    let frame;

    const align = (hash, smooth) => {
      const section = document.getElementById(hash.slice(1));
      if (!section || !root.contains(section) || !section.matches('main > section')) return false;
      const header = root.querySelector('.site-header');
      // Use the header's layout height even when scrolling has hidden it.
      const topInset = header
        ? header.offsetHeight + (parseFloat(getComputedStyle(header).top) || 0) + 16
        : 24;
      const content = section.querySelector('.page-container') || section;
      const rect = content.getBoundingClientRect();
      // Apply the same viewport alignment to every section, including longer
      // demos and plans. Never scroll past the start of tall content.
      const minimumInset = window.innerWidth > 900 ? 24 : topInset;
      const offset = Math.max(minimumInset, (window.innerHeight - rect.height) / 2);
      const top = section.id === 'hero' ? 0 : window.scrollY + rect.top - offset;
      window.scrollTo({
        top: Math.max(0, top),
        behavior: smooth && !window.matchMedia('(prefers-reduced-motion: reduce)').matches
          ? 'smooth'
          : 'instant',
      });
      return true;
    };

    const onClick = (event) => {
      const link = event.target.closest?.('a[href^="#"]');
      if (!link || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || link.target === '_blank') return;
      const hash = link.getAttribute('href');
      if (!align(hash, true)) return;
      event.preventDefault();
      if (window.location.hash !== hash) window.history.pushState(null, '', hash);
    };
    const alignHash = () => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => align(window.location.hash, false));
    };
    root.addEventListener('click', onClick);
    window.addEventListener('hashchange', alignHash);
    alignHash();
    return () => {
      root.removeEventListener('click', onClick);
      window.removeEventListener('hashchange', alignHash);
      window.cancelAnimationFrame(frame);
    };
  }, [rootRef]);
}
