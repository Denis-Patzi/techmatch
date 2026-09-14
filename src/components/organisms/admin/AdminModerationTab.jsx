import { useState } from 'react';

const mockReports = [
  { id: 101, product: 'RTX 4090 Usada', reason: 'Precio sospechosamente bajo (Posible estafa)', userReporter: 'Carlos M.', date: 'Hoy, 14:30' },
  { id: 102, product: 'iPhone 15 Pro Max', reason: 'El vendedor pide depósito previo por WhatsApp', userReporter: 'Ana P.', date: 'Ayer, 09:15' },
];

export default function AdminModerationTab() {
  const [reports, setReports] = useState(mockReports);

  const handleAction = (id, action) => {
    setReports(reps => reps.filter(r => r.id !== id));
    alert(`Acción "${action}" aplicada al reporte ${id} (Mock)`);
  };

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-slate-body mb-2">Moderación de Publicaciones (CU17)</h1>
      <p className="text-sm text-slate-sub mb-6">Gestioná los reportes enviados por la comunidad para mantener la plataforma segura.</p>

      <div className="grid grid-cols-1 gap-4">
        {reports.map((report) => (
          <div key={report.id} className="bg-navy-light border border-cyan/10 p-5 rounded-2xl flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <span className="bg-red-500/20 text-red-400 text-[0.65rem] font-bold px-2 py-0.5 rounded uppercase tracking-wider">Reporte</span>
                <h3 className="font-bold text-slate-body">{report.product}</h3>
              </div>
              <p className="text-sm text-slate-sub mb-2"><strong>Motivo:</strong> {report.reason}</p>
              <p className="text-xs text-slate-muted">Reportado por {report.userReporter} • {report.date}</p>
            </div>
            
            <div className="flex gap-2 w-full md:w-auto">
              <button onClick={() => handleAction(report.id, 'Eliminar Publicación')} className="flex-1 md:flex-none px-4 py-2 bg-red-500/10 text-red-400 border border-red-500/20 text-xs font-bold rounded-xl hover:bg-red-500/20">
                Eliminar Pub.
              </button>
              <button onClick={() => handleAction(report.id, 'Advertir Vendedor')} className="flex-1 md:flex-none px-4 py-2 bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 text-xs font-bold rounded-xl hover:bg-yellow-500/20">
                Advertir
              </button>
              <button onClick={() => handleAction(report.id, 'Desestimar')} className="flex-1 md:flex-none px-4 py-2 bg-navy border border-cyan/10 text-slate-sub text-xs font-bold rounded-xl hover:text-white">
                Ignorar
              </button>
            </div>
          </div>
        ))}
        {reports.length === 0 && (
          <div className="text-center py-12 bg-navy-light border border-cyan/10 rounded-2xl text-slate-muted">
            ¡Todo limpio! No hay reportes pendientes.
          </div>
        )}
      </div>
    </div>
  );
}
