import { useState } from 'react';

// Mock data
const mockRequests = [
  { id: 1, storeName: 'TecnoBolivia SRL', nit: '1234567015', date: '2025-05-10', status: 'pending' },
  { id: 2, storeName: 'Electro Import', nit: '9876543011', date: '2025-05-11', status: 'pending' },
];

export default function AdminVerificationsTab() {
  const [requests, setRequests] = useState(mockRequests);

  const handleApprove = (id) => {
    setRequests(reqs => reqs.filter(r => r.id !== id));
    alert(`Vendedor ${id} certificado correctamente (Mock)`);
  };

  const handleReject = (id) => {
    setRequests(reqs => reqs.filter(r => r.id !== id));
    alert(`Solicitud ${id} rechazada (Mock)`);
  };

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-slate-body mb-2">Validación y Certificación (CU16)</h1>
      <p className="text-sm text-slate-sub mb-6">Revisá los documentos de los vendedores para otorgarles el Check de Verificado.</p>

      <div className="bg-navy-light border border-cyan/10 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[700px]">
            <thead>
              <tr className="border-b border-cyan/10 bg-navy-lighter/10">
                <th className="text-left px-4 py-3 text-slate-muted font-semibold">Tienda</th>
                <th className="text-left px-4 py-3 text-slate-muted font-semibold">NIT / CI</th>
                <th className="text-left px-4 py-3 text-slate-muted font-semibold">Fecha Solicitud</th>
                <th className="text-left px-4 py-3 text-slate-muted font-semibold">Documentos</th>
                <th className="text-left px-4 py-3 text-slate-muted font-semibold">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((r, i) => (
                <tr key={r.id} className={`border-b border-cyan/5 ${i % 2 === 0 ? '' : 'bg-navy/30'}`}>
                  <td className="px-4 py-3 font-medium text-slate-body">{r.storeName}</td>
                  <td className="px-4 py-3 text-slate-sub">{r.nit}</td>
                  <td className="px-4 py-3 text-slate-sub">{r.date}</td>
                  <td className="px-4 py-3">
                    <button className="text-cyan text-xs hover:underline flex items-center gap-1.5 font-medium">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                      Ver PDF
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button onClick={() => handleApprove(r.id)} className="px-3 py-1 bg-brand-neon/20 text-brand-neon text-xs font-bold rounded-lg hover:bg-brand-neon/30">
                        Aprobar
                      </button>
                      <button onClick={() => handleReject(r.id)} className="px-3 py-1 bg-red-500/20 text-red-400 text-xs font-bold rounded-lg hover:bg-red-500/30">
                        Rechazar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {requests.length === 0 && (
                <tr><td colSpan={5} className="px-4 py-8 text-center text-slate-muted">No hay solicitudes pendientes.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
