import { Icon } from '@/components/atoms/Icon';
import { useAuth } from '@/hooks/useAuth';

export default function SellerDashboardTab({ onNavigate }) {
  const { profile } = useAuth();
  return (
    <div>
      <div className="glass-panel workspace-welcome">
        <div>
          <span className="eyebrow">Tu espacio para crecer</span>
          <h1>Hola, {profile?.full_name?.split(' ')[0] || 'bienvenido'}.</h1>
          <p>
            Cada equipo tiene una próxima historia. Administrá tu catálogo y prepará tu tienda para
            conectar con nuevos compradores.
          </p>
        </div>
        <button className="btn-primary shrink-0" onClick={() => onNavigate('catalog')}>
          Ver mi catálogo
          <Icon name="arrowUp" size={17} />
        </button>
      </div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-medium text-lg tracking-tight">Tu tienda, de un vistazo</h2>
        <span className="text-[.65rem] text-slate-muted border border-cyan/15 rounded-full px-3 py-1">
          Datos de ejemplo
        </span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Productos activos', value: '12', icon: 'box' },
          { label: 'Ofertas recibidas', value: '4', icon: 'chat' },
          { label: 'Ventas concretadas', value: '28', icon: 'chart' },
        ].map((stat) => (
          <div className="glass-panel metric-card" key={stat.label}>
            <div className="metric-icon">
              <Icon name={stat.icon} />
            </div>
            <strong>{stat.value}</strong>
            <p>{stat.label}</p>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mt-6">
        <div className="glass-panel p-7">
          <span className="eyebrow mb-4">El siguiente paso</span>
          <h2 className="text-xl font-medium tracking-tight mb-3">
            Una buena presentación hace la diferencia.
          </h2>
          <p className="text-sm text-slate-sub leading-relaxed mb-6">
            Fotos claras, detalles del estado y especificaciones completas ayudan a que tu producto
            encuentre a la persona indicada.
          </p>
          <button
            onClick={() => onNavigate('catalog')}
            className="text-cyan text-sm flex items-center gap-2"
          >
            Explorar mi catálogo
            <Icon name="arrow" size={16} />
          </button>
        </div>
        <div className="glass-panel p-7 relative overflow-hidden">
          <div className="absolute right-0 top-0 w-48 h-48 bg-brand-blue/10 rounded-full blur-3xl pointer-events-none" />
          <Icon name="sparkles" size={26} className="text-cyan mb-4" />
          <h2 className="text-xl font-medium tracking-tight mb-3">
            Más posibilidades para tu tienda.
          </h2>
          <p className="text-sm text-slate-sub leading-relaxed mb-6">
            Conocé los planes y elegí las herramientas que mejor se adapten a tu próxima etapa.
          </p>
          <button
            onClick={() => onNavigate('subscription')}
            className="text-cyan text-sm flex items-center gap-2"
          >
            Conocer los planes
            <Icon name="arrow" size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
