export default function AdminSummaryTab({ counts }) {
  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-slate-body mb-6">Resumen</h1>
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Usuarios', value: counts.total,   color: 'text-cyan',         icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg> },
          { label: 'Compradores',    value: counts.buyers,  color: 'text-brand-blue',   icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg> },
          { label: 'Vendedores',     value: counts.sellers, color: 'text-brand-neon',   icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg> },
        ].map(stat => (
          <div key={stat.label} className="bg-navy-light border border-cyan/10 rounded-2xl p-5">
            <div className={`mb-3 ${stat.color}`}>{stat.icon}</div>
            <div className={`font-display text-3xl font-black ${stat.color}`}>{stat.value}</div>
            <div className="text-sm text-slate-muted mt-1">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
