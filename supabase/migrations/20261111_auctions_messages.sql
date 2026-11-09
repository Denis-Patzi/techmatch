-- TechMatch: pujas con plazo fijo y mensajería privada.
-- Ejecutar después de 20261109_unified_accounts.sql y 20261110_products_crud.sql.
-- Las subastas ya publicadas empiezan HOY por 3 días. No inventa pujas ni mensajes.
begin;

alter table public.products add column if not exists auction_duration_days integer not null default 3
  check (auction_duration_days between 3 and 5);

create table if not exists public.auctions (
  product_id uuid primary key references public.products(id) on delete cascade,
  seller_id uuid not null references auth.users(id),
  starts_at timestamptz not null default clock_timestamp(),
  ends_at timestamptz not null,
  cancelled_at timestamptz,
  check (ends_at > starts_at)
);
create table if not exists public.auction_bids (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.auctions(product_id) on delete cascade,
  bidder_id uuid not null references auth.users(id),
  amount numeric(12,2) not null check (amount > 0 and amount <= 99999999),
  created_at timestamptz not null default clock_timestamp()
);
create index if not exists auction_bids_top_idx on public.auction_bids(product_id, amount desc);
create index if not exists auction_bids_bidder_idx on public.auction_bids(bidder_id);

-- Nadie puede cambiar el reloj, adjudicarse una subasta o insertar pujas desde el cliente.
alter table public.auctions enable row level security;
alter table public.auction_bids enable row level security;
revoke all on public.auctions, public.auction_bids from public, anon, authenticated;
grant all on public.auctions, public.auction_bids to service_role;

create or replace function app_private.guard_auction_product()
returns trigger language plpgsql security definer set search_path = '' as $$
declare
  auction public.auctions;
  has_bids boolean;
begin
  select * into auction from public.auctions where product_id=old.id for update;
  if found then
    select exists(select 1 from public.auction_bids where product_id=old.id) into has_bids;
    if tg_op='DELETE' then
      if has_bids then
        raise exception 'No se puede eliminar una subasta con pujas. Conservá su historial.' using errcode='P0001';
      end if;
      return old;
    end if;
    if has_bids and (new.price is distinct from old.price
      or new.listing_type is distinct from old.listing_type
      or new.auction_duration_days is distinct from old.auction_duration_days
      or new.title is distinct from old.title or new.description is distinct from old.description
      or new.condition is distinct from old.condition or new.category is distinct from old.category
      or new.media_path is distinct from old.media_path or new.cover_key is distinct from old.cover_key
      or new.city is distinct from old.city) then
      raise exception 'La subasta ya tiene pujas: no se pueden cambiar el producto, precio o plazo.' using errcode='P0001';
    end if;
    if has_bids and new.status is distinct from old.status then
      if not ((old.status='published' and new.status='sold' and auction.ends_at<=clock_timestamp() and auction.cancelled_at is null)
        or (app_private.is_admin() and new.status='draft' and auction.ends_at>clock_timestamp())) then
        raise exception 'Una subasta con pujas mantiene su publicación hasta el cierre. Después puede marcarse vendida.' using errcode='P0001';
      end if;
    end if;
    if (new.listing_type is distinct from old.listing_type
      or new.auction_duration_days is distinct from old.auction_duration_days) then
      raise exception 'El tipo y el plazo quedan fijos al iniciar la subasta. Creá otra publicación.' using errcode='P0001';
    end if;
    if new.status<>'published' and old.status='published'
      and not (new.status='sold' and auction.ends_at<=clock_timestamp()) then
      update public.auctions set cancelled_at=coalesce(cancelled_at,clock_timestamp()) where product_id=old.id;
    end if;
    if auction.cancelled_at is not null and new.status='published' and old.status<>'published' then
      raise exception 'Una subasta cancelada no se reinicia. Creá una nueva publicación.' using errcode='P0001';
    end if;
  end if;
  if tg_op='DELETE' then return old; end if;
  return new;
end;
$$;
revoke all on function app_private.guard_auction_product() from public;
drop trigger if exists techmatch_guard_auction_product on public.products;
create trigger techmatch_guard_auction_product before update or delete on public.products
  for each row execute function app_private.guard_auction_product();

create or replace function app_private.start_product_auction()
returns trigger language plpgsql security definer set search_path = '' as $$
declare started timestamptz := clock_timestamp();
begin
  if new.listing_type='auction' and new.status='published' then
    insert into public.auctions(product_id,seller_id,starts_at,ends_at)
    values(new.id,new.owner_id,started,started+make_interval(days=>new.auction_duration_days))
    on conflict(product_id) do nothing;
  end if;
  return new;
