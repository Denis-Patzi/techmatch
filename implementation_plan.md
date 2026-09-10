# TechMatch Bolivia — Migración a React + Vite + Tailwind + Framer Motion

Migración y refactorización de la landing page monolítica (`index.html` + `styles.css` + `script.js`) hacia un proyecto moderno basado en componentes usando **React 18 + Vite + Tailwind CSS v3 + Framer Motion**, siguiendo el patrón de Atomic Design y los principios ISBC solicitados.

---

## User Review Required

> [!IMPORTANT]
> **Modo visual**: El proyecto actual usa una paleta **Light Mode** (fondo blanco `#ffffff`, texto oscuro `#1d1d1f`). La solicitud pide migrar a **Dark Mode** con azul marino `#0A192F`, cian neón y verde esmeralda. Esto implica un **cambio visual total de identidad**. ¿Confirmás esta dirección?

> [!WARNING]
> **React Bits**: La librería oficial de *React Bits* (react-bits.dev) es una colección de componentes visuales de código abierto basados en Framer Motion. Sus componentes más relevantes para este proyecto (Spotlight Card, Magnetic Button, Text Animations) se copian directamente al proyecto como código fuente, **no se instalan via npm**. El plan contempla esta arquitectura de "copy-paste components".

> [!NOTE]
> **Scope de la migración**: El plan cubre la landing page completa. El Simulador de Tasador por IA (la lógica más compleja) se migrará íntegramente a React con `useState`, `useEffect` y animaciones Framer Motion.

---

## Open Questions

> [!IMPORTANT]
> **¿Querés crear el proyecto nuevo dentro del directorio actual** (`TechMatchv2/`) o en una **nueva carpeta hermana** como `TechMatchv2-react/`? La opción recomendada es nueva carpeta para no alterar el código legacy.

> [!IMPORTANT]
> **¿Querés incluir React Router** para preparar la arquitectura para múltiples páginas (ej: `/planes`, `/productos`)? Actualmente todo es single-page con scroll.

---

## Proposed Changes

### 1. Scaffolding del Proyecto (Vite + React + Tailwind)

#### [NEW] Estructura de carpetas sugerida

```
techmatch-react/
├── public/
│   ├── phone_mockup.png
│   ├── appstore.png
│   ├── playstore.png
│   └── logo.png
├── src/
│   ├── main.jsx                        # Entry point React
│   ├── App.jsx                         # Root: ensambla secciones
│   │
│   ├── components/
│   │   │
│   │   ├── atoms/                      # Átomos (unidades base)
│   │   │   ├── Button.jsx              # CTA primario con efecto magnético
│   │   │   ├── Badge.jsx               # Badges de estado (IA, Verificado, Match%)
│   │   │   ├── SectionLabel.jsx        # Eyebrow label uppercase (reutilizable)
│   │   │   ├── StatCounter.jsx         # Contador animado (8.500 usuarios, etc.)
│   │   │   └── PlanFeatureItem.jsx     # Ítem de lista de plan (✓/✗ + texto)
│   │   │
│   │   ├── molecules/                  # Moléculas (combinaciones de átomos)
│   │   │   ├── NavBrand.jsx            # Logo + nombre + "Bolivia"
│   │   │   ├── MiniProductCard.jsx     # Tarjeta mini del feed personalizado
│   │   │   ├── PriceAdjuster.jsx       # Control +/- de precio con meter bar
│   │   │   ├── StepCard.jsx            # Tarjeta "01 Crea tu cuenta" con conector
│   │   │   ├── PlanCard.jsx            # Tarjeta de plan (props: name, price, features[])
│   │   │   ├── ContactInfoItem.jsx     # Ícono + label + valor de contacto
│   │   │   └── PhoneBadge.jsx          # Badge flotante sobre el mockup
│   │   │
│   │   └── organisms/                  # Organismos (secciones completas)
│   │       ├── Navbar.jsx              # Navegación fija + hamburger + scroll-aware
│   │       ├── HeroSection.jsx         # Hero: título, CTA, mockup, trust stats
│   │       ├── FeaturesSection.jsx     # Grid de features + AI Demo grande
│   │       │   └── AITasadorDemo.jsx   # Simulador IA (estado React + Framer Motion)
│   │       ├── HowItWorksSection.jsx   # 3 pasos con conectores
│   │       ├── AboutSection.jsx        # Misión, visión, pilares
│   │       ├── PlansSection.jsx        # 3 planes + toggle mensual/anual
│   │       ├── DownloadSection.jsx     # Badges App Store / Play Store
│   │       ├── ContactSection.jsx      # Form de contacto con validación React
│   │       └── Footer.jsx              # Footer completo
│   │
│   ├── data/
│   │   ├── aiDemoDatabase.js           # Datos del simulador (laptop, phone, gpu, tablet)
│   │   ├── plansData.js                # Datos de los 3 planes
│   │   └── navLinks.js                 # Links de navegación
│   │
│   ├── hooks/
│   │   ├── useScrollSpy.js             # Hook: detecta sección activa para el nav
│   │   ├── useScrollAware.js           # Hook: scrolled bool para el nav
│   │   └── useCountUp.js              # Hook: animación de contadores
│   │
│   ├── lib/
│   │   └── reactbits/                  # Componentes copiados de React Bits
│   │       ├── SpotlightCard.jsx       # Tarjeta con spotlight de cursor (feat cards)
│   │       ├── MagneticButton.jsx      # Botón con efecto magnético (CTA hero)
│   │       └── AnimatedText.jsx        # Texto con entrada animada (títulos hero)
│   │
│   └── index.css                       # @tailwind directives + variables CSS custom
│
├── tailwind.config.js                  # Paleta dark mode personalizada
├── vite.config.js
└── package.json
```

