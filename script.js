'use strict';

/* ── NAV SCROLL ── */
const navHeader = document.getElementById('nav-header');
window.addEventListener('scroll', () => {
  navHeader.classList.toggle('scrolled', window.scrollY > 12);
  const btt = document.getElementById('back-to-top');
  if (btt) btt.classList.toggle('visible', window.scrollY > 400);
}, { passive: true });

/* ── HAMBURGER ── */
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('nav-links');
hamburger?.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  const s = hamburger.querySelectorAll('span');
  s[0].style.transform = open ? 'translateY(6.5px) rotate(45deg)' : '';
  s[1].style.opacity   = open ? '0' : '';
  s[2].style.transform = open ? 'translateY(-6.5px) rotate(-45deg)' : '';
});
navLinks?.querySelectorAll('a').forEach(l => l.addEventListener('click', () => {
  navLinks.classList.remove('open');
  hamburger.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
}));

/* ── SMOOTH SCROLL ── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - 72, behavior: 'smooth' });
    }
  });
});

/* ── REVEAL ON SCROLL ── */
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 80);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

['.feat-card', '.step-card', '.plan-card', '.about-mission-card',
 '.about-vision-card', '.about-stat', '.ci-item', '.contact-form', '.pillar']
  .forEach(sel => document.querySelectorAll(sel).forEach(el => {
    el.classList.add('reveal');
    revealObserver.observe(el);
  }));

/* ── COUNTER ANIMATION ── */
const counterObserver = new IntersectionObserver(entries => {
  if (entries.some(e => e.isIntersecting)) { animateCounters(); counterObserver.disconnect(); }
}, { threshold: 0.5 });
const trustRow = document.querySelector('.hero-trust');
if (trustRow) counterObserver.observe(trustRow);

