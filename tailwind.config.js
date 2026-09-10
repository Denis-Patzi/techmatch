/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      /*
       * Colores basados en CSS custom properties con formato R G B
       * (sin prefijo --tw- para evitar conflictos con variables internas de Tailwind)
       * Sintaxis: rgb(var(--c-xxx) / <alpha-value>)
       * Esto permite que bg-navy/10, border-cyan/20, etc. funcionen con opacidad.
       */
      colors: {
        navy: {
          DEFAULT: 'rgb(var(--c-navy) / <alpha-value>)',
          light: 'rgb(var(--c-navy-light) / <alpha-value>)',
          lighter: 'rgb(var(--c-navy-lighter) / <alpha-value>)',
        },
        slate: {
          body: 'rgb(var(--c-slate-body) / <alpha-value>)',
          sub: 'rgb(var(--c-slate-sub) / <alpha-value>)',
          muted: 'rgb(var(--c-slate-muted) / <alpha-value>)',
        },
        brand: {
          blue: 'rgb(var(--c-brand-blue) / <alpha-value>)',
          purple: 'rgb(var(--c-brand-purple) / <alpha-value>)',
          cyan: 'rgb(var(--c-brand-cyan) / <alpha-value>)',
          neon: 'rgb(var(--c-brand-neon) / <alpha-value>)',
        },
        cyan: {
          DEFAULT: 'rgb(var(--c-cyan) / <alpha-value>)',
        }
      },
      fontFamily: {
        sans: ['Outfit', 'sans-serif'],
        display: ['Outfit', 'sans-serif'],
      },
      animation: {
        'phone-float':  'phoneFloat 5s ease-in-out infinite',
        'badge-float1': 'badgeFloat1 4s ease-in-out infinite',
        'badge-float2': 'badgeFloat2 4.5s ease-in-out infinite',
        'pulse-dot':    'pulseDot 2s ease-in-out infinite',
        'scroll-pulse': 'scrollPulse 2s ease-in-out infinite',
        'fade-up':      'fadeUp 0.6s cubic-bezier(0.16,1,0.3,1) both',
      },
      keyframes: {
        phoneFloat:   { '0%,100%': { transform: 'translateY(0)' },        '50%': { transform: 'translateY(-14px)' } },
        badgeFloat1:  { '0%,100%': { transform: 'translateY(0)' },        '50%': { transform: 'translateY(-6px)' } },
        badgeFloat2:  { '0%,100%': { transform: 'translateY(0)' },        '50%': { transform: 'translateY(6px)' } },
        pulseDot:     { '0%,100%': { opacity: '1', transform: 'scale(1)' },'50%': { opacity: '0.3', transform: 'scale(0.75)' } },
        scrollPulse:  { '0%,100%': { opacity: '0.3' }, '50%': { opacity: '0.9' } },
        fadeUp:       { from: { opacity: '0', transform: 'translateY(20px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
      },
      boxShadow: {
        'navy-sm':   '0 2px 14px rgba(0,0,0,0.25)',
        'navy-md':   '0 8px 32px rgba(0,0,0,0.3)',
        'navy-lg':   '0 20px 60px rgba(0,0,0,0.4)',
        'cyan-glow': '0 0 24px rgba(100,255,218,0.2)',
        'blue-glow': '0 4px 20px rgba(0,113,227,0.35)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
};