---

### 2. Configuración de Tailwind (Dark Mode + Paleta TechMatch)

#### [MODIFY] `tailwind.config.js`

Extensión de la paleta con los tokens de diseño de TechMatch en modo oscuro:

```js
// tailwind.config.js
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        navy:    { DEFAULT: '#0A192F', light: '#112240', lighter: '#1d3557' },
        cyan:    { DEFAULT: '#64FFDA', dim: 'rgba(100,255,218,0.1)', dark: '#0d9488' },
        emerald: { DEFAULT: '#00B4D8', glow: 'rgba(0,180,216,0.2)' },
        slate:   { body: '#8892B0', muted: '#495670' },
        blue:    { brand: '#0071e3', hover: '#0077ed' },
        indigo:  { brand: '#5e5ce6' },
      },
      fontFamily: {
        sans:    ['Inter', 'system-ui', 'sans-serif'],
        display: ['Space Grotesk', 'Inter', 'sans-serif'],
      },
      animation: {
        'phone-float':  'phoneFloat 5s ease-in-out infinite',
        'badge-float1': 'badgeFloat1 4s ease-in-out infinite',
        'badge-float2': 'badgeFloat2 4.5s ease-in-out infinite',
        'pulse-dot':    'pulseDot 2s infinite',
        'scan-line':    'scanLine 1.5s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
```

---

### 3. Atoms

#### [NEW] `Button.jsx`
- Props: `children`, `variant` (`primary` | `outline` | `ghost`), `href`, `onClick`, `className`
- Implementa el efecto **Magnetic** de React Bits usando `useRef` + `framer-motion`'s `useMotionValue` + `useSpring`
- Clases Tailwind para gradiente azul, shadow glow, hover lift

#### [NEW] `StatCounter.jsx`
- Props: `target`, `label`, `suffix?` (ej. `+`)
- Usa `useCountUp` hook custom + `framer-motion`'s `useInView` para disparar la animación

#### [NEW] `Badge.jsx`
- Props: `text`, `variant` (`ai` | `verified` | `success` | `warning`)
- Pequeña píldora con punto pulsante opcional

---

### 4. Molecules

#### [NEW] `PlanCard.jsx`
Props completamente dinámicas:
```jsx
<PlanCard
  name="Personal Pro"
  priceMonthly={99}
  priceAnnual={79}
  tagline="Para personas que venden seguido..."
  limitChip="Catálogo ampliado ilimitado"
  features={[
    { text: 'Todo lo del plan Básico', included: true },
    { text: 'Perfil de tienda oficial', included: false },
    // ...
  ]}
  cta="Activar Personal Pro"
  variant="personal"  // 'free' | 'personal' | 'business'
  isAnnual={false}    // controlado por PlansSection
/>
```

#### [NEW] `PriceAdjuster.jsx`
- Acepta `price`, `priceMin`, `priceMax`, `onPriceChange`
- Renderiza los botones +/- y la barra de progreso
- Animación de escala con `motion.span` de Framer Motion al cambiar el precio

---

### 5. Organisms

#### [NEW] `AITasadorDemo.jsx` (El componente más complejo)

Estado React migrado completamente desde el `script.js` legacy:

```jsx
// Estado declarativo con useState
const [phase, setPhase]           = useState('idle');       // 'idle' | 'scanning' | 'result'
const [scanStatus, setScanStatus] = useState('Detectando producto...');
const [imageSrc, setImageSrc]     = useState('');
const [demoData, setDemoData]     = useState(null);
const [price, setPrice]           = useState(0);

// Lógica de escaneo con useEffect
useEffect(() => {
  if (phase !== 'scanning') return;
  const statuses = ['Detectando...', 'Analizando marca...', 'Consultando precios...', 'Completado.'];
  let i = 0;
  const interval = setInterval(() => {
    setScanStatus(statuses[Math.min(++i, statuses.length - 1)]);
  }, 700);
  const timeout = setTimeout(() => {
    clearInterval(interval);
    setPhase('result');
  }, 3500);
  return () => { clearInterval(interval); clearTimeout(timeout); };
}, [phase]);
```

