import { useState } from 'react';

// Mock data
const mockOffers = [
  { id: 201, product: 'iPhone 13 Pro 128GB', originalPrice: '4500', myOffer: '4200', status: 'pending', date: 'Hace 2 horas', seller: 'Electro Import' },
  { id: 202, product: 'Memoria RAM Corsair 16GB', originalPrice: '350', myOffer: '300', status: 'accepted', date: 'Ayer', seller: 'Juan Perez' },
  { id: 203, product: 'Teclado Mecánico Razer', originalPrice: '800', myOffer: '600', status: 'rejected', date: 'Hace 3 días', seller: 'TecnoBolivia SRL' },
];

const STATUS_COLOR = {
  pending: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
  accepted: 'bg-brand-neon/10 text-brand-neon border-brand-neon/20',
  rejected: 'bg-red-500/10 text-red-400 border-red-500/20',
};

const STATUS_LABEL = {
  pending: 'En Revisión',
  accepted: 'Aceptada',
  rejected: 'Rechazada',
};

export default function BuyerOffersTab() {
  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-slate-body mb-2">Mis Ofertas (CU12)</h1>
      <p className="text-sm text-slate-sub mb-8">Hacé seguimiento a las contraofertas que enviaste a los vendedores.</p>

      <div className="grid grid-cols-1 gap-4">
        {mockOffers.map((offer) => (
          <div key={offer.id} className="bg-navy-light border border-cyan/10 p-5 rounded-2xl flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div className="flex-1">
              <h3 className="font-bold text-slate-body mb-1">{offer.product}</h3>
              <p className="text-xs text-slate-muted mb-3">Vendedor: <span className="text-slate-sub font-medium">{offer.seller}</span> • {offer.date}</p>
              <div className="flex items-center gap-4 text-sm">
                <div>
                  <span className="text-slate-muted block text-xs">Precio original</span>
                  <span className="text-slate-sub line-through">Bs. {offer.originalPrice}</span>
                </div>
                <div>
                  <span className="text-slate-muted block text-xs">Tu oferta</span>
                  <span className="font-bold text-brand-blue">Bs. {offer.myOffer}</span>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col items-end gap-3 w-full md:w-auto">
              <span className={`text-xs font-bold px-3 py-1 rounded-full border ${STATUS_COLOR[offer.status]}`}>
                {STATUS_LABEL[offer.status]}
              </span>
              
              {offer.status === 'accepted' && (
                <button className="w-full md:w-auto px-4 py-2 bg-brand-neon/20 text-brand-neon text-xs font-bold rounded-xl hover:bg-brand-neon/30 transition-colors">
                  Coordinar Entrega
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
