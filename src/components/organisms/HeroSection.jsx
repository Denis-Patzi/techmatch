import { useRef } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/atoms/Button';
import { StatCounter } from '@/components/atoms/StatCounter';
import { PhoneBadge } from '@/components/molecules/PhoneBadge';
import { AnimatedText } from '@/lib/reactbits/AnimatedText';

/**
 * HeroSection — Organismo
 * Sección principal: título animado, CTA magnético, mockup con tilt 3D, stats animados.
 */
export function HeroSection() {
  const phoneRef = useRef(null);

  const handleMouseMove = (e) => {
    const el = phoneRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width  - 0.5;
    const y = (e.clientY - rect.top)  / rect.height - 0.5;
    el.style.transform = `perspective(700px) rotateY(${x * 7}deg) rotateX(${-y * 5}deg)`;
  };

  const handleMouseLeave = () => {
    const el = phoneRef.current;
    if (!el) return;
    el.style.transition = 'transform 0.5s cubic-bezier(0.16,1,0.3,1)';
    el.style.transform = '';
    setTimeout(() => { if (el) el.style.transition = ''; }, 500);
  };

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 72, behavior: 'smooth' });
  };

  return (
    <section id="hero" className="relative min-h-screen pt-28 pb-16 overflow-hidden bg-navy flex items-center">
      {/* Background Glows */}
      <div className="absolute top-1/4 -left-1/4 w-[800px] h-[800px] glow-purple opacity-50 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 right-[-20%] w-[600px] h-[600px] glow-blue opacity-50 blur-[100px] pointer-events-none" />
      
      <div className="relative z-10 max-w-[1080px] mx-auto px-6 w-full flex flex-col md:flex-row items-center gap-12">
        {/* ── LEFT ── */}
        <div>
          {/* Brand logo */}
          {/* <motion.img
            src="/logo.png"
            alt="TechMatch Bolivia"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="w-16 h-16 rounded-2xl mb-5"
          />*/}

          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.05 }}
            className="text-[0.8rem] font-semibold tracking-[0.14em] uppercase text-cyan mb-5"
          >
            App Web y Mobile · Solo Tecnología · Bolivia
          </motion.div>

          {/* Title */}
          <h1 className="font-display text-[clamp(3.2rem,6.5vw,5rem)] font-black leading-[1.04] tracking-tight text-slate-body mb-5">
            <AnimatedText text="Compra y vende" delay={0.12} /><br />
            <span className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-slate-body via-slate-body to-brand-purple">
              <AnimatedText text="tecnología" delay={0.24} />
            </span>
            <br />
            <AnimatedText text="en segundos." delay={0.36} />
          </h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.44 }}
            className="text-lg text-slate-sub leading-[1.7] mb-8 max-w-[460px]"
          >
            El marketplace donde encontrás laptops, celulares, componentes y todo lo tech que necesitás. Publicar es gratis. Vender es fácil.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.54 }}
            className="flex items-center gap-5 mb-12 flex-wrap"
          >
            <Button variant="cyan" href="#">
              Crear mi Cuenta Gratis
            </Button>
            <button
              onClick={() => scrollTo('features')}
              className="text-[0.95rem] font-semibold text-cyan hover:opacity-75 transition-opacity flex items-center gap-2"
            >
              Ver cómo funciona
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </button>
          </motion.div>

          {/* Trust Stats */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.64 }}
            className="flex items-center gap-0"
          >
            <div className="pr-6">
              <StatCounter target={8500} label="Usuarios activos" />
            </div>
            <div className="w-px h-8 bg-cyan/15" />
            <div className="px-6">
              <StatCounter target={23000} label="Productos publicados" />
            </div>
            <div className="w-px h-8 bg-cyan/15" />
            <div className="pl-6">
              <StatCounter target={3} label="Sucursales" />
            </div>
          </motion.div>
        </div>

        {/* ── RIGHT — Phone Mockup ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
          className="flex justify-center items-center"
        >
          <div
            className="relative flex justify-center"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            <img
              ref={phoneRef}
              src="/phone_mockup.png"
              alt="TechMatch App en tu celular"
              className="max-h-[560px] w-auto object-contain drop-shadow-[0_32px_64px_rgba(0,0,0,0.5)] animate-phone-float"
              style={{ willChange: 'transform' }}
            />

            {/* Floating badges */}
            <PhoneBadge
              variant="ai"
              text="IA sugiere precio automáticamente"
              className="top-[18%] -left-[8%] text-[0.75rem]"
            />
            <PhoneBadge
              variant="success"
              text="Vendido en 2 días ✓"
              className="bottom-[22%] -right-[6%] text-[0.75rem]"
            />
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-7 left-1/2 -translate-x-1/2">
        <span className="block w-px h-9 bg-gradient-to-b from-cyan/30 to-transparent animate-scroll-pulse mx-auto" />
      </div>
    </section>
  );
}
