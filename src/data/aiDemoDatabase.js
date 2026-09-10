/* ─────────────────────────────────────────────────────────────
   AI DEMO DATABASE — TechMatch Bolivia
   Base de datos de productos de ejemplo para el Tasador por IA
   ───────────────────────────────────────────────────────────── */

export const demoDatabase = {
  laptop: {
    name: 'Laptop ASUS VivoBook 15',
    category: 'Laptop',
    condition: 'Buen estado',
    priceBase: 4200,
    priceMin: 3600,
    priceMax: 4900,
    range: 'Bs. 3.600 — Bs. 4.900',
    chars: [
      { key: 'Procesador',     val: 'Intel Core i5-1235U' },
      { key: 'RAM',            val: '16 GB DDR4' },
      { key: 'Almacenamiento', val: '512 GB SSD NVMe' },
      { key: 'Pantalla',       val: '15.6" Full HD IPS' },
      { key: 'GPU',            val: 'Intel Iris Xe Graphics' },
      { key: 'Sistema Op.',    val: 'Windows 11 Home' },
      { key: 'Batería',        val: '~6 horas de uso real' },
    ],
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
      { key: 'Chip',          val: 'Apple A16 Bionic' },
      { key: 'Pantalla',      val: '6.1" OLED Super Retina XDR' },
      { key: 'Cámara',        val: '48 MP principal + Ultra Wide' },
      { key: 'Almacenamiento', val: '256 GB' },
      { key: 'RAM',           val: '6 GB' },
      { key: 'Batería',       val: '3.200 mAh · MagSafe compatible' },
      { key: 'Conectividad',  val: '5G + Wi-Fi 6 + Bluetooth 5.3' },
    ],
  },
  gpu: {
    name: 'NVIDIA RTX 4060 Ti 8GB',
    category: 'Componente GPU',
    condition: 'Usado · Buen estado',
    priceBase: 2900,
    priceMin: 2400,
    priceMax: 3300,
    range: 'Bs. 2.400 — Bs. 3.300',
    chars: [
      { key: 'Memoria',    val: '8 GB GDDR6' },
      { key: 'Bus',        val: '128-bit' },
      { key: 'CUDA Cores', val: '4.352' },
      { key: 'TDP',        val: '160W' },
      { key: 'Conector',   val: 'PCIe 4.0 x16' },
      { key: 'Tecnología', val: 'DLSS 3 · Ray Tracing Gen 3' },
      { key: 'Salidas',    val: '3× DisplayPort 1.4 + HDMI 2.1' },
    ],
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
      { key: 'Chip',          val: 'Apple M1' },
      { key: 'Pantalla',      val: '10.9" Liquid Retina' },
      { key: 'Almacenamiento', val: '256 GB' },
      { key: 'RAM',           val: '8 GB unificada' },
      { key: 'Cámara',        val: '12 MP trasera · 12 MP frontal Ultra Wide' },
      { key: 'Conectividad',  val: 'Wi-Fi 6 · Bluetooth 5.0' },
      { key: 'Batería',       val: '~10 horas de uso continuo' },
    ],
  },
};

export const genericDemoData = {
  name: 'Producto Tecnológico Detectado',
  category: 'Electrónico',
  condition: 'Buen estado',
  priceBase: 3500,
  priceMin: 2800,
  priceMax: 4200,
  range: 'Bs. 2.800 — Bs. 4.200',
  chars: [
    { key: 'Marca',    val: 'Detectada por IA' },
    { key: 'Modelo',   val: 'Verificado' },
    { key: 'Estado',   val: 'Buen estado general' },
    { key: 'Tipo',     val: 'Electrónico' },
    { key: 'Garantía', val: 'Consultar con el vendedor' },
  ],
};

/** Genera una imagen canvas placeholder para los ejemplos de demo */
export function generateDemoCanvas(demoKey) {
  const canvas = document.createElement('canvas');
  canvas.width = 300; canvas.height = 300;
  const ctx = canvas.getContext('2d');
  const colors = { laptop: '#0d2137', phone: '#0d1124', gpu: '#0d2114', tablet: '#24100d' };
  ctx.fillStyle = colors[demoKey] || '#0d1124';
  ctx.fillRect(0, 0, 300, 300);
  ctx.fillStyle = 'rgba(100,255,218,0.04)';
  for (let i = 0; i < 6; i++) ctx.fillRect(i * 50, 0, 25, 300);
  ctx.fillStyle = 'rgba(100,255,218,0.2)';
  ctx.font = 'bold 20px Inter, sans-serif';
  ctx.textAlign = 'center';
  const labels = { laptop: 'LAPTOP', phone: 'CELULAR', gpu: 'GPU', tablet: 'TABLET' };
  ctx.fillText(labels[demoKey] || 'PRODUCTO', 150, 155);
  return canvas.toDataURL();
}
