// Run against the local Vite server; third-party requests are blocked.
// node scripts/validation/landing-responsive.mjs [Playwright module URL]
import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';

const { chromium } = await import(process.argv[2] || 'playwright');
const origin = process.env.LANDING_TEST_URL || 'http://127.0.0.1:5173';
const artifacts = join(tmpdir(), 'techmatch-commerce-validation', 'landing-responsive');
await mkdir(artifacts, { recursive: true });
const browser = await chromium.launch({ headless: true });

try {
  for (const [width, height] of [[320, 568], [390, 844], [568, 320], [768, 1024], [1024, 768], [1100, 800], [1440, 900]]) {
    const page = await browser.newPage({ viewport: { width, height }, reducedMotion: 'reduce' });
    page.setDefaultTimeout(10000);
    const errors = [];
    page.on('pageerror', (error) => errors.push(error.message));
    await page.route('**/*', (route) => new URL(route.request().url()).origin === origin ? route.continue() : route.abort());
    await page.goto(origin, { waitUntil: 'networkidle' });
    await page.evaluate(() => { document.documentElement.style.scrollBehavior = 'auto'; });

    // Check both themes and every visible text/control, rather than only body width:
    // clipped sections can hide horizontal overflow from the document itself.
    for (const light of [true, false]) {
      await page.evaluate((value) => document.documentElement.classList.toggle('light', value), light);
      const layout = await page.evaluate(() => {
        const outside = [...document.querySelectorAll('main h1,main h2,main h3,main p,main a,main button,footer a,footer button')]
          .filter((el) => {
            const box = el.getBoundingClientRect();
            // Profile categories intentionally scroll within their own region.
            return box.width && !el.closest('.profile-category-filters') && (box.left < -1 || box.right > innerWidth + 1);
          })
          .map((el) => el.textContent.trim().slice(0, 60));
        const missingTargets = [...document.querySelectorAll('a[href^="#"]')]
          .map((el) => el.getAttribute('href').slice(1))
          .filter((id) => id && !document.getElementById(id));
        return { outside, missingTargets, width: innerWidth, scrollWidth: document.documentElement.scrollWidth };
      });
      assert.deepEqual(layout.outside, [], `${width}px: clipped text or controls`);
      assert.deepEqual(layout.missingTargets, [], `${width}px: missing section targets`);
      assert.ok(layout.scrollWidth <= layout.width, `${width}px: horizontal overflow`);
    }

    for (const selector of ['.social-feed-frame', '.profile-preview-panel', '.auction-preview-panel']) {
      const ratio = await page.locator(selector).evaluate((el) => el.offsetWidth / el.offsetHeight);
      assert.ok(Math.abs(ratio - 9 / 16) < 0.01, `${width}px: preview lost 9:16 format`);
    }
    const stepBoxes = await page.locator('.how-step-card').evaluateAll((els) => els.map((el) => {
      const { x, y, width, height } = el.getBoundingClientRect();
      return { x, y, width, height };
    }));
    if (width < 768) assert.ok(stepBoxes[1].y > stepBoxes[0].y + stepBoxes[0].height + 10, 'Mobile steps must have space between them');

    const formats = page.getByRole('group', { name: 'Formato de la vista previa' });
    await formats.getByRole('button', { name: 'Fotos', exact: true }).click();
    assert.equal(await page.locator('.social-feed-photo').count(), 1);
    await formats.getByRole('button', { name: 'Video', exact: true }).click();
    assert.equal(await formats.getByRole('button', { name: 'Video', exact: true }).getAttribute('aria-pressed'), 'true');

    await page.getByRole('group', { name: 'Tipo de perfil de ejemplo' }).getByRole('button', { name: /Cuenta de tienda/ }).click();
    assert.match(await page.locator('.profile-preview-identity').innerText(), /TIENDA|tienda/);
    await page.getByRole('group', { name: 'Período de facturación' }).getByRole('button', { name: /Anual/ }).click();
    assert.match(await page.locator('.plan-card').nth(1).innerText(), /79/);
    assert.match(await page.locator('.plan-card').nth(2).innerText(), /199/);
    assert.equal(await page.locator('.plan-card').evaluateAll((els) => els.every((el) => Number(getComputedStyle(el).opacity) === 1)), true);

    // A section taller than the viewport must still activate its navigation link.
    await page.evaluate(() => { const s = document.getElementById('ai-assistant'); window.scrollTo(0, s.offsetTop + 250); });
    await page.waitForTimeout(100);
    if (width < 1100) {
      // The floating header intentionally hides on downward scrolling.
      await page.evaluate(() => window.scrollBy(0, -40));
      await page.waitForFunction(() => !document.querySelector('.site-header').classList.contains('is-hidden'));
      await page.getByRole('button', { name: 'Abrir menú', exact: true }).click();
      const menu = page.getByRole('navigation', { name: 'Navegación móvil', exact: true });
      assert.equal(await menu.getByRole('link', { name: 'Tasador IA', exact: true }).getAttribute('aria-current'), 'location');
      await menu.getByRole('link', { name: 'Planes', exact: true }).click();
      await page.waitForTimeout(100);
      await menu.waitFor({ state: 'detached' });
      const top = await page.locator('#plans > .page-container').evaluate((el) => el.getBoundingClientRect().top);
      const minimumTop = width > 900 ? 24 : 90;
      assert.ok(top >= minimumTop - 1 && top <= 125, `${width}px: wrong content offset ${top}`);
    } else {
      assert.equal(await page.getByRole('navigation', { name: 'Navegación principal', exact: true }).getByRole('link', { name: 'Tasador IA', exact: true }).getAttribute('aria-current'), 'location');
      const navFits = await page.locator('.site-nav').evaluate((el) => el.scrollWidth <= el.clientWidth);
      assert.equal(navFits, true, `${width}px: desktop menu overflow`);
    }
    assert.deepEqual(errors, [], `${width}px: browser errors`);
    console.log(`PASS ${width}×${height}: sections, both themes, previews, controls and navigation`);
    if ([390, 768, 1440].includes(width)) {
      for (const id of ['features', 'profiles', 'how', 'plans']) {
        await page.locator(`#${id}`).screenshot({ path: join(artifacts, `checked-${width}-${id}.png`) });
      }
    }
    await page.close();
  }
} finally {
  await browser.close();
}
