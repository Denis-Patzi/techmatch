import { Icon } from '@/components/atoms/Icon';

export function AccountTypeSelector({ value, onChange, disabled = false }) {
  return (
    <div className="account-type-selector" role="group" aria-label="Tipo de cuenta">
      {[
        { id: 'personal', title: 'Personal', copy: 'Comprá y vendé por tu cuenta.', icon: 'user' },
        { id: 'store', title: 'Tienda', copy: 'Comprá y vendé como negocio.', icon: 'store' },
      ].map((type) => (
        <button
          key={type.id}
          type="button"
          aria-pressed={value === type.id}
          onClick={() => onChange(type.id)}
          disabled={disabled}
        >
          <Icon name={type.icon} size={25} />
          <strong>{type.title}</strong>
          <span>{type.copy}</span>
          {value === type.id && <Icon name="check" size={16} className="account-type-check" />}
        </button>
      ))}
    </div>
  );
}
