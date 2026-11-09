// Product definition. Quotas must be enforced by the database when publishing is connected.
// priceAnnual is the monthly equivalent with annual billing; it is not the annual total.
const definitions = [
  {
    id: 'free',
    name: 'Básico',
    priceMonthly: 0,
    priceAnnual: 0,
    accountTypes: ['personal', 'store'],
    audience: 'Para personas y tiendas',
    tagline: 'Tu primer catálogo, con fotos y videos para empezar a vender.',
    variant: 'free',
    limits: {
      activeListings: 25,
      videosPerMonth: 5,
      videoDurationSeconds: 60,
      photosPerListing: 5,
      activeAuctions: 1,
    },
    extraFeatures: [],
  },
  {
    id: 'personal',
    name: 'Personal Pro',
    priceMonthly: 99,
    priceAnnual: 79,
    accountTypes: ['personal'],
    audience: 'Para cuentas personales',
    tagline: 'Más espacio para quienes publican y venden con frecuencia.',
    variant: 'personal',
    limits: {
      activeListings: 100,
      videosPerMonth: 30,
      videoDurationSeconds: 90,
      photosPerListing: 10,
      activeAuctions: 5,
    },
    extraFeatures: ['Estadísticas de tus publicaciones'],
  },
  {
    id: 'business',
    name: 'Tienda Pro',
    priceMonthly: 249,
    priceAnnual: 199,
    accountTypes: ['store'],
    audience: 'Para cuentas de tienda',
    tagline: 'Un catálogo más amplio y más contenido para mostrar tu negocio.',
    variant: 'business',
    featured: true,
    limits: {
      activeListings: 500,
      videosPerMonth: 100,
      videoDurationSeconds: 120,
      photosPerListing: 15,
      activeAuctions: 20,
    },
    extraFeatures: ['Perfil de tienda con logo y portada', 'Estadísticas de tu catálogo'],
  },
];

export const plans = definitions.map(({ extraFeatures, ...plan }) => ({
  ...plan,
  annualTotal: plan.priceAnnual * 12,
  limitChip: `${plan.limits.activeListings} productos · ${plan.limits.videosPerMonth} videos al mes`,
  cta: plan.id === 'free' ? 'Crear cuenta gratis' : 'Crear mi cuenta',
  features: [
    `${plan.limits.activeListings} productos activos en tu catálogo`,
    `${plan.limits.videosPerMonth} videos al mes · hasta ${plan.limits.videoDurationSeconds} s`,
    `Hasta ${plan.limits.photosPerListing} fotos por publicación`,
    `${plan.limits.activeAuctions} ${plan.limits.activeAuctions === 1 ? 'subasta activa' : 'subastas activas'}`,
    'Descripción y precio sugeridos con IA',
    'Feed, catálogo y chat',
    ...extraFeatures,
  ].map((text) => ({ text, included: true })),
}));

export function getPlansForAccount(accountType) {
  return plans.filter((plan) => plan.accountTypes.includes(accountType));
}
