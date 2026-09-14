import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import toast from 'react-hot-toast';

const ROLES = ['buyer', 'seller', 'admin'];
const ROLE_LABEL = { buyer: 'Comprador', seller: 'Vendedor', admin: 'Admin' };
const ROLE_COLOR = {
  buyer: 'bg-brand-blue/20 text-brand-blue',
  seller: 'bg-brand-neon/20 text-brand-neon',
  admin: 'bg-brand-purple/20 text-brand-purple',
};

export default function AdminUsersTab() {
  const [users, setUsers] = useState([]);
  const [loadingData, setLoadingData] = useState(false);

  const fetchUsers = async () => {
    setLoadingData(true);
    const { data, error } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
    if (error) { toast.error('Error al cargar usuarios'); }
    else { setUsers(data); }
    setLoadingData(false);
  };

  useEffect(() => { fetchUsers(); }, []);

  const changeRole = async (userId, newRole) => {
    const { error } = await supabase.from('profiles').update({ role: newRole }).eq('id', userId);
    if (error) toast.error('Error al cambiar rol');
    else { toast.success('Rol actualizado'); fetchUsers(); }
  };

  const toggleVerified = async (userId, current) => {
    const { error } = await supabase.from('profiles').update({ is_verified: !current }).eq('id', userId);
    if (error) toast.error('Error al actualizar verificación');
    else fetchUsers();
  };

  const deleteUser = async (userId) => {
    if (!window.confirm('¿Eliminar usuario definitivamente?')) return;
    const { error } = await supabase.from('profiles').delete().eq('id', userId);
    if (error) toast.error('Error al eliminar');
    else { toast.success('Usuario eliminado'); fetchUsers(); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-bold text-slate-body">Usuarios (CU05)</h1>
        <button onClick={fetchUsers} className="text-sm text-cyan hover:opacity-75 transition-opacity flex items-center gap-1.5">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path><polyline points="3 3 3 8 8 8"></polyline></svg>
          Actualizar
        </button>
      </div>

      {loadingData ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-2 border-cyan border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="bg-navy-light border border-cyan/10 rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-cyan/10 bg-navy-lighter/10">
                <th className="text-left px-4 py-3 text-slate-muted font-semibold">Nombre</th>
                <th className="text-left px-4 py-3 text-slate-muted font-semibold">Ciudad</th>
                <th className="text-left px-4 py-3 text-slate-muted font-semibold">Rol</th>
                <th className="text-left px-4 py-3 text-slate-muted font-semibold">Verificado</th>
                <th className="text-left px-4 py-3 text-slate-muted font-semibold">Registro</th>
                <th className="text-left px-4 py-3 text-slate-muted font-semibold">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u, i) => (
                <tr key={u.id} className={`border-b border-cyan/5 ${i % 2 === 0 ? '' : 'bg-navy/30'}`}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-cyan/20 flex items-center justify-center text-xs font-bold text-cyan">
                        {u.full_name?.[0]?.toUpperCase() ?? '?'}
                      </div>
                      <div>
                        <div className="text-slate-body font-medium leading-none">{u.full_name ?? '—'}</div>
                        {u.store_name && <div className="text-[0.65rem] text-slate-muted mt-0.5">{u.store_name}</div>}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-sub">{u.city ?? '—'}</td>
                  <td className="px-4 py-3">
                    <select
                      value={u.role}
                      onChange={e => changeRole(u.id, e.target.value)}
                      className={`text-xs font-bold px-2.5 py-1 rounded-full border-0 cursor-pointer ${ROLE_COLOR[u.role] ?? ''} bg-transparent`}
                    >
                      {ROLES.map(r => <option key={r} value={r}>{ROLE_LABEL[r]}</option>)}
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => toggleVerified(u.id, u.is_verified)}
                      className={`w-7 h-7 rounded-full border flex items-center justify-center transition-all ${
                        u.is_verified
                          ? 'bg-brand-neon/20 border-brand-neon text-brand-neon'
                          : 'bg-navy border-slate-muted/30 text-slate-muted'
                      }`}
                    >
                      {u.is_verified ? (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                      ) : (
                        <span className="text-slate-muted/50">—</span>
                      )}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-slate-muted text-xs">
                    {new Date(u.created_at).toLocaleDateString('es-BO')}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => deleteUser(u.id)}
                      className="text-red-400/60 hover:text-red-400 transition-colors"
                      title="Eliminar usuario"
                    >
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/>
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr><td colSpan={6} className="px-4 py-8 text-center text-slate-muted">No hay usuarios registrados aún.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
