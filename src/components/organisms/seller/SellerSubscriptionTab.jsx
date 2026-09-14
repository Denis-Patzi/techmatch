export default function SellerSubscriptionTab() {
  return (
    <div className="max-w-4xl">
      <h1 className="font-display text-2xl font-bold text-slate-body mb-2">Mi Suscripción</h1>
      <p className="text-sm text-slate-sub mb-8">Administrá el plan de tu tienda para potenciar tus ventas.</p>

      {/* Plan Actual */}
      <div className="bg-navy-light border border-cyan/10 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 mb-10">
        <div>
          <div className="text-xs font-bold text-slate-muted uppercase tracking-widest mb-1">Plan Actual</div>
          <h2 className="text-xl font-display font-black text-slate-body">Plan Básico (Free)</h2>
          <p className="text-sm text-slate-sub mt-2">Tenés acceso a las herramientas básicas de venta, pero tus productos no son destacados.</p>
        </div>
        <div className="shrink-0">
          <span className="px-4 py-2 bg-slate-800 text-slate-300 text-sm font-bold rounded-xl border border-slate-700">Activo</span>
        </div>
      </div>

      <div className="border-t border-cyan/10 pt-8">
        <h3 className="font-display text-xl font-bold text-slate-body mb-6 text-center">Mejorá tu Tienda con el Plan Negocio</h3>
        
        {/* Tarjeta Plan Negocio */}
        <div className="max-w-md mx-auto bg-gradient-to-b from-navy-light to-navy border border-brand-purple/30 rounded-[2rem] p-8 relative overflow-hidden shadow-[0_0_40px_-15px_rgba(182,102,210,0.2)]">
          {/* Badge */}
          <div className="absolute top-0 right-8 bg-brand-purple text-white text-[0.65rem] font-black uppercase tracking-wider py-1 px-3 rounded-b-lg">
            Recomendado
          </div>

          <h3 className="font-display text-2xl font-bold text-slate-body mb-2">Negocio</h3>
          <p className="text-sm text-slate-sub mb-6 h-10">Para tiendas y emprendedores de hardware.</p>
          
          <div className="mb-6 flex items-baseline gap-1">
            <span className="font-display text-4xl font-black text-brand-neon">Bs. 350</span>
            <span className="text-sm text-slate-sub font-medium">/mes</span>
          </div>

          <ul className="flex flex-col gap-3 mb-8">
            {[
              'Publicaciones ILIMITADAS',
              'Comisión preferencial 3%',
              'Insignia "Vendedor Verificado"',
              'Productos destacados (Top 3)',
              'Acceso al API y Webhooks',
              'Soporte prioritario 24/7'
            ].map((feature, i) => (
              <li key={i} className="flex items-center gap-3 text-sm text-slate-body">
                <svg className="w-5 h-5 text-brand-neon shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                {feature}
              </li>
            ))}
          </ul>

          <button className="w-full py-3.5 bg-brand-purple hover:bg-brand-neon text-white hover:text-navy rounded-xl text-sm font-black transition-all duration-300 shadow-[0_0_20px_-5px_rgba(182,102,210,0.4)] hover:shadow-[0_0_25px_-5px_rgba(11,219,168,0.5)]">
            Suscribirse Ahora
          </button>
        </div>
      </div>
    </div>
  );
}
