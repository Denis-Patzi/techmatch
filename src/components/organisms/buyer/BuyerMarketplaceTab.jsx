import { useState } from 'react';

// Datos de prueba estilo Marketplace
const MOCK_PRODUCTS = [
  { id: 1, title: 'Laptop Lenovo Legion 5', price: '7500', location: 'Santa Cruz', time: 'Hace 2h', condition: 'Usado - Como nuevo', seller: 'Carlos M.' },
  { id: 2, title: 'Monitor Gigabyte G24F', price: '1200', location: 'La Paz', time: 'Hace 5h', condition: 'Nuevo sellado', seller: 'Electro Import' },
  { id: 3, title: 'Mouse Logitech G Pro X Superlight', price: '850', location: 'Cochabamba', time: 'Ayer', condition: 'Usado', seller: 'Ana P.' },
  { id: 4, title: 'Tarjeta Gráfica RTX 3060 Ti', price: '2800', location: 'Santa Cruz', time: 'Ayer', condition: 'Usado', seller: 'Juan Perez' },
];

export default function BuyerMarketplaceTab() {
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');

  return (
    <div className="flex flex-col h-full max-w-5xl mx-auto">
      
      {/* ── Top Bar: Buscador y Filtros ── */}
      <div className="sticky top-0 bg-navy z-10 pb-6">
        <h1 className="font-display text-2xl font-bold text-slate-body mb-4">Marketplace</h1>
        
        <div className="flex flex-col md:flex-row gap-3">
          {/* Buscador */}
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-muted">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            </div>
            <input
              type="text"
              placeholder="Buscar Laptops, Tarjetas Gráficas, Celulares..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-navy-light border border-cyan/20 rounded-xl text-sm text-slate-body focus:outline-none focus:border-cyan transition-colors"
            />
          </div>
          
          {/* Filtros Rápidos (Píldoras) */}
          <div className="flex gap-2 overflow-x-auto no-scrollbar shrink-0">
            {[
              { id: 'all', label: 'Todo' },
              { id: 'laptops', label: 'Laptops' },
              { id: 'components', label: 'Componentes PC' },
              { id: 'phones', label: 'Celulares' }
            ].map(f => (
              <button
                key={f.id}
                onClick={() => setFilterCategory(f.id)}
                className={`px-4 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-colors ${
                  filterCategory === f.id
                    ? 'bg-cyan text-navy'
                    : 'bg-navy-light border border-cyan/10 text-slate-sub hover:text-cyan'
                }`}
              >
                {f.label}
              </button>
            ))}
            <button className="px-4 py-2.5 rounded-xl text-sm font-bold bg-navy-light border border-cyan/10 text-slate-sub hover:text-cyan flex items-center gap-2">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>
              Más Filtros
            </button>
          </div>
        </div>
      </div>

      {/* ── Feed de Productos ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 pb-8 overflow-y-auto">
        {MOCK_PRODUCTS.map((item) => (
          <div key={item.id} className="bg-navy-light border border-cyan/10 rounded-2xl overflow-hidden hover:border-cyan/30 transition-all group flex flex-col">
            
            {/* Imagen (Placeholder) */}
            <div className="h-48 bg-navy flex items-center justify-center border-b border-cyan/10 relative overflow-hidden">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="text-cyan/20">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
              </svg>
              {/* Botón Guardar / Favorito */}
              <button className="absolute top-3 right-3 w-8 h-8 rounded-full bg-navy/80 flex items-center justify-center text-slate-muted hover:text-cyan hover:bg-navy transition-all backdrop-blur-sm border border-cyan/10">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
              </button>
            </div>
            
            {/* Detalles */}
            <div className="p-4 flex flex-col flex-1">
              <div className="flex items-center justify-between mb-1 text-[0.65rem] font-bold uppercase tracking-wider text-slate-muted">
                <span>{item.condition}</span>
                <span className="text-cyan/70">{item.time}</span>
              </div>
              <h3 className="font-bold text-slate-body mb-2 line-clamp-2">{item.title}</h3>
              <div className="font-display text-lg font-black text-brand-neon mb-3 mt-auto">
                Bs. {item.price}
              </div>
              
              <div className="flex items-center gap-2 mb-4 text-xs text-slate-sub">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                {item.location} • {item.seller}
              </div>
              
              <button className="w-full py-2 bg-navy border border-cyan/20 text-cyan text-sm font-bold rounded-xl group-hover:bg-cyan group-hover:text-navy transition-all flex items-center justify-center gap-2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                Enviar Oferta
              </button>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
}
