import { useRef } from 'react';
import {
  motion,
  useMotionTemplate,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'framer-motion';

/** A CSS 3D surface: aligned while reading, tilted as it enters and leaves. */
export function ScrollScene({
  children,
  className = '',
  surfaceClassName = '',
  variant = 'panel',
}) {
  const sceneRef = useRef(null);
  const reducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: sceneRef, offset: ['start end', 'end start'] });
  const progress = useSpring(scrollYProgress, { stiffness: 110, damping: 28 });
  const turn = useTransform(progress, [0, 0.4, 0.6, 1], [1, 0, 0, -0.65]);
  const scale = useTransform(progress, [0, 0.4, 0.6, 1], [0.96, 1, 1, 0.98]);
  const transform = useMotionTemplate`rotateX(calc(${turn} * var(--scene-tilt))) rotateY(calc(${turn} * var(--scene-turn))) translateZ(calc(${turn} * -24px)) scale(${scale})`;

  return (
    <div
      ref={sceneRef}
      className={`scroll-scene scroll-scene-${variant} ${className}`}
      data-depth-scene=""
    >
      <motion.div
        className={`scroll-scene-surface ${surfaceClassName}`}
        style={{ transform: reducedMotion ? 'none' : transform }}
      >
        {children}
      </motion.div>
    </div>
  );
}
