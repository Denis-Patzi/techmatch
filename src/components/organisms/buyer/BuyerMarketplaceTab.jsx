import { useState } from 'react';
import { Icon } from '@/components/atoms/Icon';

const PRODUCTS = [
  {
    id: 1,
    title: 'Laptop Lenovo Legion 5',
    price: 7500,
    location: 'Santa Cruz',
    condition: 'Como nuevo',
    seller: 'Carlos M.',
    category: 'laptops',
    icon: 'laptop',
    detail: 'Gaming · RTX · 16 GB RAM',
  },
  {
    id: 2,
    title: 'Monitor Gigabyte G24F',
    price: 1200,
    location: 'La Paz',
    condition: 'Nuevo sellado',
    seller: 'Electro Import',
    category: 'components',
    icon: 'grid',
    detail: '24 pulgadas · Full HD · IPS',
  },
  {
    id: 3,
    title: 'Mouse Logitech G Pro X',
    price: 850,
    location: 'Cochabamba',
    condition: 'Usado',
    seller: 'Ana P.',
    category: 'accessories',
    icon: 'cpu',
    detail: 'Inalámbrico · Superlight',
  },
  {
    id: 4,
    title: 'Tarjeta Gráfica RTX 3060 Ti',
    price: 2800,
    location: 'Santa Cruz',
    condition: 'Usado',
    seller: 'Juan Perez',
    category: 'components',
    icon: 'cpu',
    detail: 'NVIDIA GeForce · 8 GB',
  },
];
const CATEGORIES = [
  { id: 'all', label: 'Explorar todo' },
  { id: 'laptops', label: 'Laptops' },
  { id: 'components', label: 'Componentes' },
  { id: 'phones', label: 'Celulares' },
  { id: 'accessories', label: 'Periféricos' },
];

export default function BuyerMarketplaceTab() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [favorites, setFavorites] = useState([]);
  const products = PRODUCTS.filter(
    (product) =>
      (category === 'all' || product.category === category) &&
      `${product.title} ${product.location}`
        .toLocaleLowerCase('es')
        .includes(search.toLocaleLowerCase('es'))
  );
  const toggleFavorite = (id) =>
    setFavorites((previous) =>
      previous.includes(id) ? previous.filter((item) => item !== id) : [...previous, id]
    );

  return (
    <div>
      <div className="glass-panel workspace-welcome">
        <div>
          <span className="eyebrow">Tu próximo gran match</span>
          <h1>Encontrá tu próxima tecnología.</h1>
          <p>
            Explorá equipos, compará posibilidades y descubrí lo que puede acompañarte en tu próximo
            proyecto.
          </p>
        </div>
        <div className="bare-icon hidden lg:grid place-items-center w-24 h-24 text-cyan shrink-0">
          <Icon name="cpu" size={46} />
        </div>
      </div>
      <div className="flex items-center gap-4 mb-5">
        <div className="relative flex-1">
          <label htmlFor="market-search" className="sr-only">
            Buscar productos o ciudades
          </label>
          <Icon
            name="search"
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-muted"
          />
          <input
            id="market-search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="¿Qué estás buscando hoy?"
            className="w-full py-3.5 pl-12 pr-4 border border-cyan/15 rounded-2xl text-sm text-slate-body outline-none focus:border-cyan"
          />
        </div>
        <span className="hidden sm:block text-xs text-slate-muted whitespace-nowrap">
          Colección de muestra
        </span>
      </div>
      <div className="flex gap-2 overflow-x-auto pb-3 mb-5 no-scrollbar" aria-label="Categorías">
        {CATEGORIES.map((item) => (
          <button
            key={item.id}
            onClick={() => setCategory(item.id)}
            aria-pressed={category === item.id}
            className={`px-4 py-2 rounded-full text-xs whitespace-nowrap border transition-colors ${category === item.id ? 'bg-cyan/10 border-cyan/25 text-cyan' : 'border-cyan/10 text-slate-sub hover:bg-cyan/5'}`}
          >
            {item.label}
          </button>
        ))}
      </div>
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-medium tracking-tight">Descubrí nuevas posibilidades</h2>
        <span className="text-xs text-slate-muted" aria-live="polite">
          {products.length} productos
        </span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
        {products.map((product) => (
          <article key={product.id} className="glass-panel overflow-hidden group">
            <div className="relative h-48 m-3 rounded-[20px] overflow-hidden flex items-center justify-center bg-gradient-to-br from-cyan/10 via-navy-lighter/40 to-brand-blue/15">
              <div
                className="absolute inset-5 border border-cyan/10 rounded-full"
                aria-hidden="true"
              />
              <Icon
                name={product.icon}
                size={82}
                className="text-cyan/60 relative group-hover:scale-105 transition-transform duration-300"
              />
              <button
                onClick={() => toggleFavorite(product.id)}
                aria-label={`${favorites.includes(product.id) ? 'Quitar de' : 'Agregar a'} favoritos: ${product.title}`}
                aria-pressed={favorites.includes(product.id)}
                className="absolute right-3 top-3 icon-button !w-8 !h-8"
              >
                <Icon
                  name="heart"
                  size={16}
                  className={favorites.includes(product.id) ? 'text-cyan fill-cyan/20' : ''}
                />
              </button>
              <span className="absolute bottom-3 left-3 bg-navy-light/85 backdrop-blur-md text-slate-sub rounded-full text-[.6rem] px-3 py-1">
                {product.condition}
              </span>
            </div>
            <div className="px-5 pb-5">
              <p className="text-[.65rem] text-slate-muted mb-1">{product.detail}</p>
              <h3 className="font-medium text-[.95rem] tracking-tight mb-2">{product.title}</h3>
              <p className="text-xl font-medium text-cyan tracking-tight mb-4">
                Bs. {product.price.toLocaleString('es-BO')}
              </p>
              <div className="flex items-center justify-between text-[.65rem] text-slate-muted border-t border-cyan/10 pt-3 gap-2">
                <span className="flex items-center gap-1">
                  <Icon name="pin" size={12} />
                  {product.location}
                </span>
                <span>{product.seller}</span>
              </div>
            </div>
          </article>
        ))}
      </div>
      {products.length === 0 && (
        <div className="glass-panel empty-state">
          <Icon name="search" size={32} />
          <h2 className="text-xl font-medium mb-2">Todavía no hay un match por acá.</h2>
          <p>Probá otra búsqueda o explorá todas las categorías.</p>
          <button
            className="btn-secondary"
            onClick={() => {
              setSearch('');
              setCategory('all');
            }}
          >
            Ver todos los productos
          </button>
        </div>
      )}
    </div>
  );
}
