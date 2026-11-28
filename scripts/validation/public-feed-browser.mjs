// Browser fixtures only: no accounts, publications or messages are created remotely.
// node scripts/validation/public-feed-browser.mjs [Playwright module URL]
import assert from 'node:assert/strict';
import { readFile, mkdir } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
const { chromium } = await import(process.argv[2] || 'playwright');
const root = new URL('../../', import.meta.url);
const env = await readFile(new URL('.env', root), 'utf8');
const backend = env.match(/^VITE_SUPABASE_URL\s*=\s*["']?([^\s"']+)/m)?.[1];
assert.ok(backend, 'The configured Supabase URL is required.');
const videoFile = await readFile(
  new URL('public/videos/hardware-portrait-loop.mp4', root)
);
const sellerId = '00000000-0000-4000-8000-000000000001';
const buyerId = '00000000-0000-4000-8000-000000000099';
const fixtureUser = {
  id: buyerId,
  email: 'fixture@example.invalid',
  aud: 'authenticated',
  role: 'authenticated',
  user_metadata: {},
};
const fixtureSession = {
  access_token: `${Buffer.from('{}').toString('base64url')}.${Buffer.from(JSON.stringify({ sub: buyerId, exp: Math.floor(Date.now() / 1000) + 3600 })).toString('base64url')}.fixture`,
  refresh_token: 'fixture',
  token_type: 'bearer',
  expires_in: 3600,
  user: fixtureUser,
};
const fixtureProfile = {
  id: buyerId,
  full_name: 'Cuenta de prueba',
  role: 'buyer',
  account_type: 'personal',
  city: 'La Paz',
  is_verified: false,
  created_at: new Date().toISOString(),
};
const base = {
  owner_id: sellerId,
  description: 'Publicación real de prueba con características y precio.',
  price: 1500,
  category: 'Computación',
  condition: 'Usado',
  city: 'La Paz',
  listing_type: 'sale',
  status: 'published',
  cover_key: 'laptop',
  media_type: 'image',
  media_path: null,
  created_at: new Date().toISOString(),
};
const products = [
  {
    ...base,
    id: '00000000-0000-4000-8000-000000000010',
    title: 'Video del equipo',
    media_type: 'video',
    media_path: `${sellerId}/fixture.mp4`,
  },
  {
    ...base,
    id: '00000000-0000-4000-8000-000000000011',
    title: 'Laptop en venta',
  },
  {
    ...base,
    id: '00000000-0000-4000-8000-000000000012',
    title: 'Equipo en subasta',
    listing_type: 'auction',
    auction_duration_days: 3,
  },
];
const seller = {
  id: sellerId,
  display_name: 'Tienda de prueba',
  account_type: 'store',
  city: 'La Paz',
  is_verified: false,
};
const auction = {
  product_id: products[2].id,
  state: 'active',
  starts_at: new Date().toISOString(),
  ends_at: new Date(Date.now() + 86400000).toISOString(),
  server_now: new Date().toISOString(),
  current_price: 1500,
  minimum_bid: 1500,
  bid_count: 0,
};
const artifacts = join(
  tmpdir(),
  'techmatch-commerce-validation',
  'public-feed'
);
await mkdir(artifacts, { recursive: true });
const browser = await chromium.launch({ headless: true });
const contexts = [];
let checks = 0;
const errors = [];
async function test(name, run) {
  await run();
  checks++;
  console.log(`OK ${name}`);
}
async function screen(width, reducedMotion = 'reduce', options = {}) {
  const context = await browser.newContext({
    viewport: { width, height: 900 },
    reducedMotion,
  });
  contexts.push(context);
  let mode = 'products';
  let mediaFailure = Boolean(options.failMedia);
  let releaseMedia;
  const mediaGate = options.delayMedia
    ? new Promise((resolve) => {
        releaseMedia = resolve;
      })
    : Promise.resolve();
  const calls = [];
  await context.route(`${backend}/**`, async (route) => {
    const request = route.request();
    const path = new URL(request.url()).pathname;
    if (path.includes('/storage/')) {
      await mediaGate;
      return mediaFailure
        ? route.fulfill({ status: 404, body: 'Media unavailable fixture' })
        : route.fulfill({ contentType: 'video/mp4', body: videoFile });
    }
    const send = (data, status = 200) =>
      route.fulfill({
        status,
        contentType: 'application/json',
        headers: { 'access-control-allow-origin': '*' },
        body: JSON.stringify(data),
      });
    if (request.method() === 'OPTIONS') return send({});
    calls.push({ path, method: request.method() });
    if (options.allowLogin) {
      if (path === '/auth/v1/token') return send(fixtureSession);
      if (path === '/auth/v1/user') return send(fixtureUser);
      if (path === '/rest/v1/profiles') return send(fixtureProfile);
      if (path === '/rest/v1/products')
        return send(
          new URL(request.url()).searchParams.get('owner_id') ? [] : products
        );
      if (
        path === '/rest/v1/product_favorites' ||
        path === '/rest/v1/rpc/get_my_conversations'
      )
        return send([]);
      if (path === '/rest/v1/rpc/get_product_sellers') return send([seller]);
      if (path === '/rest/v1/rpc/get_auction_states') return send([auction]);
    }
    if (path === '/rest/v1/rpc/get_public_feed') {
      if (mode === 'error')
        return send(
          { code: 'PGRST202', message: 'Missing migration fixture' },
          404
        );
      const args = request.postDataJSON();
      const list =
        mode === 'empty'
          ? []
          : products.filter(
              (p) =>
                (!args.p_seller_id || p.owner_id === args.p_seller_id) &&
                (!args.p_product_id || p.id === args.p_product_id)
            );
      return send(
        list.map((product) => ({
          product,
          seller,
          auction: product.listing_type === 'auction' ? auction : null,
        }))
      );
    }
    // All other backend access during guest browsing is unexpected.
    return send({ message: 'Guests must only use the public read RPC.' }, 403);
  });
  const page = await context.newPage();
  page.setDefaultTimeout(12000);
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto(
    `http://127.0.0.1:5173/${options.startExplore ? '' : '?section=explore'}`,
    { waitUntil: 'domcontentloaded' }
  );
  if (options.startExplore)
    await page.locator('.public-explore-card').first().waitFor();
  else await page.locator('.market-feed-scroll').waitFor({ state: 'attached' });
  if (!options.delayMedia && !options.startExplore)
    await page.locator('.market-feed-layout[aria-busy="false"]').waitFor();
  return {
    page,
    calls,
    releaseMedia,
    mediaFailure: (value) => {
      mediaFailure = value;
    },
    mode: (value) => {
      mode = value;
    },
  };
}
const activeTitle = (page) =>
  page.locator('.market-feed-stage[data-active="true"] h2').innerText();
try {
  for (const width of [320, 390, 768, 1024, 1440]) {
    const visitor = await screen(width, 'reduce', { startExplore: true });
    const page = visitor.page;
    await test(`Visitors open Explore with complete cards and all categories at ${width}px`, async () => {
      await page
        .getByRole('heading', { name: 'Explorar', exact: true })
        .waitFor();
      assert.equal(await page.locator('.market-feed-scroll').count(), 0);
      const categories = page.getByRole('navigation', {
        name: 'Categorías de productos',
        exact: true,
      });
      assert.deepEqual(await categories.getByRole('button').allTextContents(), [
        'Todos',
        'Celulares',
        'Computación',
        'Audio',
        'Componentes',
        'Otros',
      ]);
      for (const light of [true, false]) {
        await page.evaluate(
          (value) => document.documentElement.classList.toggle('light', value),
          light
        );
        const layout = await page.evaluate(() => ({
          overflow: document.documentElement.scrollWidth > innerWidth,
          outside: [
            ...document.querySelectorAll(
              '.public-explore-card,.public-header-categories button'
            ),
          ].filter((el) => {
            const box = el.getBoundingClientRect();
            return box.left < -1 || box.right > innerWidth + 1;
          }).length,
        }));
        assert.equal(layout.overflow, false);
        assert.equal(layout.outside, 0);
      }
      await categories
        .getByRole('button', { name: 'Celulares', exact: true })
        .click();
      await page
        .getByText('Todavía no hay publicaciones aquí', { exact: true })
        .waitFor();
      await categories
        .getByRole('button', { name: 'Todos', exact: true })
        .click();
      await page.locator('.public-explore-card').first().waitFor();
      if (width >= 768) {
        assert.equal(
          await page
            .locator('.market-sidebar')
            .evaluate((el) => getComputedStyle(el).borderRadius),
          '0px'
        );
        const bounds = await page.locator('.market-sidebar').boundingBox();
        assert.equal(bounds.x, 0);
        assert.equal(bounds.y, 0);
        assert.equal(bounds.height, 900);
        await page
          .getByRole('button', { name: 'Contraer barra lateral', exact: true })
          .click();
        await page
          .getByRole('button', { name: 'Expandir barra lateral', exact: true })
          .click();
      }
      await page.screenshot({
        path: join(artifacts, `explore-checked-${width}.png`),
      });
      await page.getByRole('button', { name: 'Ingresar', exact: true }).click();
      const modal = page.getByRole('dialog', {
        name: 'Iniciar sesión',
        exact: true,
      });
      await modal.waitFor();
      assert.equal(await modal.locator('.login-option').count(), 5);
      assert.ok(
        (
          await modal
            .locator('.login-option')
            .evaluateAll((els) => els.map((el) => el.getAttribute('href')))
        ).every((href) => href === '/login')
      );
      const modalBounds = await modal.boundingBox();
      assert.ok(
        modalBounds.x >= 0 && modalBounds.x + modalBounds.width <= width
      );
      await page.keyboard.press('Escape');
      await modal.waitFor({ state: 'hidden' });
    });
    await page.close();
  }
  await test('QR, email, Facebook, Google and Apple all open the same email login without OAuth', async () => {
    const visitor = await screen(1440, 'reduce', { startExplore: true });
    for (const name of [
      'Usar código QR',
      'Usar correo electrónico',
      'Continuar con Facebook',
      'Continuar con Google',
      'Continuar con Apple',
    ]) {
      await visitor.page
        .getByRole('button', { name: 'Ingresar', exact: true })
        .click();
      await visitor.page
        .getByRole('dialog', { name: 'Iniciar sesión', exact: true })
        .getByRole('link', { name, exact: true })
        .click();
      await visitor.page.waitForURL('**/login');
      await visitor.page
        .getByLabel('Correo Electrónico', { exact: true })
        .waitFor();
      await visitor.page.getByLabel('Contraseña', { exact: true }).waitFor();
      await visitor.page
        .getByRole('dialog', { name: 'Iniciar sesión', exact: true })
        .waitFor();
      assert.equal(await visitor.page.locator('.auth-page').count(), 0);
      assert.ok(
        (await visitor.page.locator('.public-explore-card').count()) > 0
      );
      await visitor.page.goto('http://127.0.0.1:5173/', {
        waitUntil: 'domcontentloaded',
      });
      await visitor.page.locator('.public-explore-card').first().waitFor();
    }
    assert.ok(
      visitor.calls.every(
        (call) => call.path === '/rest/v1/rpc/get_public_feed'
      )
    );
    await visitor.page.close();
  });
  await test('Email sign-in and an existing session both open Para ti', async () => {
    const signed = await screen(1440, 'reduce', {
      startExplore: true,
      allowLogin: true,
    });
    const page = signed.page;
    await page.getByRole('button', { name: 'Ingresar', exact: true }).click();
    await page
      .getByRole('link', { name: 'Continuar con Google', exact: true })
      .click();
    await page
      .getByLabel('Correo Electrónico', { exact: true })
      .fill('fixture@example.invalid');
    await page.getByLabel('Contraseña', { exact: true }).fill('Example123!');
    await page.getByRole('button', { name: 'Continuar', exact: true }).click();
    await page.waitForURL('**/app');
    await page.locator('.market-feed-layout[aria-busy="false"]').waitFor();
    assert.equal(await page.locator('.market-public-page').count(), 0);
    assert.equal(
      await page
        .getByRole('navigation', { name: 'Navegación principal', exact: true })
        .getByRole('button', { name: 'Para ti', exact: true })
        .getAttribute('aria-current'),
      'page'
    );
    const publicReads = signed.calls.filter((call) =>
      call.path.endsWith('/get_public_feed')
    ).length;
    await page.goto('http://127.0.0.1:5173/');
    await page.locator('.market-feed-layout[aria-busy="false"]').waitFor();
    assert.equal(
      signed.calls.filter((call) => call.path.endsWith('/get_public_feed'))
        .length,
      publicReads
    );
    assert.equal(await page.locator('.market-public-page').count(), 0);
    await page.close();
  });
  await test('Reference email modal validates fields, reveals passwords, returns to methods and closes to Explore', async () => {
    const visitor = await screen(1440, 'reduce', { startExplore: true });
    const page = visitor.page;
    await page.getByRole('button', { name: 'Ingresar', exact: true }).click();
    const originalDialog = await page.getByRole('dialog').elementHandle();
    const originalBackground = await page
      .locator('.public-explore')
      .elementHandle();
    await page
      .getByRole('link', { name: 'Usar correo electrónico', exact: true })
      .click();
    const modal = page.getByRole('dialog', {
      name: 'Iniciar sesión',
      exact: true,
    });
    await modal.waitFor();
    assert.equal(
      await originalDialog.evaluate(
        (el) => el === document.querySelector('[role="dialog"]')
      ),
      true
    );
    assert.equal(
      await originalBackground.evaluate(
        (el) => el === document.querySelector('.public-explore')
      ),
      true
    );
    const submit = modal.getByRole('button', {
      name: 'Continuar',
      exact: true,
    });
    assert.equal(await submit.isDisabled(), true);
    await page.mouse.click(5, 5);
    assert.equal(await modal.isVisible(), true);
    await page.getByLabel('Correo Electrónico', { exact: true }).click();
    await page
      .getByLabel('Correo Electrónico', { exact: true })
      .pressSequentially('fixture@example.invalid', { delay: 30 });
    assert.equal(await submit.isDisabled(), true);
    await page.getByLabel('Contraseña', { exact: true }).click();
    await page
      .getByLabel('Contraseña', { exact: true })
      .pressSequentially('Example123!', { delay: 30 });
    assert.equal(new URL(page.url()).pathname, '/login');
    assert.equal(await modal.isVisible(), true);
    await submit.waitFor();
    await page.waitForFunction(
      () => !document.querySelector('.social-login-submit').disabled
    );
    await modal
      .getByRole('button', { name: 'Mostrar contraseña', exact: true })
      .click();
    assert.equal(
      await page.getByLabel('Contraseña', { exact: true }).getAttribute('type'),
      'text'
    );
    await modal
      .getByRole('button', { name: 'Ocultar contraseña', exact: true })
      .click();
    assert.equal(
      await page.getByLabel('Contraseña', { exact: true }).getAttribute('type'),
      'password'
    );
    assert.equal(
      await modal
        .getByRole('button', { name: 'Teléfono', exact: true })
        .isDisabled(),
      true
    );
    assert.equal(
      await modal.evaluate((el) => getComputedStyle(el).color),
      await modal.evaluate(
        (el) =>
          'rgb(' +
          getComputedStyle(el)
            .getPropertyValue('--c-slate-body')
            .trim()
            .split(/\s+/)
            .join(', ') +
          ')'
      )
    );
    await page.screenshot({ path: join(artifacts, 'email-login-desktop.png') });
    await modal
      .getByRole('button', {
        name: 'Volver a las opciones de acceso',
        exact: true,
      })
      .click();
    await page.waitForURL('http://127.0.0.1:5173/');
    await page
      .getByRole('link', { name: 'Usar código QR', exact: true })
      .waitFor();
    await page
      .getByRole('link', { name: 'Continuar con Apple', exact: true })
      .click();
    await page.getByLabel('Correo Electrónico', { exact: true }).waitFor();
    for (const [width, height] of [
      [390, 844],
      [320, 568],
    ]) {
      await page.setViewportSize({ width, height });
      const box = await page
        .getByRole('dialog', { name: 'Iniciar sesión', exact: true })
        .boundingBox();
      assert.ok(box.x >= 0 && box.x + box.width <= width);
      assert.ok(box.y >= 0 && box.y + box.height <= height);
      assert.equal(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth
        ),
        true
      );
      await page.screenshot({
        path: join(artifacts, `email-login-${width}.png`),
      });
    }
    await page.keyboard.press('Escape');
    await page.waitForURL('http://127.0.0.1:5173/');
    await page.getByRole('dialog').waitFor({ state: 'hidden' });
    assert.equal(await page.getByRole('dialog').count(), 0);
    await page
      .getByRole('heading', { name: 'Explorar', exact: true })
      .waitFor();
    await page.close();
  });
  await test('Initial loading hides the feed until media is decoded, then autoplays without a central play icon', async () => {
    const slow = await screen(1440, 'no-preference', { delayMedia: true });
    await slow.page.getByText('Preparando tu feed', { exact: true }).waitFor();
    assert.equal(
      await slow.page.locator('.market-feed-scroll').isVisible(),
      false
    );
    assert.equal(
      await slow.page
        .locator('.market-feed-stage video')
        .evaluate((video) => video.paused),
      true
    );
    assert.equal(
      await slow.page.locator('.market-player-hitarea svg').count(),
      0
    );
    slow.releaseMedia();
    await slow.page.locator('.market-feed-layout[aria-busy="false"]').waitFor();
    await slow.page.waitForFunction(() => {
      const video = document.querySelector('.market-feed-stage video');
      return !video.paused && video.currentTime > 0 && video.readyState >= 2;
    });
    assert.equal(
      await slow.page.getByText('Preparando tu feed', { exact: true }).count(),
      0
    );
    await slow.page.close();
  });
  await test('Media failures release initial loading and retry recovers playback', async () => {
    const broken = await screen(390, 'no-preference', { failMedia: true });
    await broken.page
      .getByRole('button', { name: 'Volver a cargar', exact: true })
      .first()
      .waitFor();
    assert.equal(
      await broken.page
        .getByText('Preparando tu feed', { exact: true })
        .count(),
      0
    );
    broken.mediaFailure(false);
    await broken.page
      .getByRole('button', { name: 'Volver a cargar', exact: true })
      .first()
      .click();
    await broken.page.waitForFunction(() => {
      const video = document.querySelector('.market-feed-stage video');
      return !video.paused && video.currentTime > 0;
    });
    await broken.page.close();
  });
  const desktop = await screen(1440, 'no-preference');
  const page = desktop.page;
  await test('Home opens the real public feed without a login redirect', async () => {
    assert.equal(new URL(page.url()).pathname, '/');
    assert.equal(await page.locator('.landing-page').count(), 0);
    assert.equal(await page.locator('.market-feed-stage').count(), 3);
    await page.getByRole('button', { name: 'Ingresar', exact: true }).waitFor();
  });
  await test('Only the active video autoplays muted; details pause and close resumes it', async () => {
    await page.waitForFunction(() => {
      const video = document.querySelector(
        '.market-feed-stage[data-active="true"] video'
      );
      return video && !video.paused && video.muted && video.currentTime > 0;
    });
    await page
      .getByRole('button', {
        name: 'Detalles de Video del equipo',
        exact: true,
      })
      .click();
    await page
      .getByRole('dialog', { name: 'Video del equipo', exact: true })
      .waitFor();
    await page.waitForFunction(
      () => document.querySelector('.market-feed-stage video').paused
    );
    await page.getByRole('button', { name: 'Cerrar', exact: true }).click();
    await page.waitForFunction(
      () => !document.querySelector('.market-feed-stage video').paused
    );
    await page
      .getByRole('button', { name: 'Pausar video', exact: true })
      .first()
      .click();
    assert.equal(
      await page
        .locator('.market-feed-stage video')
        .evaluate((video) => video.paused),
      true
    );
    await page
      .getByRole('button', { name: 'Reproducir video', exact: true })
      .first()
      .click();
  });
  await test('Opt-in auto scroll advances at video end, without looping it', async () => {
    await page
      .getByRole('button', { name: 'Desplazamiento automático', exact: true })
      .click();
    const video = page.locator('.market-feed-stage video');
    assert.equal(await video.evaluate((el) => el.loop), false);
    await video.evaluate((el) => {
      el.currentTime = el.duration - 0.1;
    });
    await page.waitForFunction(
      () =>
        document.querySelector('.market-feed-stage[data-active="true"] h2')
          ?.textContent === 'Laptop en venta'
    );
    assert.equal(await video.evaluate((el) => el.paused), true);
  });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.clock.install();
  await test('Photo timers pause behind login and stop at the final publication', async () => {
    await page
      .getByRole('combobox', { name: 'Tiempo por foto' })
      .selectOption('5');
    await page
      .locator('.market-feed-stage[data-active="true"]')
      .getByRole('button', { name: 'Guardar en deseos', exact: true })
      .click();
    const login = page.getByRole('dialog', {
      name: 'Iniciar sesión',
      exact: true,
    });
    await login.waitFor();
    await page.clock.runFor(15000);
    assert.equal(await activeTitle(page), 'Laptop en venta');
    await login
      .getByRole('button', { name: 'Seguir explorando', exact: true })
      .click();
    await login.waitFor({ state: 'hidden' });
    await page.waitForTimeout(50);
    await page.clock.runFor(5100);
    await page.waitForFunction(
      () =>
        document.querySelector('.market-feed-stage[data-active="true"] h2')
          ?.textContent === 'Equipo en subasta'
    );
    assert.equal(await activeTitle(page), 'Equipo en subasta');
    await page.clock.runFor(5100);
    await page.waitForFunction(
      () =>
        document
          .querySelector('button[aria-label="Desplazamiento automático"]')
          .getAttribute('aria-pressed') === 'false'
    );
    assert.equal(
      await page
        .getByRole('button', { name: 'Desplazamiento automático', exact: true })
        .getAttribute('aria-pressed'),
      'false'
    );
    await page
      .getByRole('status')
      .filter({ hasText: 'Llegaste a la última publicación.' })
      .waitFor();
  });
  await page.clock.resume();
  await test('Auction participation requires login and guest requests remain read-only', async () => {
    await page
      .getByRole('button', {
        name: 'Detalles de Equipo en subasta',
        exact: true,
      })
      .click();
    await page
      .getByRole('button', { name: 'Iniciar sesión para pujar', exact: true })
      .click();
    await page
      .getByRole('dialog', { name: 'Iniciar sesión', exact: true })
      .waitFor();
    assert.ok(
      desktop.calls.every(
        (call) => call.path === '/rest/v1/rpc/get_public_feed'
      )
    );
    await page
      .getByRole('button', { name: 'Seguir explorando', exact: true })
      .click();
    await page.getByRole('button', { name: 'Cerrar', exact: true }).click();
    await page.locator('.market-feed-scroll').focus();
    await page.keyboard.press('ArrowUp');
    await page.waitForFunction(
      () =>
        document.querySelector('.market-feed-stage[data-active="true"] h2')
          ?.textContent === 'Laptop en venta'
    );
  });
  for (const width of [320, 390, 768]) {
    const guest = await screen(width);
    const mobile = guest.page;
    await test(`Public feed, login and media controls fit ${width}px`, async () => {
      const bounds = await mobile
        .getByRole('button', { name: 'Ingresar', exact: true })
        .boundingBox();
      assert.ok(bounds.x >= 0 && bounds.x + bounds.width <= width);
      assert.equal(
        await mobile.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth
        ),
        true
      );
      await mobile
        .getByRole('button', { name: 'Ingresar', exact: true })
        .click();
      await mobile
        .getByRole('dialog', { name: 'Iniciar sesión', exact: true })
        .waitFor();
      assert.equal(
        await mobile
          .getByRole('link', { name: 'Usar correo electrónico', exact: true })
          .getAttribute('href'),
        '/login'
      );
      await mobile
        .getByRole('button', { name: 'Seguir explorando', exact: true })
        .click();
      await mobile.screenshot({ path: join(artifacts, `feed-${width}.png`) });
      await mobile.locator('.market-feed-scroll').focus();
      await mobile.keyboard.press('ArrowDown');
      await mobile.waitForFunction(
        () =>
          document.querySelector('.market-feed-stage[data-active="true"] h2')
            ?.textContent === 'Laptop en venta'
      );
      assert.ok(
        guest.calls.every(
          (call) => call.path === '/rest/v1/rpc/get_public_feed'
        )
      );
    });
    await mobile.close();
  }
  const states = await screen(1440);
  await test('Shared product and seller catalog are public', async () => {
    await states.page.goto(`http://127.0.0.1:5173/?product=${products[1].id}`);
    await states.page
      .getByRole('dialog', { name: 'Laptop en venta', exact: true })
      .waitFor();
    await states.page
      .getByRole('button', { name: /Tienda de prueba.*Ver catálogo/ })
      .click();
    await states.page.locator('.market-profile h1').waitFor();
    assert.match(
      await states.page.locator('.market-profile h1').innerText(),
      /Tienda de prueba/
    );
  });
  await test('Missing migration and empty data show recoverable states, not example listings', async () => {
    states.mode('error');
    await states.page.goto('http://127.0.0.1:5173/?section=explore');
    await states.page.getByRole('alert').waitFor();
    assert.equal(await states.page.locator('.market-feed-stage').count(), 0);
    states.mode('empty');
    await states.page
      .getByRole('button', { name: 'Volver a intentar', exact: true })
      .click();
    await states.page
      .getByText('Tu próximo match está por llegar', { exact: true })
      .waitFor();
    assert.equal(await states.page.locator('.market-feed-stage').count(), 0);
  });
  await test('Original landing remains accessible only through its separate route', async () => {
    await states.page.goto('http://127.0.0.1:5173/presentacion');
    await states.page.locator('.landing-page #hero').waitFor();
    assert.equal(await states.page.locator('.market-feed-scroll').count(), 0);
  });
  assert.deepEqual(errors, []);
  console.log(`PASS ${checks} public-feed browser scenarios`);
} finally {
  await Promise.all(contexts.map((context) => context.close()));
  await browser.close();
}
