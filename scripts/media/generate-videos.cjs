// Offline rendering only. Three.js and Playwright are not shipped to the website.
// Install them in a separate tools folder and set TECHMATCH_MEDIA_TOOLS to that folder.
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const http = require('node:http');
const { createRequire } = require('node:module');
const { spawn } = require('node:child_process');
const { once } = require('node:events');

const toolRequire = process.env.TECHMATCH_MEDIA_TOOLS
  ? createRequire(path.join(process.env.TECHMATCH_MEDIA_TOOLS, 'package.json'))
  : require;
const { chromium } = toolRequire('playwright');
const threeRoot = path.resolve(path.dirname(toolRequire.resolve('three')), '..');
const output = path.resolve(__dirname, '../../public/videos');
const preview = process.argv.includes('--preview');
const portrait = process.argv.includes('--portrait');
const port = 5197;
const fps = 24;
const duration = 8;

async function command(args) {
  // Respect the workspace's RTK shell convention for subprocesses as well.
  const child = spawn(
    'rtk',
    ['proxy', 'ffmpeg', '-hide_banner', '-loglevel', 'error', '-y', ...args],
    { stdio: 'inherit', windowsHide: true }
  );
  const [code] = await once(child, 'close');
  if (code !== 0) throw new Error(`ffmpeg exited with ${code}`);
}

(async () => {
  fs.mkdirSync(output, { recursive: true });
  const server = http.createServer((req, res) => {
    const url = new URL(req.url, `http://127.0.0.1:${port}`);
    const isThree = url.pathname.startsWith('/three/');
    const file = isThree
      ? path.resolve(threeRoot, url.pathname.slice(7))
      : path.join(__dirname, 'scenes.html');
    if (isThree && !file.startsWith(threeRoot + path.sep)) {
      res.writeHead(403);
      res.end();
      return;
    }
    if (!fs.existsSync(file)) {
      res.writeHead(404);
      res.end();
      return;
    }
    res.setHeader('Content-Type', file.endsWith('.html') ? 'text/html' : 'text/javascript');
    fs.createReadStream(file).pipe(res);
  });
  server.listen(port, '127.0.0.1');
  await once(server, 'listening');
  let browser;
  try {
    browser = await chromium.launch({
      channel: 'chrome',
      headless: true,
      args: ['--enable-unsafe-swiftshader'],
    });
    const page = await browser.newPage({
      viewport: portrait ? { width: 540, height: 960 } : { width: 960, height: 600 },
    });
    page.on('pageerror', (error) => console.error(error));
    for (const variant of portrait ? ['hardware'] : ['hardware', 'processor']) {
      const filename = `${variant}${portrait ? '-portrait' : ''}`;
      const frames = fs.mkdtempSync(path.join(os.tmpdir(), `techmatch-${variant}-`));
      await page.goto(
        `http://127.0.0.1:${port}/?scene=${variant}${portrait ? '&format=portrait' : ''}`
      );
      await page.waitForFunction(() => window.sceneReady);
      const frameCount = preview ? 1 : fps * duration;
      for (let i = 0; i < frameCount; i++) {
        const png = await page.evaluate((time) => window.renderFrame(time), i / fps);
        fs.writeFileSync(
          path.join(frames, `frame-${String(i).padStart(4, '0')}.png`),
          Buffer.from(png, 'base64')
        );
        if (i % 48 === 0) console.log(`${variant}: ${i}/${frameCount} frames`);
      }
      await command([
        '-i',
        path.join(frames, 'frame-0000.png'),
        '-frames:v',
        '1',
        '-c:v',
        'libwebp',
        '-quality',
        '88',
        path.join(output, `${filename}-poster.webp`),
      ]);
      if (!preview) {
        await command([
          '-framerate',
          String(fps),
          '-i',
          path.join(frames, 'frame-%04d.png'),
          '-an',
          '-c:v',
          'libx264',
          '-preset',
          'slow',
          '-crf',
          '23',
          '-pix_fmt',
          'yuv420p',
          '-movflags',
          '+faststart',
          path.join(output, `${filename}-loop.mp4`),
        ]);
        console.log(`${variant}: MP4 + poster ready`);
      }
      // Keep intermediate frames in OS temp for inspection; never delete arbitrary paths.
    }
  } finally {
    await browser?.close();
    server.close();
  }
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