Transiciones entre estados con `AnimatePresence` + `motion.div`:
```jsx
<AnimatePresence mode="wait">
  {phase === 'idle'     && <IdleUploadZone key="idle" />}
  {phase === 'scanning' && <ScanningState key="scan" status={scanStatus} />}
  {phase === 'result'   && <ResultPanel   key="result" data={demoData} />}
</AnimatePresence>
```

#### [NEW] `Navbar.jsx`
- `useScrollAware` hook → aplica clase glassmorphism cuando `scrollY > 12`
- `useScrollSpy` hook → resalta el link activo del nav
- Estado `menuOpen` con `useState` → controla menú hamburguesa
- `motion.div` para la apertura del menú mobile

#### [NEW] `PlansSection.jsx`
- Estado `isAnnual` con `useState`
- Pasa `isAnnual` como prop a cada `PlanCard`
- Transición de precio con `motion.span` + `useMotionValue`

#### [NEW] `ContactSection.jsx`
- Estado del formulario: `formData`, `status` (`idle` | `sending` | `success`)
- `motion.div` para la animación del mensaje de éxito
- Validación básica sin librerías externas

---

### 6. React Bits Components (`src/lib/reactbits/`)

#### [NEW] `SpotlightCard.jsx`
Se aplica a las `feat-card` (Features Section). El componente rastreará la posición del mouse con `useMotionValue` y aplicará un spotlight radial sobre la tarjeta usando CSS custom properties, tal como lo hace React Bits.

#### [NEW] `MagneticButton.jsx`
Aplica a los CTA principales (Hero, Nav CTA). Usa `useRef` + `useSpring` de Framer Motion para que el botón siga magnéticamente el cursor del usuario dentro de un radio configurable.

#### [NEW] `AnimatedText.jsx`
Aplica al `hero-title`. Divide el texto en palabras y las anima con `staggerChildren` de Framer Motion para una entrada en cascada.

---

### 7. Data Layer (`src/data/`)

#### [NEW] `aiDemoDatabase.js`
Exporta el objeto `demoDatabase` del `script.js` legacy como un módulo ES6 tipado.

#### [NEW] `plansData.js`
```js
export const plans = [
  { id: 'free',     name: 'Básico',       priceMonthly: 0,   priceAnnual: 0,   ... },
  { id: 'personal', name: 'Personal Pro', priceMonthly: 99,  priceAnnual: 79,  ... },
  { id: 'business', name: 'Negocio',      priceMonthly: 249, priceAnnual: 199, ... },
];
```

---

### 8. Custom Hooks (`src/hooks/`)

| Hook | Descripción | Reemplaza |
|---|---|---|
| `useScrollAware(threshold)` | Retorna `boolean` si scrollY > threshold | Listener `scroll` en `script.js:5` |
| `useScrollSpy(sectionIds)` | Retorna el id de la sección activa | `IntersectionObserver` en `script.js:428` |
| `useCountUp(target, inView)` | Anima un número de 0 a target | `animateCounters()` en `script.js:61` |
| `useReveal()` | Retorna `ref` + variantes de Framer Motion | `revealObserver` en `script.js:38` |

---

## Verificación del Plan

### Setup Inicial
```bash
npm create vite@latest techmatch-react -- --template react
cd techmatch-react
npm install framer-motion
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

### Automated Tests
- `npm run dev` → verificar que el servidor corra sin errores en `localhost:5173`
- `npm run build` → verificar que el build de producción complete sin warnings críticos

### Manual Verification
- [ ] **Nav**: Scroll activa glassmorphism, link activo resaltado, hamburger funciona mobile
- [ ] **Hero**: Animación de texto en cascada, tilt del mockup con mouse, contadores animados
- [ ] **AI Demo**: Los 4 botones de ejemplo (Laptop, Celular, GPU, Tablet) disparan el flujo completo idle → scanning → result
- [ ] **Precio +/-**: Los botones ajustan el precio y la barra de posición se mueve fluidamente
- [ ] **Planes**: Toggle mensual/anual cambia precios con animación
- [ ] **Formulario**: Envío muestra estado "Enviando..." y luego mensaje de éxito
- [ ] **Spotlight Cards**: El efecto de cursor sobre las feat-cards funciona correctamente
- [ ] **Magnetic Button**: El CTA del hero sigue el cursor magnéticamente
- [ ] **Responsive**: Verificar breakpoints en mobile (375px) y tablet (768px)
