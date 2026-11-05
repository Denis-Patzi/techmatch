import { Icon } from '@/components/atoms/Icon';
import { SpotlightCard } from '@/lib/reactbits/SpotlightCard';
import { AITasadorDemo } from './AITasadorDemo';
import { ScrollScene } from '@/components/molecules/ScrollScene';
import { ScrollBackdrop } from '@/components/molecules/ScrollBackdrop';

function FeedPreview() {
  return (
    <div className="space-y-2">
      {[
        { name: 'Laptop Gaming', value: '98%', icon: 'laptop' },
        { name: 'iPhone 14 Pro', value: '95%', icon: 'phone' },
        { name: 'GeForce RTX', value: '91%', icon: 'cpu' },
      ].map((item, index) => (
        <div
          key={item.name}
          className={`flex items-center gap-3 p-3 rounded-2xl border border-cyan/10 ${index === 0 ? 'bg-cyan/10' : 'bg-navy-light/40'}`}
        >
          <div className="text-cyan">
            <Icon name={item.icon} size={20} />
          </div>
          <span className="text-xs text-slate-body flex-1">{item.name}</span>
          <span className="text-[.65rem] text-cyan bg-cyan/10 rounded-full px-2 py-1">
            {item.value}
          </span>
        </div>
      ))}
    </div>
  );
}
function PricePreview() {
  return (
    <div className="bg-navy-light/50 border border-cyan/10 rounded-2xl p-4">
      <div className="text-[.65rem] text-slate-muted mb-3">Una nueva oportunidad de venta</div>
      <div className="flex items-center gap-3">
        <span className="text-sm text-slate-muted line-through">Bs. 1.800</span>
        <Icon name="arrow" size={16} className="text-cyan" />
        <strong className="font-medium text-2xl text-cyan">Bs. 1.550</strong>
      </div>
      <div className="flex items-end gap-2 h-12 mt-4" aria-hidden="true">
        {[30, 45, 38, 55, 48, 65, 75, 90].map((height, index) => (
          <div
            key={index}
            className="flex-1 rounded-t-md bg-brand-blue/25"
            style={{ height: `${height}%`, opacity: 0.35 + index * 0.09 }}
          />
        ))}
      </div>
    </div>
  );
}
function ComparePreview() {
  return (
    <div className="bg-navy-light/50 border border-cyan/10 rounded-2xl overflow-hidden text-[.65rem]">
      <div className="grid grid-cols-3 p-3 bg-cyan/5">
        <span />
        <span className="text-center text-slate-body">MacBook</span>
        <span className="text-center text-slate-body">ASUS</span>
      </div>
      {[
        { label: 'Chip', a: 'Apple M2', b: 'Intel i5' },
        { label: 'RAM', a: '8 GB', b: '16 GB' },
        { label: 'Precio', a: 'Bs. 9.800', b: 'Bs. 4.200' },
      ].map((row) => (
        <div key={row.label} className="grid grid-cols-3 p-3 border-t border-cyan/5">
          <span className="text-slate-muted">{row.label}</span>
          <span className="text-center text-slate-sub">{row.a}</span>
          <span className="text-center text-cyan">{row.b}</span>
        </div>
      ))}
    </div>
  );
}
const features = [
  {
    number: '01',
    title: 'Tu mundo. Tu feed.',
    copy: 'Una vista de cómo tus intereses pueden convertirse en tu próxima gran compra.',
    Visual: FeedPreview,
  },
  {
    number: '02',
    title: 'El precio, más claro.',
    copy: 'Explorá cómo una sugerencia de precio puede darle una nueva oportunidad a tu equipo.',
    Visual: PricePreview,
  },
  {
    number: '03',
    title: 'Elegí con perspectiva.',
    copy: 'Las especificaciones, lado a lado. Menos dudas para elegir tu próxima tecnología.',
    Visual: ComparePreview,
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="scene-section">
      <ScrollBackdrop image="/images/tech-circuits.webp" variant="circuits" />
      <div className="page-container">
        <div className="section-heading">
          <div>
            <span className="eyebrow mb-5">Una mejor forma de conectar</span>
            <h2 className="section-title">
              Lo que nos hace
              <br />
              diferentes.
            </h2>
          </div>
          <p className="section-copy">
            Tecnología para encontrar tecnología. Descubrí las herramientas que estamos construyendo
            para tu próxima compra o venta.
          </p>
        </div>
        <ScrollScene>
          <SpotlightCard className="glass-panel ai-demo-shell">
            <p className="demo-caption">
              <Icon name="sparkles" size={15} /> Probá el tasador · Demostración con precios de
              ejemplo
            </p>
            <AITasadorDemo />
          </SpotlightCard>
        </ScrollScene>
        <div className="feature-grid">
          {features.map((feature, index) => (
            <ScrollScene
              key={feature.number}
              surfaceClassName="glass-panel liquid-glass feature-tile"
              variant={index % 2 ? 'reverse' : 'panel'}
            >
              <div>
                <span className="feature-number">{feature.number} / VISTA PREVIA</span>
                <h3>{feature.title}</h3>
                <p>{feature.copy}</p>
              </div>
              <div className="feature-preview">
                <feature.Visual />
              </div>
            </ScrollScene>
          ))}
        </div>
      </div>
    </section>
  );
}
