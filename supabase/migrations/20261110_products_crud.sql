-- TechMatch: CRUD de publicaciones y deseos para la aplicación social.
-- Ejecutar DESPUÉS de 20261109_unified_accounts.sql (ya aplicado).
-- No modifica las políticas de profiles ni crea cuentas de prueba.
begin;

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  title text not null check (char_length(btrim(title)) between 3 and 100),
  description text not null check (char_length(btrim(description)) between 10 and 3000),
  price numeric(12,2) not null check (price > 0 and price <= 99999999),
  category text not null check (category in ('Celulares','Computación','Audio','Componentes','Otros')),
  condition text not null check (condition in ('Nuevo','Como nuevo','Usado')),
  city text not null check (char_length(btrim(city)) between 2 and 80),
  listing_type text not null default 'sale' check (listing_type in ('sale','auction')),
  status text not null default 'published' check (status in ('published','draft','sold')),
  media_type text not null default 'image' check (media_type in ('image','video')),
  media_path text,
  cover_key text not null default 'phone' check (cover_key in ('phone','laptop','audio','gpu')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (media_type <> 'video' or media_path is not null)
);
create index if not exists products_owner_idx on public.products(owner_id);
create index if not exists products_feed_idx on public.products(status, created_at desc);

create or replace function app_private.guard_product()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  if tg_op = 'UPDATE' and (new.owner_id is distinct from old.owner_id
    or new.id is distinct from old.id or new.created_at is distinct from old.created_at) then
    raise exception 'No se puede cambiar el propietario, identificador o fecha de creación.' using errcode='42501';
  end if;
  new.title := btrim(new.title);
  new.description := btrim(new.description);
  new.city := btrim(new.city);
  new.updated_at := now();
  if tg_op = 'INSERT' then new.created_at := now(); end if;
  if new.media_path is not null and (
    split_part(new.media_path, '/', 1) <> new.owner_id::text
    or new.media_path like '%..%' or char_length(new.media_path) > 250) then
    raise exception 'El archivo debe pertenecer al propietario de la publicación.' using errcode='42501';
  end if;
  -- Hasta implementar suscripciones de pago, todas las cuentas usan Básico.
  -- Serializa por propietario para que altas concurrentes no eludan el límite.
  perform pg_advisory_xact_lock(hashtextextended(new.owner_id::text, 0));
  if not app_private.is_admin() and new.status = 'published' then
    if (select count(*) from public.products where owner_id=new.owner_id
      and status='published' and id<>new.id) >= 25 then
      raise exception 'El plan Básico permite hasta 25 publicaciones activas.' using errcode='23514';
    end if;
    if new.media_type='video' and (select count(*) from public.products
      where owner_id=new.owner_id and status='published' and media_type='video' and id<>new.id) >= 5 then
      raise exception 'El plan Básico permite hasta 5 videos activos.' using errcode='23514';
    end if;
  end if;
  return new;
end;
$$;
revoke all on function app_private.guard_product() from public;
drop trigger if exists techmatch_guard_product on public.products;
create trigger techmatch_guard_product before insert or update on public.products
  for each row execute function app_private.guard_product();

alter table public.products enable row level security;
revoke all on public.products from public, anon, authenticated;
grant select, insert, update, delete on public.products to authenticated, service_role;
drop policy if exists products_read on public.products;
create policy products_read on public.products for select to authenticated
  using (status='published' or owner_id=(select auth.uid()) or (select app_private.is_admin()));
drop policy if exists products_create on public.products;
create policy products_create on public.products for insert to authenticated
  with check (owner_id=(select auth.uid()));
drop policy if exists products_edit on public.products;
create policy products_edit on public.products for update to authenticated
  using (owner_id=(select auth.uid()) or (select app_private.is_admin()))
  with check (owner_id=(select auth.uid()) or (select app_private.is_admin()));
drop policy if exists products_delete on public.products;
create policy products_delete on public.products for delete to authenticated
  using (owner_id=(select auth.uid()) or (select app_private.is_admin()));

create table if not exists public.product_favorites (
  user_id uuid not null references auth.users(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, product_id)
);
create index if not exists favorites_product_idx on public.product_favorites(product_id);
alter table public.product_favorites enable row level security;
revoke all on public.product_favorites from public, anon, authenticated;
grant select, insert, delete on public.product_favorites to authenticated, service_role;
drop policy if exists favorites_own_read on public.product_favorites;
create policy favorites_own_read on public.product_favorites for select to authenticated
  using (user_id=(select auth.uid()));
drop policy if exists favorites_own_add on public.product_favorites;
create policy favorites_own_add on public.product_favorites for insert to authenticated
  with check (user_id=(select auth.uid()) and exists (
    select 1 from public.products where id=product_id and status='published'));
drop policy if exists favorites_own_remove on public.product_favorites;
create policy favorites_own_remove on public.product_favorites for delete to authenticated
  using (user_id=(select auth.uid()));

-- Identidad pública mínima del vendedor. No expone teléfono, NIT ni correo.
create or replace function public.get_product_sellers(seller_ids uuid[])
returns table(id uuid, display_name text, account_type text, city text, is_verified boolean)
language sql stable security definer set search_path='' as $$
  select p.id, case when p.account_type='store' then p.store_name else p.full_name end,
    p.account_type, p.city, p.is_verified
  from public.profiles p where (select auth.uid()) is not null
    and p.id=any(seller_ids) and (p.id=(select auth.uid()) or app_private.is_admin()
      or exists(select 1 from public.products x where x.owner_id=p.id and x.status='published'));
$$;
revoke all on function public.get_product_sellers(uuid[]) from public, anon;
grant execute on function public.get_product_sellers(uuid[]) to authenticated;

-- Multimedia de publicaciones: archivos públicos; subir/eliminar solo propios o admin.
-- No subir documentos privados: este bucket sirve imágenes/videos del catálogo.
insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
values ('product-media','product-media',true,20971520,
  array['image/jpeg','image/png','image/webp','video/mp4','video/webm'])
on conflict(id) do update set public=true,file_size_limit=excluded.file_size_limit,
  allowed_mime_types=excluded.allowed_mime_types;
drop policy if exists techmatch_media_read on storage.objects;
create policy techmatch_media_read on storage.objects for select to authenticated
  using (bucket_id='product-media');
drop policy if exists techmatch_media_add on storage.objects;
create policy techmatch_media_add on storage.objects for insert to authenticated
  with check (bucket_id='product-media' and (
    (storage.foldername(name))[1]=(select auth.uid())::text or (select app_private.is_admin())));
drop policy if exists techmatch_media_remove on storage.objects;
create policy techmatch_media_remove on storage.objects for delete to authenticated
  using (bucket_id='product-media' and (
    (storage.foldername(name))[1]=(select auth.uid())::text or (select app_private.is_admin())));
commit;
