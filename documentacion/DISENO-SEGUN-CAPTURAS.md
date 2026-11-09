# Interfaz autenticada según las capturas

Se revisaron las siete imágenes de `documentacion/capturas`. El rediseño aplica su distribución al área autenticada `/app`, conservando el logo, azul y temas de TechMatch. La portada pública aprobada mantiene su diseño.

| Referencia | Aplicación en TechMatch |
| --- | --- |
| `225922` y `225934`: visor desktop | Menú fijo con búsqueda a la izquierda; contenido a toda la altura; foto/video centrado; descripción abajo; acciones y flechas a la derecha |
| `225852` y `230148`: feed móvil | Contenido de borde a borde, menú/búsqueda superpuestos, pestañas Explorar/Para vos, acciones laterales y barra inferior de cinco accesos |
| `230044`: Explorar | Mosaico de publicaciones verticales con categorías, búsqueda y precio visible |
| `230024`: perfil desktop | Avatar grande a la izquierda, nombre y estadísticas al lado, acciones de perfil/publicación y pestañas de contenido |
| `230212`: perfil móvil | Avatar y nombre centrados, estadísticas en una fila y publicaciones compactas |

Los sufijos corresponden a los archivos `Screenshot 2026-11-08 HHMMSS.png` dentro de `capturas`.

## Barra flotante y contraíble

La barra lateral tiene formato de cápsula, separada de los bordes como en administración, con vidrio azul y transparencias en ambos temas. El botón junto al logo alterna entre el menú completo (248 px) y los iconos (84 px), liberando espacio para la publicación. La preferencia se conserva al recargar; los iconos mantienen sus nombres accesibles y etiquetas al pasar el cursor. La búsqueda compacta abre el buscador habitual.

El fondo del feed continúa detrás de la cápsula: visor, márgenes y área de la aplicación comparten el mismo color base. En móvil, los cinco accesos inferiores también quedan flotantes en una cápsula, respetando el área segura del dispositivo.

[Validación de la barra](diseno/validacion-sidebar-capsula.json): contracción por teclado, persistencia, búsqueda compacta, navegación, ambos temas, pantallas de 320 a 1440 px y altura de 600 px. Capturas `diseno/sidebar-capsula-*.png`. No se requieren cambios adicionales en Supabase.

## Comportamiento

- **Para vos** presenta las publicaciones disponibles, ordenadas por fecha. Desplazamiento vertical, flechas y teclado permiten cambiar de producto. Todavía no existe un algoritmo personalizado de recomendaciones.
- El reproductor incluye reproducir/pausar, progreso, sonido y pantalla completa donde el navegador lo admite. Pausa los videos que quedan fuera de vista y respeta la preferencia de movimiento reducido para la reproducción automática.
- **Explorar** permite buscar y filtrar por categorías en una cuadrícula vertical. En móvil se abre desde el segundo acceso inferior o la pestaña superior.
- **Compartir** utiliza el diálogo del dispositivo cuando está disponible o copia un enlace al detalle. La consulta conserva los permisos de Supabase y requiere una sesión; una publicación privada o eliminada no se vuelve pública por compartirla.
- **Mi perfil** abre Publicaciones: tres columnas en móvil y más columnas en desktop. La pestaña **Catálogo** conserva dos columnas en móvil, con edición y eliminación, siguiendo la expectativa de la portada. También hay Subastas y Deseos, y orden por fecha/precio.
- **Publicar**, **Editar perfil**, **Mi catálogo**, deseos y administración conservan su conexión con Supabase. No se requiere otra migración SQL.

Los contadores utilizan la información disponible: productos y publicaciones marcadas como vendidas por su propietario. La puntuación se muestra sin reseñas hasta implementar ese módulo. Se mantienen los alcances pendientes de pujas, pagos y tasador real descritos en el [Sprint 02](SPRINT-02-APP-SOCIAL-Y-CRUD.md).

## Comprobaciones

La compilación de producción pasa. [Validación del rediseño](diseno/validacion-interfaz-capturas.json): Chrome con componentes reales y SDK Supabase simulado para cuentas de prueba, con recorrido CRUD, deseos, búsquedas, reproductor, enlaces compartidos, cuenta personal/tienda y administración. Se revisaron 320, 375, 400, 456, 768, 1100 y 1440 píxeles sin desbordes.

Las capturas `diseno/tiktok-techmatch-*.png` muestran datos de prueba del navegador. El usuario había confirmado el CRUD completo con Supabase real antes de esta modificación visual; no se alteraron sus tablas ni registros.
