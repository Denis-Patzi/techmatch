# Panel administrativo conectado

## Apartados

El panel en `/admin` conserva las cápsulas, transparencias y paleta azul, tomando como referencia las gráficas, tarjetas y tablas de `expectativa nuevo diseño` (`1ed9b576…`, `57f0dbc6…`, `6a05d3e7…`, `b5b20b6b…` y `fc1d3a7a…`). El acceso continúa reservado al rol administrador.

| Apartado | Funciones conectadas |
| --- | --- |
| Resumen | Usuarios, publicaciones activas, anuncios de subasta y perfiles verificados; gráfica por fecha, distribución de cuentas, barras de categorías/estados y publicaciones recientes |
| Usuarios | Consulta, búsqueda, filtros, edición de datos, tipo de cuenta y acceso; verificación y eliminación del perfil con confirmación; exportación CSV |
| Publicaciones | Fotos/videos, propietario, tipo, precio y estado; crear, consultar, editar, retirar a borrador, publicar y eliminar; búsqueda, filtros, paginación y CSV |
| Subastas | Gestión de los anuncios actuales con precio base y creación de nuevos anuncios de ese tipo |
| Verificaciones | Lista de perfiles reales con filtros de verificación y revisión manual para otorgar o retirar el check |
| Revisión | Borradores y publicaciones de cuentas sin verificar; consulta y cambios reales de visibilidad |

Se retiraron las etiquetas de casos de uso `CU#` y los módulos anteriores con solicitudes, reportes y consultas IMEI simulados.

## Datos y estadísticas

El panel utiliza `profiles` y `products`, con las políticas de administrador ya aplicadas en las migraciones anteriores. No necesita otro SQL, claves administrativas ni tablas nuevas.

La consulta recupera todas las páginas de perfiles y productos, evitando limitar las estadísticas a las primeras 200/1000 filas. La vista usa una misma carga de datos para tablas y métricas; las mutaciones actualizan esa carga con la fila devuelta por Supabase. **Actualizar datos** vuelve a consultar el servidor. No se presenta como seguimiento en tiempo real.

- Los usuarios excluyen las cuentas con rol administrador; las cuentas personales y tiendas se identifican por `account_type`, conservando compatibilidad con perfiles históricos.
- Publicaciones activas incluye únicamente `published`; borradores y vendidos se muestran por separado.
- Subastas publicadas cuenta anuncios `auction` con estado `published`.
- La gráfica muestra altas de los registros que actualmente existen por fecha de creación, en la zona horaria de Bolivia. Permite 7, 30 y 90 días; el período de 90 días agrupa por semana. También ofrece una tabla accesible con los valores.
- Las barras por categoría cuentan publicaciones activas. Los vendidos son marcas del propietario; no acreditan pagos, ventas verificadas ni ingresos.
- Los datos vacíos muestran cero o un mensaje de ausencia. Ante un fallo de actualización, se conserva la última carga y se informa el error.

El usuario confirmó que el Resumen muestra sus usuarios y publicaciones actuales usando Supabase real.

## Verificación y procedencia de equipos

Se eliminó el buscador que devolvía resultados de IMEI inventados. El check actual es una verificación manual del **perfil**; no verifica documentos ni determina si un producto es robado. La lista Revisión usa criterios visibles —borrador o perfil sin verificar— y no los presenta como prueba de fraude.

Retirar una publicación la pasa a borrador; el propietario conserva la posibilidad de editar y volver a publicar. Un bloqueo de moderación que el propietario no pueda revertir requeriría un estado y permisos adicionales. Las denuncias de compradores, documentos de procedencia y una conexión a un servicio real de consulta IMEI quedan para una implementación posterior.

Las subastas conservan el alcance actual: anuncios con precio base, sin pujas, adjudicación ni cobros. El panel no muestra cifras ficticias de operaciones.

## Operaciones de usuarios

La edición guarda nombre, teléfono, ciudad, tipo de cuenta, datos comerciales y acceso. La interfaz impide que el administrador cambie su propio acceso o elimine su propio perfil. Los cambios de verificación y eliminaciones piden confirmación explícita.

Eliminar un perfil retira sus publicaciones por la relación existente en la base. La confirmación muestra la cantidad y advierte que la cuenta de Supabase Auth continúa existiendo y podría recrear el perfil al iniciar sesión. La eliminación completa de autenticación no se simula desde el navegador.

Los CSV exportan los resultados filtrados. Se escapan comillas y valores que podrían interpretarse como fórmulas en una hoja de cálculo.

## Validación

- `node scripts/validation/admin-analytics.mjs`: comprueba agregaciones, roles históricos, exclusión de administradores, estados, subastas, límite de fechas de Bolivia, períodos vacíos y CSV.
- [Pruebas del panel](diseno/validacion-admin-dashboard.json): Chrome con componentes reales y SDK Supabase de prueba. Edición y verificación, errores y reintento, CSV, creación/edición/eliminación de anuncios, visibilidad, sincronización de métricas y carga superior a 1000 publicaciones. No modifica los datos reales.
- Vista responsive entre 320 y 1440 px y temas claro/oscuro, sin desbordes de página. Capturas `diseno/admin-resumen-real-*.png` y `diseno/admin-subastas-reales.png`; sus filas son cuentas de prueba.
- La compilación de producción pasa. El usuario confirmó por separado la lectura de sus datos reales en el resumen; las mutaciones administrativas se verificaron con cuentas simuladas.
