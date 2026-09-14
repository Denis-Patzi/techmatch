export default function SellerCatalogTab() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-bold text-slate-body">Mi Catálogo</h1>
        <button className="bg-brand-neon text-navy px-4 py-2 rounded-xl text-sm font-bold hover:bg-brand-neon/90 transition-colors flex items-center gap-2">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
          Nueva Publicación
        </button>
      </div>

      <div className="bg-navy-light border border-cyan/10 rounded-2xl overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-navy border-b border-cyan/10 text-slate-muted font-medium">
            <tr>
              <th className="px-4 py-3">Producto</th>
              <th className="px-4 py-3">Precio (Bs)</th>
              <th className="px-4 py-3">Estado</th>
              <th className="px-4 py-3 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-cyan/5">
            <tr className="hover:bg-navy-lighter/30 transition-colors">
              <td className="px-4 py-3 font-medium text-slate-body">Laptop Gamer RTX 3060</td>
              <td className="px-4 py-3 font-display text-brand-neon font-bold">7500</td>
              <td className="px-4 py-3">
                <span className="px-2 py-1 bg-cyan/10 text-cyan text-xs font-bold rounded">Activo</span>
              </td>
              <td className="px-4 py-3 text-right">
                <button className="text-slate-sub hover:text-cyan text-xs font-bold">Editar</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
