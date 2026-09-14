import { useState } from 'react';

// Mock data
const mockRecommendations = [
  { id: 1, title: 'Laptop Lenovo Legion 5', price: '7500', match: 98, condition: 'Nuevo' },
  { id: 2, title: 'Monitor Gigabyte G24F', price: '1200', match: 92, condition: 'Usado - Como nuevo' },
  { id: 3, title: 'Mouse Logitech G Pro X', price: '850', match: 85, condition: 'Nuevo' },
];

export default function BuyerMatchmakingTab() {
  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-slate-body mb-2">Para Mí (CU11)</h1>
      <p className="text-sm text-slate-sub mb-8">Recomendaciones personalizadas basadas en tus intereses y búsquedas recientes.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockRecommendations.map((item) => (
          <div key={item.id} className="bg-navy-light border border-cyan/10 rounded-2xl overflow-hidden hover:border-cyan/30 transition-colors group">
            {/* Image placeholder */}
            <div className="h-40 bg-navy flex items-center justify-center border-b border-cyan/10 relative">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="text-cyan/20">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
              </svg>
              <div className="absolute top-3 right-3 bg-brand-neon/10 border border-brand-neon/30 text-brand-neon text-[0.65rem] font-bold px-2 py-1 rounded-full flex items-center gap-1">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                {item.match}% Match
              </div>
            </div>
            
            <div className="p-5">
              <div className="text-xs text-slate-muted mb-1">{item.condition}</div>
              <h3 className="font-bold text-slate-body mb-3 line-clamp-2">{item.title}</h3>
              <div className="font-display text-xl font-black text-brand-neon mb-4">Bs. {item.price}</div>
              
              <button className="w-full py-2 bg-navy border border-cyan/20 text-cyan text-sm font-bold rounded-xl group-hover:bg-cyan group-hover:text-navy transition-all">
                Ver Detalles
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
