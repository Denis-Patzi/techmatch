# Aplicación de usuario unificada

> Actualización posterior: el [Sprint 02](SPRINT-02-APP-SOCIAL-Y-CRUD.md) incorpora el nuevo diseño autenticado, CRUD persistente de productos, multimedia y deseos. Las limitaciones de catálogo descritas abajo corresponden a la entrega inicial de unificación.

## Qué cambia

El acceso de cuentas personales y de tienda se reúne en `/app`. Los usuarios con roles históricos `buyer` y `seller` acceden a las mismas secciones: Explorar, Deseos, Mi catálogo, Compras y ventas, Tasador IA, Mi plan y Mi perfil. El administrador continúa en `/admin`.

El registro pide el tipo de cuenta, Personal o Tienda; ya no obliga a elegir comprador o vendedor. Una persona compra o vende según la función que utiliza. Los perfiles nuevos reciben el rol normal `buyer` como código compatible con la base actual; ese código no restringe la navegación a comprar. Los usuarios existentes conservan sus roles. No se añade un cuarto actor.

Las rutas antiguas se conservan como accesos compatibles: `/profile` lleva al perfil en `/app`, `/seller` lleva al catálogo y `/onboarding` lleva al espacio unificado. El menú principal, inicio de sesión y registro usan la entrada común. En móvil hay cuatro accesos y Más para evitar amontonar las secciones.

En administración, el resumen distingue cuentas personales y tiendas, excluyendo administradores del total de cuentas de usuario. La tabla muestra el tipo de cuenta y presenta los roles históricos `buyer` y `seller` como Usuario; Administrador conserva su acceso separado. La visualización no modifica los roles existentes en la base.

## Cambio que debe aplicarse en Supabase

Abrir el proyecto de TechMatch en Supabase, entrar a **SQL Editor → New query** y ejecutar el contenido completo de:

[20261109_unified_accounts.sql](../supabase/migrations/20261109_unified_accounts.sql).

Este es el único script necesario para la unificación. El archivo anterior de `supabase/proposals/20261108_accounts_plans.sql` sigue siendo una propuesta aparte para futuras suscripciones; no es requisito de este paso.

El script requiere `profiles.id` de tipo UUID y las columnas informadas: `role`, `full_name`, `phone`, `city`, `store_name`, `nit`, `is_verified` y `created_at`. Conserva esos campos y los registros existentes. Realiza estos cambios:

1. Añade `account_type` con valores `personal` o `store`, e identifica inicialmente las tiendas por `store_name` cuando el tipo todavía está vacío.
2. Normaliza los perfiles nuevos a partir de los metadatos de registro: nombre, teléfono, ciudad y datos comerciales. Nunca toma permisos administrativos ni verificación de los metadatos enviados por el cliente.
3. Incorpora `ensure_my_profile()`, que recupera o crea únicamente el perfil de quien tiene la sesión iniciada, si faltaba su fila. No reemplaza los triggers de alta de `auth.users` existentes.
4. **Reemplaza las políticas de `profiles`**: cada cuenta consulta y edita su propio perfil; el administrador mantiene la gestión de perfiles. El cliente público no puede consultar perfiles privados de otras personas.
5. Impide que una persona se cambie el rol, la verificación, la fecha o el identificador desde su perfil. Los cambios de nombre o identidad comercial retiran la verificación hasta una nueva revisión.

El script no elimina perfiles ni convierte roles existentes. El acceso de administración sigue dependiendo de un perfil con `role = 'admin'`, asignado desde una operación de confianza. El borrado del panel administrativo retira un perfil, no la cuenta de Supabase Auth; la eliminación completa de autenticación requiere un servicio administrativo posterior.

Después de ejecutarlo, cerrar sesión y volver a ingresar. Comprobar una cuenta personal y otra de tienda; cambiar un nombre o teléfono, guardar y recargar. También comprobar que una cuenta normal no acceda a `/admin`.

El usuario confirmó que la ejecución devolvió `Success. No rows returned`. Esto confirma la ejecución sin errores que reportó SQL Editor; no sustituye la prueba de acceso y guardado con una sesión real.

## Qué funciona y qué sigue pendiente

- Navegación y protección de rutas, selección de tipo de cuenta al registrarse y edición del perfil con lectura del resultado guardado en Supabase.
- Planes filtrados según cuenta personal/tienda; siguen siendo una vista de prestaciones, sin contratación ni activación de pago.
- Explorar presenta un catálogo de ejemplo. Deseos permite marcar esos productos durante la navegación; todavía no se guarda en una tabla de favoritos.
- El tasador es una demostración identificada como tal.
- El CRUD persistente de productos, carga de fotos/videos, subastas reales, ofertas, pagos y seguimiento siguen pendientes. Mi catálogo y Compras y ventas lo indican; se retiran las acciones antiguas sin funcionalidad y las cifras ficticias del panel del vendedor.

La base necesita tablas de productos y multimedia antes de habilitar el CRUD comercial. El SQL de esta entrega se limita a preparar correctamente las cuentas y sus permisos. No se sustituye Supabase por datos locales para aparentar persistencia.

## Validación

- [SQL y permisos](diseno/validacion-cuentas-unificadas-sql.json): PostgreSQL en memoria sobre el esquema de perfiles informado. Se ejecuta la migración dos veces, se conservan roles existentes, se prueban propietario/administrador, prohibición de cambiar campos reservados, creación del perfil faltante y metadatos de registro sin privilegios.
- [Aplicación y autenticación](diseno/validacion-app-unificada.json): Chrome con el contexto y formularios reales y un SDK Supabase simulado para cuentas de prueba. Comprueba registro, login/logout, rutas antiguas, aislamiento del administrador, clasificación de cuentas en su resumen y tabla, edición/recarga de perfil, planes por tipo, recuperación ante errores, Deseos y navegación móvil. No se utilizaron credenciales de usuarios reales.
- Se revisan 320, 375, 768, 1100 y 1440 px. Capturas: `diseno/app-unificada-*.png`. La compilación de producción pasa.
