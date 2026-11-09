-- PROPUESTA DE ESQUEMA: no aplicada a Supabase.
-- Supone public.profiles existente con id UUID PRIMARY KEY.
-- Revisar triggers y políticas existentes en una base de desarrollo antes de integrar.
-- No implementa pagos, CRUD de productos ni cumplimiento de cuotas de publicación.
begin;

alter table public.profiles
  add column if not exists account_type text not null default 'personal';

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conrelid = 'public.profiles'::regclass
      and conname = 'profiles_account_type_check'
  ) then
    alter table public.profiles add constraint profiles_account_type_check
      check (account_type in ('personal', 'store'));
  end if;
end;
$$;

-- Compatibilidad con las tiendas previamente identificadas por store_name.
update public.profiles
set account_type = 'store'
where account_type = 'personal' and nullif(btrim(store_name), '') is not null;

create table if not exists public.plans (
  id text primary key,
  name text not null,
  monthly_price numeric(10, 2) not null check (monthly_price >= 0),
  annual_monthly_price numeric(10, 2) not null check (annual_monthly_price >= 0),
  account_types text[] not null check (
    cardinality(account_types) > 0
    and account_types <@ array['personal', 'store']::text[]
  ),
  active_listing_limit integer not null check (active_listing_limit > 0),
  monthly_video_limit integer not null check (monthly_video_limit >= 0),
  video_duration_seconds integer not null check (video_duration_seconds > 0),
  photos_per_listing integer not null check (photos_per_listing > 0),
  active_auction_limit integer not null check (
    active_auction_limit >= 0 and active_auction_limit <= active_listing_limit
  )
);

insert into public.plans (
  id, name, monthly_price, annual_monthly_price, account_types,
  active_listing_limit, monthly_video_limit, video_duration_seconds,
  photos_per_listing, active_auction_limit
) values
  ('free', 'Básico', 0, 0, array['personal', 'store'], 25, 5, 60, 5, 1),
  ('personal', 'Personal Pro', 99, 79, array['personal'], 100, 30, 90, 10, 5),
  ('business', 'Tienda Pro', 249, 199, array['store'], 500, 100, 120, 15, 20)
on conflict (id) do update set
  name = excluded.name,
  monthly_price = excluded.monthly_price,
  annual_monthly_price = excluded.annual_monthly_price,
  account_types = excluded.account_types,
  active_listing_limit = excluded.active_listing_limit,
  monthly_video_limit = excluded.monthly_video_limit,
  video_duration_seconds = excluded.video_duration_seconds,
  photos_per_listing = excluded.photos_per_listing,
  active_auction_limit = excluded.active_auction_limit;

create table if not exists public.subscriptions (
  profile_id uuid primary key references public.profiles(id) on delete cascade,
  plan_id text not null references public.plans(id),
  billing_period text not null check (billing_period in ('monthly', 'annual')),
  status text not null default 'pending'
    check (status in ('pending', 'active', 'canceled', 'expired')),
  starts_at timestamptz not null default now(),
  ends_at timestamptz,
  created_at timestamptz not null default now(),
  check (ends_at is null or ends_at > starts_at),
  check (plan_id = 'free' or status <> 'active' or ends_at is not null)
);

-- Sin suscripción activa y vigente, el servicio de publicación deberá aplicar Básico.
-- El historial de pagos/cambios se incorporará aparte: esta tabla es el estado actual.
-- La elegibilidad del plan respecto a account_type debe comprobarse en la operación
-- administrativa que activa/cambia la suscripción y también al cambiar account_type.
-- Nunca aceptar plan_id o status del cliente sin verificar autorización y contratación.

alter table public.plans enable row level security;
alter table public.subscriptions enable row level security;

revoke all on public.plans from public, anon, authenticated;
revoke all on public.subscriptions from public, anon, authenticated;
grant select on public.plans to anon, authenticated;
grant select on public.subscriptions to authenticated;
grant select, insert, update, delete on public.plans to service_role;
grant select, insert, update, delete on public.subscriptions to service_role;

drop policy if exists plans_public_read on public.plans;
create policy plans_public_read on public.plans
  for select to anon, authenticated using (true);

drop policy if exists subscriptions_owner_read on public.subscriptions;
create policy subscriptions_owner_read on public.subscriptions
  for select to authenticated using ((select auth.uid()) = profile_id);

-- No se crean políticas de escritura de suscripciones para el navegador.
-- La clave privilegiada debe permanecer exclusivamente en el servidor.
-- No se modifican aquí las políticas de profiles: deben revisarse por separado
-- para impedir que el propietario se asigne role=admin o is_verified=true.

commit;