end;
$$;
revoke all on function app_private.start_product_auction() from public;
drop trigger if exists techmatch_start_product_auction on public.products;
create trigger techmatch_start_product_auction after insert or update on public.products
  for each row execute function app_private.start_product_auction();
insert into public.auctions(product_id,seller_id,starts_at,ends_at)
select id,owner_id,now(),now()+make_interval(days=>auction_duration_days)
from public.products where listing_type='auction' and status='published'
on conflict(product_id) do nothing;

create or replace function public.place_auction_bid(p_product_id uuid,p_amount numeric)
returns uuid language plpgsql security definer set search_path = '' as $$
declare
  actor uuid := auth.uid();
  product public.products;
  auction public.auctions;
  highest numeric;
  result uuid;
  accepted_at timestamptz;
begin
  if actor is null then raise exception 'Iniciá sesión para pujar.' using errcode='42501'; end if;
  -- Mismo orden de bloqueo que el CRUD: producto y después subasta.
  select * into product from public.products where id=p_product_id for update;
  if not found then raise exception 'La publicación no está disponible.' using errcode='P0001'; end if;
  select * into auction from public.auctions where product_id=p_product_id for update;
  if not found or product.listing_type<>'auction' or product.status<>'published'
    or auction.cancelled_at is not null then
    raise exception 'Esta subasta no está activa.' using errcode='P0001';
  end if;
  if auction.ends_at<=clock_timestamp() then
    raise exception 'La subasta ya finalizó.' using errcode='P0001';
  end if;
  if actor=product.owner_id then
    raise exception 'No podés pujar por tu propio producto.' using errcode='P0001';
  end if;
  if not exists(select 1 from public.profiles where id=actor) then
    raise exception 'Completá tu perfil antes de pujar.' using errcode='P0001';
  end if;
  if p_amount is null or p_amount<=0 or p_amount>99999999 or p_amount<>round(p_amount,2) then
    raise exception 'Ingresá un importe válido con hasta dos decimales.' using errcode='P0001';
  end if;
  select max(amount) into highest from public.auction_bids where product_id=p_product_id;
  if p_amount<product.price or (highest is not null and p_amount<highest+1) then
    raise exception 'La puja debe alcanzar el precio base y superar la oferta actual por al menos Bs. 1.' using errcode='P0001';
  end if;
  accepted_at := clock_timestamp();
  if auction.ends_at<=accepted_at then
    raise exception 'La subasta ya finalizó.' using errcode='P0001';
  end if;
  insert into public.auction_bids(product_id,bidder_id,amount,created_at)
    values(p_product_id,actor,p_amount,accepted_at) returning id into result;
  return result;
end;
$$;

-- El resultado se determina por hora del servidor, incluso sin navegadores abiertos.
-- No requiere cron: pasada ends_at, no se admiten pujas y el máximo queda definitivo.
create or replace function public.get_auction_states(p_product_ids uuid[])
returns table(product_id uuid,starts_at timestamptz,ends_at timestamptz,server_now timestamptz,
  state text,current_price numeric,bid_count bigint,minimum_bid numeric,
  is_leading boolean,is_winner boolean,winner_name text)
language sql security definer set search_path = '' as $$
  select a.product_id,a.starts_at,a.ends_at,statement_timestamp(),
    case when a.cancelled_at is not null then 'cancelled'
      when a.ends_at<=statement_timestamp() then 'ended' else 'active' end,
    coalesce(b.amount,p.price),counts.total,
    case when b.amount is null then p.price else b.amount+1 end,
    coalesce(b.bidder_id=auth.uid(),false),
    coalesce(a.cancelled_at is null and a.ends_at<=statement_timestamp() and b.bidder_id=auth.uid(),false),
    case when b.bidder_id is not null and a.cancelled_at is null and a.ends_at<=statement_timestamp()
      and (auth.uid()=a.seller_id or auth.uid()=b.bidder_id)
      then coalesce(nullif(pr.full_name,''),'Participante') else null end
  from public.auctions a join public.products p on p.id=a.product_id
  left join lateral (select x.amount,x.bidder_id from public.auction_bids x
    where x.product_id=a.product_id order by x.amount desc limit 1) b on true
  left join public.profiles pr on pr.id=b.bidder_id
  cross join lateral (select count(*) total from public.auction_bids x where x.product_id=a.product_id) counts
  where auth.uid() is not null and a.product_id=any(p_product_ids)
    and (p.status='published' or p.owner_id=auth.uid() or app_private.is_admin()
      or exists(select 1 from public.auction_bids own where own.product_id=p.id and own.bidder_id=auth.uid()));
