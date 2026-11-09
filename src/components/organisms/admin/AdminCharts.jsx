import { useId, useState } from 'react';

export function ActivityChart({ data }) {
  const gradient = `activity-${useId().replaceAll(':', '')}`;
  const [selected, setSelected] = useState(null);
  const width = 680,
    height = 230,
    pad = 28;
  const max = Math.max(1, ...data.map((item) => Math.max(item.users, item.products)));
  const x = (index) => pad + (index / Math.max(1, data.length - 1)) * (width - pad * 2);
  const y = (value) => height - pad - (value / max) * (height - pad * 2);
  const path = (key) =>
    data.map((item, index) => `${index ? 'L' : 'M'}${x(index)},${y(item[key])}`).join(' ');
  const focused = data[selected !== null && selected < data.length ? selected : data.length - 1];
  return (
    <div className="admin-activity-chart">
      <div className="admin-chart-legend">
        <span>
          <i className="admin-dot-blue" />
          Publicaciones
        </span>
        <span>
          <i className="admin-dot-pale" />
          Usuarios
        </span>
        <strong>
          {focused?.label}: {focused?.products || 0} publicaciones · {focused?.users || 0} usuarios
        </strong>
      </div>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        role="img"
        aria-label="Altas de usuarios y publicaciones por fecha"
      >
        <defs>
          <linearGradient id={gradient} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#368cff" stopOpacity=".3" />
            <stop offset="100%" stopColor="#368cff" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[0, 0.5, 1].map((part) => (
          <g key={part}>
            <line
              x1={pad}
              x2={width - pad}
              y1={y(part * max)}
              y2={y(part * max)}
              className="admin-chart-grid"
            />
            <text x="4" y={y(part * max) - 5}>
              {Math.ceil(part * max)}
            </text>
          </g>
        ))}
        <path
          d={`${path('products')} L${x(data.length - 1)},${height - pad} L${pad},${height - pad} Z`}
          fill={`url(#${gradient})`}
        />
        <path
          d={path('users')}
          fill="none"
          stroke="#9dcaff"
          strokeWidth="2.5"
          strokeDasharray="5 5"
        />
        <path d={path('products')} fill="none" stroke="#3287f7" strokeWidth="3" />
        {data.map((item, index) => (
          <g key={item.key} onPointerEnter={() => setSelected(index)}>
            <rect
              x={x(index) - Math.max(8, (width - pad * 2) / data.length / 2)}
              y={pad}
              width={Math.max(16, (width - pad * 2) / data.length)}
              height={height - pad * 2}
              fill="transparent"
            />
            <circle
              cx={x(index)}
              cy={y(item.products)}
              r={selected === index ? 5 : 2.5}
              fill="#5da8ff"
            />
            {(index === 0 ||
              index === data.length - 1 ||
              index === Math.floor(data.length / 2)) && (
              <text
                x={x(index)}
                y={height - 4}
                textAnchor={index === 0 ? 'start' : index === data.length - 1 ? 'end' : 'middle'}
              >
                {item.label}
              </text>
            )}
          </g>
        ))}
      </svg>
      <details className="admin-chart-data">
        <summary>Ver datos de la gráfica</summary>
        <div className="admin-table-scroll">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Usuarios</th>
                <th>Publicaciones</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item) => (
                <tr key={item.key}>
                  <td>{item.label}</td>
                  <td>{item.users}</td>
                  <td>{item.products}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </div>
  );
}
export function AccountDonut({ personal, stores }) {
  const total = personal + stores;
  const ratio = total ? stores / total : 0;
  const circumference = 2 * Math.PI * 62;
  return (
    <div className="admin-account-chart">
      <div className="admin-donut">
        <svg
          viewBox="0 0 160 160"
          role="img"
          aria-label={`${personal} cuentas personales y ${stores} tiendas`}
        >
          <circle
            cx="80"
            cy="80"
            r="62"
            fill="none"
            stroke="currentColor"
            strokeWidth="15"
            className="admin-donut-track"
          />
          <circle
            cx="80"
            cy="80"
            r="62"
            fill="none"
            stroke="#3789f6"
            strokeWidth="15"
            strokeDasharray={`${circumference * (total ? 1 : 0)} ${circumference}`}
            transform="rotate(-90 80 80)"
          />
          <circle
            cx="80"
            cy="80"
            r="62"
            fill="none"
            stroke="#9bceff"
            strokeWidth="15"
            strokeDasharray={`${circumference * ratio} ${circumference}`}
            transform="rotate(-90 80 80)"
            strokeLinecap={ratio ? 'round' : 'butt'}
          />
        </svg>
        <div>
          <strong>{total}</strong>
          <span>Cuentas</span>
        </div>
      </div>
      <div className="admin-donut-legend">
        <p>
          <span>
            <i className="admin-dot-blue" />
            Personales
          </span>
          <strong>{personal}</strong>
        </p>
        <p>
          <span>
            <i className="admin-dot-pale" />
            Tiendas
          </span>
          <strong>{stores}</strong>
        </p>
      </div>
    </div>
  );
}
export function CategoryBars({ data }) {
  const max = Math.max(1, ...data.map((item) => item.value));
  return (
    <div className="admin-category-bars">
      {data.length ? (
        data.map((item) => (
          <div className="admin-category-row" key={item.label}>
            <span>{item.label}</span>
            <div>
              <span style={{ width: `${(item.value / max) * 100}%` }} />
            </div>
            <strong>{item.value}</strong>
          </div>
        ))
      ) : (
        <p className="admin-empty-inline">Las publicaciones activas aparecerán por categoría.</p>
      )}
    </div>
  );
}
