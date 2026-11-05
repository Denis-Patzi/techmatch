import { Icon } from '@/components/atoms/Icon';
import { ScrollBackdrop } from '@/components/molecules/ScrollBackdrop';
import { ScrollScene } from '@/components/molecules/ScrollScene';
import { SpotlightCard } from '@/lib/reactbits/SpotlightCard';
import { AITasadorDemo } from './AITasadorDemo';

export function AIAssistantSection() {
  return (
    <section id="ai-assistant" className="scene-section social-section">
      <ScrollBackdrop image="/images/tech-circuits.webp" variant="circuits" />
      <div className="page-container">
        <div className="section-heading">
          <div>
            <span className="eyebrow mb-5">Tasador y asistente con IA</span>
            <h2 className="section-title">
              Mostrá tu producto.
              <br />
              <span className="text-cyan">La IA te ayuda a publicarlo.</span>
            </h2>
          </div>
          <p className="section-copy">
            Generá una descripción y recibí una recomendación de precio. Revisá y ajustá la
            propuesta antes de publicar, desde tu cuenta personal o tu tienda.
          </p>
        </div>
        <div className="ai-assistant-benefits">
          <span>
            <Icon name="file" size={17} /> Descripción sugerida
          </span>
          <span>
            <Icon name="sparkles" size={17} /> Precio orientativo
          </span>
          <span>
            <Icon name="check" size={17} /> Vos revisás y decidís
          </span>
        </div>
        <ScrollScene>
          <SpotlightCard className="glass-panel ai-demo-shell">
            <p className="demo-caption">
              <Icon name="sparkles" size={15} /> Así te ayuda la IA · Animación con datos y precios
              de ejemplo
            </p>
            <AITasadorDemo />
          </SpotlightCard>
        </ScrollScene>
      </div>
    </section>
  );
}
