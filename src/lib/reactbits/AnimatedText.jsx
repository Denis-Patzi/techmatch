import { motion } from 'framer-motion';

/**
 * AnimatedText — React Bits
 * Anima texto palabra por palabra con un stagger effect de entrada (fadeUp).
 * Ideal para títulos hero de alto impacto.
 *
 * Inspirado en: https://www.reactbits.dev/text-animations/blur-text
 *
 * @param {string}   text      - Texto a animar
 * @param {string}   className - Clases Tailwind aplicadas a cada palabra
 * @param {number}   delay     - Delay inicial en segundos (default 0.1)
 * @param {number}   stagger   - Stagger entre palabras en segundos (default 0.08)
 */
export function AnimatedText({ text, className = '', delay = 0.1, stagger = 0.08 }) {
  const words = text.split(' ');

  const container = {
    hidden: {},
    visible: { transition: { staggerChildren: stagger, delayChildren: delay } },
  };

  const wordVariant = {
    hidden:  { opacity: 0, y: 20, filter: 'blur(4px)' },
    visible: {
      opacity: 1, y: 0, filter: 'blur(0px)',
      transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
    },
  };

  return (
    <motion.span
      variants={container}
      initial="hidden"
      animate="visible"
      className="inline"
      aria-label={text}
    >
      {words.map((word, i) => (
        <motion.span
          key={i}
          variants={wordVariant}
          className={`inline-block ${className}`}
          style={{ marginRight: '0.28em' }}
        >
          {word}
        </motion.span>
      ))}
    </motion.span>
  );
}
