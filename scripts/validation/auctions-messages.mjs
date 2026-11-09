// PostgreSQL embebido de prueba: nunca conecta con Supabase ni crea cuentas reales.
// node scripts/validation/auctions-messages.mjs [URL del módulo @electric-sql/pglite]
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
const { PGlite } = await import(process.argv[2] || '@electric-sql/pglite');
const db = new PGlite();
const users = {
  seller: '00000000-0000-4000-8000-000000000001',
  buyer: '00000000-0000-4000-8000-000000000002',
  rival: '00000000-0000-4000-8000-000000000003',
  outsider: '00000000-0000-4000-8000-000000000004',
  admin: '00000000-0000-4000-8000-000000000005',
};
let checks = 0;
async function test(name, run) {
  await run();
  checks++;
  console.log(`OK ${name}`);
}
async function actor(name, run) {
  await db.query("select set_config('request.jwt.claim.sub',$1,false)", [
    users[name] || '',
  ]);
  await db.exec('set role authenticated');
  try {
    return await run();
  } finally {
    await db.exec('reset role');
    await db.exec("select set_config('request.jwt.claim.sub','',false)");
  }
}
const query = async (sql, args = []) => (await db.query(sql, args)).rows;
const rpc = async (sql, args) => (await query(sql, args))[0];
const rejected = (sql, args, match) =>
  assert.rejects(() => db.query(sql, args), match);
async function product({
  type = 'auction',
  status = 'published',
  days = 3,
} = {}) {
  return actor(
    'seller',
    async () =>
      (
        await query(
          `insert into public.products
    (owner_id,title,description,price,category,condition,city,listing_type,status,auction_duration_days)
    values($1,'Laptop de prueba','Descripción del producto de prueba',100,'Computación','Usado','La Paz',$2,$3,$4) returning id`,
          [users.seller, type, status, days]
        )
      )[0].id
  );
}
const state = (id) =>
  rpc('select * from public.get_auction_states(array[$1::uuid])', [id]);
const bid = (id, amount) =>
  db.query('select public.place_auction_bid($1,$2)', [id, amount]);
