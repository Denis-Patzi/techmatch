import { useState } from 'react';
import toast from 'react-hot-toast';
import { MarketDialog } from '@/components/organisms/market/MarketViews';
import { getAccountType } from '@/lib/account';
import { productError } from '@/lib/products';

export default function AdminUserEditor({ profile, self, onSave, onClose }) {
  const [values, setValues] = useState({
    full_name: profile.full_name || '',
    phone: profile.phone || '',
    city: profile.city || '',
    store_name: profile.store_name || '',
    nit: profile.nit || '',
    account_type: getAccountType(profile),
    access_role: profile.role === 'admin' ? 'admin' : 'buyer',
  });
  const [busy, setBusy] = useState(false),
    [error, setError] = useState('');
  const field = (key) => ({
    value: values[key],
    onChange: (event) => setValues((previous) => ({ ...previous, [key]: event.target.value })),
  });
  return (
    <MarketDialog
      title="Editar usuario"
      onClose={() => {
        if (!busy) onClose();
      }}
    >
      <form
        className="admin-user-editor"
        onSubmit={async (event) => {
          event.preventDefault();
          if (
            values.full_name.trim().length < 3 ||
            (values.account_type === 'store' && values.store_name.trim().length < 2)
          ) {
            setError('Completá el nombre y, para tiendas, el nombre comercial.');
            return;
          }
          setBusy(true);
          setError('');
          try {
            await onSave(profile.id, {
              full_name: values.full_name.trim(),
              phone: values.phone.trim() || null,
              city: values.city.trim() || null,
              account_type: values.account_type,
              store_name: values.account_type === 'store' ? values.store_name.trim() : null,
              nit: values.account_type === 'store' ? values.nit.trim() || null : null,
              ...(!self
                ? {
                    role:
                      values.access_role === 'admin'
                        ? 'admin'
                        : profile.role === 'seller'
                          ? 'seller'
                          : 'buyer',
                  }
                : {}),
            });
            toast.success('Usuario actualizado.');
            onClose();
          } catch (failure) {
            setError(productError(failure));
          } finally {
            setBusy(false);
          }
        }}
      >
        <h2>Editar usuario</h2>
        <p>Actualizá los datos del perfil y su tipo de cuenta.</p>
        <fieldset disabled={busy}>
          <label>
            Nombre completo
            <input required minLength={3} maxLength={120} {...field('full_name')} />
          </label>
          <div className="market-field-row">
            <label>
              Teléfono
              <input maxLength={30} {...field('phone')} />
            </label>
            <label>
              Ciudad
              <input maxLength={80} {...field('city')} />
            </label>
          </div>
          <div className="market-field-row">
            <label>
              Tipo de cuenta
              <select {...field('account_type')}>
                <option value="personal">Personal</option>
                <option value="store">Tienda</option>
              </select>
            </label>
            <label>
              Acceso
              <select disabled={self} {...field('access_role')}>
                <option value="buyer">Usuario</option>
                <option value="admin">Administrador</option>
              </select>
            </label>
          </div>
          {values.account_type === 'store' && (
            <>
              <label>
                Nombre de la tienda
                <input required minLength={2} maxLength={120} {...field('store_name')} />
              </label>
              <label>
                NIT
                <input maxLength={30} {...field('nit')} />
              </label>
            </>
          )}
          {values.access_role === 'admin' && profile.role !== 'admin' && (
            <p className="market-notice">
              Al guardar, esta cuenta tendrá acceso a la administración de usuarios y publicaciones.
            </p>
          )}
          {error && (
            <p role="alert" className="market-error">
              {error}
            </p>
          )}
          <div className="market-form-actions">
            <button type="button" className="market-secondary" onClick={onClose}>
              Cancelar
            </button>
            <button className="btn-primary" type="submit">
              {busy ? 'Guardando…' : 'Guardar cambios'}
            </button>
          </div>
        </fieldset>
      </form>
    </MarketDialog>
  );
}
