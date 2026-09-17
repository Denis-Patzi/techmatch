import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/hooks/useAuth';

const ROLES = ['buyer', 'seller', 'admin'];
const ROLE_LABEL = { buyer: 'Comprador', seller: 'Vendedor', admin: 'Admin' };
const ROLE_COLOR = {
  buyer: 'bg-brand-blue/20 text-brand-blue',
  seller: 'bg-brand-neon/20 text-brand-neon',
  admin: 'bg-brand-purple/20 text-brand-purple',
};

const NAV = [
  { id: 'summary',       label: 'Dashboard',      icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="24" height="24" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></svg> },
  { id: 'users',         label: 'Usuarios',       icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg> },
  { id: 'verifications', label: 'Verificaciones', icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg> },
  { id: 'moderation',    label: 'Moderación',     icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path><line x1="4" y1="22" x2="4" y2="15"></line></svg> },
  { id: 'security',      label: 'Seguridad IMEI', icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect><line x1="12" y1="18" x2="12.01" y2="18"></line></svg> },
];

// Placeholder components (to be implemented)
import AdminSummaryTab from '@/components/organisms/admin/AdminSummaryTab';
import AdminUsersTab from '@/components/organisms/admin/AdminUsersTab';
import AdminVerificationsTab from '@/components/organisms/admin/AdminVerificationsTab';
import AdminModerationTab from '@/components/organisms/admin/AdminModerationTab';
import AdminSecurityTab from '@/components/organisms/admin/AdminSecurityTab';

/**
 * AdminPage — Panel de Administrador Completo
 */
