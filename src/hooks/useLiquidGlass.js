import { useEffect } from 'react';

/** Move only the decorative reflection; keep text, hit areas and layout still. */
export function useLiquidGlass(rootRef) {
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const preference = window.matchMedia(
      '(prefers-reduced-motion: no-preference) and (hover: hover) and (pointer: fine)'
    );
    let activeSurface;
    let frame = 0;
    let pointer;

    const reset = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      if (!activeSurface) return;
      delete activeSurface.dataset.glassActive;
      activeSurface.style.removeProperty('--glass-x');
      activeSurface.style.removeProperty('--glass-y');
      activeSurface = null;
    };

    const reflect = () => {
      frame = 0;
      const surface = pointer.target.closest('.liquid-glass');
      if (!surface || !root.contains(surface)) {
        reset();
        return;
      }
      if (activeSurface !== surface) reset();
      activeSurface = surface;
      const bounds = surface.getBoundingClientRect();
      const x = Math.max(0, Math.min(100, ((pointer.x - bounds.left) / bounds.width) * 100));
      const y = Math.max(0, Math.min(100, ((pointer.y - bounds.top) / bounds.height) * 100));
      surface.style.setProperty('--glass-x', `${x.toFixed(1)}%`);
      surface.style.setProperty('--glass-y', `${y.toFixed(1)}%`);
      surface.dataset.glassActive = 'true';
    };

    const onPointerMove = (event) => {
      if (!preference.matches || event.pointerType === 'touch') return;
      pointer = { target: event.target, x: event.clientX, y: event.clientY };
      if (!frame) frame = requestAnimationFrame(reflect);
    };

    root.addEventListener('pointermove', onPointerMove, { passive: true });
    root.addEventListener('pointerleave', reset);
    window.addEventListener('blur', reset);
    preference.addEventListener('change', reset);
    return () => {
      root.removeEventListener('pointermove', onPointerMove);
      root.removeEventListener('pointerleave', reset);
      window.removeEventListener('blur', reset);
      preference.removeEventListener('change', reset);
      reset();
    };
  }, [rootRef]);
}
