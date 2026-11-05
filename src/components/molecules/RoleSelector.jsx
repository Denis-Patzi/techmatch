import { motion } from 'framer-motion';

const ROLES = [
  {
    id: 'buyer',
    icon: (
      <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
        <line x1="3" y1="6" x2="21" y2="6" />
        <path d="M16 10a4 4 0 01-8 0" />
      </svg>
    ),
    title: 'Comprador',
    desc: 'Explorá y comprá tecnología',
  },
  {
    id: 'seller',
    icon: (
      <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
    title: 'Vendedor / Tienda',
    desc: 'Publicá y gestioná tu catálogo',
  },
];

/**
 * RoleSelector — Molécula
 * Toggle de 2 cards para elegir el rol al registrarse.
 */
export function RoleSelector({ value, onChange }) {
  return (
    <div className="grid grid-cols-2 gap-3 mb-6">
      {ROLES.map((role) => {
        const isActive = value === role.id;
        return (
          <motion.button
            key={role.id}
            type="button"
            aria-pressed={isActive}
            onClick={() => onChange(role.id)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            className={`
              relative flex flex-col items-center gap-2 p-5 rounded-2xl border-2 text-center
              transition-all duration-200 cursor-pointer
              ${
                isActive
                  ? 'border-cyan bg-cyan/10 text-slate-body shadow-[0_0_20px_rgb(var(--c-brand-blue)/0.08)]'
                  : 'border-cyan/15 bg-navy-light text-slate-sub hover:border-cyan/40'
              }
            `}
          >
            {/* Ícono */}
            <span className={isActive ? 'text-cyan' : 'text-slate-muted'}>{role.icon}</span>

            <div>
              <div className="font-bold text-sm">{role.title}</div>
              <div className="text-[0.72rem] text-slate-muted mt-0.5">{role.desc}</div>
            </div>

            {/* Check indicator */}
            {isActive && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute top-2.5 right-2.5 w-5 h-5 bg-cyan rounded-full flex items-center justify-center"
              >
                <svg
                  width="10"
                  height="10"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#0D1118"
                  strokeWidth="3.5"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </motion.span>
            )}
          </motion.button>
        );
      })}
    </div>
  );
}