export default function AdminPage() {
  const [section, setSection] = useState('summary');
  const [users, setUsers]       = useState([]);
  const [counts, setCounts]     = useState({ total: 0, buyers: 0, sellers: 0 });
  const [loadingData, setLoadingData] = useState(false);
  const [avatarMenuOpen, setAvatarMenuOpen] = useState(false);
  const avatarRef = useRef(null);
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();

  /* ── Cargar todos los perfiles ── */
  const fetchUsers = async () => {
    setLoadingData(true);
    const { data, error } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
    if (error) { toast.error('Error al cargar usuarios'); }
    else {
      setUsers(data);
      setCounts({
        total:   data.length,
        buyers:  data.filter(u => u.role === 'buyer').length,
        sellers: data.filter(u => u.role === 'seller').length,
      });
    }
    setLoadingData(false);
  };

  useEffect(() => { fetchUsers(); }, []);

  /* ── Cambiar rol ── */
  const changeRole = async (userId, newRole) => {
    const { error } = await supabase.from('profiles').update({ role: newRole }).eq('id', userId);
    if (error) toast.error('Error al cambiar rol');
    else { toast.success('Rol actualizado'); fetchUsers(); }
  };

  /* ── Cambiar verificación ── */
  const toggleVerified = async (userId, current) => {
    const { error } = await supabase.from('profiles').update({ is_verified: !current }).eq('id', userId);
    if (error) toast.error('Error al actualizar verificación');
    else fetchUsers();
  };

  /* ── Eliminar usuario ── */
  const deleteUser = async (userId) => {
    if (!confirm('¿Estás seguro de que querés eliminar este usuario? Esta acción no se puede deshacer.')) return;
    const { error } = await supabase.from('profiles').delete().eq('id', userId);
    if (error) toast.error('Error al eliminar usuario');
    else { toast.success('Usuario eliminado'); fetchUsers(); }
  };

  const handleSignOut = async () => { setAvatarMenuOpen(false); await signOut(); navigate('/'); };

  // Cerrar el popover al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (avatarRef.current && !avatarRef.current.contains(e.target)) {
        setAvatarMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="min-h-screen bg-navy flex flex-col md:flex-row">

      {/* ── Sidebar ── solo visible en md+ */}
      <aside className="hidden md:flex md:w-56 bg-navy-light border-r border-cyan/10 flex-col">
        {/* Logo */}
        <div className="p-5 border-b border-cyan/10">
          <div className="flex items-center gap-2.5">
            <img src="/logo.png" alt="TechMatch" className="w-8 h-8 rounded-lg" />
            <div>
              <div className="font-bold text-slate-body text-sm leading-none">TechMatch</div>
              <div className="text-[0.65rem] text-brand-purple font-semibold mt-0.5">Admin Panel</div>
            </div>
          </div>
        </div>

        {/* Navegación */}
        <nav className="flex-1 p-3 flex flex-col gap-1">
          {NAV.map(item => (
            <button
              key={item.id}
              onClick={() => setSection(item.id)}
              className={`
                flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium
                transition-all duration-150 text-left
                ${section === item.id
                  ? 'bg-cyan/15 text-cyan border border-cyan/20'
                  : 'text-slate-sub hover:text-slate-body hover:bg-navy-lighter/30'
                }
              `}
            >
              <div className="shrink-0">{item.icon}</div>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Cerrar sesión */}
        <div className="p-3 border-t border-cyan/10">
          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 px-3 py-2.5 w-full rounded-xl text-sm text-slate-muted hover:text-red-400 hover:bg-red-400/5 transition-all"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* ── Contenido principal ── pb-24 deja espacio al nav en móvil */}
      <main className="flex-1 p-4 md:p-8 pb-24 md:pb-8 overflow-auto">
        {section === 'summary'       && <AdminSummaryTab counts={counts} />}
        {section === 'users'         && <AdminUsersTab />}
        {section === 'verifications' && <AdminVerificationsTab />}
        {section === 'moderation'    && <AdminModerationTab />}
        {section === 'security'      && <AdminSecurityTab />}
      </main>

      {/* ══════════════════════════════════════════════════════
          BOTTOM NAVIGATION BAR (Mobile only md-)
          ▸ Solo íconos + Avatar con popover
          ══════════════════════════════════════════════════════ */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 z-50
                   bg-navy/80 backdrop-blur-xl
                   border-t border-cyan/15
                   shadow-[0_-4px_24px_rgba(0,0,0,0.3)]"
        style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
      >
        <div className="flex items-center justify-around px-3 pt-2 pb-2">
          {NAV.map(item => (
            <button
              key={item.id}
              onClick={() => setSection(item.id)}
              className={`flex items-center justify-center w-11 h-11 rounded-2xl transition-all duration-200 active:scale-90 ${
                section === item.id ? 'text-cyan' : 'text-slate-muted'
              }`}
            >
              <div className={section === item.id ? '[&>svg]:stroke-[2.5]' : '[&>svg]:stroke-[1.8]'}>
                {item.icon}
              </div>
            </button>
          ))}

          {/* ── Avatar con Popover de sesión ── */}
          <div className="relative" ref={avatarRef}>
            {avatarMenuOpen && (
              <div className="absolute bottom-14 right-0 mb-1 w-52 bg-navy-light border border-cyan/15 rounded-2xl shadow-[0_-8px_32px_rgba(0,0,0,0.4)] overflow-hidden">
                <div className="px-4 py-3 border-b border-cyan/10">
                  <p className="text-xs font-bold text-slate-body truncate">
                    {profile?.full_name ?? user?.email?.split('@')[0] ?? 'Admin'}
                  </p>
                  <p className="text-[0.65rem] text-slate-muted truncate">{user?.email}</p>
                </div>
                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center gap-2.5 px-4 py-3 text-sm text-red-400 hover:bg-red-400/10 transition-colors active:bg-red-400/20"
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                    <polyline points="16 17 21 12 16 7"/>
                    <line x1="21" y1="12" x2="9" y2="12"/>
                  </svg>
                  Cerrar sesión
                </button>
              </div>
            )}
            <button
              onClick={() => setAvatarMenuOpen(!avatarMenuOpen)}
              className={`w-9 h-9 rounded-full overflow-hidden border-2 transition-all duration-200 active:scale-90 ${
                avatarMenuOpen ? 'border-cyan shadow-[0_0_0_3px_rgba(34,211,238,0.2)]' : 'border-brand-purple/40'
              }`}
            >
              {profile?.avatar_url ? (
                <img src={profile.avatar_url} alt="Foto de perfil" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-brand-purple/40 to-cyan/20 flex items-center justify-center text-sm font-bold text-cyan">
                  {profile?.full_name?.[0]?.toUpperCase() ?? user?.email?.[0]?.toUpperCase() ?? 'A'}
                </div>
              )}
            </button>
          </div>
        </div>
      </nav>

    </div>
  );
}