$$;
create or replace function public.get_auction_bid_history(p_product_id uuid)
returns table(id uuid,amount numeric,created_at timestamptz,is_mine boolean)
language sql security definer set search_path = '' as $$
  select b.id,b.amount,b.created_at,b.bidder_id=auth.uid()
  from public.auction_bids b join public.products p on p.id=b.product_id
  where b.product_id=p_product_id and auth.uid() is not null
    and (p.status='published' or p.owner_id=auth.uid() or app_private.is_admin()
      or exists(select 1 from public.auction_bids own where own.product_id=p.id and own.bidder_id=auth.uid()))
  order by b.amount desc limit 20;
$$;

create table if not exists public.conversations (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references public.products(id) on delete set null,
  product_title text not null,
  buyer_id uuid not null references auth.users(id) on delete cascade,
  seller_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default clock_timestamp(),
  last_message_at timestamptz not null default clock_timestamp(),
  buyer_read_at timestamptz,
  seller_read_at timestamptz,
  unique(product_id,buyer_id,seller_id),
  check(buyer_id<>seller_id)
);
create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  sender_id uuid not null references auth.users(id) on delete cascade,
  body text not null check(char_length(btrim(body)) between 1 and 2000),
  created_at timestamptz not null default clock_timestamp()
);
create index if not exists messages_conversation_idx on public.messages(conversation_id,created_at desc,id desc);
create index if not exists conversations_buyer_idx on public.conversations(buyer_id,last_message_at desc);
create index if not exists conversations_seller_idx on public.conversations(seller_id,last_message_at desc);
alter table public.conversations enable row level security;
alter table public.messages enable row level security;
revoke all on public.conversations,public.messages from public,anon,authenticated;
grant select on public.conversations,public.messages to authenticated;
grant all on public.conversations,public.messages to service_role;
drop policy if exists conversations_participants on public.conversations;
create policy conversations_participants on public.conversations for select to authenticated
  using ((select auth.uid()) in (buyer_id,seller_id));
drop policy if exists messages_participants on public.messages;
create policy messages_participants on public.messages for select to authenticated
  using (exists(select 1 from public.conversations c where c.id=conversation_id
    and (select auth.uid()) in (c.buyer_id,c.seller_id)));

create or replace function public.open_product_conversation(p_product_id uuid)
returns uuid language plpgsql security definer set search_path = '' as $$
declare actor uuid := auth.uid(); product public.products; result uuid;
begin
  if actor is null then raise exception 'Iniciá sesión para contactar.' using errcode='42501'; end if;
  select * into product from public.products where id=p_product_id;
  if not found or product.status<>'published' then
    raise exception 'El producto ya no está disponible para iniciar un contacto.' using errcode='P0001';
  end if;
  if actor=product.owner_id then
    raise exception 'Los mensajes de tus compradores aparecen en tu bandeja.' using errcode='P0001';
  end if;
  insert into public.conversations(product_id,product_title,buyer_id,seller_id)
  values(product.id,product.title,actor,product.owner_id)
  on conflict(product_id,buyer_id,seller_id) do update set product_title=excluded.product_title
  returning id into result;
  return result;
end;
$$;

create or replace function public.contact_auction_winner(p_product_id uuid)
returns uuid language plpgsql security definer set search_path = '' as $$
declare auction public.auctions; winner uuid; result uuid; title text;
begin
  select * into auction from public.auctions where product_id=p_product_id;
  if not found or auth.uid() is distinct from auction.seller_id then
    raise exception 'Solo el vendedor puede contactar al ganador.' using errcode='42501';
  end if;
  if auction.cancelled_at is not null or auction.ends_at>clock_timestamp() then
    raise exception 'Esperá al cierre de la subasta.' using errcode='P0001';
  end if;
  select bidder_id into winner from public.auction_bids where product_id=p_product_id order by amount desc limit 1;
  if winner is null then raise exception 'La subasta finalizó sin pujas.' using errcode='P0001'; end if;
  select p.title into title from public.products p where p.id=p_product_id;
  insert into public.conversations(product_id,product_title,buyer_id,seller_id)
  values(p_product_id,title,winner,auction.seller_id)
  on conflict(product_id,buyer_id,seller_id) do update set product_title=excluded.product_title
  returning id into result;
  return result;
end;
$$;

create or replace function public.get_my_conversations()
returns table(id uuid,product_id uuid,product_title text,other_name text,
  last_message text,last_message_at timestamptz,unread_count bigint)
