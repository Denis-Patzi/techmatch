import { Icon } from '@/components/atoms/Icon';

export function ComingSoon({ title, description, icon = 'sparkles', onBack }) {
  return (
    <div className="glass-panel empty-state">
      <Icon name={icon} size={42} />
      <span className="eyebrow mb-4">Próximamente</span>
      <h1>{title}</h1>
      <p>{description}</p>
      <button className="btn-secondary" onClick={onBack}>
        Volver al resumen
        <Icon name="arrow" size={16} />
      </button>
    </div>
  );
}
