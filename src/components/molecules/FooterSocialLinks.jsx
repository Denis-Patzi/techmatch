import toast from 'react-hot-toast';

// Add the official profile URLs here when the accounts are available.
const networks = [
  {
    name: 'Facebook',
    href: null,
    path: 'M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.23.2 2.23.2v2.46h-1.26c-1.24 0-1.62.77-1.62 1.56V12h2.77l-.44 2.89h-2.33v6.99A10 10 0 0 0 22 12Z',
  },
  {
    name: 'Instagram',
    href: null,
  },
  {
    name: 'TikTok',
    href: null,
    path: 'M16 2h-3v13.5a3.5 3.5 0 1 1-3-3.46V9a6.5 6.5 0 1 0 6 6.48V8.3A8.5 8.5 0 0 0 21 10V7a5 5 0 0 1-5-5Z',
  },
];

export function FooterSocialLinks() {
  const pending = networks.some((network) => !network.href);
  return (
    <div className="footer-socials">
      <p className="footer-socials-heading">Conectá con TechMatch</p>
      <div className="footer-social-links" role="group" aria-label="Redes sociales de TechMatch">
        {networks.map(({ name, href, path }) => {
          const content = (
            <>
              <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
                {path ? (
                  <path d={path} fill="currentColor" />
                ) : (
                  <g fill="none" stroke="currentColor" strokeWidth="1.8">
                    <rect x="3" y="3" width="18" height="18" rx="5" />
                    <circle cx="12" cy="12" r="4" />
                    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
                  </g>
                )}
              </svg>
              <span>{name}</span>
            </>
          );
          return href ? (
            <a
              key={name}
              className="footer-social-link"
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`TechMatch en ${name} (abre en otra pestaña)`}
            >
              {content}
            </a>
          ) : (
            <button
              key={name}
              type="button"
              className="footer-social-link"
              aria-label={`${name} de TechMatch: próximamente`}
              onClick={() => toast(`Muy pronto vas a encontrar a TechMatch en ${name}.`, { id: 'footer-social-coming-soon' })}
            >
              {content}
            </button>
          );
        })}
      </div>
      {pending && <p className="footer-socials-note">Nuestras redes, próximamente.</p>}
    </div>
  );
}
