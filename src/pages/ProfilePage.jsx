import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

import BuyerProfileTab from '@/components/organisms/buyer/BuyerProfileTab';
import BuyerMarketplaceTab from '@/components/organisms/buyer/BuyerMarketplaceTab';
import BuyerOffersTab from '@/components/organisms/buyer/BuyerOffersTab';

const BUYER_NAV = [
  { 
    id: 'marketplace', 
    label: 'Marketplace', 
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg> 
  },
  { 
    id: 'offers', 
    label: 'Mis Ofertas', 
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg> 
  },
];

export default function ProfilePage() {
  const { user, profile, signOut } = useAuth();
  const [section, setSection] = useState('marketplace');
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <div className="flex h-screen bg-navy text-slate-body overflow-hidden">
      
      {/* ── Sidebar (Menú Lateral) ── */}
      <aside className={`${isCollapsed ? 'w-20' : 'w-56'} bg-navy-light border-r border-cyan/10 flex flex-col shrink-0 transition-all duration-300 ease-in-out`}>
        
        {/* Logo & Toggle */}
        <div className="p-4 border-b border-cyan/10 flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex items-center gap-2.5 overflow-hidden">
              <img src="/logo.png" alt="TechMatch" className="w-8 h-8 rounded-lg shrink-0" />
              <div>
                <div className="font-bold text-slate-body text-sm leading-none truncate">TechMatch</div>
                <div className="text-[0.65rem] text-cyan font-semibold mt-0.5 truncate">Marketplace</div>
              </div>
            </div>
          )}
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={`p-2 rounded-xl text-slate-muted hover:text-cyan hover:bg-cyan/10 transition-colors ${isCollapsed ? 'mx-auto' : ''}`}
            title="Colapsar menú"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>
        </div>

        {/* Navegación Principal */}
        <nav className="flex-1 p-3 flex flex-col gap-2 overflow-y-auto mt-2">
          {BUYER_NAV.map(item => (
            <button
              key={item.id}
              onClick={() => setSection(item.id)}
              title={isCollapsed ? item.label : undefined}
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                section === item.id
                  ? 'bg-cyan/10 text-cyan border border-cyan/20'
                  : 'text-slate-sub hover:bg-navy hover:text-slate-body border border-transparent'
              } ${isCollapsed ? 'justify-center' : ''}`}
            >
              <div className="shrink-0">{item.icon}</div>
              {!isCollapsed && <span className="truncate">{item.label}</span>}
            </button>
          ))}
        </nav>

        {/* Bottom Actions (Perfil y Salir) */}
        <div className="p-3 border-t border-cyan/10 flex flex-col gap-2">
          
          <button
            onClick={() => setSection('profile')}
            title={isCollapsed ? 'Mi Perfil' : undefined}
            className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
              section === 'profile'
                ? 'bg-cyan/10 text-cyan border border-cyan/20'
                : 'text-slate-sub hover:bg-navy hover:text-slate-body border border-transparent'
            } ${isCollapsed ? 'justify-center' : ''}`}
          >
            <div className="shrink-0">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
            </div>
            {!isCollapsed && <span className="truncate">Mi Perfil</span>}
          </button>

          <button
            onClick={handleSignOut}
            title={isCollapsed ? 'Cerrar sesión' : undefined}
            className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-muted hover:text-red-400 hover:bg-red-400/10 transition-all ${isCollapsed ? 'justify-center' : ''}`}
          >
            <div className="shrink-0">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
            </div>
            {!isCollapsed && <span className="truncate">Cerrar sesión</span>}
          </button>

        </div>
      </aside>

      {/* ── Contenido principal ── */}
      <main className="flex-1 p-6 md:p-8 overflow-hidden bg-navy flex flex-col">
        {section === 'marketplace' && <BuyerMarketplaceTab />}
        {section === 'offers'      && <div className="overflow-auto h-full"><BuyerOffersTab /></div>}
        {section === 'profile'     && <div className="overflow-auto h-full"><BuyerProfileTab /></div>}
      </main>

    </div>
  );
}
