import { useState } from 'react';

export default function AdminSecurityTab() {
  const [imei, setImei] = useState('');
  const [result, setResult] = useState(null);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!imei) return;
    
    // Mock search
    if (imei === '123456789012345') {
      setResult({ status: 'blocked', reason: 'Reportado como robado el 12/03/2025' });
    } else {
      setResult({ status: 'clean', reason: 'No se encontraron reportes para este IMEI/Serie' });
    }
  };

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-slate-body mb-2">Seguridad y Validación (CU14/15)</h1>
      <p className="text-sm text-slate-sub mb-8">Consultá códigos IMEI o Números de Serie contra la base de datos interna y bloqueados.</p>

      <div className="bg-navy-light border border-cyan/10 p-6 rounded-2xl max-w-2xl mb-8">
        <h3 className="font-bold text-slate-body mb-4">Herramienta de Verificación Manual</h3>
        <form onSubmit={handleSearch} className="flex gap-3">
          <input
            type="text"
            placeholder="Ingrese IMEI o Nro. de Serie..."
            value={imei}
            onChange={(e) => setImei(e.target.value)}
            className="flex-1 bg-navy border border-cyan/20 rounded-xl px-4 py-2.5 text-sm text-slate-body focus:outline-none focus:border-cyan"
          />
          <button type="submit" className="bg-brand-blue text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-brand-hover transition-colors">
            Consultar
          </button>
        </form>

        {result && (
          <div className={`mt-6 p-4 rounded-xl border ${result.status === 'blocked' ? 'bg-red-500/10 border-red-500/30' : 'bg-brand-neon/10 border-brand-neon/30'}`}>
            <div className="flex items-center gap-2 mb-1">
              <span className={`flex items-center justify-center w-6 h-6 rounded-full border ${result.status === 'blocked' ? 'border-red-400 text-red-400' : 'border-brand-neon text-brand-neon'}`}>
                {result.status === 'blocked' ? (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                ) : (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                )}
              </span>
              <h4 className={`font-bold ${result.status === 'blocked' ? 'text-red-400' : 'text-brand-neon'}`}>
                {result.status === 'blocked' ? 'Equipo Observado / Bloqueado' : 'Equipo Limpio'}
              </h4>
            </div>
            <p className="text-sm text-slate-sub ml-7">{result.reason}</p>
          </div>
        )}
      </div>
      
      <div className="max-w-2xl">
        <h3 className="font-bold text-slate-body mb-3">Últimos equipos marcados automáticamente</h3>
        <div className="bg-navy-light border border-cyan/10 rounded-xl p-4 text-sm text-slate-muted">
          La IA de moderación no ha detectado IMEI sospechosos en las últimas 24 horas.
        </div>
      </div>
    </div>
  );
}
