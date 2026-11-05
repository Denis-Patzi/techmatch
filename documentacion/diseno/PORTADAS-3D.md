# Tres propuestas de portada interactiva

La portada presenta dispositivos modelados por código en 3D. Se retiraron del hero la imagen de fondo de hardware, el video de la tarjeta gráfica y sus recuadros promocionales.

| Propuesta | Vista local | Composición y movimiento |
| --- | --- | --- |
| Órbita 3D | http://127.0.0.1:5173/?portada=orbita | Laptop central, celular, auriculares, procesador y RAM flotantes; órbitas azules y puntos de luz en movimiento |
| Constelación | http://127.0.0.1:5173/?portada=particulas | Los dispositivos se dibujan con partículas luminosas y contornos; la composición conserva profundidad y responde al cursor |
| Portal | http://127.0.0.1:5173/?portada=portal | Aros de energía alrededor de la laptop; los demás dispositivos recorren una órbita vertical |

Estas direcciones muestran un selector para comparar las propuestas en la página. La portada normal `/` presenta Órbita 3D y oculta los controles de comparación. El logo y la navegación mantienen el diseño compartido.

Órbita 3D tiene una respuesta al cursor un 25 % mayor y una interpolación más ágil. La RAM ocupa el espacio inferior izquierdo e incorpora chips, contactos dorados y una línea azul luminosa.

Las escenas se dibujan en tiempo real con Three.js, cargado en un módulo separado al aproximarse la composición a la pantalla. No utilizan modelos externos ni solicitudes de imágenes para los dispositivos. Las pantallas y los puntos luminosos se generan con canvas.

El movimiento responde al cursor y al scroll. Cada escena tiene control de pausa, se detiene fuera de pantalla y al ocultar la pestaña, y presenta una composición estática con movimiento reducido. El respaldo sin WebGL es una ilustración vectorial de los mismos dispositivos. Al alternar opciones o salir de la portada se liberan geometrías, materiales y el contexto gráfico.

Fuentes:

- `src/components/organisms/HeroSection.jsx`: composición y selector de revisión.
- `src/components/organisms/HeroTechScene.jsx`: carga, visibilidad, movimiento reducido y respaldo.
- `src/lib/hero/techModels.js`: dispositivos y conversión a partículas.
- `src/lib/hero/createTechScene.js`: iluminación, cámara, órbitas y animación.
- `src/styles/hero-universe.css`: integración visual y adaptación móvil.

Las capturas `portada-opcion-*-clara.png`, `portada-opcion-*-oscura.png` y `portada-opcion-*-movil.png` permiten revisar las tres propuestas. Las comprobaciones de navegador se registran en `validacion-portadas-3d.json`.
