export default function SellerDashboardTab() {
  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-slate-body mb-6">Dashboard de Tienda</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: 'Productos Activos', value: '12', color: 'text-cyan' },
          { label: 'Ofertas Recibidas', value: '4', color: 'text-brand-neon' },
          { label: 'Ventas Concretadas', value: '28', color: 'text-brand-purple' },
        ].map(stat => (
          <div key={stat.label} className="bg-navy-light border border-cyan/10 rounded-2xl p-5">
            <div className={`font-display text-3xl font-black ${stat.color}`}>{stat.value}</div>
            <div className="text-sm text-slate-muted mt-1">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
