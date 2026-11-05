import { useEffect, useRef, useState } from 'react';

/** Decorative, silent video with a static fallback and explicit playback control. */
export function VideoLoop({ src, poster, label, className = '', priority = false }) {
  const containerRef = useRef(null);
  const videoRef = useRef(null);
  const [reducedMotion, setReducedMotion] = useState(
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
  const [saveData] = useState(() => Boolean(navigator.connection?.saveData));
  const [nearViewport, setNearViewport] = useState(false);
  const [inViewport, setInViewport] = useState(false);
  const [pageVisible, setPageVisible] = useState(() => !document.hidden);
  const [userPaused, setUserPaused] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const motionAllowed = !reducedMotion && !saveData;
  const showVideo = motionAllowed && nearViewport && !failed;

  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updatePreference = () => setReducedMotion(preference.matches);
    updatePreference();
    preference.addEventListener('change', updatePreference);
    return () => preference.removeEventListener('change', updatePreference);
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!('IntersectionObserver' in window)) {
      setNearViewport(true);
      setInViewport(true);
      return;
    }
    const preloadObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setNearViewport(true);
          preloadObserver.disconnect();
        }
      },
      { rootMargin: '200px' }
    );
    const visibilityObserver = new IntersectionObserver(
      ([entry]) => {
        setInViewport(entry.isIntersecting && entry.intersectionRatio >= 0.1);
      },
      { threshold: [0, 0.1] }
    );
    preloadObserver.observe(container);
    visibilityObserver.observe(container);
    return () => {
      preloadObserver.disconnect();
      visibilityObserver.disconnect();
    };
  }, []);

  useEffect(() => {
    const updateVisibility = () => setPageVisible(!document.hidden);
    document.addEventListener('visibilitychange', updateVisibility);
    return () => document.removeEventListener('visibilitychange', updateVisibility);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (showVideo && inViewport && pageVisible && !userPaused) {
      video.play().catch(() => setPlaying(false));
    } else {
      video.pause();
    }
    return () => video.pause();
  }, [showVideo, inViewport, pageVisible, userPaused]);

  const togglePlayback = () => {
    const video = videoRef.current;
    if (!video) return;
    if (playing) {
      setUserPaused(true);
      video.pause();
    } else {
      setUserPaused(false);
      video.play().catch(() => setPlaying(false));
    }
  };

  return (
    <div ref={containerRef} className={`video-loop ${className}`}>
      <img
        className="video-loop-poster"
        src={poster}
        alt={label}
        width="960"
        height="600"
        loading={priority ? 'eager' : 'lazy'}
        fetchPriority={priority ? 'high' : 'low'}
        decoding="async"
      />
      {showVideo && (
        <video
          ref={videoRef}
          className={loaded ? 'is-loaded' : ''}
          src={src}
          poster={poster}
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden="true"
          tabIndex={-1}
          disablePictureInPicture
          onLoadedData={() => setLoaded(true)}
          onPlaying={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onError={() => setFailed(true)}
        />
      )}
      {showVideo && (
        <button
          type="button"
          className="video-loop-control"
          onClick={togglePlayback}
          aria-label={`${playing ? 'Pausar' : 'Reproducir'} animación: ${label}`}
          title={playing ? 'Pausar animación' : 'Reproducir animación'}
        >
          <svg
            width="17"
            height="17"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            {playing ? <path d="M8 5v14M16 5v14" /> : <path d="m8 5 11 7-11 7V5Z" />}
          </svg>
        </button>
      )}
    </div>
  );
}
