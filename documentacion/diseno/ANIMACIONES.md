# Fondos, profundidad y videos de TechMatch

Entrega: 5 de noviembre de 2026.

Este documento conserva la entrega original de videos y cristal. La portada actual usa Órbita 3D en el hero, un celular animado con CSS en el tasador y un video vertical 540 × 960 en el feed. Ver [PRINCIPAL-SOCIAL.md](PRINCIPAL-SOCIAL.md) y [VISTAS-VERTICALES.md](VISTAS-VERTICALES.md) para la integración vigente; los videos horizontales originales permanecen en el repositorio.

La portada combina imágenes de hardware con capas que se desplazan a distintas velocidades. El hero, el tasador, las tarjetas, los planes y la vista del celular cambian su perspectiva durante el scroll. Los textos y controles permanecen en el documento y conservan su interacción.

## Videos integrados

| Ubicación | Archivo | Contenido | Tamaño |
| --- | --- | --- | --- |
| Tarjeta principal de la portada | `public/videos/hardware-loop.mp4` | Tarjeta gráfica 3D flotante, ventiladores y luz azul | 622.650 bytes |
| Estado inicial del tasador | `public/videos/processor-loop.mp4` | Procesador suspendido sobre su placa, conexiones luminosas y plano de exploración | 315.356 bytes |

Ambos videos duran 8 segundos, tienen resolución de 960 × 600, 24 fotogramas por segundo y formato H.264/MP4. No contienen pista de audio. Su reproducción en bucle es decorativa; no representa un análisis real del producto.

Imágenes de respaldo: `public/videos/hardware-poster.webp` y `public/videos/processor-poster.webp`. Videos y respaldos suman 990.226 bytes, menos de 1 MB decimal. Se usa MP4 para controlar la reproducción y mantener pequeño el peso de los archivos.

El componente `VideoLoop`:

- Carga cada video al aproximarse a la zona visible y lo reproduce al entrar en pantalla.
- Lo pausa al salir de pantalla o cuando la pestaña queda oculta.
- Incluye un botón de pausa/reproducción con nombre accesible y área de 44 × 44 px.
- Mantiene la pausa manual al recorrer otras secciones.
- Muestra el respaldo estático y evita descargar MP4 con movimiento reducido o ahorro de datos detectado al cargar la página.
- Responde a cambios de la preferencia de movimiento mientras la página está abierta.
- Conserva el respaldo si falla la carga del video o el navegador impide su reproducción.

La animación del tasador desaparece al seleccionar un producto, dejando espacio al análisis de ejemplo existente.

## Procedencia y regeneración

Los videos son escenas originales construidas con geometría, materiales e iluminación mediante código. No se utiliza material de archivo ni modelos de terceros. El generador usa Three.js para dibujar los fotogramas, Chrome/Playwright para capturarlos y FFmpeg para codificar el MP4. Estas herramientas se ejecutan fuera de la aplicación; no se agregan al paquete JavaScript que descarga el visitante.

Fuentes editables:

- `scripts/media/scenes.html`: modelos, colores, cámara, iluminación y movimiento periódico.
- `scripts/media/generate-videos.cjs`: captura determinista, compresión y exportación de imágenes de respaldo.

Para regenerar, instalar `three` y `playwright` en una carpeta de herramientas externa al proyecto, tener Chrome y FFmpeg disponibles y configurar `TECHMATCH_MEDIA_TOOLS` con la ruta de esa carpeta. Ejecutar `rtk proxy node scripts/media/generate-videos.cjs`. El argumento `--preview` exporta solamente los respaldos. Los fotogramas intermedios quedan en el directorio temporal del sistema.

Los fondos estáticos `public/images/tech-workspace.webp` y `public/images/tech-circuits.webp` se generaron con `image_gen.imagegen`. Sus instrucciones completas están en [fondos-prompts.json](fondos-prompts.json). Los fondos se optimizaron a WebP de 1600 px.

## Verificación

Resultados: [validacion-videos.json](validacion-videos.json) y [validacion-3d.json](validacion-3d.json).

- Reproducción, duración, bucle, ausencia de sonido, pausa manual y pausa por visibilidad verificadas en Chrome.
- Sin desborde horizontal a 320, 375, 768, 1100, 1440 y 1920 px en las secciones revisadas.
- Preferencias de movimiento reducido y ahorro de datos: cero solicitudes de MP4.
- Respaldo estático verificado simulando respuestas 404 de los videos.
- Tasador de ejemplo y transformación 3D al desplazarse siguen funcionando.
- Sin errores de ejecución ni solicitudes fallidas de video en el recorrido normal.
- Compilación de producción correcta. Se mantienen las advertencias anteriores de Zod y del tamaño del paquete principal.

Capturas: `portada-video-clara.png`, `portada-video-oscura.png`, `portada-video-movil.png` y `tasador-video-claro.png`.

## Cristal líquido

La barra principal, el menú móvil, las dos tarjetas flotantes de la portada, las tres tarjetas de beneficios y el panel de vista móvil incorporan el acabado `liquid-glass`: fondo translúcido, desenfoque, saturación suave, reflejo y borde iluminado. La barra aumenta su opacidad al desplazarse para conservar la lectura sobre el contenido.

`useLiquidGlass` actualiza únicamente la posición del reflejo, como máximo una vez por fotograma. Los textos y controles permanecen inmóviles. El seguimiento del cursor se desactiva con movimiento reducido y en pantallas táctiles; el acabado estático permanece. Las capas decorativas no interceptan clics y existe un fondo opaco de respaldo para navegadores sin desenfoque.

Comprobado en temas claro y oscuro, a 320, 375, 768 y 1440 px, con navegación móvil, cierre por Escape y devolución de foco al botón del menú. Ver [validacion-cristal.json](validacion-cristal.json). Capturas: `cristal-portada-clara.png`, `cristal-portada-oscura.png`, `cristal-tarjetas.png` y `cristal-menu-movil.png`.
