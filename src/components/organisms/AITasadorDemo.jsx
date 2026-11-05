import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '@/components/atoms/Icon';
import { demoDatabase } from '@/data/aiDemoDatabase';
import '@/styles/ai-showcase.css';

const PRODUCT = demoDatabase.phone;
const DURATION = 9600;
const STEPS = [
  { at: 2400, label: 'Reconocer el producto', detail: 'Modelo y características' },
  {
    at: 5200,
    label: 'Preparar la descripción',
    detail: 'Los detalles, listos para tu publicación',
  },
  { at: 8000, label: 'Sugerir un precio', detail: 'Una referencia para decidir' },
];
const SPECS = [
  { key: 'Estado', val: 'Usado · Excelente' },
  ...['Almacenamiento', 'Chip', 'Cámara'].map((key) =>
    PRODUCT.chars.find((characteristic) => characteristic.key === key)
  ),
];
const DESCRIPTION =
  'Vendo iPhone 14 Pro de 256 GB, usado y en excelente estado. Chip A16 Bionic, pantalla OLED de 6,1 pulgadas y cámara principal de 48 MP. Compatible con 5G y carga MagSafe.';

/** Code-native product illustration; no media downloads or WebGL context needed. */
function ScanningPhone() {
  return (
    <div className="ai-product-scene" aria-hidden="true">
      <div className="ai-scene-grid" />
      <div className="ai-product-orbit ai-product-orbit-outer" />
      <div className="ai-product-orbit" />
      <div className="ai-phone-shadow" />
      <div className="ai-phone-position">
        <div className="ai-phone-model">
          <div className="ai-phone-edge" />
          <div className="ai-phone-back">
            <div className="ai-camera-island">
              <i className="ai-camera-lens" />
              <i className="ai-camera-lens" />
              <i className="ai-camera-lens" />
              <i className="ai-camera-flash" />
            </div>
            <span className="ai-phone-back-mark">14 / PRO</span>
          </div>
          <div className="ai-phone-front">
            <div className="ai-phone-screen">
              <div className="ai-screen-aura ai-screen-aura-one" />
              <div className="ai-screen-aura ai-screen-aura-two" />
              <div className="ai-phone-island" />
              <div className="ai-phone-screen-content">
                <Icon name="sparkles" size={27} />
                <span>
                  Mucho más
                  <br />
                  por descubrir.
                </span>
                <small>TECHMATCH</small>
              </div>
              <div className="ai-phone-home" />
            </div>
          </div>
        </div>
      </div>
      <div className="ai-scan-target">
        <i />
        <i />
        <i />
        <i />
        <div className="ai-product-beam" />
      </div>
      <span className="ai-scan-callout ai-callout-storage">
        256 <small>GB</small>
      </span>
      <span className="ai-scan-callout ai-callout-camera">
        48 <small>MP</small>
      </span>
      <span className="ai-scene-caption">VISTA DE PRODUCTO · ANÁLISIS IA</span>
    </div>
  );
}

