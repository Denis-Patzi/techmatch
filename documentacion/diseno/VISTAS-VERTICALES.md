# Vistas verticales de la portada

El feed y la subasta se presentan en marcos 9:16 de hasta 432 px de ancho, con navegación inferior y datos del producto superpuestos. El perfil completo usa también un marco de celular 9:16 de hasta 456 px, situado a la derecha del texto en escritorio. En móvil se apila debajo del texto y permite desplazarse dentro de su contenido. Esta disposición alterna con el feed de la sección anterior, que mantiene el celular a la izquierda.

## Feed

- Video renderizado originalmente a 540 × 960, con encuadre vertical del modelo de tarjeta gráfica. No se recorta el video horizontal anterior.
- Alternancia entre video y fotografía, pausa y reproducción, y Me gusta local para la demostración.
- Accesos al catálogo, perfil, subastas y registro desde el marco de la aplicación.

Archivos: `public/videos/hardware-portrait-loop.mp4` (937.659 bytes) y `public/videos/hardware-portrait-poster.webp` (44.536 bytes). Para reproducir la generación, usar `scripts/media/generate-videos.cjs --portrait` con `TECHMATCH_MEDIA_TOOLS` apuntando al directorio externo de Playwright y Three.js, y FFmpeg instalado. La opción nueva conserva los archivos horizontales.

## Catálogo y subasta

El perfil muestra imágenes, formato de publicación, modalidad de venta y precio. Las publicaciones se organizan en tres columnas de miniaturas 3:4 separadas por 5 px; el catálogo usa dos columnas compactas con 8 px de separación, foto, nombre y precio. Los filtros Todos, Computación, Celulares y Audio funcionan tanto para la cuenta personal como para la tienda. Sustituyen la galería horizontal anterior para mostrar más productos a la vez.

Las pestañas y la selección de persona/tienda siguen funcionando. La subasta presenta fotografía de auriculares, vendedor, condición, precio de salida y botón para registrarse y participar.

La cabecera del perfil incorpora un avatar circular con iniciales de 88 px en escritorio y 72 px en móvil. El nombre, usuario, puntuación sobre cinco, ventas y total de productos se sitúan al lado del avatar. La descripción aparece debajo del bloque completo y también se muestra en móvil. Se retiran los seguidores y Me gusta de ambos tipos de cuenta. Las cifras restantes proceden de los datos de ejemplo de cada cuenta; el total de productos corresponde al catálogo completo y permanece estable al aplicar una categoría.

La cuenta personal añade **Deseos**, con un corazón visible también en móvil, a continuación de Subastas. Muestra dos productos guardados de ejemplo. La tienda no incluye esa pestaña; cambiar a tienda desde Deseos vuelve al catálogo. Esta demostración no guarda favoritos ni consulta estadísticas reales.

Las fotografías se generaron con la herramienta integrada `image_gen`, mediante la habilidad imagegen. Archivos finales optimizados para la web:

- `public/images/product-headphones.webp` (67.264 bytes).
- `public/images/product-laptop.webp` (44.538 bytes).
- `public/images/product-phone.webp` (31.158 bytes).

Los prompts completos y la correspondencia de archivos están en [productos-prompts.json](productos-prompts.json). Son imágenes ilustrativas de la portada; no representan inventario real. Las miniaturas ajustan su encuadre al espacio disponible.

## Validación y alcance

Compilación de producción correcta. Chrome comprobó el video 9:16, controles multimedia, alternancia de formatos, Me gusta, cambio de perfil y filtro de subastas. Se verifican 320, 375, 768, 1100, 1440 y 1920 px: marcos exteriores 9:16 preservados y sin desbordes de página. Se revisan ambos temas y movimiento reducido. No se registran errores de ejecución ni imágenes/videos ausentes.

Resultado: [validacion-vistas-verticales.json](validacion-vistas-verticales.json). Capturas: `vista-*.png`.

Validación de la revisión final del perfil: [validacion-perfil-compacto.json](validacion-perfil-compacto.json). Comprueba las categorías en ambas cuentas, publicaciones en tres columnas, catálogo en dos columnas, separación de 8 px, marco 9:16 y ubicación a la izquierda del texto. Capturas vigentes: `perfil-publicaciones-*.png` y `perfil-catalogo-compacto-*.png`. Los informes anteriores conservan las comprobaciones de versiones previas de la galería.

Actualización de métricas y Deseos: [validacion-perfil-metricas-deseos.json](validacion-perfil-metricas-deseos.json). Se verifican avatar circular y dimensiones, métricas por cuenta, total estable al filtrar, contenido de Deseos, cambio a tienda y corazón visible sin desbordar las pestañas entre 320 y 1920 px. Capturas actuales: `perfil-metricas-*.png` y `perfil-deseos-personal.png`. Compilación correcta, sin errores de ejecución.

Revisión de la cabecera lateral, posterior a la anterior: [validacion-perfil-cabecera-lateral.json](validacion-perfil-cabecera-lateral.json). Comprueba ambos tipos de cuenta a 320, 375, 768 y 1440 px: avatar ampliado, indicadores al lado, descripción visible debajo y ausencia de seguidores/Me gusta. Capturas vigentes: `perfil-cabecera-lateral-*.png`.

Estas son vistas ilustrativas de la portada. La navegación lleva a secciones existentes o al registro; no se implementan compras, ofertas reales ni persistencia de favoritos.
