import { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';

/** Decorative image plane moving behind a section's readable foreground. */
export function ScrollBackdrop({ image, variant = 'workspace', priority = false }) {
  const layerRef = useRef(null);
  const reducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: layerRef, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], ['5%', '-5%']);
  const scale = useTransform(scrollYProgress, [0, 1], [1.13, 1.04]);

  return (
    <div ref={layerRef} className={`scene-backdrop scene-backdrop-${variant}`} aria-hidden="true">
      <motion.div className="scene-backdrop-art" style={reducedMotion ? undefined : { y, scale }}>
        <img
          src={image}
          alt=""
          width="1600"
          height="900"
          loading={priority ? 'eager' : 'lazy'}
          fetchPriority={priority ? 'auto' : 'low'}
          decoding="async"
        />
      </motion.div>
      <div className="scene-backdrop-shade" />
    </div>
  );
}
