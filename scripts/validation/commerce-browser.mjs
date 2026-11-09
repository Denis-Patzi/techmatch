// UI con respuestas controladas; no inicia sesión ni modifica Supabase real.
// node scripts/validation/commerce-browser.mjs [URL del módulo playwright]
import assert from 'node:assert/strict';
import { readFile, mkdir } from 'node:fs/promises';
import { randomUUID } from 'node:crypto';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
const { chromium } = await import(process.argv[2] || 'playwright');
const root = new URL('../../', import.meta.url);
const env = await readFile(new URL('.env', root), 'utf8');
const url = env.match(/^VITE_SUPABASE_URL\s*=\s*["']?([^\s"']+)/m)?.[1];
assert.ok(
  url,
  'Se necesita la URL configurada del proyecto, sin imprimir credenciales.'
);
const storageKey = `sb-${new URL(url).hostname.split('.')[0]}-auth-token`;
const sellerId = '00000000-0000-4000-8000-000000000001';
const buyerId = '00000000-0000-4000-8000-000000000002';
const adminId = '00000000-0000-4000-8000-000000000003';
const saleId = '00000000-0000-4000-8000-000000000010';
const auctionId = '00000000-0000-4000-8000-000000000011';
const now = () => new Date().toISOString();
const products = [
  {
    id: saleId,
    owner_id: sellerId,
    title: 'iPhone 13 de 128 GB',
    description:
      'Equipo de prueba para verificar contacto y mensajería privada.',
    price: 2500,
    listing_type: 'sale',
    status: 'published',
    category: 'Celulares',
    condition: 'Usado',
    city: 'La Paz',
    cover_key: 'phone',
    media_type: 'image',
    media_path: null,
    created_at: now(),
    auction_duration_days: 3,
  },
  {
    id: auctionId,
    owner_id: sellerId,
    title: 'Laptop para diseño',
    description: 'Laptop de prueba para validar pujas con plazo fijo.',
    price: 100,
    listing_type: 'auction',
    status: 'published',
    category: 'Computación',
    condition: 'Como nuevo',
    city: 'La Paz',
    cover_key: 'laptop',
    media_type: 'image',
    media_path: null,
    created_at: now(),
    auction_duration_days: 5,
  },
];
const profiles = {
  [adminId]: {
    id: adminId,
    full_name: 'Cuenta administradora',
    account_type: 'personal',
    city: 'La Paz',
    role: 'admin',
    is_verified: true,
  },
  [sellerId]: {
    id: sellerId,
    full_name: 'Sofía Vendedora',
    store_name: 'Nova Tech',
    account_type: 'store',
    city: 'La Paz',
    role: 'buyer',
    is_verified: true,
  },
  [buyerId]: {
    id: buyerId,
    full_name: 'Diego Comprador',
    account_type: 'personal',
    city: 'La Paz',
    role: 'buyer',
    is_verified: false,
  },
};
const bids = [],
  conversations = [],
  messages = [];
let endsAt = new Date(Date.now() + 5 * 86400000).toISOString();
let failSend = false,
  failAuctions = false;
let errors = [];
const profileWrites = [];
const artifactDir = join(
  tmpdir(),
  'techmatch-commerce-validation',
  'screenshots'
);
await mkdir(artifactDir, { recursive: true });
const browser = await chromium.launch({ headless: true });
const contexts = [];
async function screen(userId, viewport = { width: 1440, height: 1000 }) {
  const context = await browser.newContext({
    viewport,
    reducedMotion: 'reduce',
  });
  contexts.push(context);
  const user = {
    id: userId,
    email: 'fixture@example.invalid',
    aud: 'authenticated',
    role: 'authenticated',
    user_metadata: {},
  };
  const session = {
    access_token: `${Buffer.from('{}').toString('base64url')}.${Buffer.from(JSON.stringify({ sub: userId, exp: Math.floor(Date.now() / 1000) + 3600 })).toString('base64url')}.fixture`,
    refresh_token: 'fixture',
    token_type: 'bearer',
    expires_at: Math.floor(Date.now() / 1000) + 3600,
    expires_in: 3600,
    user,
  };
  await context.addInitScript(
    ({ storageKey, session }) => {
      localStorage.setItem(storageKey, JSON.stringify(session));
    },
    { storageKey, session }
  );
  await context.route(`${url}/**`, async (route) => {
    const request = route.request(),
      u = new URL(request.url());
    const body = request.postDataJSON() || {};
    let data;
    const send = (value, status = 200) =>
      route.fulfill({
        status,
        contentType: 'application/json',
        headers: { 'access-control-allow-origin': '*' },
        body: JSON.stringify(value),
      });
    if (u.pathname.startsWith('/auth/')) return send(user);
    if (u.pathname === '/rest/v1/profiles') {
      const targetId = u.searchParams.get('id')?.slice(3);
      if (request.method() === 'PATCH') {
        profileWrites.push({ actor: userId, target: targetId, values: body });
        Object.assign(profiles[targetId], body);
        if (profiles[targetId].account_type === 'personal') {
          profiles[targetId].store_name = null;
          profiles[targetId].nit = null;
        }
        return send(profiles[targetId]);
      }
      return send(targetId ? profiles[targetId] : Object.values(profiles));
    }
    if (u.pathname === '/rest/v1/products') {
      if (request.method() !== 'GET')
        return send(
          { code: 'P0001', message: 'La prueba no crea productos reales.' },
          400
        );
      data = products.filter(
        (p) =>
          !u.searchParams.get('owner_id') ||
          p.owner_id === u.searchParams.get('owner_id').slice(3)
      );
      return send(data);
    }
    if (u.pathname === '/rest/v1/product_favorites') return send([]);
    if (!u.pathname.includes('/rpc/')) return send([]);
    const rpc = u.pathname.split('/').at(-1);
    if (rpc === 'get_product_sellers')
      data = [
        {
          id: sellerId,
          display_name: 'Nova Tech',
          account_type: 'store',
          city: 'La Paz',
          is_verified: true,
        },
      ];
    else if (rpc === 'get_auction_states') {
      if (failAuctions)
        return send({ code: 'PGRST202', message: 'Missing RPC' }, 404);
      const ended = Date.parse(endsAt) <= Date.now(),
        top = bids.at(-1);
      data = [
        {
          product_id: auctionId,
          starts_at: now(),
          ends_at: endsAt,
          server_now: now(),
          state: ended ? 'ended' : 'active',
          current_price: top?.amount ?? 100,
          bid_count: bids.length,
          minimum_bid: top ? top.amount + 1 : 100,
          is_leading: top?.bidder_id === userId,
          is_winner: ended && top?.bidder_id === userId,
          winner_name:
            ended && (userId === sellerId || top?.bidder_id === userId)
              ? 'Diego Comprador'
              : null,
        },
      ];
    } else if (rpc === 'get_auction_bid_history')
      data = [...bids]
        .reverse()
        .map((b) => ({ ...b, is_mine: b.bidder_id === userId }));
    else if (rpc === 'place_auction_bid') {
      const id = randomUUID();
      bids.push({
        id,
        bidder_id: userId,
        amount: body.p_amount,
        created_at: now(),
      });
      data = id;
    } else if (rpc === 'get_my_conversations') {
      data = conversations
        .filter((c) => [c.buyer_id, c.seller_id].includes(userId))
        .map((c) => {
          const related = messages.filter((m) => m.conversation_id === c.id);
          const other =
            profiles[c.buyer_id === userId ? c.seller_id : c.buyer_id];
          return {
            ...c,
            other_name: other.store_name || other.full_name,
            last_message: related.at(-1)?.body,
            unread_count: related.filter(
              (m) => m.sender_id !== userId && !m.read?.includes(userId)
            ).length,
          };
        });
    } else if (
      rpc === 'open_product_conversation' ||
      rpc === 'contact_auction_winner'
    ) {
      const product = products.find((p) => p.id === body.p_product_id);
      const buyer =
        rpc === 'contact_auction_winner' ? bids.at(-1).bidder_id : userId;
      let c = conversations.find(
        (c) => c.product_id === product.id && c.buyer_id === buyer
      );
      if (!c) {
        c = {
          id: randomUUID(),
          buyer_id: buyer,
          seller_id: sellerId,
          product_id: product.id,
          product_title: product.title,
          last_message_at: now(),
        };
        conversations.push(c);
      }
      data = c.id;
    } else if (rpc === 'get_conversation_messages')
      data = messages
        .filter((m) => m.conversation_id === body.p_conversation_id)
        .slice(-50)
        .reverse();
    else if (rpc === 'send_conversation_message') {
      if (failSend) {
        failSend = false;
        return send(
          { code: 'P0001', message: 'Envío interrumpido de prueba.' },
          400
        );
      }
      if (!messages.some((m) => m.id === body.p_client_id))
        messages.push({
          id: body.p_client_id,
          conversation_id: body.p_conversation_id,
          sender_id: userId,
          body: body.p_body,
          created_at: now(),
          read: [],
        });
      data = body.p_client_id;
    } else if (rpc === 'mark_conversation_read') {
      messages
        .filter((m) => m.conversation_id === body.p_conversation_id)
        .forEach((m) => m.read.push(userId));
      data = null;
    } else throw new Error(`RPC inesperada: ${rpc}`);
    return send(data);
  });
  const page = await context.newPage();
  page.on('pageerror', (e) => errors.push(e.message));
  return page;
}
async function waitText(page, text) {
  await page
    .getByText(text, { exact: false })
    .first()
    .waitFor({ timeout: 15000 });
}
async function click(page, name) {
  await page.getByRole('button', { name, exact: true }).first().click();
}
async function accountTests() {
  const personal = await screen(buyerId);
  await personal.goto('http://127.0.0.1:5173/app?section=profile');
  await personal.locator('.market-profile .account-status').waitFor();
  assert.match(
    await personal.locator('.account-status').innerText(),
    /Cuenta personal/
  );
  assert.match(
    await personal.locator('.account-status').innerText(),
    /Plan Básico · Gratis/
  );
  await click(personal, 'Editar perfil');
  await waitText(personal, 'Solo el administrador puede modificarlo.');
  assert.equal(await personal.locator('.account-type-selector').count(), 0);
  assert.equal(await personal.locator('[name="account_type"]').count(), 0);
  await personal
    .getByLabel('Teléfono (opcional)', { exact: true })
    .fill('77777777');
  await click(personal, 'Guardar cambios');
  await waitText(personal, 'Perfil actualizado correctamente.');
  const saved = profileWrites.at(-1);
  assert.equal(saved.values.phone, '77777777');
  assert.equal(Object.hasOwn(saved.values, 'account_type'), false);
  console.log(
    'OK UI cuentas: perfil personal muestra tipo y plan; edición sin selector ni account_type en el envío.'
  );
  const store = await screen(sellerId, { width: 390, height: 844 });
  await store.goto('http://127.0.0.1:5173/app?section=profile');
  await store.locator('.market-profile .account-status').waitFor();
  assert.match(
    await store.locator('.account-status').innerText(),
    /Cuenta de tienda/
  );
  assert.match(
    await store.locator('.account-status').innerText(),
    /Plan Básico · Gratis/
  );
  assert.equal(
    await store.evaluate(
      () => document.documentElement.scrollWidth > innerWidth
    ),
    false
  );
  await store.screenshot({
    path: join(artifactDir, 'perfil-tipo-plan-mobile.png'),
    fullPage: true,
  });
  await click(store, 'Editar perfil');
  await waitText(store, 'Solo el administrador puede modificarlo.');
  assert.equal(await store.locator('.account-type-selector').count(), 0);
  assert.equal(
    await store.getByLabel('Nombre de la tienda', { exact: true }).inputValue(),
    'Nova Tech'
  );
  await store
    .getByLabel('Teléfono (opcional)', { exact: true })
    .fill('78888888');
  await click(store, 'Guardar cambios');
  await waitText(store, 'Perfil actualizado correctamente.');
  assert.equal(
    Object.hasOwn(profileWrites.at(-1).values, 'account_type'),
    false
  );
  assert.equal(profiles[sellerId].account_type, 'store');
  console.log(
    'OK UI cuentas: tienda conserva campos comerciales, tipo fijo y plan visible en móvil.'
  );
  const admin = await screen(adminId);
  await admin.goto('http://127.0.0.1:5173/admin?section=users');
  await admin
    .getByRole('button', { name: 'Editar Diego Comprador', exact: true })
    .click();
  await admin
    .getByLabel('Tipo de cuenta', { exact: true })
    .selectOption('store');
  await admin
    .getByLabel('Nombre de la tienda', { exact: true })
    .fill('Tienda de Diego');
  await click(admin, 'Guardar cambios');
  await waitText(admin, 'Usuario actualizado.');
  assert.equal(profiles[buyerId].account_type, 'store');
  assert.equal(profileWrites.at(-1).actor, adminId);
  await personal.goto('http://127.0.0.1:5173/app?section=profile');
  await personal.locator('.market-profile .account-status').waitFor();
  assert.match(
    await personal.locator('.account-status').innerText(),
    /Cuenta de tienda/
  );
  console.log(
    'OK UI cuentas: el administrador conserva el cambio de tipo y el perfil refleja la modificación.'
  );
  await admin
    .getByRole('button', { name: 'Editar Tienda de Diego', exact: true })
    .click();
  await admin
    .getByLabel('Tipo de cuenta', { exact: true })
    .selectOption('personal');
  await click(admin, 'Guardar cambios');
  await admin
    .getByRole('dialog', { name: 'Editar usuario', exact: true })
    .waitFor({ state: 'hidden' });
  assert.equal(profiles[buyerId].account_type, 'personal');
  assert.equal(profiles[buyerId].store_name, null);
  assert.deepEqual(errors, []);
  console.log(
    'PASS cuentas en navegador: permisos de interfaz, edición normal, tipo y plan, administrador y móvil.'
  );
}
try {
  if (process.argv.includes('--accounts-only')) await accountTests();
  else {
    const buyer = await screen(buyerId);
    await buyer.goto('http://127.0.0.1:5173/app?section=auctions');
    await buyer
      .getByRole('button', { name: 'Ver Laptop para diseño', exact: true })
      .click();
    await waitText(buyer, 'Tu oferta en bolivianos');
    assert.match(
      await buyer.locator('.auction-countdown').last().innerText(),
      /4d|5d/
    );
    const before = await buyer.locator('.auction-countdown').last().innerText();
    await buyer.waitForFunction(
      (initial) =>
        document.querySelector('.auction-panel .auction-countdown')
          ?.textContent !== initial,
      before
    );
    await buyer.getByLabel('Tu oferta en bolivianos').fill('120.50');
    await click(buyer, 'Pujar');
    await waitText(buyer, 'Tu oferta va ganando.');
    assert.equal(bids.length, 1);
    assert.equal(bids[0].amount, 120.5);
    await buyer.screenshot({
      path: join(artifactDir, 'subasta-desktop.png'),
      fullPage: true,
    });
    console.log(
      'OK UI: puja decimal, oferta persistente, contador y estado ganador provisional.'
    );
    await click(buyer, 'Cerrar');
    await buyer.goto('http://127.0.0.1:5173/app');
    await buyer
      .getByRole('button', {
        name: 'Contactar al vendedor de iPhone 13 de 128 GB',
        exact: true,
      })
      .click();
    await waitText(buyer, 'Una conversación, un nuevo match');
    await click(buyer, 'Preguntar si está disponible');
    await click(buyer, 'Enviar mensaje');
    await buyer.locator('.message-bubble').first().waitFor();
    assert.equal(conversations.length, 1);
    assert.equal(messages.length, 1);
    const seller = await screen(sellerId);
    await seller.goto('http://127.0.0.1:5173/app?section=messages');
    await seller.locator('.messages-conversation').first().click();
    await waitText(seller, '¿Sigue disponible?');
    await seller
      .getByLabel('Escribí un mensaje', { exact: true })
      .fill('Sí, está disponible. Incluye cargador.');
    await seller
      .getByLabel('Escribí un mensaje', { exact: true })
      .press('Enter');
    await waitText(buyer, 'Sí, está disponible. Incluye cargador.');
    assert.equal(messages.length, 2);
    await buyer.screenshot({
      path: join(artifactDir, 'mensajes-desktop.png'),
      fullPage: true,
    });
    console.log(
      'OK UI: contactar desde feed, respuesta en otra cuenta y actualización de la conversación.'
    );
    failSend = true;
    await buyer
      .getByLabel('Escribí un mensaje', { exact: true })
      .fill('¿Podemos coordinar para mañana?');
    await click(buyer, 'Enviar mensaje');
    await waitText(buyer, 'Tu texto se conserva');
    assert.equal(
      await buyer
        .getByLabel('Escribí un mensaje', { exact: true })
        .inputValue(),
      '¿Podemos coordinar para mañana?'
    );
    await click(buyer, 'Enviar mensaje');
    await buyer
      .locator('.message-bubble')
      .filter({ hasText: '¿Podemos coordinar para mañana?' })
      .waitFor();
    assert.equal(
      messages.filter((m) => m.body === '¿Podemos coordinar para mañana?')
        .length,
      1
    );
    console.log(
      'OK UI: error de envío conserva texto y permite reintento sin duplicados.'
    );
    const mobile = await screen(buyerId, { width: 390, height: 844 });
    await mobile.goto('http://127.0.0.1:5173/app');
    await mobile
      .getByRole('button', {
        name: 'Contactar al vendedor de iPhone 13 de 128 GB',
        exact: true,
      })
      .click();
    await mobile.locator('.messages-thread').waitFor();
    assert.equal(conversations.length, 1);
    assert.equal(await mobile.locator('.messages-list').isVisible(), false);
    await mobile
      .getByLabel('Escribí un mensaje', { exact: true })
      .fill('Mensaje desde el celular.');
    await click(mobile, 'Enviar mensaje');
    await waitText(seller, 'Mensaje desde el celular.');
    const composer = await mobile.locator('.messages-composer').boundingBox();
    const nav = await mobile.locator('.market-mobile-nav').boundingBox();
    assert.ok(
      composer.y + composer.height <= nav.y + 1,
      'La barra móvil no debe tapar el compositor.'
    );
    assert.equal(
      await mobile.evaluate(
        () => document.documentElement.scrollWidth > innerWidth
      ),
      false
    );
    await mobile.screenshot({
      path: join(artifactDir, 'mensajes-mobile.png'),
      fullPage: true,
    });
    await mobile
      .getByRole('button', { name: 'Volver a conversaciones', exact: true })
      .click();
    await mobile.locator('.messages-list').waitFor({ state: 'visible' });
    console.log(
      'OK UI: móvil, conversación reutilizada, envío, retorno a bandeja y ausencia de desbordamiento.'
    );
    await mobile.goto('http://127.0.0.1:5173/app?section=publish&type=auction');
    assert.equal(
      await mobile.getByLabel('Tipo', { exact: true }).inputValue(),
      'auction'
    );
    await mobile
      .getByLabel('Duración de la subasta', { exact: true })
      .selectOption('4');
    assert.equal(
      await mobile
        .getByLabel('Duración de la subasta', { exact: true })
        .inputValue(),
      '4'
    );
    console.log('OK UI: editor permite elegir 3, 4 o 5 días.');
    endsAt = new Date(Date.now() - 1000).toISOString();
    await buyer.goto('http://127.0.0.1:5173/app?section=auctions');
    await click(buyer, 'Finalizadas');
    await click(buyer, 'Ver Laptop para diseño');
    await waitText(buyer, '¡Ganaste esta subasta!');
    assert.equal(
      await buyer.getByRole('button', { name: 'Pujar', exact: true }).count(),
      0
    );
    await seller.goto('http://127.0.0.1:5173/app?section=auctions');
    await click(seller, 'Finalizadas');
    await click(seller, 'Ver Laptop para diseño');
    await waitText(seller, 'Ganador: Diego Comprador');
    await click(seller, 'Contactar al ganador');
    await seller.locator('.messages-thread').waitFor();
    assert.equal(conversations.length, 2);
    console.log(
      'OK UI: cierre, ganador definitivo y contacto del vendedor al ganador.'
    );
    failAuctions = true;
    await buyer.goto('http://127.0.0.1:5173/app?section=auctions');
    await waitText(buyer, 'Falta activar subastas y mensajes');
    assert.deepEqual(errors, []);
    console.log(
      'PASS navegador: escritorio y móvil, sin errores de React. Capturas:',
      artifactDir
    );
  }
} finally {
  await Promise.all(contexts.map((c) => c.close()));
  await browser.close();
}
