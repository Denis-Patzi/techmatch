-- TechMatch: aplicación unificada para cuentas personales y tiendas.
-- Ejecutar manualmente en Supabase > SQL Editor, sobre el proyecto correcto.
-- Requiere profiles con los campos informados y profiles.id UUID PRIMARY KEY.
-- Conserva perfiles/roles existentes. Añade account_type y protege el perfil.
-- REEMPLAZA las políticas RLS de profiles por propietario/administrador.
-- No crea productos, pagos, suscripciones ni almacenamiento multimedia.
begin;

create schema if not exists app_private;
revoke all on schema app_private from public;
grant usage on schema app_private to authenticated, service_role;

alter table public.profiles add column if not exists account_type text;
update public.profiles
set account_type = case
  when nullif(btrim(store_name), '') is not null then 'store' else 'personal' end
where account_type is null;
alter table public.profiles alter column account_type set default 'personal';
alter table public.profiles alter column account_type set not null;

do $$
begin
  if not exists (select 1 from pg_constraint
    where conrelid = 'public.profiles'::regclass
      and conname = 'profiles_account_type_check') then
    alter table public.profiles add constraint profiles_account_type_check
      check (account_type in ('personal', 'store'));
  end if;
end;
$$;

-- La función consulta el rol sin recursión sobre las políticas de profiles.
create or replace function app_private.is_admin()
returns boolean language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.profiles
    where id = (select auth.uid()) and role = 'admin');
$$;
revoke all on function app_private.is_admin() from public;
grant execute on function app_private.is_admin() to authenticated, service_role;

create or replace function app_private.protect_profile()
returns trigger language plpgsql security definer set search_path = '' as $$
declare
  metadata jsonb := '{}'::jsonb;
begin
  if tg_op = 'INSERT' then
    -- Compatible con el trigger de alta existente: normaliza el registro nuevo.
    -- Nunca confiar en role/is_verified incluidos en los metadatos del cliente.
    select coalesce(raw_user_meta_data, '{}'::jsonb) into metadata
      from auth.users where id = new.id;
    metadata := coalesce(metadata, '{}'::jsonb);
    new.role := 'buyer';
    new.is_verified := false;
    new.full_name := coalesce(nullif(btrim(new.full_name), ''),
      nullif(btrim(metadata ->> 'full_name'), ''), 'Mi cuenta');
    new.phone := coalesce(new.phone, nullif(metadata ->> 'phone', ''));
    new.city := coalesce(new.city, nullif(metadata ->> 'city', ''));
    new.store_name := coalesce(nullif(btrim(new.store_name), ''),
      nullif(btrim(metadata ->> 'store_name'), ''));
    new.nit := coalesce(new.nit, nullif(metadata ->> 'nit', ''));
    if metadata ->> 'account_type' = 'store' then
      new.account_type := 'store';
    elsif metadata ->> 'account_type' = 'personal' then
      new.account_type := 'personal';
    else
      new.account_type := case when new.store_name is not null then 'store' else 'personal' end;
    end if;
    new.created_at := coalesce(new.created_at, now());
  else
    if new.id is distinct from old.id then
      raise exception 'No se puede cambiar el propietario del perfil.' using errcode = '42501';
    end if;
    if (select auth.uid()) is not null and not app_private.is_admin() then
      if new.role is distinct from old.role
        or new.is_verified is distinct from old.is_verified
        or new.created_at is distinct from old.created_at then
        raise exception 'El rol, la verificación y la fecha no se pueden editar desde el perfil.'
          using errcode = '42501';
      end if;
      if new.account_type is distinct from old.account_type
        or new.full_name is distinct from old.full_name
        or new.store_name is distinct from old.store_name
        or new.nit is distinct from old.nit then
        new.is_verified := false;
      end if;
    end if;
  end if;

  if new.account_type = 'personal' then
    new.store_name := null;
    new.nit := null;
  elsif new.account_type = 'store' then
    new.store_name := btrim(new.store_name);
    if new.store_name is null or char_length(new.store_name) < 2 then
      raise exception 'La cuenta de tienda necesita un nombre comercial.' using errcode = '23514';
    end if;
  else
    raise exception 'Tipo de cuenta inválido.' using errcode = '23514';
  end if;
  return new;
end;
$$;
revoke all on function app_private.protect_profile() from public;
drop trigger if exists techmatch_protect_profile on public.profiles;
create trigger techmatch_protect_profile before insert or update on public.profiles
  for each row execute function app_private.protect_profile();

-- Recupera únicamente el perfil del usuario autenticado. No recibe otro id.
-- Sirve si el proyecto todavía no tiene un trigger que cree profiles al registrarse.
create or replace function public.ensure_my_profile()
returns public.profiles language plpgsql security definer set search_path = '' as $$
declare
  current_id uuid := (select auth.uid());
  metadata jsonb;
  result public.profiles;
begin
  if current_id is null then
    raise exception 'Se necesita una sesión.' using errcode = '42501';
  end if;
  select * into result from public.profiles where id = current_id;
  if found then return result; end if;
  select coalesce(raw_user_meta_data, '{}'::jsonb) into metadata
    from auth.users where id = current_id;
  if not found then
    raise exception 'La cuenta de autenticación no existe.' using errcode = '42501';
  end if;
  insert into public.profiles (id, role, full_name, phone, city, store_name, nit, is_verified, created_at, account_type)
  values (current_id, 'buyer', coalesce(nullif(btrim(metadata ->> 'full_name'), ''), 'Mi cuenta'),
    nullif(metadata ->> 'phone', ''), nullif(metadata ->> 'city', ''),
    nullif(btrim(metadata ->> 'store_name'), ''), nullif(metadata ->> 'nit', ''),
    false, now(), case when metadata ->> 'account_type' = 'store' then 'store' else 'personal' end)
  on conflict (id) do nothing;
  select * into result from public.profiles where id = current_id;
  return result;
end;
$$;
revoke all on function public.ensure_my_profile() from public, anon;
grant execute on function public.ensure_my_profile() to authenticated;

alter table public.profiles enable row level security;

-- Se sustituyen políticas anteriores para que una política amplia no eluda
-- el aislamiento entre cuentas. El guard anterior conserva los campos reservados.
do $$
declare policy_record record;
begin
  for policy_record in select policyname from pg_policies
    where schemaname = 'public' and tablename = 'profiles'
  loop
    execute format('drop policy %I on public.profiles', policy_record.policyname);
  end loop;
end;
$$;

revoke all on public.profiles from public, anon, authenticated;
grant select, update, delete on public.profiles to authenticated;
grant select, insert, update, delete on public.profiles to service_role;

create policy profiles_read_own_or_admin on public.profiles for select to authenticated
  using ((select auth.uid()) = id or (select app_private.is_admin()));
create policy profiles_update_own_or_admin on public.profiles for update to authenticated
  using ((select auth.uid()) = id or (select app_private.is_admin()))
  with check ((select auth.uid()) = id or (select app_private.is_admin()));
create policy profiles_delete_admin on public.profiles for delete to authenticated
  using ((select app_private.is_admin()) and id <> (select auth.uid()));

-- No se cambia ningún comprador/vendedor existente a administrador.
-- Para el primer administrador, usar solo SQL Editor o un servicio de confianza
-- sobre una cuenta existente; el registro público nunca concede ese permiso.
commit;
