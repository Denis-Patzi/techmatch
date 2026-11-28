-- Feed público de solo lectura. Ejecutar después de las migraciones de productos
-- y subastas/mensajes. No cambia los permisos de tablas ni publica datos privados.
begin;

create or replace function public.get_public_feed(
  p_seller_id uuid default null,
  p_product_id uuid default null
)
returns table(product jsonb, seller jsonb, auction jsonb)
language sql stable security definer set search_path = '' as $$
  select jsonb_build_object(
    'id', p.id, 'owner_id', p.owner_id, 'title', p.title,
    'description', p.description, 'price', p.price, 'category', p.category,
    'condition', p.condition, 'city', p.city, 'listing_type', p.listing_type,
    'status', p.status, 'media_type', p.media_type, 'media_path', p.media_path,
    'cover_key', p.cover_key, 'created_at', p.created_at,
    'auction_duration_days', p.auction_duration_days
  ), jsonb_build_object(
    'id', pr.id,
    'display_name', case when pr.account_type='store' then pr.store_name else pr.full_name end,
    'account_type', pr.account_type, 'city', pr.city, 'is_verified', pr.is_verified
  ), case when a.product_id is null then null else jsonb_build_object(
    'product_id', p.id, 'starts_at', a.starts_at, 'ends_at', a.ends_at,
    'server_now', statement_timestamp(),
    'state', case when a.cancelled_at is not null then 'cancelled'
      when a.ends_at<=statement_timestamp() then 'ended' else 'active' end,
    'current_price', coalesce(b.amount,p.price), 'bid_count', b.total,
    'minimum_bid', case when b.amount is null then p.price else b.amount+1 end
  ) end
  from public.products p
  join public.profiles pr on pr.id=p.owner_id
  left join public.auctions a on a.product_id=p.id
  left join lateral (
    select max(amount) amount, count(*) total
    from public.auction_bids where product_id=p.id
  ) b on a.product_id is not null
  where p.status='published'
    and (p_seller_id is null or p.owner_id=p_seller_id)
    and (p_product_id is null or p.id=p_product_id)
  order by p.created_at desc,p.id desc
  limit 200;
$$;
revoke all on function public.get_public_feed(uuid,uuid) from public;
grant execute on function public.get_public_feed(uuid,uuid) to anon,authenticated;
comment on function public.get_public_feed(uuid,uuid) is
  'Feed público: publicaciones visibles, identidad pública del vendedor y resumen de subasta sin participantes.';
notify pgrst,'reload schema';
commit;
