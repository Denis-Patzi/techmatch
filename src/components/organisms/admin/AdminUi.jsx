import { useState } from 'react';
import { Icon } from '@/components/atoms/Icon';
import { MarketDialog } from '@/components/organisms/market/MarketViews';
import { productError } from '@/lib/products';

export function AdminHeading({ eyebrow, title, description, children }) {
  return (
    <div className="admin-section-heading">
      <div>
        {eyebrow && <span className="eyebrow">{eyebrow}</span>}
        <h1>{title}</h1>
        {description && <p>{description}</p>}
      </div>
      {children && <div className="admin-heading-actions">{children}</div>}
    </div>
  );
}
export function AdminPagination({ count, page, onChange, size = 10 }) {
  const pages = Math.max(1, Math.ceil(count / size));
  return (
    <div className="admin-pagination">
      <span>
        {count
          ? `${(page - 1) * size + 1}–${Math.min(page * size, count)} de ${count}`
          : '0 resultados'}
      </span>
      <div>
        <button
          className="market-secondary"
          disabled={page <= 1}
          onClick={() => onChange(page - 1)}
          aria-label="Página anterior"
        >
          <Icon name="chevron" className="rotate-180" size={16} />
        </button>
        <span>
          {page} / {pages}
        </span>
        <button
          className="market-secondary"
          disabled={page >= pages}
          onClick={() => onChange(page + 1)}
          aria-label="Página siguiente"
        >
          <Icon name="chevron" size={16} />
        </button>
      </div>
    </div>
  );
}
export function AdminConfirm({
  title,
  description,
  label = 'Confirmar',
  danger,
  onConfirm,
  onClose,
}) {
  const [busy, setBusy] = useState(false),
    [error, setError] = useState('');
  return (
    <MarketDialog
      title={title}
      onClose={() => {
        if (!busy) onClose();
      }}
      compact
    >
      <div className="market-confirm">
        <Icon name={danger ? 'flag' : 'shield'} size={28} />
        <h2>{title}</h2>
        <p>{description}</p>
        {error && (
          <p role="alert" className="market-error">
            {error}
          </p>
        )}
        <div className="market-form-actions">
          <button className="market-secondary" disabled={busy} onClick={onClose}>
            Cancelar
          </button>
          <button
            className={danger ? 'market-delete-button' : 'btn-primary'}
            disabled={busy}
            onClick={async () => {
              setBusy(true);
              setError('');
              try {
                await onConfirm();
                onClose();
              } catch (failure) {
                setError(productError(failure));
              } finally {
                setBusy(false);
              }
            }}
          >
            {busy ? 'Guardando…' : label}
          </button>
        </div>
      </div>
    </MarketDialog>
  );
}
