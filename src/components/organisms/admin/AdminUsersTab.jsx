import { useState } from 'react';
import toast from 'react-hot-toast';
import { Icon } from '@/components/atoms/Icon';
import { useAuth } from '@/hooks/useAuth';
import { getAccountType } from '@/lib/account';
import { accountName, dateLabel, downloadCsv } from '@/lib/adminAnalytics';
import { AdminConfirm, AdminHeading, AdminPagination } from './AdminUi';
import AdminUserEditor from './AdminUserEditor';

export default function AdminUsersTab({ data, verifications = false, initialQuery = '' }) {
  const { user, refreshProfile } = useAuth();
  const [query, setQuery] = useState(initialQuery),
    [type, setType] = useState('all'),
    [verification, setVerification] = useState(verifications ? 'pending' : 'all');
  const [page, setPage] = useState(1),
    [editing, setEditing] = useState(null),
    [action, setAction] = useState(null);
  const rows = data.profiles
    .filter(
      (item) =>
        (!verifications || item.role !== 'admin') &&
        (type === 'all' || getAccountType(item) === type) &&
        (verification === 'all' || Boolean(item.is_verified) === (verification === 'verified')) &&
        `${item.full_name || ''} ${item.store_name || ''} ${item.city || ''} ${item.phone || ''}`
          .toLocaleLowerCase()
          .includes(query.toLocaleLowerCase())
    )
    .sort((a, b) => (b.created_at || '').localeCompare(a.created_at || ''));
  const currentPage = Math.min(page, Math.max(1, Math.ceil(rows.length / 10)));
  const changeFilter = (setter) => (event) => {
    setter(event.target.value);
    setPage(1);
  };
  const exportUsers = () =>
    downloadCsv(
      'techmatch-usuarios.csv',
      [
        { label: 'Nombre', value: (r) => r.full_name },
        { label: 'Nombre comercial', value: (r) => r.store_name },
        { label: 'Cuenta', value: (r) => (getAccountType(r) === 'store' ? 'Tienda' : 'Personal') },
        { label: 'Acceso', value: (r) => (r.role === 'admin' ? 'Administrador' : 'Usuario') },
        { label: 'Ciudad', value: (r) => r.city },
        { label: 'Teléfono', value: (r) => r.phone },
        { label: 'Verificado', value: (r) => (r.is_verified ? 'Sí' : 'No') },
        { label: 'Registro', value: (r) => r.created_at },
      ],
      rows
    );
  return (
    <section>
      <AdminHeading
        eyebrow={verifications ? 'Confianza de la comunidad' : 'Gestión de la comunidad'}
        title={verifications ? 'Verificaciones' : 'Usuarios'}
        description={
          verifications
            ? 'Revisá los perfiles actuales y otorgá o retirá su verificación manual.'
            : 'Consultá y editá las cuentas personales, tiendas y administradores registrados.'
        }
      >
        <button className="market-secondary" onClick={exportUsers}>
          <Icon name="file" size={17} />
          Exportar CSV
        </button>
      </AdminHeading>
      {verifications && (
        <p className="market-notice">
          La verificación corresponde al perfil. No certifica documentos, identidad ni procedencia
          de equipos; no hay una consulta automática de IMEI conectada.
        </p>
      )}
      <div className="admin-filters glass-panel">
        <label className="admin-search-field">
          <Icon name="search" size={18} />
          <input
            aria-label="Buscar usuarios"
            placeholder="Nombre, tienda, ciudad o teléfono…"
            value={query}
            onChange={changeFilter(setQuery)}
          />
        </label>
        <label>
          Cuenta
          <select aria-label="Filtrar tipo de cuenta" value={type} onChange={changeFilter(setType)}>
            <option value="all">Todas</option>
            <option value="personal">Personales</option>
            <option value="store">Tiendas</option>
          </select>
        </label>
        <label>
          Verificación
          <select
            aria-label="Filtrar verificación"
            value={verification}
            onChange={changeFilter(setVerification)}
          >
            <option value="all">Todas</option>
            <option value="pending">Sin verificar</option>
            <option value="verified">Verificadas</option>
          </select>
        </label>
      </div>
      <div className="glass-panel admin-table-panel">
        <div className="admin-panel-heading">
          <h2>
            {rows.length} {verifications ? 'perfiles' : 'usuarios'}
          </h2>
          <span className="admin-subtle">Datos de perfiles registrados</span>
        </div>
        <div className="admin-table-scroll">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Usuario</th>
                <th>Cuenta</th>
                <th>Ubicación</th>
                <th>Contacto</th>
                <th>Acceso</th>
                <th>Verificación</th>
                <th>Publicaciones</th>
                <th>Registro</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {rows.slice((currentPage - 1) * 10, currentPage * 10).map((item) => (
                <tr key={item.id}>
                  <td>
                    <div className="admin-user-cell">
                      <span className="market-avatar">
                        {accountName(item).slice(0, 2).toUpperCase()}
                      </span>
                      <div>
                        <strong>{accountName(item)}</strong>
                        {item.store_name && <small>{item.full_name}</small>}
                        {verifications && item.nit && <small>NIT: {item.nit}</small>}
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="admin-badge">
                      {getAccountType(item) === 'store' ? 'Tienda' : 'Personal'}
                    </span>
                  </td>
                  <td>{item.city || 'Sin ciudad'}</td>
                  <td>{item.phone || 'Sin teléfono'}</td>
                  <td>{item.role === 'admin' ? 'Administrador' : 'Usuario'}</td>
                  <td>
                    <span
                      className={`admin-badge ${item.is_verified ? 'status-published' : 'status-draft'}`}
                    >
                      {item.is_verified ? 'Verificado' : 'Sin verificar'}
                    </span>
                  </td>
                  <td>{data.products.filter((product) => product.owner_id === item.id).length}</td>
                  <td>{dateLabel(item.created_at)}</td>
                  <td>
                    <div className="admin-row-actions">
                      <button
                        className="market-text-button"
                        onClick={() => setEditing(item)}
                        aria-label={`Editar ${accountName(item)}`}
                      >
                        Editar
                      </button>
                      <button
                        className="market-text-button"
                        onClick={() => setAction({ kind: 'verify', profile: item })}
                        aria-label={`${item.is_verified ? 'Retirar' : 'Otorgar'} verificación de ${accountName(item)}`}
                      >
                        <Icon name="shield" size={17} />
                        {item.is_verified ? 'Retirar check' : 'Verificar'}
                      </button>
                      {!verifications && (
                        <button
                          className="market-text-button market-danger"
                          disabled={item.id === user.id}
                          title={
                            item.id === user.id ? 'No podés eliminar tu propio perfil' : undefined
                          }
                          onClick={() => setAction({ kind: 'delete', profile: item })}
                          aria-label={`Eliminar perfil de ${accountName(item)}`}
                        >
                          Eliminar
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {!rows.length && (
                <tr>
                  <td colSpan={9} className="admin-empty-inline">
                    No hay perfiles que coincidan con los filtros.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <AdminPagination count={rows.length} page={currentPage} onChange={setPage} />
      </div>
      {editing && (
        <AdminUserEditor
          profile={editing}
          self={editing.id === user.id}
          onClose={() => setEditing(null)}
          onSave={async (id, values) => {
            await data.updateUser(id, values);
            if (id === user.id) await refreshProfile();
          }}
        />
      )}
      {action && (
        <AdminConfirm
          title={
            action.kind === 'delete'
              ? 'Eliminar perfil'
              : action.profile.is_verified
                ? 'Retirar verificación'
                : 'Verificar perfil'
          }
          danger={action.kind === 'delete'}
          label={action.kind === 'delete' ? 'Eliminar perfil' : 'Confirmar verificación'}
          description={
            action.kind === 'delete'
              ? `Se eliminará el perfil de ${accountName(action.profile)} y sus ${data.products.filter((item) => item.owner_id === action.profile.id).length} publicaciones. La cuenta de Supabase Auth seguirá existiendo y podría recrear su perfil al ingresar. Esta acción no se puede deshacer.`
              : `${action.profile.is_verified ? 'Se retirará' : 'Se otorgará'} el check de verificación del perfil de ${accountName(action.profile)}. Esta acción es una revisión manual del administrador.`
          }
          onClose={() => setAction(null)}
          onConfirm={async () => {
            if (action.kind === 'delete') {
              await data.removeUser(action.profile.id);
              toast.success('Perfil eliminado.');
            } else {
              await data.updateUser(action.profile.id, {
                is_verified: !action.profile.is_verified,
              });
              if (action.profile.id === user.id) await refreshProfile();
              toast.success('Verificación actualizada.');
            }
          }}
        />
      )}
    </section>
  );
}
