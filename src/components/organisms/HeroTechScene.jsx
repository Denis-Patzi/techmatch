import { useEffect, useRef, useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';

const DESCRIPTIONS = {
  orbita:
    'Laptop, celular, auriculares, procesador y memoria RAM flotando entre órbitas de luz azul.',
  particulas: 'Una constelación de partículas luminosas que forma dispositivos tecnológicos en 3D.',
  portal: 'Un portal de aros luminosos con dispositivos tecnológicos que orbitan a su alrededor.',
};

function SceneFallback({ variant }) {
  return (
    <svg className="tech-scene-fallback" viewBox="0 0 600 530" aria-hidden="true">
      <defs>
        <linearGradient id="tech-fallback-blue" x2="1" y2="1">
          <stop stopColor="#76ddff" />
          <stop offset="1" stopColor="#2265ee" />
        </linearGradient>
      </defs>
      <g fill="none" stroke="url(#tech-fallback-blue)" strokeWidth="1.7">
        <ellipse cx="300" cy="285" rx="245" ry="116" transform="rotate(-20 300 285)" opacity=".6" />
        <ellipse cx="300" cy="285" rx="232" ry="130" transform="rotate(16 300 285)" opacity=".3" />
        <g transform="translate(165 135) rotate(-5 135 105)">
          <rect width="270" height="175" rx="12" fill="rgb(36 105 222 / .1)" />
          <rect x="12" y="12" width="246" height="149" rx="7" />
          <path d="m0 175-31 51h332l-31-51M95 210h80" />
          <circle cx="135" cy="87" r="44" opacity=".5" />
          <path d="m112 87 17 17 32-36" />
        </g>
        <g transform="translate(78 215) rotate(-15)">
          <rect width="60" height="115" rx="12" fill="rgb(36 105 222 / .1)" />
          <path d="M23 10h14M22 103h16" />
        </g>
        <g transform="translate(470 150) rotate(12)">
          <path d="M-40 13v-12a40 40 0 0 1 80 0v12" />
          <rect x="-49" y="5" width="20" height="50" rx="8" />
          <rect x="29" y="5" width="20" height="50" rx="8" />
        </g>
        <g transform="translate(440 365) rotate(20)">
          <rect x="-27" y="-27" width="54" height="54" rx="6" />
          <path d="M-13-40v13M0-40v13M13-40v13M-13 27v13M0 27v13M13 27v13M-40-13h13M-40 0h13M-40 13h13M27-13h13M27 0h13M27 13h13" />
        </g>
        {variant === 'orbita' && (
          <g transform="translate(130 365) rotate(-12)">
            <rect width="110" height="27" rx="3" fill="rgb(36 105 222 / .1)" />
            {[8, 28, 48, 68, 88].map((x) => (
              <rect key={x} x={x} y="6" width="14" height="13" rx="2" />
            ))}
            <path d="M8 27v7m8-7v7m8-7v7m8-7v7m8-7v7m8-7v7m16-7v7m8-7v7m8-7v7m8-7v7m8-7v7" />
          </g>
        )}
      </g>
    </svg>
  );
}

export function HeroTechScene({ variant }) {
  const stageRef = useRef(null);
  const mountRef = useRef(null);
  const instanceRef = useRef(null);
  const { isDark } = useTheme();
  const [phase, setPhase] = useState('loading');
  const [near, setNear] = useState(false);
  const [visible, setVisible] = useState(false);
  const [pageVisible, setPageVisible] = useState(() => !document.hidden);
  const [paused, setPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(
    () => matchMedia('(prefers-reduced-motion: reduce)').matches
  );
  const shouldRun = visible && pageVisible && !paused && !reducedMotion;
  const runRef = useRef(shouldRun);
  runRef.current = shouldRun;

  useEffect(() => {
    const preference = matchMedia('(prefers-reduced-motion: reduce)');
    const onPreference = () => setReducedMotion(preference.matches);
    const onVisibility = () => setPageVisible(!document.hidden);
    preference.addEventListener('change', onPreference);
    document.addEventListener('visibilitychange', onVisibility);
    const observer = new IntersectionObserver(
      ([entry]) => {
        setVisible(entry.isIntersecting);
      },
      { threshold: 0.05 }
    );
    const preload = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setNear(true);
          preload.disconnect();
        }
      },
      { rootMargin: '200px' }
    );
    observer.observe(stageRef.current);
    preload.observe(stageRef.current);
    return () => {
      observer.disconnect();
      preload.disconnect();
      preference.removeEventListener('change', onPreference);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  useEffect(() => {
    if (!near) return;
    let cancelled = false;
    let instance;
    setPhase('loading');
    const onContextLost = (event) => {
      event.preventDefault();
      instance?.dispose();
      instanceRef.current = null;
      setPhase('fallback');
    };
    import('@/lib/hero/createTechScene')
      .then(({ createTechScene }) => {
        if (cancelled) return;
        instance = createTechScene(mountRef.current, { variant, isDark, onContextLost });
        instanceRef.current = instance;
        instance.setRunning(runRef.current);
        setPhase('ready');
      })
      .catch(() => {
        if (!cancelled) setPhase('fallback');
      });
    return () => {
      cancelled = true;
      instance?.dispose();
      instanceRef.current = null;
    };
  }, [near, variant, isDark]);

  useEffect(() => {
    instanceRef.current?.setRunning(shouldRun);
  }, [shouldRun]);

  useEffect(() => {
    const onScroll = () => {
      const height = document.getElementById('hero')?.offsetHeight || innerHeight;
      instanceRef.current?.setScroll(Math.min(scrollY / height, 1));
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const onPointerMove = (event) => {
    if (event.pointerType === 'touch' || reducedMotion || paused) return;
    const rect = stageRef.current.getBoundingClientRect();
    instanceRef.current?.setPointer(
      ((event.clientX - rect.left) / rect.width - 0.5) * 2,
      ((event.clientY - rect.top) / rect.height - 0.5) * 2
    );
  };

  return (
    <figure
      ref={stageRef}
      className={`tech-scene tech-scene-${variant}`}
      data-scene-state={phase}
      data-scene-running={phase === 'ready' && shouldRun}
      onPointerMove={onPointerMove}
      onPointerLeave={() => instanceRef.current?.setPointer(0, 0)}
    >
      <div className="tech-scene-aura" aria-hidden="true" />
      <SceneFallback variant={variant} />
      <div ref={mountRef} className="tech-scene-canvas" />
      <figcaption className="sr-only">{DESCRIPTIONS[variant]}</figcaption>
      {phase === 'ready' && !reducedMotion && (
        <button
          type="button"
          className="tech-scene-playback"
          onClick={() => setPaused((value) => !value)}
          aria-label={paused ? 'Reproducir animación 3D' : 'Pausar animación 3D'}
          title={paused ? 'Reproducir animación' : 'Pausar animación'}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            {paused ? <path d="m8 5 11 7-11 7V5Z" /> : <path d="M8 5v14M16 5v14" />}
          </svg>
        </button>
      )}
    </figure>
  );
}