/** Autoplay once on entering the viewport; keep the completed listing available to read. */
export function AITasadorDemo() {
  const rootRef = useRef(null);
  const elapsedRef = useRef(0);
  const [elapsed, setElapsed] = useState(0);
  const [visible, setVisible] = useState(false);
  const [pageVisible, setPageVisible] = useState(() => !document.hidden);
  const [paused, setPaused] = useState(false);
  const [replay, setReplay] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
  const complete = reducedMotion || elapsed >= DURATION;
  const running = visible && pageVisible && !paused && !complete;
  const stage = complete ? STEPS.length : STEPS.filter(({ at }) => elapsed >= at).length;
  const productReady = stage >= 1;
  const descriptionReady = stage >= 2;
  const priceReady = stage >= 3;
  const status = complete
    ? 'Tu propuesta está lista'
    : paused
      ? 'Animación en pausa'
      : [
          'Reconociendo el producto…',
          'Redactando la descripción…',
          'Estimando un precio…',
          'Preparando tu publicación…',
        ][stage];

  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onPreference = () => setReducedMotion(preference.matches);
    const onVisibility = () => setPageVisible(!document.hidden);
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), {
      threshold: 0.12,
    });
    observer.observe(rootRef.current);
    preference.addEventListener('change', onPreference);
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      observer.disconnect();
      preference.removeEventListener('change', onPreference);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  useEffect(() => {
    if (!running) return;
    let previous = performance.now();
    const timer = window.setInterval(() => {
      const now = performance.now();
      elapsedRef.current = Math.min(DURATION, elapsedRef.current + now - previous);
      previous = now;
      setElapsed(elapsedRef.current);
    }, 100);
    return () => window.clearInterval(timer);
  }, [running, replay]);

  const repeatAnimation = () => {
    elapsedRef.current = 0;
    setElapsed(0);
    setPaused(false);
    setReplay((value) => value + 1);
  };

  return (
    <div
      ref={rootRef}
      className="ai-showcase"
      data-running={running}
      data-complete={complete}
      data-stage={stage}
      style={{ '--ai-progress': `${complete ? 100 : (elapsed / DURATION) * 100}%` }}
    >
      <div className="ai-analysis-panel">
        <div className="ai-analysis-heading">
          <Icon name="sparkles" size={23} />
          <div>
            <span className="ai-overline">De producto a publicación</span>
            <h3>La IA se ocupa de los detalles.</h3>
          </div>
        </div>
        <ScanningPhone key={replay} />
        <div className="ai-analysis-status">
          <span className="ai-status-light" />
          <p role="status">{status}</p>
          {!reducedMotion && (
            <button
              type="button"
              onClick={complete ? repeatAnimation : () => setPaused((value) => !value)}
              className="ai-animation-control"
              aria-label={
                complete
                  ? 'Repetir análisis de ejemplo'
                  : paused
                    ? 'Continuar animación del tasador'
                    : 'Pausar animación del tasador'
              }
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                {complete ? (
                  <path d="M3 10a9 9 0 1 1 1 8M3 4v6h6" />
                ) : paused ? (
                  <path d="m8 5 11 7-11 7V5Z" />
                ) : (
                  <path d="M8 5v14M16 5v14" />
                )}
              </svg>
              <span>{complete ? 'Repetir' : paused ? 'Continuar' : 'Pausar'}</span>
            </button>
          )}
        </div>
        <div className="ai-analysis-progress" aria-hidden="true">
          <span />
        </div>
        <ol className="ai-analysis-steps">
          {STEPS.map((step, index) => (
            <li
              key={step.label}
              data-state={stage > index ? 'done' : stage === index ? 'active' : 'pending'}
            >
              <span className="ai-step-number">
                {stage > index ? <Icon name="check" size={17} /> : `0${index + 1}`}
              </span>
              <div>
                <strong>{step.label}</strong>
                <small>{step.detail}</small>
              </div>
            </li>
          ))}
        </ol>
      </div>

      <div
        className="ai-listing-preview"
        aria-label="Publicación sugerida de ejemplo"
        aria-busy={!complete}
      >
        <div className="ai-listing-toolbar">
          <span>
            <Icon name="file" size={17} /> Tu publicación
          </span>
          <span className="ai-draft-label">
            {complete ? 'Lista para revisar' : 'Borrador con IA'}
          </span>
        </div>
        <div className={`ai-reveal-block ai-listing-title ${productReady ? 'is-ready' : ''}`}>
          <div aria-hidden={!productReady}>
            <span className="ai-overline">{PRODUCT.category} · Venta</span>
            <h3>
              iPhone 14 Pro <span>256 GB</span>
            </h3>
            <span className="ai-listing-location">
              <Icon name="pin" size={14} /> La Paz, Bolivia
            </span>
          </div>
        </div>
        <div className={`ai-reveal-block ai-listing-price ${priceReady ? 'is-ready' : ''}`}>
          <div aria-hidden={!priceReady}>
            <span className="ai-price-label">
              <Icon name="sparkles" size={16} /> Precio recomendado
            </span>
            <strong>Bs. {PRODUCT.priceBase.toLocaleString('es-BO')}</strong>
            <span className="ai-price-range">Rango orientativo: {PRODUCT.range}</span>
          </div>
        </div>
        <div className={`ai-reveal-block ai-listing-specs ${productReady ? 'is-ready' : ''}`}>
          <div aria-hidden={!productReady}>
            <h4>Características</h4>
            <dl>
              {SPECS.map(({ key, val }) => (
                <div key={key}>
                  <dt>{key}</dt>
                  <dd>{val}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
        <div
          className={`ai-reveal-block ai-listing-description ${descriptionReady ? 'is-ready' : ''}`}
        >
          <div aria-hidden={!descriptionReady}>
            <h4>
              Descripción sugerida <Icon name="sparkles" size={15} />
            </h4>
            <p>{DESCRIPTION}</p>
          </div>
        </div>
        <p className="ai-listing-note">
          <Icon name="check" size={16} /> Vos confirmás el estado, los detalles y el precio final.
        </p>
        <Link to="/signup" className="ai-listing-cta">
          Crear mi publicación <Icon name="arrow" size={18} />
        </Link>
      </div>
    </div>
  );
}
