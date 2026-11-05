import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { MeshSurfaceSampler } from 'three/addons/math/MeshSurfaceSampler.js';

/** Original, code-built devices; no external models or stock imagery. */
export function createTechModels(resources) {
  const own = (resource) => {
    resources.add(resource);
    return resource;
  };
  const metal = (color, roughness = 0.28) =>
    own(new THREE.MeshStandardMaterial({ color, metalness: 0.72, roughness }));
  const silver = metal('#b5cee6');
  const navy = metal('#14243c', 0.38);
  const black = metal('#071326', 0.45);
  const blue = metal('#246ef1');
  const light = own(new THREE.MeshBasicMaterial({ color: '#4eaaff', toneMapped: false }));
  const ice = own(new THREE.MeshBasicMaterial({ color: '#b4eaff', toneMapped: false }));
  const gold = metal('#bca575');

  function box(parent, size, position, material, radius = 0.04) {
    const geometry = own(
      new RoundedBoxGeometry(...size, 2, Math.min(radius, Math.min(...size) / 3))
    );
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(...position);
    parent.add(mesh);
    return mesh;
  }

  function ring(parent, radius, tube, position, material, arc = Math.PI * 2) {
    const mesh = new THREE.Mesh(own(new THREE.TorusGeometry(radius, tube, 8, 72, arc)), material);
    mesh.position.set(...position);
    parent.add(mesh);
    return mesh;
  }

  function displayTexture(phone = false) {
    const canvas = document.createElement('canvas');
    canvas.width = phone ? 240 : 768;
    canvas.height = phone ? 480 : 480;
    const ctx = canvas.getContext('2d');
    const w = canvas.width,
      h = canvas.height;
    ctx.fillStyle = '#061835';
    ctx.fillRect(0, 0, w, h);
    const glow = ctx.createRadialGradient(w * 0.7, h * 0.25, 0, w * 0.6, h * 0.35, h);
    glow.addColorStop(0, '#60dcff');
    glow.addColorStop(0.25, '#2b7cff');
    glow.addColorStop(0.63, '#254cd4');
    glow.addColorStop(1, '#081d4e');
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, w, h);
    for (let i = 0; i < 7; i++) {
      ctx.beginPath();
      ctx.ellipse(
        w * 0.48,
        h * 0.58,
        w * (0.3 + i * 0.045),
        h * (0.23 + i * 0.035),
        -0.5,
        0,
        Math.PI * 2
      );
      ctx.strokeStyle = `rgba(180,230,255,${0.45 - i * 0.055})`;
      ctx.lineWidth = phone ? 1.4 : 2.5;
      ctx.stroke();
    }
    ctx.fillStyle = '#e4f6ff';
    ctx.globalAlpha = 0.9;
    const tiles = phone ? 3 : 4;
    for (let i = 0; i < tiles; i++) {
      const x = phone ? 32 : 42 + i * 56;
      const y = phone ? 275 + i * 45 : 395;
      ctx.beginPath();
      ctx.roundRect(x, y, phone ? 176 : 36, phone ? 27 : 36, 9);
      ctx.fill();
    }
    const texture = own(new THREE.CanvasTexture(canvas));
    texture.colorSpace = THREE.SRGBColorSpace;
    return own(new THREE.MeshBasicMaterial({ map: texture, toneMapped: false }));
  }

  function laptop() {
    const group = new THREE.Group();
    box(group, [3.5, 2.15, 0.14], [0, 0.6, -0.47], silver, 0.11);
    box(group, [3.31, 1.94, 0.025], [0, 0.61, -0.385], black, 0.05);
    box(group, [3.18, 1.81, 0.012], [0, 0.62, -0.365], displayTexture(), 0.015);
    box(group, [3.7, 0.13, 2.1], [0, -0.55, 0.48], silver, 0.1);
    box(group, [3.15, 0.014, 0.87], [0, -0.474, 0.28], navy, 0.04);
    for (let row = 0; row < 4; row++)
      for (let col = 0; col < 12; col++) {
        box(
          group,
          [0.19, 0.018, 0.13],
          [-1.36 + col * 0.245, -0.455, -0.02 + row * 0.19],
          black,
          0.015
        );
      }
    box(group, [1.15, 0.012, 0.53], [0, -0.474, 1.05], navy, 0.045);
    box(group, [3.22, 0.018, 0.025], [0, -0.56, 1.53], light, 0.006);
    return group;
  }

  function phone() {
    const group = new THREE.Group();
    box(group, [0.91, 1.83, 0.16], [0, 0, 0], blue, 0.11);
    box(group, [0.84, 1.76, 0.025], [0, 0, 0.093], black, 0.09);
    box(group, [0.77, 1.67, 0.015], [0, 0, 0.112], displayTexture(true), 0.06);
    box(group, [0.28, 0.065, 0.015], [0, 0.73, 0.13], black, 0.02);
    box(group, [0.03, 0.25, 0.055], [0.47, 0.31, 0.015], silver, 0.01);
    return group;
  }

  function headphones() {
    const group = new THREE.Group();
    const band = ring(group, 0.69, 0.072, [0, 0.17, 0], silver, Math.PI * 1.28);
    band.rotation.z = -Math.PI * 0.14;
    const accent = ring(group, 0.69, 0.015, [0, 0.17, 0.07], light, Math.PI * 1.28);
    accent.rotation.z = band.rotation.z;
    for (const side of [-1, 1]) {
      box(group, [0.25, 0.68, 0.46], [side * 0.64, -0.3, 0], navy, 0.1);
      box(group, [0.12, 0.55, 0.37], [side * 0.46, -0.3, 0], black, 0.055);
      box(group, [0.025, 0.31, 0.1], [side * 0.78, -0.3, 0.14], light, 0.01);
    }
    return group;
  }

  function processor() {
    const group = new THREE.Group();
    box(group, [1.05, 0.13, 1.05], [0, 0, 0], blue);
    box(group, [0.84, 0.14, 0.84], [0, 0.13, 0], silver, 0.07);
    box(group, [0.42, 0.015, 0.42], [0, 0.21, 0], light, 0.025);
    box(group, [0.22, 0.019, 0.22], [0, 0.22, 0], ice, 0.02);
    for (let i = 0; i < 7; i++)
      for (const side of [-1, 1]) {
        const p = -0.39 + i * 0.13;
        box(group, [0.05, 0.1, 0.06], [p, -0.09, side * 0.43], gold, 0.008);
        box(group, [0.06, 0.1, 0.05], [side * 0.43, -0.09, p], gold, 0.008);
      }
    return group;
  }

  function ram() {
    const group = new THREE.Group();
    box(group, [1.95, 0.48, 0.07], [0, 0, 0], blue, 0.025);
    box(group, [1.86, 0.35, 0.09], [0, 0.045, 0.045], navy, 0.03);
    for (let i = 0; i < 8; i++) {
      box(group, [0.17, 0.2, 0.04], [-0.755 + i * 0.216, 0.035, 0.11], black, 0.015);
    }
    box(group, [1.81, 0.025, 0.035], [0, 0.247, 0.035], light, 0.008);
    box(group, [1.82, 0.02, 0.025], [0, -0.16, 0.1], silver, 0.006);
    for (let i = 0; i < 28; i++) {
      if (i === 14 || i === 15) continue;
      box(group, [0.047, 0.13, 0.025], [-0.89 + i * 0.066, -0.28, 0.015], gold, 0.004);
    }
    return group;
  }

  function asParticles(model, sprite, isDark) {
    const positions = [],
      colors = [];
    const point = new THREE.Vector3(),
      size = new THREE.Vector3();
    const edgeColor = new THREE.Color(isDark ? '#c0eeff' : '#0861d4');
    const group = new THREE.Group();
    model.updateMatrixWorld(true);
    model.traverse((mesh) => {
      if (!mesh.isMesh) return;
      mesh.geometry.computeBoundingBox();
      mesh.geometry.boundingBox.getSize(size);
      const count = Math.max(18, Math.min(1400, Math.round(size.lengthSq() * 115)));
      const sampler = new MeshSurfaceSampler(mesh).build();
      const tint = mesh.material.isMeshBasicMaterial
        ? new THREE.Color(isDark ? '#6bceff' : '#0969ec')
        : edgeColor;
      for (let i = 0; i < count; i++) {
        sampler.sample(point);
        point.applyMatrix4(mesh.matrixWorld);
        positions.push(point.x, point.y, point.z);
        colors.push(tint.r, tint.g, tint.b);
      }
      if (size.length() > 1.6) {
        const geometry = own(new THREE.EdgesGeometry(mesh.geometry, 15));
        const edges = new THREE.LineSegments(
          geometry,
          own(
            new THREE.LineBasicMaterial({
              color: '#2e88f0',
              transparent: true,
              opacity: isDark ? 0.6 : 0.43,
            })
          )
        );
        edges.applyMatrix4(mesh.matrixWorld);
        group.add(edges);
      }
    });
    const geometry = own(new THREE.BufferGeometry());
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    const material = own(
      new THREE.PointsMaterial({
        map: sprite,
        size: isDark ? 0.06 : 0.05,
        vertexColors: true,
        transparent: true,
        opacity: 0.95,
        depthWrite: false,
        blending: isDark ? THREE.AdditiveBlending : THREE.NormalBlending,
        toneMapped: false,
      })
    );
    group.add(new THREE.Points(geometry, material));
    return group;
  }

  return { laptop, phone, headphones, processor, ram, asParticles };
}