function animateCounters() {
  document.querySelectorAll('[data-target]').forEach(el => {
    const target = parseInt(el.dataset.target, 10);
    const t0 = performance.now();
    const tick = now => {
      const p = Math.min((now - t0) / 1600, 1);
      el.textContent = Math.round((1 - Math.pow(1 - p, 3)) * target).toLocaleString('es-BO');
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  });
}

/* ── BILLING TOGGLE ── */
const billingBtn   = document.getElementById('billing-toggle-btn');
const billingLabel = document.getElementById('billing-toggle-label');
let isAnnual = false;
billingBtn?.addEventListener('click', () => {
  isAnnual = !isAnnual;
  billingLabel.textContent = isAnnual ? 'Ver precios mensuales' : 'Ver precios anuales — Ahorra un 20%';
  document.querySelectorAll('.plan-amount[data-monthly]').forEach(el => {
    animatePrice(el, parseInt(isAnnual ? el.dataset.annual : el.dataset.monthly, 10));
  });
});
function animatePrice(el, target) {
  const from = parseInt(el.textContent.replace(/\D/g,''), 10) || 0;
  const t0 = performance.now();
  const tick = now => {
    const p = Math.min((now - t0) / 350, 1);
    el.textContent = Math.round(from + (target - from) * (1 - Math.pow(1 - p, 2)));
    if (p < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}


/* ==========================================================
   AI DEMO — REAL IMAGE UPLOAD + SCAN + PRICE + CHARS
   ========================================================== */

const demoDatabase = {
  laptop: {
    name: 'Laptop ASUS VivoBook 15',
    category: 'Laptop',
    condition: 'Buen estado',
    priceBase: 4200,
    priceMin: 3600,
    priceMax: 4900,
    range: 'Bs. 3.600 — Bs. 4.900',
    chars: [
      { key: 'Procesador',   val: 'Intel Core i5-1235U' },
      { key: 'RAM',          val: '16 GB DDR4' },
      { key: 'Almacenamiento', val: '512 GB SSD NVMe' },
      { key: 'Pantalla',     val: '15.6" Full HD' },
      { key: 'GPU',          val: 'Intel Iris Xe' },
      { key: 'Sistema Op.',  val: 'Windows 11 Home' },
      { key: 'Bateria',      val: '~6 horas de uso real' },
    ]
  },
  phone: {
    name: 'iPhone 14 Pro 256GB',
    category: 'Celular',
    condition: 'Excelente estado',
    priceBase: 6300,
    priceMin: 5800,
    priceMax: 7200,
    range: 'Bs. 5.800 — Bs. 7.200',
    chars: [
      { key: 'Chip',        val: 'Apple A16 Bionic' },
      { key: 'Pantalla',    val: '6.1" OLED Super Retina' },
      { key: 'Camara',      val: '48 MP principal' },
      { key: 'Almacenamiento', val: '256 GB' },
      { key: 'RAM',         val: '6 GB' },
      { key: 'Bateria',     val: '3.200 mAh · MagSafe' },
      { key: 'Conectividad', val: '5G + Wi-Fi 6' },
    ]
  },
  gpu: {
    name: 'NVIDIA RTX 4060 Ti 8GB',
    category: 'Componente',
    condition: 'Usado · Buen estado',
    priceBase: 2900,
    priceMin: 2400,
    priceMax: 3300,
    range: 'Bs. 2.400 — Bs. 3.300',
    chars: [
      { key: 'Memoria',      val: '8 GB GDDR6' },
      { key: 'Bus',          val: '128-bit' },
      { key: 'CUDA Cores',   val: '4.352' },
      { key: 'TDP',          val: '160W' },
      { key: 'Conector',     val: 'PCIe 4.0 x16' },
      { key: 'Tecnologia',   val: 'DLSS 3 · Ray Tracing' },
      { key: 'Salidas',      val: '3x DP 1.4 + HDMI 2.1' },
    ]
  },
  tablet: {
    name: 'iPad Air 5 Wi-Fi 256GB',
    category: 'Tablet',
    condition: 'Como nuevo',
    priceBase: 5100,
    priceMin: 4600,
    priceMax: 5700,
    range: 'Bs. 4.600 — Bs. 5.700',
    chars: [
      { key: 'Chip',        val: 'Apple M1' },
      { key: 'Pantalla',    val: '10.9" Liquid Retina' },
      { key: 'Almacenamiento', val: '256 GB' },
      { key: 'RAM',         val: '8 GB' },
      { key: 'Camara',      val: '12 MP trasera · 12 MP frontal' },
      { key: 'Conectividad', val: 'Wi-Fi 6 · Bluetooth 5' },
      { key: 'Bateria',     val: '~10 horas de uso' },
    ]
  },
};

// Placeholders for user-uploaded image
const genericDemoData = {
  name: 'Producto Tecnologico Detectado',
  category: 'Electronico',
  condition: 'Buen estado',
  priceBase: 3500,
  priceMin: 2800,
  priceMax: 4200,
  range: 'Bs. 2.800 — Bs. 4.200',
  chars: [
    { key: 'Marca',          val: 'Detectada por IA' },
    { key: 'Modelo',         val: 'Verificado' },
    { key: 'Estado',         val: 'Buen estado' },
    { key: 'Tipo',           val: 'Electronico' },
    { key: 'Garantia',       val: 'Consultar con vendedor' },
  ]
};

let currentPrice   = 0;
let currentPriceMin = 0;
let currentPriceMax = 0;
let currentImageSrc = '';

/* FILE INPUT change */
const aiFileInput = document.getElementById('ai-file-input');
aiFileInput?.addEventListener('change', e => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = evt => {
    currentImageSrc = evt.target.result;
    startScan(currentImageSrc, null);
  };
  reader.readAsDataURL(file);
  aiFileInput.value = '';
});

/* Also trigger on clicking the auz-btn inside auz-idle */
document.querySelectorAll('.auz-btn').forEach(btn => {
  btn.addEventListener('click', e => {
    e.stopPropagation();
    aiFileInput?.click();
  });
});

/* EXAMPLE BUTTONS */
document.querySelectorAll('.ex-btn').forEach(btn => {
  btn.addEventListener('click', e => {
    e.stopPropagation();
    const demoKey = btn.dataset.demo;
    // Use a small colored placeholder image for demo
    const canvas = document.createElement('canvas');
    canvas.width = 300; canvas.height = 300;
    const ctx = canvas.getContext('2d');
    const colors = { laptop:'#1c2e4a', phone:'#1c1c2e', gpu:'#1c2e1c', tablet:'#2e1c1c' };
    ctx.fillStyle = colors[demoKey] || '#1c1c2e';
    ctx.fillRect(0,0,300,300);
    ctx.fillStyle = 'rgba(255,255,255,0.06)';
    for (let i=0; i<6; i++) { ctx.fillRect(i*50,0,25,300); }
    ctx.fillStyle = 'rgba(255,255,255,0.12)';
    ctx.font = 'bold 22px Inter, sans-serif';
    ctx.textAlign = 'center';
    const labels = { laptop:'LAPTOP', phone:'CELULAR', gpu:'GPU', tablet:'TABLET' };
    ctx.fillText(labels[demoKey] || 'PRODUCTO', 150, 155);
    currentImageSrc = canvas.toDataURL();
    startScan(currentImageSrc, demoKey);
  });
});

/* CLICK on auz-idle area (but not on buttons) */
document.getElementById('auz-idle')?.addEventListener('click', e => {
  if (!e.target.closest('.auz-btn') && !e.target.closest('.ex-btn') && !e.target.closest('.auz-examples')) {
    aiFileInput?.click();
  }
});

function startScan(imageSrc, demoKey) {
  const idle     = document.getElementById('auz-idle');
  const scanning = document.getElementById('auz-scanning');
  const scanImg  = document.getElementById('scan-preview-img');
  const scanStatus = document.getElementById('scan-status');
  const arpPlaceholder = document.getElementById('arp-placeholder');
  const arpContent = document.getElementById('arp-content');

  // Show scanning
  idle.style.display     = 'none';
  scanning.style.display = 'flex';
  scanImg.src = imageSrc;

  const statuses = [
    'Detectando producto...',
    'Analizando marca y modelo...',
    'Consultando precios del mercado boliviano...',
    'Generando descripcion automatica...',
    'Calculo completado.',
  ];
  let si = 0;
  const statusInterval = setInterval(() => {
    si = Math.min(si + 1, statuses.length - 1);
    if (scanStatus) scanStatus.textContent = statuses[si];
  }, 700);

  setTimeout(() => {
    clearInterval(statusInterval);
    // Get data
    const data = demoKey ? (demoDatabase[demoKey] || genericDemoData) : genericDemoData;
    showResult(imageSrc, data);
    // Hide scanning
    scanning.style.display = 'none';
  }, 3500);
}

function showResult(imageSrc, data) {
  const arpPlaceholder = document.getElementById('arp-placeholder');
  const arpContent     = document.getElementById('arp-content');
  const arpImg         = document.getElementById('arp-img');
  const arpCat         = document.getElementById('arp-category');
  const arpName        = document.getElementById('arp-name');
  const arpCond        = document.getElementById('arp-condition');
  const rangeEl        = document.getElementById('pcb-range');
  const charsList      = document.getElementById('chars-list');
  const priceValueEl   = document.getElementById('price-value');

  // Setup state
  currentPrice    = data.priceBase;
  currentPriceMin = data.priceMin;
  currentPriceMax = data.priceMax;

  // Fill product header
  if (arpImg)  arpImg.src = imageSrc;
  if (arpCat)  arpCat.textContent  = data.category;
  if (arpName) arpName.textContent = data.name;
  if (arpCond) arpCond.textContent = data.condition;

  // Price
  if (priceValueEl) priceValueEl.textContent = currentPrice.toLocaleString('es-BO');
  if (rangeEl) rangeEl.textContent = 'Rango de mercado: ' + data.range;
  updateMeter();

  // Chars list — animate one by one
  if (charsList) {
    charsList.innerHTML = '';
    data.chars.forEach((c, i) => {
      const li = document.createElement('li');
      li.innerHTML = `<span class="ch-key">${c.key}</span><span class="ch-val">${c.val}</span>`;
      li.style.opacity = '0';
      li.style.transform = 'translateX(8px)';
      li.style.transition = `opacity 0.3s ease ${i * 80}ms, transform 0.3s ease ${i * 80}ms`;
      charsList.appendChild(li);
      requestAnimationFrame(() => requestAnimationFrame(() => {
        li.style.opacity = '1';
        li.style.transform = 'translateX(0)';
      }));
    });
  }

  // Show content
  if (arpPlaceholder) arpPlaceholder.style.display = 'none';
  if (arpContent) {
    arpContent.style.display = 'flex';
    arpContent.style.animation = 'fadeUp 0.4s cubic-bezier(0.16,1,0.3,1) both';
  }
}

function updateMeter() {
  const bar = document.getElementById('pcb-meter-bar');
  const priceValueEl = document.getElementById('price-value');
  if (!bar) return;
  const range = currentPriceMax - currentPriceMin;
  const pct   = range > 0 ? Math.max(0, Math.min(1, (currentPrice - currentPriceMin) / range)) : 0.5;
  bar.style.left = `${pct * 100}%`;
  if (priceValueEl) priceValueEl.textContent = currentPrice.toLocaleString('es-BO');
}

/* Price up/down buttons */
const PRICE_STEP = 50;
document.getElementById('price-up')?.addEventListener('click', () => {
  if (currentPrice === 0) return;
  currentPrice = Math.min(currentPriceMax + 500, currentPrice + PRICE_STEP);
  updateMeter();
  animatePriceJump();
});
document.getElementById('price-down')?.addEventListener('click', () => {
  if (currentPrice === 0) return;
  currentPrice = Math.max(Math.floor(currentPriceMin * 0.7), currentPrice - PRICE_STEP);
  updateMeter();
  animatePriceJump();
});

function animatePriceJump() {
  const v = document.getElementById('price-value');
  if (!v) return;
  v.style.transform = 'scale(1.08)';
  setTimeout(() => { v.style.transform = ''; }, 150);
}

function resetAIDemo() {
  const idle     = document.getElementById('auz-idle');
  const scanning = document.getElementById('auz-scanning');
  const arpPlaceholder = document.getElementById('arp-placeholder');
  const arpContent = document.getElementById('arp-content');

  if (idle)     idle.style.display     = '';
  if (scanning) scanning.style.display = 'none';
  if (arpPlaceholder) arpPlaceholder.style.display = '';
  if (arpContent)     arpContent.style.display     = 'none';

  currentPrice = 0;
  const pv = document.getElementById('price-value');
  if (pv) pv.textContent = '0';
}


/* ── FORM ── */
function submitForm(e) {
  e.preventDefault();
  const btn     = document.getElementById('cf-submit');
  const success = document.getElementById('form-success');
  btn.textContent = 'Enviando...';
  btn.disabled = true;
  btn.style.opacity = '0.65';
  setTimeout(() => {
    btn.style.display = 'none';
    success.style.display = 'block';
    e.target.reset();
    setTimeout(() => {
      btn.textContent = 'Enviar mensaje';
      btn.disabled = false;
      btn.style.opacity = '';
      btn.style.display = '';
      success.style.display = 'none';
    }, 5000);
  }, 1400);
}

/* ── PHONE TILT ── */
const phone = document.getElementById('hero-phone');
const phoneWrap = phone?.parentElement;
phoneWrap?.addEventListener('mousemove', e => {
  const r = phoneWrap.getBoundingClientRect();
  const x = (e.clientX - r.left) / r.width  - 0.5;
  const y = (e.clientY - r.top)  / r.height - 0.5;
  phone.style.transform = `perspective(700px) rotateY(${x * 7}deg) rotateX(${-y * 5}deg)`;
});
phoneWrap?.addEventListener('mouseleave', () => {
  phone.style.transition = 'transform 0.5s cubic-bezier(0.16,1,0.3,1)';
  phone.style.transform  = '';
  setTimeout(() => { if (phone) phone.style.transition = ''; }, 500);
});

/* ── ACTIVE NAV ── */
document.head.insertAdjacentHTML('beforeend', '<style>.nav-link.active{color:var(--blue)!important;}</style>');
document.querySelectorAll('section[id]').forEach(s => {
  new IntersectionObserver(entries => {
    if (entries[0].isIntersecting)
      document.querySelectorAll('.nav-link').forEach(l =>
        l.classList.toggle('active', l.getAttribute('href') === `#${s.id}`)
      );
  }, { threshold: 0.4 }).observe(s);
});

console.log('%cTechMatch Bolivia', 'color:#0071e3;font-size:1.4rem;font-weight:800;font-family:system-ui');
