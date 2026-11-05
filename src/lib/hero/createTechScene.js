import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { createTechModels } from './techModels';

/** Lazy-loaded WebGL scene shared by the three reviewable hero concepts. */
export function createTechScene(container, { variant, isDark, onContextLost }) {
  const resources = new Set();
  const own = (value) => {
    resources.add(value);
    return value;
  };
  const renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true,
    powerPreference: 'low-power',
  });
  renderer.setPixelRatio(Math.min(devicePixelRatio, innerWidth < 768 ? 1.25 : 1.6));
  renderer.setClearColor(0x000000, 0);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;
  renderer.domElement.setAttribute('aria-hidden', 'true');
  renderer.domElement.addEventListener('webglcontextlost', onContextLost);
  container.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 60);
  camera.position.set(0, 1.0, 10.4);
  camera.lookAt(0, 0.05, 0);
  const pmrem = new THREE.PMREMGenerator(renderer);
  const room = new RoomEnvironment();
  const environment = pmrem.fromScene(room, 0.04);
  scene.environment = environment.texture;
  room.dispose();
  pmrem.dispose();
  const world = new THREE.Group();
  scene.add(world);
  scene.add(new THREE.HemisphereLight('#c4e9ff', '#243d79', 2.6));
  const key = new THREE.DirectionalLight('#e5f7ff', 3.4);
  key.position.set(-4, 6, 6);
  scene.add(key);
  const rim = new THREE.DirectionalLight('#1f72ff', 5);
  rim.position.set(5, 2, -3);
  scene.add(rim);

  const dotCanvas = document.createElement('canvas');
  dotCanvas.width = dotCanvas.height = 64;
  const context = dotCanvas.getContext('2d');
  const gradient = context.createRadialGradient(32, 32, 0, 32, 32, 32);
  gradient.addColorStop(0, '#ffffff');
  gradient.addColorStop(0.2, '#ffffff');
  gradient.addColorStop(0.5, '#ffffff88');
  gradient.addColorStop(1, '#ffffff00');
  context.fillStyle = gradient;
  context.fillRect(0, 0, 64, 64);
  const sprite = own(new THREE.CanvasTexture(dotCanvas));
  const models = createTechModels(resources);
  const solidDevices = [models.laptop(), models.phone(), models.headphones(), models.processor()];
  if (variant === 'orbita') solidDevices.push(models.ram());
  const devices =
    variant === 'particulas'
      ? solidDevices.map((model) => models.asParticles(model, sprite, isDark))
      : solidDevices;
  const poses = [
    { position: [0, 0.05, 0.1], scale: 1, rotation: [0.02, -0.2, -0.06] },
    { position: [-2.35, 0.12, 1.05], scale: 1.05, rotation: [0.1, 0.35, -0.18] },
    { position: [2.22, 1.02, -0.2], scale: 1.08, rotation: [0.1, -0.4, 0.16] },
    { position: [1.72, -1.45, 1.1], scale: 1.12, rotation: [0.4, 0.25, -0.15] },
    { position: [-1.65, -1.43, 0.85], scale: 1.05, rotation: [0.15, 0.1, 0.18] },
  ];
  devices.forEach((device, index) => {
    device.position.set(...poses[index].position);
    device.rotation.set(...poses[index].rotation);
    device.scale.setScalar(poses[index].scale);
    world.add(device);
  });

  const rings = [];
  function ring(radius, color, opacity, rotation, z = -0.8, arc = Math.PI * 2) {
    const material = own(
      new THREE.MeshBasicMaterial({
        color,
        transparent: true,
        opacity,
        depthWrite: false,
        toneMapped: false,
      })
    );
    const mesh = new THREE.Mesh(own(new THREE.TorusGeometry(radius, 0.012, 6, 150, arc)), material);
    mesh.rotation.set(...rotation);
    mesh.position.z = z;
    world.add(mesh);
    rings.push(mesh);
    return mesh;
  }
  if (variant === 'portal') {
    for (let i = 0; i < 5; i++)
      ring(
        2.65 + i * 0.2,
        i % 2 ? '#4ccfff' : '#307aff',
        0.78 - i * 0.12,
        [0.12 * i, -0.09 * i, i * 0.4],
        -1.4 - i * 0.18,
        Math.PI * 1.85
      );
    const halo = new THREE.Sprite(
      own(
        new THREE.SpriteMaterial({
          map: sprite,
          color: '#217bff',
          transparent: true,
          opacity: isDark ? 0.28 : 0.14,
          depthWrite: false,
          blending: THREE.AdditiveBlending,
        })
      )
    );
    halo.position.set(0, 0, -2.2);
    halo.scale.set(8, 8, 1);
    world.add(halo);
  } else {
    ring(3.12, '#278aff', 0.57, [1.03, 0.18, -0.27]);
    ring(3.38, '#46bfff', 0.24, [1.15, -0.13, -0.1]);
    ring(2.95, '#4e9dff', 0.4, [0.92, 0.3, 0.12], -0.8, Math.PI * 0.62);
  }

  const points = [],
    pointColors = [];
  const count = variant === 'particulas' ? 650 : 320;
  for (let i = 0; i < count; i++) {
    const angle = i * 2.39996;
    const radius = 2.7 + ((i % 17) / 17) * 1.35;
    points.push(
      Math.cos(angle) * radius,
      Math.sin(angle) * radius * 0.78,
      Math.sin(i * 1.7) * 2.4 - 1
    );
    const color = new THREE.Color(i % 5 === 0 ? '#5fcfff' : '#3185f5');
    pointColors.push(color.r, color.g, color.b);
  }
  const particleGeometry = own(new THREE.BufferGeometry());
  particleGeometry.setAttribute('position', new THREE.Float32BufferAttribute(points, 3));
  particleGeometry.setAttribute('color', new THREE.Float32BufferAttribute(pointColors, 3));
  const particleMaterial = own(
    new THREE.PointsMaterial({
      size: variant === 'particulas' ? 0.055 : 0.045,
      map: sprite,
      vertexColors: true,
      transparent: true,
      opacity: isDark ? 0.75 : 0.65,
      depthWrite: false,
      toneMapped: false,
    })
  );
  const stars = new THREE.Points(particleGeometry, particleMaterial);
  world.add(stars);
  const satellites = [];
  for (let i = 0; i < 7; i++) {
    const glow = new THREE.Sprite(
      own(
        new THREE.SpriteMaterial({
          map: sprite,
          color: i % 2 ? '#62d9ff' : '#2a7dff',
          transparent: true,
          opacity: 0.85,
          depthWrite: false,
          toneMapped: false,
        })
      )
    );
    glow.scale.setScalar(i % 3 === 0 ? 0.18 : 0.11);
    world.add(glow);
    satellites.push(glow);
  }

  let running = false,
    frame = 0,
    elapsed = 0,
    previousTime = 0,
    disposed = false;
  const pointer = new THREE.Vector2();
  const targetPointer = new THREE.Vector2();
  const pointerSensitivity = variant === 'orbita' ? 1.25 : 1;
  const pointerSmoothing = variant === 'orbita' ? 0.07 : 0.055;
  let scroll = 0;

  function render(time = 0) {
    if (disposed) return;
    if (running && previousTime) elapsed += Math.min((time - previousTime) / 1000, 0.05);
    previousTime = time;
    pointer.lerp(targetPointer, pointerSmoothing);
    world.rotation.y = pointer.x * 0.2 * pointerSensitivity + scroll * 0.16;
    world.rotation.x = -pointer.y * 0.13 * pointerSensitivity + scroll * 0.08;
    stars.rotation.y = elapsed * 0.035;
    stars.rotation.z = Math.sin(elapsed * 0.15) * 0.055;
    devices.forEach((device, index) => {
      const base = poses[index];
      device.position.y =
        base.position[1] +
        Math.sin(elapsed * (0.6 + index * 0.08) + index * 1.4) * (index ? 0.2 : 0.1);
      device.position.x = base.position[0] + (index ? Math.sin(elapsed * 0.27 + index) * 0.13 : 0);
      device.rotation.y =
        base.rotation[1] + Math.sin(elapsed * 0.35 + index) * (index === 3 ? 0.7 : 0.22);
      device.rotation.z = base.rotation[2] + Math.sin(elapsed * 0.4 + index) * 0.045;
      if (variant === 'portal' && index) {
        const phase = elapsed * 0.28 + index * 2.1;
        device.position.x = Math.cos(phase) * 2.55;
        device.position.y = Math.sin(phase) * 1.95;
        device.position.z = 0.4 + Math.sin(phase + 0.8) * 0.8;
      }
    });
    rings.forEach((item, index) => {
      item.rotation.z += running ? (index % 2 ? -0.0012 : 0.0015) : 0;
    });
    satellites.forEach((glow, index) => {
      const phase = elapsed * (0.45 + index * 0.025) + (index * Math.PI * 2) / satellites.length;
      glow.position.set(
        Math.cos(phase) * 3.12,
        Math.sin(phase) * 1.6,
        Math.sin(phase) * 1.8 - 0.65
      );
    });
    renderer.render(scene, camera);
    if (running) frame = requestAnimationFrame(render);
  }

  const resize = () => {
    const { width, height } = container.getBoundingClientRect();
    if (!width || !height) return;
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.position.z = camera.aspect < 1 ? 12.3 : 10.4;
    camera.updateProjectionMatrix();
    if (!running) render();
  };
  const observer = new ResizeObserver(resize);
  observer.observe(container);
  resize();

  return {
    setRunning(value) {
      if (disposed || running === value) return;
      running = value;
      cancelAnimationFrame(frame);
      previousTime = 0;
      if (running) frame = requestAnimationFrame(render);
      else render();
    },
    setPointer(x, y) {
      targetPointer.set(x, y);
    },
    setScroll(value) {
      scroll = value;
    },
    dispose() {
      if (disposed) return;
      disposed = true;
      running = false;
      cancelAnimationFrame(frame);
      observer.disconnect();
      renderer.domElement.removeEventListener('webglcontextlost', onContextLost);
      environment.dispose();
      resources.forEach((resource) => resource.dispose());
      renderer.dispose();
      if (!renderer.getContext().isContextLost()) renderer.forceContextLoss();
      renderer.domElement.remove();
    },
  };
}