language sql security definer set search_path = '' as $$
  select c.id,c.product_id,c.product_title,
    coalesce(case when pr.account_type='store' then nullif(pr.store_name,'') else nullif(pr.full_name,'') end,'Cuenta de TechMatch'),
    latest.body,c.last_message_at,
    (select count(*) from public.messages m where m.conversation_id=c.id and m.sender_id<>auth.uid()
      and m.created_at>coalesce(case when c.buyer_id=auth.uid() then c.buyer_read_at else c.seller_read_at end,'-infinity'::timestamptz))
  from public.conversations c
  left join public.profiles pr on pr.id=case when c.buyer_id=auth.uid() then c.seller_id else c.buyer_id end
  left join lateral(select m.body from public.messages m where m.conversation_id=c.id
    order by m.created_at desc,m.id desc limit 1) latest on true
  where auth.uid() in (c.buyer_id,c.seller_id)
  order by c.last_message_at desc,c.id;
$$;

create or replace function public.get_conversation_messages(p_conversation_id uuid,
  p_before timestamptz default null,p_before_id uuid default null)
returns table(id uuid,sender_id uuid,body text,created_at timestamptz)
language plpgsql security definer set search_path = '' as $$
begin
  if not exists(select 1 from public.conversations c where c.id=p_conversation_id
    and auth.uid() in (c.buyer_id,c.seller_id)) then
    raise exception 'No tenés acceso a esta conversación.' using errcode='42501';
  end if;
  return query select m.id,m.sender_id,m.body,m.created_at from public.messages m
    where m.conversation_id=p_conversation_id
      and (p_before is null or (m.created_at,m.id)<(p_before,p_before_id))
    order by m.created_at desc,m.id desc limit 50;
end;
$$;

create or replace function public.send_conversation_message(p_conversation_id uuid,p_body text,p_client_id uuid)
returns uuid language plpgsql security definer set search_path = '' as $$
declare actor uuid := auth.uid(); convo public.conversations; existing public.messages; sent_at timestamptz;
begin
  select * into convo from public.conversations where id=p_conversation_id for update;
  if not found or actor is null or actor not in (convo.buyer_id,convo.seller_id) then
    raise exception 'No tenés acceso a esta conversación.' using errcode='42501';
  end if;
  if p_body is null or char_length(btrim(p_body)) not between 1 and 2000 or p_client_id is null then
    raise exception 'Escribí un mensaje de 1 a 2000 caracteres.' using errcode='P0001';
  end if;
  select * into existing from public.messages where id=p_client_id;
  if found then
    if existing.conversation_id=p_conversation_id and existing.sender_id=actor and existing.body=btrim(p_body) then
      return existing.id;
    end if;
    raise exception 'El identificador de mensaje ya fue utilizado.' using errcode='P0001';
  end if;
  sent_at := clock_timestamp();
  insert into public.messages(id,conversation_id,sender_id,body,created_at)
  values(p_client_id,p_conversation_id,actor,btrim(p_body),sent_at);
  update public.conversations set last_message_at=sent_at where id=p_conversation_id;
  return p_client_id;
end;
$$;

-- Marca solo hasta el último mensaje efectivamente cargado, no hasta la hora del polling.
create or replace function public.mark_conversation_read(p_conversation_id uuid,p_last_message_id uuid)
returns void language plpgsql security definer set search_path = '' as $$
declare read_until timestamptz; actor uuid := auth.uid();
begin
  if not exists(select 1 from public.conversations c where c.id=p_conversation_id
    and actor in(c.buyer_id,c.seller_id)) then
    raise exception 'No tenés acceso a esta conversación.' using errcode='42501';
  end if;
  select created_at into read_until from public.messages where id=p_last_message_id and conversation_id=p_conversation_id;
  if read_until is null then return; end if;
  update public.conversations set
    buyer_read_at=case when buyer_id=actor then greatest(buyer_read_at,read_until) else buyer_read_at end,
    seller_read_at=case when seller_id=actor then greatest(seller_read_at,read_until) else seller_read_at end
  where id=p_conversation_id;
end;
$$;

revoke all on function public.place_auction_bid(uuid,numeric), public.get_auction_states(uuid[]),
  public.get_auction_bid_history(uuid),public.open_product_conversation(uuid),public.contact_auction_winner(uuid),
  public.get_my_conversations(),public.get_conversation_messages(uuid,timestamptz,uuid),
  public.send_conversation_message(uuid,text,uuid),public.mark_conversation_read(uuid,uuid) from public,anon;
grant execute on function public.place_auction_bid(uuid,numeric), public.get_auction_states(uuid[]),
  public.get_auction_bid_history(uuid),public.open_product_conversation(uuid),public.contact_auction_winner(uuid),
  public.get_my_conversations(),public.get_conversation_messages(uuid,timestamptz,uuid),
  public.send_conversation_message(uuid,text,uuid),public.mark_conversation_read(uuid,uuid) to authenticated;

notify pgrst,'reload schema';
commit;
