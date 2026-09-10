import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

/* ── Organisms ── */
import { Navbar }            from '@/components/organisms/Navbar';
import { HeroSection }       from '@/components/organisms/HeroSection';
import { FeaturesSection }   from '@/components/organisms/FeaturesSection';
import { SellersSection }    from '@/components/organisms/SellersSection';
import { BuyersSection }     from '@/components/organisms/BuyersSection';
import { HowItWorksSection } from '@/components/organisms/HowItWorksSection';
import { AboutSection }      from '@/components/organisms/AboutSection';
import { PlansSection }      from '@/components/organisms/PlansSection';
import { DownloadSection }   from '@/components/organisms/DownloadSection';
import { LocationsSection }  from '@/components/organisms/LocationsSection';
import { ContactSection }    from '@/components/organisms/ContactSection';
import { Footer }            from '@/components/organisms/Footer';

/* ── Atoms ── */
import { ThemeToggle } from '@/components/atoms/ThemeToggle';

/* ── Back-to-top ── */
function BackToTop() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const handler = () => setVisible(window.scrollY > 400);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);
  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          key="btt"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.2 }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label="Volver arriba"
          className="
            fixed bottom-6 right-6 z-50
            w-11 h-11 rounded-full bg-navy-light border border-cyan/25
            flex items-center justify-center text-cyan
            shadow-navy-md hover:bg-navy-lighter hover:border-cyan/50
            transition-colors duration-150
          "
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M18 15l-6-6-6 6"/>
          </svg>
        </motion.button>
      )}
    </AnimatePresence>
  );
}

/**
 * App — Raíz
 * Gestiona el estado del tema (isDark) y lo aplica como clase en <html>.
 * ThemeToggle y BackToTop son botones fijos en las esquinas inferiores.
 */
export default function App() {
  const [isDark, setIsDark] = useState(false);

  /* Aplica/quita la clase 'light' en el elemento <html> */
  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.remove('light');
    } else {
      root.classList.add('light');
    }
  }, [isDark]);

  return (
    <>
      <Navbar isDark={isDark} onToggleTheme={() => setIsDark(d => !d)} />
      <main>
        <HeroSection />
        <FeaturesSection />
        <SellersSection />
        <BuyersSection />
        <HowItWorksSection />
        <AboutSection />
        <PlansSection />
        <DownloadSection />
        <LocationsSection />
        <ContactSection />
      </main>
      <Footer />

      {/* Controles fijos */}
      <BackToTop />
    </>
  );
}
