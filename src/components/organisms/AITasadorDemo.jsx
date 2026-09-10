import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from '@/components/atoms/Badge';
import { Button } from '@/components/atoms/Button';
import { PriceAdjuster } from '@/components/molecules/PriceAdjuster';
import { demoDatabase, genericDemoData, generateDemoCanvas } from '@/data/aiDemoDatabase';

/** Estados del simulador */
const PHASE = { IDLE: 'idle', SCANNING: 'scanning', RESULT: 'result' };

const SCAN_STATUSES = [
  'Detectando producto...',
  'Analizando marca y modelo...',
  'Consultando precios del mercado boliviano...',
  'Generando descripción automática...',
  'Cálculo completado.',
];

const DEMO_BUTTONS = [
  { key: 'laptop',  label: 'Laptop' },
  { key: 'phone',   label: 'Celular' },
  { key: 'gpu',     label: 'Componente' },
  { key: 'tablet',  label: 'Tablet' },
];

/** ─────────────────────────────────────────────────────────
 * AITasadorDemo — Organismo
 * Simulador interactivo del "Tasador Inteligente por IA".
 *
 * Estado React declarativo (useState + useEffect) que reemplaza
 * completamente la manipulación directa del DOM del script.js legacy.
 *
 * Flujo de estados:
 *   IDLE → (imagen seleccionada) → SCANNING → (3.5s) → RESULT
 *   RESULT → (botón "Analizar otro") → IDLE
 * ───────────────────────────────────────────────────────── */
