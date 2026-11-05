import { Link } from 'react-router-dom';
import { Icon } from '@/components/atoms/Icon';
import { NavBrand } from '@/components/molecules/NavBrand';
import { ScrollScene } from '@/components/molecules/ScrollScene';
import { ScrollBackdrop } from '@/components/molecules/ScrollBackdrop';

export function DownloadSection() {
  return (
    <section id="download" className="scene-section">
      <ScrollBackdrop image="/images/tech-circuits.webp" variant="circuits" />
      <div className="page-container">
        <div className="glass-panel liquid-glass download-panel">
          <div className="max-w-lg">
            <span className="eyebrow mb-5">Tu mundo tech, con vos</span>
            <h2 className="section-title">
              Buenas conexiones.
              <br />
              Desde cualquier pantalla.
            </h2>
            <p className="section-copy">
              Llevá TechMatch con vos. Encontrá tu próximo equipo y conectá con tu comunidad desde
              el navegador de tu celular.
            </p>
            <Link to="/signup" className="btn-primary mt-7">
              Empezar ahora
              <Icon name="arrow" size={17} />
            </Link>
            <div className="flex items-center gap-3 mt-6 text-xs text-slate-muted">
              <Icon name="phone" size={16} />
              <span>App para iOS y Android · Próximamente</span>
            </div>
          </div>
          <ScrollScene className="phone-scene" surfaceClassName="phone-preview" variant="phone">
            <span className="sr-only">Vista previa ilustrativa de TechMatch en un celular</span>
            <div className="phone-island" />
            <div className="flex justify-between items-center mb-6">
              <NavBrand />
              <Icon name="search" size={17} />
            </div>
            <p className="text-xs text-slate-muted">Hola, comunidad.</p>
            <h3 className="text-2xl font-medium tracking-tight leading-tight mt-1 mb-5">
              Tu próximo
              <br />
              <span className="text-cyan">gran match.</span>
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: 'laptop', name: 'Laptops' },
                { icon: 'cpu', name: 'Hardware' },
                { icon: 'phone', name: 'Celulares' },
                { icon: 'headphones', name: 'Audio' },
              ].map((item) => (
                <div key={item.name} className="rounded-2xl bg-cyan/5 border border-cyan/10 p-4">
                  <Icon name={item.icon} size={30} className="text-cyan mx-auto my-3" />
                  <p className="text-[.6rem] text-center text-slate-sub">{item.name}</p>
                </div>
              ))}
            </div>
            <div className="flex justify-around border-t border-cyan/10 pt-4 mt-5 text-cyan">
              <Icon name="grid" size={17} />
              <Icon name="heart" size={17} />
              <Icon name="chat" size={17} />
              <Icon name="user" size={17} />
            </div>
          </ScrollScene>
        </div>
      </div>
    </section>
  );
}
