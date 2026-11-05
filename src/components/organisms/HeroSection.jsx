import { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform, useSpring } from 'framer-motion';
import { Link, useSearchParams } from 'react-router-dom';
import { Icon } from '@/components/atoms/Icon';
import { HeroTechScene } from './HeroTechScene';

const concepts = [
  { id: 'orbita', name: 'Órbita 3D', description: 'Dispositivos flotantes y órbitas de luz.' },
  {
    id: 'particulas',
    name: 'Constelación',
    description: 'Tecnología dibujada con partículas luminosas.',
  },
  { id: 'portal', name: 'Portal', description: 'Aros de energía y dispositivos en movimiento.' },
];

const categories = [
  { name: 'Laptops', icon: 'laptop' },
  { name: 'Celulares', icon: 'phone' },
  { name: 'Componentes', icon: 'cpu' },
  { name: 'Periféricos', icon: 'headphones' },
];

export function HeroSection() {
  const [searchParams, setSearchParams] = useSearchParams();
  const requestedConcept = searchParams.get('portada');
  const concept = concepts.find((item) => item.id === requestedConcept) || concepts[0];
  const showConcepts = requestedConcept !== null;
  const reducedMotion = useReducedMotion();
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const wordmarkY = useTransform(scrollYProgress, [0, 1], [0, 90]);
  const showcaseTarget = useTransform(scrollYProgress, [0, 1], [0, -30]);
  const showcaseY = useSpring(showcaseTarget, { stiffness: 100, damping: 28 });
  const showcaseRotateX = useTransform(scrollYProgress, [0, 1], [4, -9]);
  const showcaseRotateY = useTransform(scrollYProgress, [0, 1], [-7, 12]);
  const showcaseDepth = useTransform(scrollYProgress, [0, 1], [10, -70]);
  return (
    <section id="hero" className="hero-section hero-section-universe scene-section" ref={heroRef}>
      <motion.div
        className="hero-wordmark"
        aria-hidden="true"
        style={{ x: '-50%', y: reducedMotion ? 0 : wordmarkY }}
      >
        TECHMATCH
      </motion.div>
      <div className="page-container">
        <div className="hero-grid">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="eyebrow">Fotos, videos y tu próximo equipo</span>
            <h1 className="hero-heading">
              Tu próximo
              <br />
              <span>gran match.</span>
              <br />
              En tu feed.
            </h1>
            <p className="hero-description">
              Deslizá entre fotos y videos de productos. Comprá, vendé o descubrí subastas desde
              perfiles personales y de tiendas, con IA para ayudarte a publicar.
            </p>
            <div className="hero-actions">
              <Link to="/signup" className="btn-primary">
                Crear mi perfil <Icon name="arrow" size={17} />
              </Link>
              <a href="#features" className="btn-secondary">
                Descubrir el feed <Icon name="arrowUp" size={16} />
              </a>
            </div>
            <p className="hero-note">
              <Icon name="check" size={15} /> Tu contenido, tu catálogo y tus subastas en un perfil.
            </p>
          </motion.div>
          <motion.div
            className="hero-showcase hero-showcase-universe"
            style={{
              y: reducedMotion ? 0 : showcaseY,
              rotateX: reducedMotion ? 0 : showcaseRotateX,
              rotateY: reducedMotion ? 0 : showcaseRotateY,
              z: reducedMotion ? 0 : showcaseDepth,
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.15 }}
          >
            <HeroTechScene variant={concept.id} />
            {showConcepts && (
              <div className="hero-concepts">
                <p className="hero-concepts-label">Elegí una propuesta para la portada</p>
                <div
                  className="hero-concepts-options"
                  role="group"
                  aria-label="Propuestas de animación"
                >
                  {concepts.map((item, index) => (
                    <button
                      key={item.id}
                      type="button"
                      aria-pressed={concept.id === item.id}
                      onClick={() => {
                        const next = new URLSearchParams(searchParams);
                        next.set('portada', item.id);
                        setSearchParams(next, { replace: true, preventScrollReset: true });
                      }}
                    >
                      <span>0{index + 1}</span> {item.name}
                    </button>
                  ))}
                </div>
                <p className="hero-concepts-description" aria-live="polite">
                  {concept.description}
                </p>
              </div>
            )}
          </motion.div>
        </div>
        <div className="hero-categories">
          <span>Encontrá tu categoría</span>
          {categories.map((category) => (
            <a key={category.name} href="#features">
              <Icon name={category.icon} size={19} />
              {category.name}
              <Icon name="arrowUp" size={12} />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