export function AITasadorDemo() {
  const [phase, setPhase]         = useState(PHASE.IDLE);
  const [scanStatus, setScanStatus] = useState(SCAN_STATUSES[0]);
  const [imageSrc, setImageSrc]   = useState('');
  const [demoData, setDemoData]   = useState(null);
  const [price, setPrice]         = useState(0);
  const fileInputRef              = useRef(null);

  /* ── Scanning useEffect ── */
  useEffect(() => {
    if (phase !== PHASE.SCANNING) return;
    let si = 0;
    const interval = setInterval(() => {
      si = Math.min(si + 1, SCAN_STATUSES.length - 1);
      setScanStatus(SCAN_STATUSES[si]);
    }, 700);
    const timeout = setTimeout(() => {
      clearInterval(interval);
      setPhase(PHASE.RESULT);
    }, 3500);
    return () => { clearInterval(interval); clearTimeout(timeout); };
  }, [phase]);

  /* ── Handlers ── */
  const startScan = (src, data) => {
    setImageSrc(src);
    setScanStatus(SCAN_STATUSES[0]);
    setDemoData(data);
    setPrice(data.priceBase);
    setPhase(PHASE.SCANNING);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => startScan(evt.target.result, genericDemoData);
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleDemoKey = (key) => {
    const src  = generateDemoCanvas(key);
    const data = demoDatabase[key] ?? genericDemoData;
    startScan(src, data);
  };

  const handleReset = () => {
    setPhase(PHASE.IDLE);
    setImageSrc('');
    setDemoData(null);
    setPrice(0);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-stretch feat-card-large">

      {/* ── LEFT: Upload Zone ── */}
      <div className="flex flex-col">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-11 h-11 rounded-[14px] bg-brand-blue/20 text-brand-blue flex items-center justify-center">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="3"/><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/>
            </svg>
          </div>
          <div>
            <div className="text-[0.68rem] font-bold uppercase tracking-widest text-brand-blue">Inteligencia Artificial</div>
            <h3 className="font-display text-xl font-bold text-slate-body tracking-tight">La IA publica por vos</h3>
          </div>
        </div>

        <p className="text-sm text-slate-sub leading-relaxed mb-5">
          Solo subís una foto de tu producto. Nuestra IA lo reconoce, rellena el título, descripción y características técnicas automáticamente, y te da un precio promedio basado en el mercado boliviano.
        </p>

        {/* Upload Zone */}
        <div className="flex-1 flex flex-col">
          <AnimatePresence mode="wait">

            {/* ── IDLE STATE ── */}
            {phase === PHASE.IDLE && (
              <motion.div
                key="idle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={() => fileInputRef.current?.click()}
                className="
                  flex-1 border-2 border-dashed border-brand-blue/30 rounded-2xl p-7
                  bg-brand-blue/5 flex flex-col items-center gap-3 text-center
                  cursor-pointer hover:border-brand-blue/60 hover:bg-brand-blue/10
                  transition-all duration-200 min-h-[260px] justify-center
                "
              >
                <div className="w-14 h-14 rounded-2xl bg-navy-light flex items-center justify-center text-brand-blue shadow-navy-sm mb-1">
                  <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21,15 16,10 5,21"/>
                  </svg>
                </div>
                <p className="text-base font-bold text-slate-body">Subé una foto de tu producto</p>
                <p className="text-xs text-slate-sub">JPG, PNG o foto de celular — máx 10MB</p>

                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
                  className="mt-1 bg-brand-blue text-white text-sm font-bold px-5 py-2.5 rounded-full
                             hover:bg-brand-hover transition-colors duration-150 shadow-blue-glow"
                >
                  Seleccionar imagen
                </button>

                <span className="text-xs text-slate-muted mt-1">o usá un ejemplo</span>
                <div className="flex gap-2 flex-wrap justify-center mt-1" onClick={(e) => e.stopPropagation()}>
                  {DEMO_BUTTONS.map(({ key, label }) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => handleDemoKey(key)}
                      className="text-xs font-semibold px-3 py-1.5 rounded-full border border-cyan/20
                                 text-cyan hover:bg-cyan/10 hover:border-cyan/50 transition-colors duration-150"
                    >
                      {label}
                    </button>
                  ))}
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </motion.div>
            )}

            {/* ── SCANNING STATE ── */}
            {phase === PHASE.SCANNING && (
              <motion.div
                key="scanning"
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                className="flex-1 flex flex-col items-center justify-center gap-5 min-h-[260px]"
              >
                {/* Image preview with scan animation */}
                <div className="relative w-48 h-48 rounded-2xl overflow-hidden border border-cyan/20 shadow-navy-md">
                  <img src={imageSrc} alt="Escaneando..." className="w-full h-full object-cover" />
                  {/* Scan overlay */}
                  <div className="absolute inset-0 bg-navy/40" />
                  {/* Scan line */}
                  <div className="scan-line-animated" />
                  {/* Corners */}
                  {[['top-2 left-2 border-t border-l','rounded-tl-sm'],
                    ['top-2 right-2 border-t border-r','rounded-tr-sm'],
                    ['bottom-2 left-2 border-b border-l','rounded-bl-sm'],
                    ['bottom-2 right-2 border-b border-r','rounded-br-sm']].map(([pos, r], i) => (
                    <div key={i} className={`absolute w-5 h-5 border-cyan/80 ${pos} ${r}`} />
                  ))}
                </div>
                <AnimatePresence mode="wait">
                  <motion.p
                    key={scanStatus}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.2 }}
                    className="text-sm font-semibold text-cyan text-center"
                  >
                    {scanStatus}
                  </motion.p>
                </AnimatePresence>
                {/* Spinner dots */}
                <div className="flex gap-1.5">
                  {[0,1,2].map(i => (
                    <motion.div
                      key={i}
                      className="w-1.5 h-1.5 rounded-full bg-cyan"
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                    />
                  ))}
                </div>
              </motion.div>
            )}

            {/* Result state — left side just shows the image again */}
            {phase === PHASE.RESULT && (
              <motion.div
                key="result-left"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="flex-1 flex flex-col items-center justify-center gap-4 min-h-[260px]"
              >
                <div className="relative w-40 h-40 rounded-2xl overflow-hidden border border-cyan/20 shadow-navy-md">
                  <img src={imageSrc} alt={demoData?.name} className="w-full h-full object-cover" />
                  <Badge variant="ai" className="absolute bottom-2 left-1/2 -translate-x-1/2 whitespace-nowrap shadow-navy-sm">
                    Analizado por IA
                  </Badge>
                </div>
                <button
                  onClick={handleReset}
                  type="button"
                  className="text-xs text-slate-sub hover:text-cyan transition-colors duration-150 underline underline-offset-2"
                >
                  ← Analizar otro producto
                </button>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>

      {/* ── RIGHT: Result Panel ── */}
      <div className="flex flex-col">
        <AnimatePresence mode="wait">
          {/* Placeholder */}
          {phase === PHASE.IDLE && (
            <motion.div
              key="placeholder"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex-1 border border-cyan/10 rounded-2xl bg-navy-light flex flex-col items-center justify-center gap-4 p-8 min-h-[360px] text-center"
            >
              <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="text-slate-muted">
                <circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/>
              </svg>
              <p className="text-sm text-slate-muted">Subí o seleccioná una imagen para ver el análisis</p>
            </motion.div>
          )}

          {/* Scanning placeholder */}
          {phase === PHASE.SCANNING && (
            <motion.div
              key="scan-placeholder"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 border border-cyan/10 rounded-2xl bg-navy-light flex flex-col items-center justify-center gap-4 p-8 min-h-[360px]"
            >
              <div className="space-y-3 w-full">
                {[80, 60, 90, 50, 70].map((w, i) => (
                  <motion.div
                    key={i}
                    className="h-3 bg-navy-lighter rounded-full"
                    animate={{ opacity: [0.3, 0.7, 0.3] }}
                    transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.15 }}
                    style={{ width: `${w}%` }}
                  />
                ))}
              </div>
            </motion.div>
          )}

          {/* Result Panel */}
          {phase === PHASE.RESULT && demoData && (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="flex-1 border border-cyan/15 rounded-2xl bg-navy-light flex flex-col gap-4 p-6 min-h-[360px]"
            >
              {/* Product info header */}
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-brand-blue/20 text-brand-blue flex items-center justify-center flex-shrink-0 text-xs font-bold">
                  {demoData.category.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <div className="text-[0.68rem] font-bold uppercase tracking-widest text-brand-blue mb-0.5">{demoData.category}</div>
                  <div className="font-display text-base font-bold text-slate-body leading-tight">{demoData.name}</div>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-green animate-pulse-dot" />
                    <span className="text-xs text-slate-sub">{demoData.condition}</span>
                  </div>
                </div>
              </div>

              {/* Price Adjuster */}
              <PriceAdjuster
                price={price}
                priceMin={demoData.priceMin}
                priceMax={demoData.priceMax}
                range={demoData.range}
                onChange={setPrice}
              />

              {/* Characteristics */}
              <div>
                <div className="text-[0.68rem] font-bold uppercase tracking-widest text-slate-muted mb-2">
                  Características detectadas por IA
                </div>
                <ul className="space-y-1.5">
                  {demoData.chars.map((c, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: 8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1], delay: i * 0.07 }}
                      className="flex items-center justify-between text-xs py-1.5 border-b border-cyan/5 last:border-0"
                    >
                      <span className="text-slate-muted font-medium">{c.key}</span>
                      <span className="text-slate-body font-semibold">{c.val}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>

              {/* Actions */}
              <div className="flex gap-3 mt-auto pt-2">
                <Button variant="cyan" className="flex-1 text-[0.85rem] py-3 justify-center" magnetic={false}>
                  Publicar con este precio
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
