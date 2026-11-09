const paths = {
  panelClose: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="3" />
      <path d="M9 3v18m7-13-4 4 4 4" />
    </>
  ),
  panelOpen: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="3" />
      <path d="M9 3v18m4-13 4 4-4 4" />
    </>
  ),
  star: (
    <path d="m12 3 2.8 5.7 6.3.9-4.6 4.5 1.1 6.2-5.6-2.9-5.6 2.9 1.1-6.2L2.9 9.6l6.3-.9L12 3Z" />
  ),
  video: (
    <>
      <rect x="3" y="4" width="14" height="16" rx="3" />
      <path d="m17 9 4-3v12l-4-3M8 9l4 3-4 3V9Z" />
    </>
  ),
  image: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="3" />
      <circle cx="8" cy="8" r="1.5" />
      <path d="m3 17 5-5 4 4 4-6 5 7" />
    </>
  ),
  file: (
    <>
      <path d="M14 3H5v18h14V8l-5-5ZM14 3v5h5M8 12h8M8 16h6" />
    </>
  ),
  store: (
    <>
      <path d="M3 10 5 3h14l2 7M4 12v9h16v-9M9 21v-6h6v6" />
      <path d="M3 10a3 3 0 0 0 6 0 3 3 0 0 0 6 0 3 3 0 0 0 6 0M9 3v7M15 3v7" />
    </>
  ),
  gavel: (
    <>
      <path d="m14 3 7 7-3 3-7-7 3-3ZM5 12l7 7-3 3-7-7 3-3ZM9 14l5-5M13 13l-3 3M14 21h8" />
    </>
  ),
  arrow: <path d="M5 12h14M12 5l7 7-7 7" />,
  arrowUp: <path d="M7 17 17 7M7 7h10v10" />,
  chevron: <path d="m9 5 7 7-7 7" />,
  grid: (
    <>
      <rect x="3" y="3" width="7" height="7" rx="2" />
      <rect x="14" y="3" width="7" height="7" rx="2" />
      <rect x="3" y="14" width="7" height="7" rx="2" />
      <rect x="14" y="14" width="7" height="7" rx="2" />
    </>
  ),
  laptop: (
    <>
      <rect x="4" y="3" width="16" height="13" rx="2" />
      <path d="m4 16-2 4h20l-2-4M9 20h6" />
    </>
  ),
  phone: (
    <>
      <rect x="6" y="2" width="12" height="20" rx="3" />
      <path d="M10 5h4M11 19h2" />
    </>
  ),
  cpu: (
    <>
      <rect x="6" y="6" width="12" height="12" rx="3" />
      <rect x="10" y="10" width="4" height="4" rx="1" />
      <path d="M9 2v4m6-4v4M9 18v4m6-4v4M2 9h4m-4 6h4m12-6h4m-4 6h4" />
    </>
  ),
  headphones: (
    <>
      <path d="M3 14v-3a9 9 0 0 1 18 0v3" />
      <rect x="3" y="12" width="4" height="8" rx="2" />
      <rect x="17" y="12" width="4" height="8" rx="2" />
    </>
  ),
  sparkles: (
    <path d="m12 3 2.6 6.4L21 12l-6.4 2.6L12 21l-2.6-6.4L3 12l6.4-2.6L12 3ZM20 2v4m-2-2h4" />
  ),
  shield: (
    <>
      <path d="m12 3 8 3v6c0 5-8 9-8 9s-8-4-8-9V6l8-3Z" />
      <path d="m8 12 3 3 5-6" />
    </>
  ),
  check: <path d="m5 12 4 4L19 6" />,
  search: (
    <>
      <circle cx="10.5" cy="10.5" r="7.5" />
      <path d="m16 16 5 5" />
    </>
  ),
  bag: (
    <>
      <rect x="4" y="7" width="16" height="14" rx="3" />
      <path d="M8 8V6a4 4 0 0 1 8 0v2" />
    </>
  ),
  box: <path d="m12 3 9 5-9 5-9-5 9-5ZM3 8v9l9 5 9-5V8M12 13v9M7 5l10 6" />,
  chart: <path d="M4 3v17h17M8 15v-4m5 4V7m5 8v-6" />,
  chat: <path d="M21 14a3 3 0 0 1-3 3H8l-5 4V6a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3v8Z" />,
  users: (
    <>
      <circle cx="9" cy="8" r="4" />
      <path d="M2 21v-2a7 7 0 0 1 14 0v2M17 4a4 4 0 0 1 0 8m2 3a6 6 0 0 1 3 6" />
    </>
  ),
  user: (
    <>
      <circle cx="12" cy="7" r="4" />
      <path d="M4 21v-2a8 8 0 0 1 16 0v2" />
    </>
  ),
  flag: <path d="M4 22V3c6-4 10 4 16 0v12c-6 4-10-4-16 0" />,
  settings: (
    <>
      <path d="m9 3-1 3-3 1-2 4 2 2v4l4 3 3-1 3 1 4-3v-4l2-2-2-4-3-1-1-3H9Z" />
      <circle cx="12" cy="12" r="3" />
    </>
  ),
  logout: <path d="M9 3H4v18h5M10 12h11m-4-4 4 4-4 4" />,
  home: (
    <>
      <path d="m3 10 9-7 9 7v11H3V10Z" />
      <path d="M9 21v-8h6v8" />
    </>
  ),
  pin: (
    <>
      <path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z" />
      <circle cx="12" cy="10" r="2.5" />
    </>
  ),
  plus: <path d="M12 5v14M5 12h14" />,
  heart: <path d="M20 4a5 5 0 0 0-8 2 5 5 0 0 0-8-2c-5 5 0 10 8 16 8-6 13-11 8-16Z" />,
  menu: <path d="M4 6h16M4 12h16M4 18h16" />,
  close: <path d="m6 6 12 12M6 18 18 6" />,
  play: <path d="m8 4 12 8-12 8V4Z" />,
  pause: <path d="M8 4v16M16 4v16" />,
  volume: <path d="m11 4-6 5H2v6h3l6 5V4ZM15 8a6 6 0 0 1 0 8M18 4a11 11 0 0 1 0 16" />,
  muted: <path d="m11 4-6 5H2v6h3l6 5V4ZM16 9l6 6m0-6-6 6" />,
  fullscreen: <path d="M8 3H3v5m13-5h5v5M3 16v5h5m13-5v5h-5" />,
  share: <path d="M15 8V3l7 9-7 9v-5C7 16 3 20 3 20S2 8 15 8Z" />,
};
export function Icon({ name, size = 20, className = '', ...props }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
      {...props}
    >
      {paths[name] ?? paths.grid}
    </svg>
  );
}
