import { getAccountType } from '@/lib/account';

const DAY = 86400000;
const dayKey = (value) => {
  const date = new Date(value);
  return Number.isFinite(date.getTime())
    ? new Intl.DateTimeFormat('en-CA', {
        timeZone: 'America/La_Paz',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      }).format(date)
    : null;
};
export const accountName = (profile) =>
  (getAccountType(profile) === 'store' ? profile?.store_name : profile?.full_name) ||
  profile?.full_name ||
  'Sin nombre';
export const statusLabel = (status) =>
  ({ published: 'Publicado', draft: 'Borrador', sold: 'Vendido' })[status] || status;
export const dateLabel = (value) => {
  const date = new Date(value);
  return value && Number.isFinite(date.getTime())
    ? date.toLocaleDateString('es-BO', {
        timeZone: 'America/La_Paz',
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
    : 'Sin fecha';
};
export function getAdminAnalytics(profiles, products, days = 30, now = new Date()) {
  const users = profiles.filter((item) => item.role !== 'admin');
  const active = products.filter((item) => item.status === 'published');
  const today = dayKey(now);
  const end = new Date(`${today}T12:00:00-04:00`);
  const step = days > 30 ? 7 : 1;
  const start = new Date(end.getTime() - (days - 1) * DAY);
  const bucketCount = Math.ceil(days / step);
  const activity = Array.from({ length: bucketCount }, (_, index) => {
    const date = new Date(start.getTime() + index * step * DAY);
    return {
      key: dayKey(date),
      label: date.toLocaleDateString('es-BO', {
        timeZone: 'America/La_Paz',
        day: '2-digit',
        month: 'short',
      }),
      users: 0,
      products: 0,
    };
  });
  const assign = (items, field) =>
    items.forEach((item) => {
      const key = dayKey(item.created_at);
      if (!key || key < dayKey(start) || key > today) return;
      const distance = Math.round((new Date(`${key}T12:00:00-04:00`) - start) / DAY);
      const bucket = activity[Math.floor(distance / step)];
      if (bucket) bucket[field]++;
    });
  assign(users, 'users');
  assign(products, 'products');
  const categories = Object.entries(
    active.reduce((totals, item) => {
      totals[item.category] = (totals[item.category] || 0) + 1;
      return totals;
    }, {})
  )
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value);
  const ownerMap = Object.fromEntries(profiles.map((item) => [item.id, item]));
  const review = products.filter(
    (item) =>
      item.status === 'draft' ||
      (item.status === 'published' && !ownerMap[item.owner_id]?.is_verified)
  );
  return {
    users,
    active,
    ownerMap,
    activity,
    categories,
    review,
    totalUsers: users.length,
    stores: users.filter((item) => getAccountType(item) === 'store').length,
    personal: users.filter((item) => getAccountType(item) === 'personal').length,
    verified: users.filter((item) => item.is_verified).length,
    auctions: products.filter((item) => item.listing_type === 'auction'),
    activeAuctions: active.filter((item) => item.listing_type === 'auction').length,
    statuses: ['published', 'draft', 'sold'].map((key) => ({
      key,
      label: statusLabel(key),
      value: products.filter((item) => item.status === key).length,
    })),
  };
}

export function downloadCsv(filename, columns, rows) {
  const escape = (value) => {
    let text = String(value ?? '');
    if (/^[\s]*[=+@\-\t\r]/.test(text)) text = `'${text}`;
    return `"${text.replaceAll('"', '""')}"`;
  };
  const csv = [
    columns.map((column) => escape(column.label)).join(','),
    ...rows.map((row) => columns.map((column) => escape(column.value(row))).join(',')),
  ].join('\r\n');
  const url = URL.createObjectURL(new Blob(['\uFEFF', csv], { type: 'text/csv;charset=utf-8;' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.append(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
