import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

import SellerDashboardTab from '@/components/organisms/seller/SellerDashboardTab';
import SellerCatalogTab from '@/components/organisms/seller/SellerCatalogTab';
import SellerSubscriptionTab from '@/components/organisms/seller/SellerSubscriptionTab';

const NAV = [
  { 
    id: 'dashboard', 
    label: 'Dashboard', 
    icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="24" height="24" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></svg> 
  },
  { 
    id: 'catalog', 
    label: 'Mi Catálogo', 
    icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg> 
  },
  { 
    id: 'offers', 
    label: 'Negociaciones', 
    icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg> 
  },
  { 
    id: 'ai', 
    label: 'Tasador IA', 
    icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M12 16v-4"></path><path d="M12 8h.01"></path></svg> 
  },
  { 
    id: 'subscription', 
    label: 'Mi Suscripción', 
    icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg> 
  },
];

export default function SellerPage() {
  const { user, profile, signOut } = useAuth();
  const [section, setSection] = useState('dashboard');
  const [avatarMenuOpen, setAvatarMenuOpen] = useState(false);
  const avatarRef = useRef(null);
  const navigate = useNavigate();

  // Cerrar popover al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (avatarRef.current && !avatarRef.current.contains(e.target)) {
        setAvatarMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    setAvatarMenuOpen(false);
    await signOut();
    navigate('/');
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-navy text-slate-body overflow-hidden">
      
      {/* ── Sidebar — solo visible en md+ ── */}
      <aside className="hidden md:flex md:w-56 bg-navy-light border-r border-cyan/10 flex-col shrink-0">
        
        {/* Logo */}
        <div className="p-5 border-b border-cyan/10">
          <div className="flex items-center gap-2.5">
            <img src="/logo.png" alt="TechMatch" className="w-8 h-8 rounded-lg" />
            <div>
              <div className="font-bold text-slate-body text-sm leading-none">TechMatch</div>
              <div className="text-[0.65rem] text-brand-neon font-semibold mt-0.5">Seller Panel</div>
            </div>
          </div>
        </div>

        {/* User Card */}
        <div className="p-5 border-b border-cyan/10 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-cyan/20 border border-cyan/30 flex items-center justify-center text-sm font-bold text-cyan shrink-0">
            {profile?.full_name?.[0]?.toUpperCase() ?? '?'}
          </div>
          <div className="overflow-hidden">
            <div className="text-sm font-bold truncate">{profile?.store_name || profile?.full_name || 'Tienda'}</div>
            <div className="text-[0.65rem] text-slate-muted truncate">{user?.email}</div>
          </div>
        </div>

        {/* Navegación Principal */}
        <nav className="flex-1 p-3 flex flex-col gap-1 overflow-y-auto">
          {NAV.map(item => (
            <button
              key={item.id}
              onClick={() => setSection(item.id)}
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-left ${
                section === item.id
                  ? 'bg-cyan/15 text-cyan border border-cyan/20'
                  : 'text-slate-sub hover:bg-navy-lighter/30 hover:text-slate-body border border-transparent'
              }`}
            >
              <div className="shrink-0">{item.icon}</div>
              <span className="truncate">{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Cerrar sesión */}
        <div className="p-3 border-t border-cyan/10">
          <button
            onClick={() => setSection('settings')}
            className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all mb-1 ${
              section === 'settings'
                ? 'bg-cyan/15 text-cyan border border-cyan/20'
                : 'text-slate-sub hover:bg-navy-lighter/30 hover:text-slate-body border border-transparent'
            }`}
          >
            <div className="shrink-0">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
            </div>
            <span>Ajustes de Tienda</span>
          </button>
          
          <button
            onClick={handleSignOut}
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-muted hover:text-red-400 hover:bg-red-400/10 transition-all w-full text-left"
          >
            <div className="shrink-0">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
            </div>
            <span>Cerrar sesión</span>
          </button>
        </div>
      </aside>

      {/* ── Contenido principal ── */}
      {/* pb-24 en mobile deja espacio para la bottom nav bar */}
      <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-auto bg-navy pb-24 md:pb-6">
        {section === 'dashboard'    && <SellerDashboardTab />}
        {section === 'catalog'      && <SellerCatalogTab />}
        {section === 'offers'       && <div className="text-slate-muted">Negociaciones en construcción...</div>}
        {section === 'ai'           && <div className="text-slate-muted">Tasador IA en construcción...</div>}
        {section === 'subscription' && <SellerSubscriptionTab />}
        {section === 'settings'     && <div className="text-slate-muted">Ajustes en construcción...</div>}
      </main>

      {/* ══════════════════════════════════════════════════════
          BOTTOM NAVIGATION BAR — Mobile only (md-)
          ▸ Solo íconos (sin labels) + Avatar con popover
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
            {/* Popover — aparece ARRIBA del avatar */}
            {avatarMenuOpen && (
              <div className="absolute bottom-14 right-0 mb-1 w-52 bg-navy-light border border-cyan/15 rounded-2xl shadow-[0_-8px_32px_rgba(0,0,0,0.4)] overflow-hidden">
                <div className="px-4 py-3 border-b border-cyan/10">
                  <p className="text-xs font-bold text-slate-body truncate">
                    {profile?.store_name || profile?.full_name || user?.email?.split('@')[0] || 'Tienda'}
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

            {/* Botón Avatar */}
            <button
              onClick={() => setAvatarMenuOpen(!avatarMenuOpen)}
              className={`w-9 h-9 rounded-full overflow-hidden border-2 transition-all duration-200 active:scale-90 ${
                avatarMenuOpen ? 'border-cyan shadow-[0_0_0_3px_rgba(34,211,238,0.2)]' : 'border-brand-neon/40'
              }`}
            >
              {profile?.avatar_url ? (
                <img src={profile.avatar_url} alt="Foto de perfil" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-brand-neon/20 to-cyan/30 flex items-center justify-center text-sm font-bold text-cyan">
                  {profile?.full_name?.[0]?.toUpperCase() ?? user?.email?.[0]?.toUpperCase() ?? 'S'}
                </div>
              )}
            </button>
          </div>

        </div>
      </nav>

    </div>
  );
}


