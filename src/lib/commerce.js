import { supabase } from '@/lib/supabaseClient';

export function commerceError(error) {
  if (
    ['42P01', '42703', 'PGRST202', 'PGRST205', 'PGRST204'].includes(error?.code)
  )
    return 'Falta activar subastas y mensajes en Supabase. Ejecutá 20261111_auctions_messages.sql en SQL Editor.';
  if (error?.code === 'P0001' || error?.code === '42501')
    return error.message || 'No tenés permiso para esta acción.';
  return 'No pudimos conectar. Revisá tu conexión y volvé a intentar.';
}

export async function commerceRpc(name, args) {
  const { data, error } = await supabase.rpc(name, args);
  if (error) throw error;
  return data;
}

// El reloj avanza desde la muestra del servidor sin depender de cambios del reloj local.
export const auctionNow = (auction) =>
  Date.parse(auction.server_now) +
  Math.max(0, performance.now() - auction.receivedAt);
export const auctionClosed = (auction) =>
  auction &&
  (auction.state !== 'active' ||
    Date.parse(auction.ends_at) <= auctionNow(auction));
export function countdownText(auction) {
  if (!auction) return 'Consultando plazo…';
  if (auction.state === 'cancelled') return 'Cancelada';
  let seconds = Math.max(
    0,
    Math.ceil((Date.parse(auction.ends_at) - auctionNow(auction)) / 1000),
  );
  if (!seconds) return 'Finalizada';
  const days = Math.floor(seconds / 86400);
  seconds %= 86400;
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  return `${days}d ${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;
}
