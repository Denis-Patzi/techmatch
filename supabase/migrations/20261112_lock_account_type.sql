-- TechMatch: el tipo se elige en el registro; solo un administrador puede cambiarlo.
-- Ejecutar después de 20261109_unified_accounts.sql. Conserva los tipos actuales.
begin;

create or replace function app_private.lock_profile_account_type()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  if new.account_type is distinct from old.account_type
    and auth.uid() is not null and not app_private.is_admin() then
    raise exception 'Solo el administrador puede cambiar el tipo de cuenta.' using errcode='42501';
  end if;
  return new;
end;
$$;
revoke all on function app_private.lock_profile_account_type() from public;

-- Se suma al guard existente: conserva la protección de rol, verificación e identidad.
-- SQL Editor y los procesos internos sin sesión siguen siendo administración de confianza.
drop trigger if exists techmatch_lock_account_type on public.profiles;
create trigger techmatch_lock_account_type before update on public.profiles
  for each row execute function app_private.lock_profile_account_type();

notify pgrst,'reload schema';
commit;
