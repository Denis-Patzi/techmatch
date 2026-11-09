import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const analyticsUrl = new URL('../../src/lib/adminAnalytics.js', import.meta.url);
const accountUrl = new URL('../../src/lib/account.js', import.meta.url);
const source = (await readFile(analyticsUrl, 'utf8')).replace(
  "'@/lib/account'",
  JSON.stringify(accountUrl.href)
);
const { getAdminAnalytics, downloadCsv } = await import(
  `data:text/javascript;base64,${Buffer.from(source).toString('base64')}`
);
const now = new Date('2026-11-08T18:00:00Z');
const empty = getAdminAnalytics([], [], 30, now);
assert.equal(empty.totalUsers, 0);
assert.equal(empty.activity.length, 30);
assert.equal(
  empty.activity.reduce((sum, item) => sum + item.products, 0),
  0
);
assert.deepEqual(empty.categories, []);
const profiles = [
  {
    id: 'p1',
    role: 'buyer',
    account_type: 'personal',
    created_at: '2026-11-08T04:00:00Z',
    is_verified: true,
  },
  {
    id: 'p2',
    role: 'seller',
    store_name: 'Tienda',
    created_at: '2026-11-08T03:59:00Z',
    is_verified: false,
  },
  { id: 'admin', role: 'admin', account_type: 'personal', created_at: now.toISOString() },
];
const products = [
  {
    id: 'one',
    owner_id: 'p1',
    status: 'published',
    listing_type: 'sale',
    category: 'Celulares',
    created_at: now.toISOString(),
  },
  {
    id: 'two',
    owner_id: 'p2',
    status: 'published',
    listing_type: 'auction',
    category: 'Audio',
    created_at: '2026-11-08T03:59:00Z',
  },
  {
    id: 'three',
    owner_id: 'p1',
    status: 'draft',
    listing_type: 'sale',
    category: 'Audio',
    created_at: '2026-10-25T12:00:00Z',
  },
  {
    id: 'four',
    owner_id: 'p2',
    status: 'sold',
    listing_type: 'auction',
    category: 'Computación',
    created_at: '2026-10-25T12:00:00Z',
  },
];
const metrics = getAdminAnalytics(profiles, products, 7, now);
assert.equal(metrics.totalUsers, 2);
assert.equal(metrics.personal, 1);
assert.equal(metrics.stores, 1);
assert.equal(metrics.verified, 1);
assert.equal(metrics.activeAuctions, 1);
assert.equal(metrics.auctions.length, 2);
assert.equal(metrics.activity.at(-1).users, 1);
assert.equal(metrics.activity.at(-2).users, 1);
assert.equal(metrics.activity.at(-2).products, 1);
assert.equal(
  metrics.activity.reduce((sum, item) => sum + item.products, 0),
  2
);
assert.equal(
  metrics.categories.reduce((sum, item) => sum + item.value, 0),
  2
);
assert.deepEqual(
  metrics.statuses.map((item) => item.value),
  [2, 1, 1]
);
assert.deepEqual(
  metrics.review.map((item) => item.id),
  ['two', 'three']
);
const weekly = getAdminAnalytics(profiles, products, 90, now);
assert.equal(weekly.activity.length, 13);
assert.equal(
  weekly.activity.reduce((sum, item) => sum + item.products, 0),
  4
);
let blob;
URL.createObjectURL = (value) => {
  blob = value;
  return 'blob:test';
};
URL.revokeObjectURL = () => {};
globalThis.document = { createElement: () => ({ click() {}, remove() {} }), body: { append() {} } };
downloadCsv(
  'test.csv',
  [{ label: 'Nombre', value: (r) => r.name }],
  [{ name: '=HYPERLINK("https://example.test")' }, { name: 'Nombre, "con comillas"' }]
);
const csv = await blob.text();
assert.ok(csv.includes("'=HYPERLINK"));
assert.ok(csv.includes('Nombre, ""con comillas""'));
console.log(
  'OK: totales, exclusión de administradores, estados, subastas, perfiles históricos, límites de fecha en Bolivia, períodos vacíos y CSV seguro.'
);
