import { useAuth } from '@/hooks/useAuth';
import { Icon } from '@/components/atoms/Icon';
import { ComingSoon } from '@/components/molecules/ComingSoon';
import { getAccountType } from '@/lib/account';

export default function SellerCatalogTab({ onExplore }) {
  const { profile } = useAuth();
  const store = getAccountType(profile) === 'store';
  return (
    <div>
      <span className="eyebrow mb-4">Tu espacio para vender</span>
      <h1>
        {store ? `El catálogo de ${profile?.store_name || 'tu tienda'}.` : 'Tu catálogo personal.'}
      </h1>
      <p className="text-sm text-slate-sub mt-3">
        Tus publicaciones se reunirán en tu perfil, junto a las opciones de venta y subasta.
      </p>
      <ComingSoon
        title="Prepará tu próximo gran match."
        description="La creación, edición y eliminación de publicaciones está en preparación. Podés completar tu perfil y conocer los planes mientras habilitamos esta función."
        icon="box"
        onBack={onExplore}
        backLabel="Explorar productos"
      />
      <p className="user-demo-note">
        <Icon name="shield" size={16} /> Tus futuras publicaciones se gestionarán desde esta misma
        cuenta, personal o de tienda.
      </p>
    </div>
  );
}
