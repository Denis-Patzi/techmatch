import { Link } from 'react-router-dom';
import { Icon } from '@/components/atoms/Icon';
import { LoginForm } from '@/components/organisms/LoginForm';
import { MarketDialog } from './MarketViews';

export default function EmailLoginDialog({ onClose, onBack }) {
  return (
    <MarketDialog
      title="Iniciar sesión"
      compact
      closeOnBackdrop={false}
      className="market-email-login-modal"
      onClose={onClose}
    >
      <EmailLoginContent onBack={onBack} />
    </MarketDialog>
  );
}

export function EmailLoginContent({ onBack }) {
  return (
    <>
      <button
        type="button"
        className="email-login-back"
        aria-label="Volver a las opciones de acceso"
        onClick={onBack}
      >
        <Icon name="back" size={23} />
      </button>
      <div className="email-login-content">
        <h2>
          Iniciá sesión en <span>TechMatch</span>
        </h2>
        <div
          className="email-login-tabs"
          role="group"
          aria-label="Método de acceso"
        >
          <button type="button" disabled title="Próximamente">
            Teléfono
          </button>
          <button
            type="button"
            aria-pressed="true"
            onClick={() => document.getElementById('email')?.focus()}
          >
            Correo electrónico
          </button>
        </div>
        <LoginForm variant="social" />
      </div>
      <footer className="email-login-footer">
        ¿Todavía no tenés cuenta? <Link to="/signup">Registrate</Link>
      </footer>
    </>
  );
}
