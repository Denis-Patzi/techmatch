import { Icon } from '@/components/atoms/Icon';

export default function AdminSummaryTab({ counts }) {
  return (
    <div>
      <div className="glass-panel workspace-welcome">
        <div>
          <span className="eyebrow">Administración de TechMatch</span>
          <h1>Una comunidad en buenas manos.</h1>
          <p>
            Consultá los usuarios registrados y accedé a las herramientas de gestión desde un solo
            lugar.
          </p>
        </div>
        <div className="bare-icon hidden sm:grid place-items-center w-20 h-20 text-cyan shrink-0">
          <Icon name="shield" size={36} />
        </div>
      </div>
      <h2 className="font-medium text-lg tracking-tight mb-4">La comunidad, en números</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Usuarios registrados', value: counts.total, icon: 'users' },
          { label: 'Compradores', value: counts.buyers, icon: 'bag' },
          { label: 'Vendedores', value: counts.sellers, icon: 'box' },
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
      <div className="glass-panel p-7 mt-6 flex gap-4 items-start">
        <div className="text-cyan pt-1">
          <Icon name="shield" size={24} />
        </div>
        <div>
          <h2 className="text-lg font-medium mb-2">Confianza en cada conexión.</h2>
          <p className="text-sm text-slate-sub max-w-2xl leading-relaxed">
            La gestión de usuarios permite revisar perfiles, roles y verificaciones. Los espacios de
            moderación y seguridad muestran una vista previa de las herramientas previstas.
          </p>
        </div>
      </div>
    </div>
  );
}
