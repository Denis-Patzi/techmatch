# Actores, cuentas, planes y datos de TechMatch

Definición del 8 de noviembre de 2026. Corresponde a los tres actores y cuatro módulos de [nuevo diagrama.png](<nuevo diagrama.png>).

## Tres conceptos distintos

| Concepto | Opciones | Qué determina |
| --- | --- | --- |
| Actor | Comprador, Vendedor, Administrador | Las funciones que desempeña la persona en el sistema. |
| Tipo de cuenta | Personal, Tienda | La identidad pública y los datos del perfil. |
| Plan | Básico, Personal Pro, Tienda Pro | La capacidad de publicación y las prestaciones contratadas. |

Una persona con cuenta personal puede comprar y vender. Una tienda también puede actuar como compradora. Es la misma cuenta desempeñando diferentes funciones: esto no introduce actores adicionales. Los planes no son actores del diagrama.

El administrador es un rol interno, no un tipo de cuenta comercial ni un plan que se adquiere. Tener un plan de pago no concede permisos administrativos ni verificación automática.

## Funciones de los actores

| Función | Comprador | Vendedor | Administrador |
| --- | --- | --- | --- |
| Registrarse, iniciar sesión y editar su perfil | Propio | Propio | Propio; gestionar usuarios autorizados |
| Ver feed y catálogo, buscar, comparar y consultar recomendaciones | Sí | Sí, al comprar | Supervisar y gestionar contenido |
| Guardar deseos y consultar productos | Propios | Propios al comprar | Sin acceso general a listas privadas ajenas |
| Crear, ver, editar y retirar publicaciones | Al habilitar su función de vendedor | Solo propias | Moderar y retirar con motivo registrado |
| Publicar fotos o videos y solicitar descripción/precio por IA | Al publicar como vendedor | Según límites del plan | Configurar reglas y supervisar |
| Crear subastas y gestionar ofertas recibidas | Al publicar como vendedor | Solo propias, según plan | Moderar; no ofertar por otros |
| Ofertar, negociar y comprar | Sobre productos ajenos | Como comprador; no sobre su propia subasta | Supervisar incidencias autorizadas |
| Gestionar pedido/venta y seguimiento | Sus compras | Sus ventas | Resolver incidencias y consultar registros autorizados |
| Elegir o cancelar una suscripción | De su propia cuenta | De su propia cuenta | Gestionar catálogo de planes y operaciones autorizadas |
| Cambiar roles, verificar tiendas y moderar reportes | No | No | Sí, con controles y registro de acciones |

La relación con el diagrama queda así: **UC01** agrupa autenticación y usuarios; **UC02**, publicaciones, catálogo, búsqueda, comparación, IA y deseos; **UC03**, ofertas, subastas, negociación, pago y seguimiento; **UC04**, administración, moderación, seguridad y suscripciones. Estos son grupos de alto nivel, no cuatro operaciones CRUD únicas.

## Planes definidos

Se mantienen los importes existentes. El precio anual mostrado es el equivalente mensual facturado por año completo.

| Plan | Tipo de cuenta | Mensual | Equivalente mensual anual | Total anual | Productos activos | Videos nuevos por mes | Duración máxima | Fotos por publicación | Subastas activas |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Básico | Personal o Tienda | Bs. 0 | Bs. 0 | Bs. 0 | 25 | 5 | 60 s | 5 | 1 |
| Personal Pro | Personal | Bs. 99 | Bs. 79 | Bs. 948 | 100 | 30 | 90 s | 10 | 5 |
| Tienda Pro | Tienda | Bs. 249 | Bs. 199 | Bs. 2.388 | 500 | 100 | 120 s | 15 | 20 |

Todos incluyen fotos, videos dentro del cupo, catálogo y ayuda para generar descripción/precio. Personal Pro añade estadísticas de publicaciones; Tienda Pro amplía capacidad, personalización de tienda y estadísticas del catálogo. Son prestaciones definidas del producto; no se presenta la contratación como un pago ya implementado.

Una tienda puede empezar con Básico sin pagar. Personal Pro no transforma una persona en tienda y Tienda Pro no transforma una tienda en administrador. La verificación requiere revisión, con independencia del plan.

### Reglas de conteo para el CRUD

- Un producto activo es una publicación visible de venta o subasta. Una subasta consume también un lugar de producto activo. Los borradores y publicaciones retiradas no cuentan como activos.
- Los videos se cuentan por archivo nuevo aceptado durante el mes calendario en `America/La_Paz`, sumando publicaciones de venta y subastas. Borrar un video no devuelve el cupo del mes. Reutilizar un archivo ya aceptado no debe contarlo dos veces.
- El período anual cambia el importe y vigencia de la suscripción; el cupo de videos sigue renovándose cada mes calendario.
- Las fotos tienen un máximo por publicación. La duración del video y la cantidad de fotos se validan además del cupo mensual.
- Antes de exceder un límite se debe rechazar la operación con un mensaje claro; los productos existentes se conservan. Al bajar de plan, el usuario debe seleccionar qué publicaciones mantendrá activas.
- Los contadores y la aceptación de un archivo deben actualizarse de manera atómica en el servidor para impedir que cargas simultáneas sobrepasen el límite. Un cambio visual o una validación JavaScript no sustituye esta comprobación.

