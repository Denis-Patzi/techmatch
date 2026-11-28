import { customPrices, promotionPrices } from '@/data/plansData';

export function PlanExtras({ accountType }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mt-8">
      <section
        className="glass-panel p-5 sm:p-6 min-w-0"
        aria-label="Tarifas Custom"
      >
        <h2 className="text-lg font-medium mb-2">Custom · precios por mes</h2>
        <p className="text-sm text-slate-sub mb-4">
          Elegí servicios y una duración de 1 a 12 meses.
        </p>
        <dl className="flex flex-col gap-4 text-sm">
          {customPrices
            .filter((item) => !item.storeOnly || accountType !== 'personal')
            .map((item) => (
              <div
                key={item.label}
                className="flex items-start justify-between gap-4"
              >
                <dt className="text-slate-sub">
                  {item.label}
                  {item.storeOnly && (
                    <span className="block text-xs text-slate-muted">
                      Solo tiendas
                    </span>
                  )}
                </dt>
                <dd className="text-cyan whitespace-nowrap font-medium">
                  Bs. {item.price}
                </dd>
              </div>
            ))}
        </dl>
        <p className="text-sm text-slate-sub mt-5">
          Descuentos por duración: 3 meses −10%, 6 meses −15% y 12 meses −20%.
          Aplican únicamente al plan Custom.
        </p>
      </section>
      <section
        className="glass-panel p-5 sm:p-6 min-w-0"
        aria-label="Promociones por días"
      >
        <h2 className="text-lg font-medium mb-2">Promociones por días</h2>
        <p className="text-sm text-slate-sub mb-4">
          Destacados y anuncios sin suscripción.
        </p>
        <table className="w-full text-left text-xs sm:text-sm">
          <caption className="sr-only">
            Precios de promociones en bolivianos
          </caption>
          <thead className="text-slate-muted">
            <tr>
              <th scope="col" className="py-3">
                Tipo
              </th>
              <th scope="col">1 día</th>
              <th scope="col">7 días</th>
              <th scope="col">30 días</th>
            </tr>
          </thead>
          <tbody>
            {promotionPrices.map((item) => (
              <tr key={item.label}>
                <th scope="row" className="py-3 font-medium">
                  {item.label}
                </th>
                <td>Bs. {item.daily}</td>
                <td>Bs. {item.weekly}</td>
                <td>Bs. {item.monthly}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="text-xs text-slate-muted mt-5">
          Compra de promociones disponible próximamente.
        </p>
      </section>
    </div>
  );
}
