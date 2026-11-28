export default function FeedLoadingScreen() {
  return (
    <div
      className="market-feed-loading-screen"
      role="status"
      aria-live="polite"
    >
      <img src="/logo-blue.png" width="52" height="52" alt="" />
      <strong>TechMatch</strong>
      <span className="market-feed-loading-spinner" aria-hidden="true" />
      <p>Preparando tu feed</p>
      <small>Cargando publicaciones y contenido…</small>
    </div>
  );
}