## Compatibilidad con Supabase actual

Según el esquema informado, hoy solo existe `profiles` con `id`, `role`, `full_name`, `phone`, `city`, `store_name`, `nit`, `is_verified` y `created_at`. El frontend de esta entrega continúa funcionando con esos campos.

Mientras no exista un campo propio, la vista de suscripciones toma `store_name` no vacío como indicación temporal de tienda. Un vendedor sin nombre de tienda se presenta como personal. Esto permite distinguir las opciones visuales y no sirve como control de autorización de planes.

Actualización de la aplicación: el registro ahora pide Personal o Tienda y ambos tipos acceden a `/app`, con opciones para explorar y vender. Los valores históricos `buyer` y `seller` se conservan en `profiles.role`, pero ambos usan el mismo espacio; `/admin` queda separado. El perfil permite guardar `account_type` con el SQL de la [aplicación unificada](APLICACION-USUARIO-UNIFICADA.md). El CRUD comercial continúa pendiente.

### Ampliación propuesta

| Tabla/campo | Objetivo |
| --- | --- |
| `profiles.account_type` | Guardar explícitamente `personal` o `store`, separado de `role`. |
| `plans` | Catálogo de precios, tipos de cuenta permitidos y límites. |
| `subscriptions` | Plan vigente, propietario, período mensual/anual, estado y fechas. |
| `products` | Publicaciones del propietario, modalidad y estado; base del CRUD pendiente. |
| `product_media` | Archivos, tipo, duración, propietario y fecha de aceptación. |
| `media_upload_events` | Historial de consumo mensual que se conserva aunque se retire un archivo. |
| `auctions` y `bids` | Subastas y ofertas de sus participantes. |
| `orders`, `negotiations`, `reports` | Ventas, negociación y moderación según los casos de uso posteriores. |

El [SQL propuesto](../supabase/proposals/20261108_accounts_plans.sql) prepara únicamente `account_type`, `plans` y `subscriptions`, sin eliminar columnas ni perfiles existentes. No ha sido aplicado a Supabase. Debe validarse contra los tipos, triggers y políticas reales antes de integrarlo. Las tablas de productos, archivos y consumo, sus reglas y su CRUD siguen pendientes; por ello los límites de esta entrega están definidos y publicados, pero todavía no se hacen cumplir sobre publicaciones reales.

Conservar los valores `buyer`, `seller` y `admin` facilita la transición. Al conectar los flujos, el estado vendedor significa que puede publicar; no debe excluir las funciones de comprador. Los cambios de rol o verificación requieren una operación administrativa protegida; el usuario no debe poder concedérselos al editar su perfil.

Las suscripciones no se activan al pulsar un enlace de registro ni mediante un parámetro de URL. Deben verificarse desde el servidor. El SQL propuesto deja las escrituras de suscripciones fuera del cliente público. La autorización por filas y las restricciones de columnas deben revisarse en el esquema real, conforme a [RLS de Supabase](https://supabase.com/docs/guides/database/postgres/row-level-security) y [gestión de usuarios](https://supabase.com/docs/guides/auth/managing-user-data).

## Entrega visible

La portada recupera Planes después de Cómo funciona, antes de Crear perfil. Incluye navegación desde menú y pie, comparación mensual/anual y totales anuales. Los planes de pago figuran como próximos; los enlaces permiten registrarse y no asignan una suscripción. El vendedor ve Básico y el plan Pro correspondiente a su tipo de cuenta, usando la misma definición de límites y precios.

## Comprobaciones de esta entrega

- [Portada y navegación](diseno/validacion-planes-renovados.json): tres planes, precios conservados, videos del Básico, totales anuales y navegación móvil. Revisión de 320, 375, 768, 1000, 1100, 1440 y 1920 px sin desbordes y sin errores de ejecución; temas claro y oscuro.
- [Planes por cuenta](diseno/validacion-planes-por-cuenta.json): sesión simulada en Chrome, sin acceder a usuarios reales. El vendedor personal recibe Básico/Personal Pro; la tienda, Básico/Tienda Pro. Se comprueba también el campo explícito futuro y el período anual.
- [SQL propuesto](diseno/validacion-esquema-planes.json): ejecución dos veces sobre PostgreSQL en memoria con PGlite y un esquema de prueba equivalente al `profiles` informado. Se contrastan precios y límites con el frontend, conversión inicial a tienda por `store_name`, lectura pública del catálogo, lectura privada de suscripciones y bloqueo de escrituras desde clientes. No es una prueba del Supabase desplegado ni de cuotas de publicación.

La compilación de producción pasa. Se mantienen los avisos previos de anotaciones de Zod y tamaño de paquetes. Capturas: `diseno/planes-renovados-*.png` y `diseno/planes-tienda-panel.png`.