try {
  await db.exec(`create role anon; create role authenticated; create role service_role;
    create schema auth; create schema storage;
    create table auth.users(id uuid primary key,raw_user_meta_data jsonb default '{}');
    create function auth.uid() returns uuid language sql stable as
      $$select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid$$;
    grant usage on schema auth,public,storage to authenticated,anon,service_role;
    create table public.profiles(id uuid primary key references auth.users(id),role text,full_name text,
      phone text,city text,store_name text,nit text,is_verified boolean,created_at timestamptz);
    create table storage.buckets(id text primary key,name text,public boolean,file_size_limit bigint,allowed_mime_types text[]);
    create table storage.objects(id uuid,bucket_id text,name text);
    create function storage.foldername(text) returns text[] language sql immutable as $$select string_to_array($1,'/')$$;`);
  for (const [name, id] of Object.entries(users)) {
    await db.query('insert into auth.users(id) values($1)', [id]);
    await db.query(
      `insert into public.profiles(id,role,full_name,city,is_verified,created_at)
      values($1,$2,$3,'La Paz',false,now())`,
      [id, name === 'admin' ? 'admin' : 'buyer', name]
    );
  }
  for (const migration of [
    '20261109_unified_accounts.sql',
    '20261110_products_crud.sql',
    '20261111_auctions_messages.sql',
    '20261112_lock_account_type.sql',
  ])
    await db.exec(
      await readFile(
        new URL(`../../supabase/migrations/${migration}`, import.meta.url),
        'utf8'
      )
    );
  await test('Migración repetible sin borrar datos', async () => {
    await db.exec(
      await readFile(
        new URL(
          '../../supabase/migrations/20261111_auctions_messages.sql',
          import.meta.url
        ),
        'utf8'
      )
    );
  });
  await test('Bloqueo de tipo repetible y sin alterar cuentas existentes', async () => {
    const before = await query(
      'select id,account_type from public.profiles order by id'
    );
    await db.exec(
      await readFile(
        new URL(
          '../../supabase/migrations/20261112_lock_account_type.sql',
          import.meta.url
        ),
        'utf8'
      )
    );
    assert.deepEqual(
      await query('select id,account_type from public.profiles order by id'),
      before
    );
  });
  await test('Elegir personal o tienda al registrarse sigue habilitado', async () => {
    for (const [name, type, id] of [
      [
        'registeredPersonal',
        'personal',
        '20000000-0000-4000-8000-000000000001',
      ],
      ['registeredStore', 'store', '20000000-0000-4000-8000-000000000002'],
    ]) {
      users[name] = id;
      await db.query(
        'insert into auth.users(id,raw_user_meta_data) values($1,$2)',
        [
          id,
          JSON.stringify({
            account_type: type,
            full_name: 'Nueva cuenta',
            store_name: 'Nueva tienda',
          }),
        ]
      );
      await actor(name, async () => {
        const result = await rpc('select * from public.ensure_my_profile()');
        assert.equal(result.account_type, type);
        assert.equal(result.role, 'buyer');
      });
    }
  });
  await test('Una cuenta personal no puede convertirse en tienda desde la API', () =>
    actor('buyer', () =>
      rejected(
        "update public.profiles set account_type='store',store_name='Tienda alterada' where id=$1",
        [users.buyer],
        /Solo el administrador/
      )
    ));
  await test('El administrador puede convertir personal a tienda', async () => {
    await actor('admin', () =>
      db.query(
        "update public.profiles set account_type='store',store_name='Tienda autorizada',nit='123456' where id=$1",
        [users.buyer]
      )
    );
    await actor('buyer', async () => {
      const [p] = await query('select * from public.profiles where id=$1', [
        users.buyer,
      ]);
      assert.equal(p.account_type, 'store');
      assert.equal(p.store_name, 'Tienda autorizada');
    });
  });
  await test('Una tienda no puede convertirse en personal desde la API', () =>
    actor('buyer', () =>
      rejected(
        "update public.profiles set account_type='personal' where id=$1",
        [users.buyer],
        /Solo el administrador/
      )
    ));
  await test('Editar datos normales conserva el tipo y la protección de verificación', async () => {
    await actor('admin', () =>
      db.query('update public.profiles set is_verified=true where id=$1', [
        users.buyer,
      ])
    );
    await actor('buyer', async () => {
      await db.query(
        "update public.profiles set phone='77777777',city='La Paz' where id=$1",
        [users.buyer]
      );
      let [p] = await query('select * from public.profiles where id=$1', [
        users.buyer,
      ]);
      assert.equal(p.account_type, 'store');
      assert.equal(p.is_verified, true);
      await db.query(
        "update public.profiles set store_name='Mi tienda actualizada' where id=$1",
        [users.buyer]
      );
      [p] = await query('select * from public.profiles where id=$1', [
        users.buyer,
      ]);
      assert.equal(p.account_type, 'store');
      assert.equal(p.is_verified, false);
    });
  });
  await test('El administrador puede convertir tienda a personal y limpiar datos comerciales', async () => {
    await actor('admin', () =>
      db.query(
        "update public.profiles set account_type='personal' where id=$1",
        [users.buyer]
      )
    );
    await actor('buyer', async () => {
      const [p] = await query('select * from public.profiles where id=$1', [
        users.buyer,
      ]);
      assert.equal(p.account_type, 'personal');
      assert.equal(p.store_name, null);
      assert.equal(p.nit, null);
    });
  });
  const id = await product({ days: 5 });
  await test('Plazo del servidor de 5 días', () =>
    actor('buyer', async () => {
      const a = await state(id);
      assert.equal(
        (Date.parse(a.ends_at) - Date.parse(a.starts_at)) / 86400000,
        5
      );
      assert.equal(a.state, 'active');
    }));
  await test('Solo 3, 4 o 5 días; el borrador inicia al publicar', async () => {
    await assert.rejects(() => product({ days: 2 }));
    const draft = await product({ days: 4, status: 'draft' });
    assert.equal(
      (
        await query('select * from public.auctions where product_id=$1', [
          draft,
        ])
      ).length,
      0
    );
    await actor('seller', () =>
      db.query("update public.products set status='published' where id=$1", [
        draft,
      ])
    );
    const [a] = await query(
      'select * from public.auctions where product_id=$1',
      [draft]
    );
    assert.equal(
      (Date.parse(a.ends_at) - Date.parse(a.starts_at)) / 86400000,
      4
    );
  });
  await test('Rechazar puja propia, debajo de base, precisión y sesión ausente', async () => {
    await actor('seller', () => assert.rejects(() => bid(id, 120), /propio/));
    await actor('buyer', async () => {
      await assert.rejects(() => bid(id, 99), /precio base/);
      await assert.rejects(() => bid(id, 100.001), /decimales/);
      await assert.rejects(() => bid(id, 'NaN'), /válido/);
    });
    await actor(null, () => assert.rejects(() => bid(id, 100), /sesión/));
  });
  await test('Primera puja al precio base y oferta persistente sin extender plazo', () =>
    actor('buyer', async () => {
      const before = await state(id);
      await bid(id, 100);
      const after = await state(id);
      assert.equal(Number(after.current_price), 100);
      assert.equal(Number(after.bid_count), 1);
      assert.equal(after.is_leading, true);
      assert.equal(Date.parse(before.ends_at), Date.parse(after.ends_at));
    }));
  await test('Rechazar importe igual o incremento menor a Bs. 1', () =>
    actor('rival', async () => {
      await assert.rejects(() => bid(id, 100), /superar/);
      await assert.rejects(() => bid(id, 100.5), /superar/);
      await bid(id, 101);
    }));
  await test('Una sola oferta aceptada al repetir el mismo importe', () =>
    actor('buyer', async () => {
      const outcomes = await Promise.allSettled([bid(id, 102), bid(id, 102)]);
      assert.equal(outcomes.filter((o) => o.status === 'fulfilled').length, 1);
    }));
  await test('Proteger producto, precio, plazo, tipo, retirada y eliminación con pujas', () =>
    actor('seller', async () => {
      for (const change of [
        'price=20',
        'auction_duration_days=4',
        "listing_type='sale'",
        "description='Otro equipo totalmente distinto'",
        "status='draft'",
        "status='sold'",
      ])
        await rejected(
          `update public.products set ${change} where id=$1`,
          [id],
          /subasta|pujas/
        );
      await rejected('delete from public.products where id=$1', [id], /pujas/);
    }));
  await test('Privacidad de identidad de postores y bloqueo de inserción directa', () =>
    actor('outsider', async () => {
      const a = await state(id);
      assert.equal(a.winner_name, null);
      const history = await query(
        'select * from public.get_auction_bid_history($1)',
        [id]
      );
      assert.ok(history.every((h) => !Object.hasOwn(h, 'bidder_id')));
      await rejected(
        'insert into public.auction_bids(product_id,bidder_id,amount) values($1,$2,999)',
        [id, users.outsider],
        /permission/
      );
      await rejected(
        "update public.auctions set ends_at=now()+interval '10 days' where product_id=$1",
        [id],
        /permission/
      );
    }));
  await db.query(
    "update public.auctions set starts_at=now()-interval '6 days',ends_at=now()-interval '1 second' where product_id=$1",
    [id]
  );
  await test('Cierre sin cron: oferta definitiva, ganador y rechazo tardío', async () => {
    await actor('rival', async () => {
      await assert.rejects(() => bid(id, 200), /finalizó/);
      const a = await state(id);
      assert.equal(a.is_winner, false);
      assert.equal(a.winner_name, null);
    });
    await actor('buyer', async () => {
      const a = await state(id);
      assert.equal(a.state, 'ended');
      assert.equal(a.is_winner, true);
      assert.equal(Number(a.current_price), 102);
    });
    await actor('seller', async () => {
      assert.equal((await state(id)).winner_name, 'buyer');
    });
  });
  await test('Contactar al ganador solo como vendedor', async () => {
    await actor('outsider', () =>
      rejected('select public.contact_auction_winner($1)', [id], /vendedor/)
    );
    await actor('seller', async () => {
      const c = await rpc('select public.contact_auction_winner($1) id', [id]);
      assert.ok(c.id);
    });
  });
  await test('Marcar vendida después del cierre conserva el ganador y las pujas', async () => {
    await actor('seller', () =>
      db.query("update public.products set status='sold' where id=$1", [id])
    );
    await actor('buyer', async () => {
      const a = await state(id);
      assert.equal(a.state, 'ended');
      assert.equal(a.is_winner, true);
      assert.equal(Number(a.current_price), 102);
    });
    await actor('seller', () =>
      rejected(
        "update public.products set status='published' where id=$1",
        [id],
        /pujas/
      )
    );
  });
  await test('Subasta sin pujas termina sin ganador', async () => {
    const empty = await product();
    await db.query(
      "update public.auctions set starts_at=now()-interval '4 days',ends_at=now()-interval '1 second' where product_id=$1",
      [empty]
    );
    await actor('seller', async () => {
      const a = await state(empty);
      assert.equal(a.state, 'ended');
      assert.equal(Number(a.bid_count), 0);
      assert.equal(a.winner_name, null);
      await rejected(
        'select public.contact_auction_winner($1)',
        [empty],
        /sin pujas/
      );
    });
  });
  await test('Retirada administrativa cancela una subasta activa', async () => {
    const cancelled = await product();
    await actor('buyer', () => bid(cancelled, 100));
    await actor('admin', () =>
      db.query("update public.products set status='draft' where id=$1", [
        cancelled,
      ])
    );
    await actor('buyer', async () => {
      assert.equal((await state(cancelled)).state, 'cancelled');
      await assert.rejects(() => bid(cancelled, 150), /activa/);
    });
    await actor('seller', () =>
      rejected(
        "update public.products set status='published' where id=$1",
        [cancelled],
        /cancelada|pujas/
      )
    );
  });
  const sale = await product({ type: 'sale' });
  let conversation;
  await test('Contactar crea una sola conversación por comprador y producto', () =>
    actor('buyer', async () => {
      conversation = (
        await rpc('select public.open_product_conversation($1) id', [sale])
      ).id;
      assert.equal(
        (await rpc('select public.open_product_conversation($1) id', [sale]))
          .id,
        conversation
      );
      const list = await query('select * from public.get_my_conversations()');
      assert.equal(
        list.find((c) => c.id === conversation).other_name,
        'seller'
      );
    }));
  await test('Impedir contacto propio y producto no publicado', async () => {
    await actor('seller', () =>
      rejected('select public.open_product_conversation($1)', [sale], /bandeja/)
    );
    const draft = await product({ type: 'sale', status: 'draft' });
    await actor('buyer', () =>
      rejected(
        'select public.open_product_conversation($1)',
        [draft],
        /disponible/
      )
    );
  });
  const clientId = '10000000-0000-4000-8000-000000000001';
  await test('Enviar mensaje y reintentar sin duplicados', () =>
    actor('buyer', async () => {
      await db.query('select public.send_conversation_message($1,$2,$3)', [
        conversation,
        'Hola, ¿sigue disponible?',
        clientId,
      ]);
      await db.query('select public.send_conversation_message($1,$2,$3)', [
        conversation,
        'Hola, ¿sigue disponible?',
        clientId,
      ]);
      const rows = await query(
        'select * from public.get_conversation_messages($1)',
        [conversation]
      );
      assert.equal(rows.length, 1);
      assert.equal(rows[0].sender_id, users.buyer);
      await rejected(
        'select public.send_conversation_message($1,$2,$3)',
        [conversation, 'texto alterado', clientId],
        /utilizado/
      );
      await rejected(
        'select public.send_conversation_message($1,$2,gen_random_uuid())',
        [conversation, '   '],
        /caracteres/
      );
      await rejected(
        'select public.send_conversation_message($1,$2,gen_random_uuid())',
        [conversation, 'x'.repeat(2001)],
        /caracteres/
      );
    }));
  await test('Aislar conversaciones y mensajes incluso del administrador', async () => {
    for (const name of ['outsider', 'admin'])
      await actor(name, async () => {
        assert.equal(
          (
            await query(
              'select * from public.messages where conversation_id=$1',
              [conversation]
            )
          ).length,
          0
        );
        assert.equal(
          (
            await query('select * from public.conversations where id=$1', [
              conversation,
            ])
          ).length,
          0
        );
        assert.equal(
          (await query('select * from public.get_my_conversations()')).some(
            (c) => c.id === conversation
          ),
          false
        );
        await rejected(
          'select * from public.get_conversation_messages($1)',
          [conversation],
          /acceso/
        );
        await rejected(
          "select public.send_conversation_message($1,'intruso',gen_random_uuid())",
          [conversation],
          /acceso/
        );
        await rejected(
          'select public.mark_conversation_read($1,$2)',
          [conversation, clientId],
          /acceso/
        );
      });
  });
  await test('Contador sin leer y lectura limitada al mensaje recibido', () =>
    actor('seller', async () => {
      const list = await query('select * from public.get_my_conversations()');
      assert.equal(
        Number(list.find((c) => c.id === conversation).unread_count),
        1
      );
      await db.query('select public.mark_conversation_read($1,$2)', [
        conversation,
        clientId,
      ]);
      assert.equal(
        Number(
          (await query('select * from public.get_my_conversations()')).find(
            (c) => c.id === conversation
          ).unread_count
        ),
        0
      );
      await db.query(
        "select public.send_conversation_message($1,'Sí, disponible.',gen_random_uuid())",
        [conversation]
      );
    }));
  await test('Paginación de mensajes con cursor sin perder historial', async () => {
    await actor('buyer', async () => {
      for (let i = 0; i < 55; i++)
        await db.query(
          'select public.send_conversation_message($1,$2,gen_random_uuid())',
          [conversation, `Mensaje ${i}`]
        );
      const recent = await query(
        'select * from public.get_conversation_messages($1)',
        [conversation]
      );
      assert.equal(recent.length, 50);
      const cursor = recent.at(-1);
      const older = await query(
        'select * from public.get_conversation_messages($1,$2,$3)',
        [conversation, cursor.created_at, cursor.id]
      );
      assert.equal(older.length, 7);
      assert.equal(new Set([...recent, ...older].map((m) => m.id)).size, 57);
    });
  });
  await test('Conservar conversación e historial al eliminar el producto de venta', async () => {
    await actor('seller', () =>
      db.query('delete from public.products where id=$1', [sale])
    );
    await actor('buyer', async () => {
      const c = (
        await query('select * from public.get_my_conversations()')
      ).find((c) => c.id === conversation);
      assert.equal(c.product_id, null);
      assert.equal(c.product_title, 'Laptop de prueba');
      await db.query(
        "select public.send_conversation_message($1,'Gracias.',gen_random_uuid())",
        [conversation]
      );
    });
  });
  console.log(
    `PASS ${checks} escenarios PostgreSQL: subastas, permisos y mensajería.`
  );
} finally {
  await db.close();
}
