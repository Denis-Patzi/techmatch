// Catálogo comercial del PDF de planes. Vista informativa, sin activar suscripciones.
const feature = (text, included = true) => ({ text, included });
export const plans = [
  {
    id: 'free',
    name: 'Gratis',
    priceMonthly: 0,
    accountTypes: ['personal', 'store'],
    audience: 'Para personas y tiendas',
    tagline: 'Empezá a publicar sin costo.',
    variant: 'free',
    limits: { activeListings: 10 },
    limitChip: '10 publicaciones activas',
    features: [
      feature('10 publicaciones activas'),
      feature('Destacados y anuncios incluidos', false),
      feature('Estadísticas de publicaciones', false),
      feature('Catálogo de productos', false),
      feature('Equipo de tienda', false),
    ],
  },
  {
    id: 'personal',
    name: 'Vendedor individual',
    priceMonthly: 60,
    accountTypes: ['personal'],
    audience: 'Para cuentas personales',
    tagline: 'Más publicaciones y visibilidad para tus productos.',
    variant: 'personal',
    limits: { activeListings: 40 },
    limitChip: '40 publicaciones activas',
    features: [
      feature('40 publicaciones activas · duración de 1 mes'),
      feature('2 destacados durante todo el periodo'),
      feature('1 anuncio en inicio durante todo el periodo'),
      feature('Cambiar el producto destacado o anunciado'),
      feature('Estadísticas de tus publicaciones'),
      feature('Catálogo de productos'),
      feature('Equipo de tienda', false),
    ],
  },
  {
    id: 'business',
    name: 'Tienda',
    priceMonthly: 240,
    accountTypes: ['store'],
    audience: 'Para cuentas de tienda',
    tagline: 'Un catálogo amplio y un equipo para tu negocio.',
    variant: 'business',
    featured: true,
    limits: { activeListings: 200 },
    limitChip: '200 publicaciones activas',
    features: [
      feature('200 publicaciones activas · duración de 1 mes'),
      feature('10 destacados durante todo el periodo'),
      feature('3 anuncios en inicio durante todo el periodo'),
      feature('Cambiar el producto destacado o anunciado'),
      feature('Estadísticas de tus publicaciones'),
      feature('Catálogo de productos'),
      feature('Equipo: 1 administrador + 3 vendedores'),
    ],
  },
  {
    id: 'custom',
    name: 'Custom',
    priceMonthly: null,
    accountTypes: ['personal', 'store'],
    audience: 'Para personas y tiendas',
    tagline: 'Elegí la capacidad, visibilidad y duración que necesitás.',
    variant: 'personal',
    limitChip: 'A tu medida · de 1 a 12 meses',
    features: [
      feature('Publicaciones, destacados y anuncios a elección'),
      feature('Cambiar el producto destacado o anunciado'),
      feature('Estadísticas y catálogo de productos'),
      feature('Equipo a elección, solo para tiendas'),
      feature('3 meses: 10% de descuento'),
      feature('6 meses: 15% de descuento'),
      feature('12 meses: 20% de descuento'),
    ],
  },
];
export const customPrices = [
  { label: 'Paquete de 10 publicaciones', price: 12 },
  { label: '1 destacado todo el mes', price: 36 },
  { label: '1 anuncio todo el mes', price: 96 },
  { label: '1 vendedor de tienda adicional', price: 24, storeOnly: true },
];
export const promotionPrices = [
  { label: 'Destacado', daily: 5, weekly: 13, monthly: 43 },
  { label: 'Anuncio', daily: 14, weekly: 34, monthly: 115 },
];
export function getPlansForAccount(accountType) {
  return plans.filter((plan) => plan.accountTypes.includes(accountType));
}
