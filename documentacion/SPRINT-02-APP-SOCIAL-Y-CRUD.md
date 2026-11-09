# Sprint 02: aplicación social y CRUD de productos

> Diseño actualizado: [Interfaz según las nuevas capturas](DISENO-SEGUN-CAPTURAS.md), con visor a pantalla completa, Explorar separado y perfil adaptable a desktop/móvil. El CRUD de esta entrega se conserva.

> Administración actualizada: [Panel conectado](PANEL-ADMINISTRADOR.md), con gráficas, usuarios, publicaciones, subastas y revisión manual. Se eliminan etiquetas CU y módulos administrativos simulados.

## Objetivo

Preparar el área autenticada para la presentación, tomando como referencia `diseno desktop.png` (feed vertical con menú lateral) y `diseno mobile.png` (perfil con catálogo compacto). Se conserva el logo y la identidad azul, con tema claro/oscuro y superficies de vidrio. La portada pública aprobada no cambia.

## Funciones incorporadas

| Requerimiento | Implementación |
| --- | --- |
| Entrada común de personas y tiendas | `/app`, con funciones de compra y venta en la misma cuenta |
| Feed desktop | Foto/video vertical, desplazamiento entre publicaciones, flechas, categoría y búsqueda |
| Navegación móvil | Inicio, Catálogo, Publicar, Subastas y Perfil; opciones adicionales en el menú superior |
| Perfil y catálogo | Avatar circular, identidad personal/tienda, categorías y pestañas Publicaciones, Catálogo, Subastas y Deseos |
| Crear producto | Título, descripción, precio en Bs., categoría, condición, ciudad, tipo y visibilidad |
| Consultar producto | Feed, catálogo propio, catálogo del vendedor y ventana de detalle |
| Actualizar producto | Editor con datos existentes; permite cambiar precio, contenido y estado publicado/borrador/vendido |
| Eliminar producto | Confirmación explícita, borrado real en Supabase y retirada del catálogo |
| Multimedia | Una imagen o un video por publicación; JPG/PNG/WebP/MP4/WebM, hasta 20 MB |
| Imágenes de referencia | Opción para publicar usando recursos existentes, siempre identificados como referencia |
| Deseos | `product_favorites`, conservados entre sesiones; cada cuenta consulta solo los propios |
| Administración | Nueva sección Productos con consulta, creación propia y edición/eliminación de publicaciones de la comunidad |
| Permisos | RLS de propietario/administrador; datos privados del perfil siguen protegidos |
| Básico | Hasta 25 publicaciones activas, incluidas 5 con video, comprobadas por PostgreSQL |

No se muestran reseñas ni ventas ficticias. La puntuación aparece sin reseñas. El contador propio de vendidos representa publicaciones marcadas como vendidas por su dueño; no acredita pagos. En perfiles ajenos no se presume una cifra de ventas. El catálogo cuenta los productos accesibles según permisos.

## Base de datos

La migración [20261110_products_crud.sql](../supabase/migrations/20261110_products_crud.sql) requiere la migración anterior de cuentas. Crea `products`, `product_favorites`, el RPC `get_product_sellers` y el bucket público `product-media` con restricciones de tamaño, formatos y permisos de escritura por carpeta de propietario. La identidad pública devuelve nombre visible, tipo, ciudad y verificación; no devuelve teléfono, correo ni NIT.

El usuario confirmó **Success. No rows returned** al ejecutar este nuevo script y después comprobó **crear, consultar en catálogo, editar y eliminar** productos con Supabase real. No se debe repetir el script de cuentas. Las pruebas automatizadas son aisladas; la carga multimedia contra el servicio real todavía debe comprobarse durante el ensayo del recorrido.

Los medios del catálogo son públicos; este bucket no es para documentos privados. Para conservar referencias compartidas, eliminar una publicación no borra automáticamente su archivo ni archivos reemplazados: la limpieza de medios sin referencias queda pendiente. Una subida nueva se intenta retirar si falla la creación/edición correspondiente.

El cliente solicita las 200 publicaciones más recientes y todas las propias. Los deseos recuperan también productos publicados fuera de ese lote. No se implementa todavía paginación para todo el historial de la comunidad.

## Recorrido para presentar el CRUD

1. Cerrar sesión y volver a ingresar. Entrar a **Publicar**.
2. Crear un producto con título, descripción y precio. Elegir una foto propia o una imagen de referencia.
3. Mostrar el producto en **Mi catálogo** y abrir el detalle. Recargar para demostrar que existe en Supabase.
4. Pulsar **Editar**, cambiar el precio y guardar. Volver a recargar para comprobarlo.
5. Marcarlo como **Borrador**: desaparece del feed público y sigue en el catálogo propio. Volver a publicarlo.
6. Con otra cuenta, mostrar el producto en el feed, guardarlo en Deseos y abrir el catálogo del vendedor. Esa cuenta no tiene acciones para editarlo ni borrarlo.
7. Desde la cuenta propietaria, pulsar **Eliminar**, confirmar y mostrar que se retiró. Los deseos asociados se eliminan en cascada.
8. Ingresar con un administrador existente y entrar a **Productos** para mostrar la gestión de publicaciones de la comunidad.

Para que el catálogo se vea completo, cargar antes de exponer tres o cuatro productos propios con categorías diferentes. La aplicación no inserta productos ficticios ni usa almacenamiento local como reemplazo de Supabase.

## Límites de esta entrega

- Subastas permite crear/editar/eliminar anuncios con precio base; las pujas, adjudicación y cierre automático no están implementados.
- Tasador IA sigue identificado como demostración. Chat, pedidos, pagos, reseñas y suscripciones cobradas siguen pendientes.
- El control de esta entrega permite 25 publicaciones y 5 videos **activos** por cuenta. Todavía no contabiliza los videos por mes ni controla su duración como propone la definición comercial de los planes; la vista Mi plan explica esa diferencia. Los precios se mantienen y las prestaciones Pro siguen en preparación.
- El administrador gestiona perfiles y publicaciones; borrar un perfil no elimina la cuenta de Supabase Auth, como se explica en la interfaz.

## Validación

- [SQL, cuotas y permisos](diseno/validacion-crud-productos-sql.json): PGlite con auth y esquema Storage de prueba. Comprueba migración repetible, CRUD propietario/administrador, rechazo de escritura ajena, privacidad de deseos, estados, cuotas y políticas de medios. No sustituye una prueba de carga contra el servicio real de Storage.
- [Interfaz y CRUD](diseno/validacion-social-crud.json): Chrome con componentes reales y SDK Supabase simulado. Comprueba creación/edición/eliminación, recarga, errores sin pérdida del formulario, carga de medios, deseos, tienda/personal, administración y tamaños de 320 a 1440 px.
- Capturas de validación: `diseno/social-app-*.png`. Sus productos pertenecen a las cuentas de prueba del navegador; no son registros insertados en la base del usuario.

La implementación de medios utiliza [Storage y control de acceso de Supabase](https://supabase.com/docs/guides/storage/security/access-control) y la API oficial de [subida de archivos](https://supabase.com/docs/reference/javascript/file-buckets-upload).
