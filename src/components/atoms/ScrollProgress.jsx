import { motion, useScroll, useSpring, useReducedMotion } from 'framer-motion';

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 160, damping: 30 });
  const reducedMotion = useReducedMotion();

  return (
    <motion.div
      aria-hidden="true"
      className="scroll-progress"
      style={{ scaleX: reducedMotion ? scrollYProgress : progress }}
    />
  );
}
