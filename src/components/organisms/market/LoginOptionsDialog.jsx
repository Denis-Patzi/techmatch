import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import { MarketDialog } from './MarketViews';
import { Icon } from '@/components/atoms/Icon';
import { EmailLoginContent } from './EmailLoginDialog';

const methods = [
  { id: 'qr', label: 'Usar código QR' },
  { id: 'email', label: 'Usar correo electrónico' },
  { id: 'facebook', label: 'Continuar con Facebook' },
  { id: 'google', label: 'Continuar con Google' },
  { id: 'apple', label: 'Continuar con Apple' },
];

function MethodIcon({ name }) {
  if (name === 'email') return <Icon name="user" size={22} />;
  return (
    <svg width="23" height="23" viewBox="0 0 24 24" aria-hidden="true">
      {name === 'qr' && (
        <g fill="none" stroke="currentColor" strokeWidth="1.7">
          <rect x="3" y="3" width="6" height="6" rx="1" />
          <rect x="15" y="3" width="6" height="6" rx="1" />
          <rect x="3" y="15" width="6" height="6" rx="1" />
          <path d="M15 13v4h6M13 21h4v-2m4 2v-2M3 12h3m6-9v3m-1 5h3" />
        </g>
      )}
      {name === 'facebook' && (
        <>
          <circle cx="12" cy="12" r="11" fill="#1877f2" />
          <path
            d="M13.5 22v-9h3l.5-3h-3.5V8c0-.9.3-1.5 1.6-1.5H17V3.8c-.5-.1-1.5-.3-2.6-.3-2.6 0-4.4 1.6-4.4 4.5v2H7v3h3v9Z"
            fill="white"
          />
        </>
      )}
      {name === 'google' && (
        <>
          <path
            fill="#4285f4"
            d="M21.6 12.2c0-.7-.1-1.4-.2-2.1H12v4h5.4a4.6 4.6 0 0 1-2 3v2.5h3.3c1.9-1.8 2.9-4.3 2.9-7.4Z"
          />
          <path
            fill="#34a853"
            d="M12 22c2.7 0 5-.9 6.7-2.4l-3.3-2.5a6 6 0 0 1-9-3.1H3v2.6A10 10 0 0 0 12 22Z"
          />
          <path
            fill="#fbbc05"
            d="M6.4 14a6 6 0 0 1 0-4V7.4H3a10 10 0 0 0 0 9.2Z"
          />
          <path
            fill="#ea4335"
            d="M12 6c1.5 0 2.8.5 3.9 1.5l2.9-2.9A10 10 0 0 0 3 7.4L6.4 10A6 6 0 0 1 12 6Z"
          />
        </>
      )}
      {name === 'apple' && (
        <path
          fill="currentColor"
          d="M17.1 2c.1 1.5-.5 2.8-1.4 3.8-.9 1-2.3 1.7-3.7 1.6-.2-1.5.5-2.9 1.4-3.9.9-.9 2.4-1.6 3.7-1.5ZM20.5 17.5c-.5 1.2-.8 1.7-1.5 2.8-.9 1.3-2.2 2.9-3.8 2.9-1.4 0-1.8-.9-3.7-.9s-2.4.9-3.7.9c-1.5 0-2.8-1.5-3.7-2.8C1.6 16.7 1 11.3 3.4 8.5c1.7-2 4-2.3 5.6-1.6 1.2.5 2 .8 3 .8s1.8-.4 3.2-.9c1.5-.5 3.6-.3 5.1 1.5-4.4 2.4-3.7 8.2.2 9.2Z"
        />
      )}
    </svg>
  );
}

export default function LoginOptionsDialog({
  reason,
  onClose,
  emailLogin = false,
  onBack,
}) {
  useEffect(() => {
    document
      .querySelector(emailLogin ? '.social-login-input' : '.login-option')
      ?.focus();
  }, [emailLogin]);
  return (
    <MarketDialog
      title="Iniciar sesión"
      compact
      closeOnBackdrop={false}
      className={
        emailLogin ? 'market-email-login-modal' : 'market-login-options-modal'
      }
      onClose={onClose}
    >
      {emailLogin ? (
        <EmailLoginContent onBack={onBack} />
      ) : (
        <>
          <div className="login-options-content">
            <h2>
              Iniciá sesión en <span>TechMatch</span>
            </h2>
            <p className="login-options-reason">{reason}</p>
            <div
              className="login-options-methods"
              aria-label="Opciones para iniciar sesión"
            >
              {methods.map((method) => (
                <Link key={method.id} to="/login" className="login-option">
                  <MethodIcon name={method.id} />
                  <span>{method.label}</span>
                </Link>
              ))}
            </div>
            <p className="login-options-note">
              Continuá con tu correo para ingresar a tu cuenta.
            </p>
          </div>
          <div className="login-options-footer">
            <p>
              ¿Todavía no tenés cuenta? <Link to="/signup">Registrate</Link>
            </p>
            <button type="button" onClick={onClose}>
              Seguir explorando
            </button>
          </div>
        </>
      )}
    </MarketDialog>
  );
}
