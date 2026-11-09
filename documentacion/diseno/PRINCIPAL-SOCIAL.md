# Portada: feed visual, perfiles y ayuda con IA

La página principal presenta el nuevo concepto de TechMatch: descubrir productos en un feed de fotos y videos y publicar desde una cuenta personal o de tienda. Cada perfil reúne sus publicaciones, catálogo y subastas.

La IA sigue siendo una función central: ayuda a preparar la descripción del producto y recomienda un precio que la persona puede revisar y ajustar.

## Recorrido de la portada

1. **Presentación:** mensaje sobre el feed, perfiles y subastas, junto a Órbita 3D con RAM y respuesta al cursor.
2. **El feed:** publicación 9:16 de hasta 432 px de ancho a la izquierda y texto a la derecha. Incluye foto/video vertical, navegación inferior, precio y acceso al catálogo. En móvil ambos bloques se apilan con el texto primero.
3. **Perfiles:** texto a la izquierda y vista de celular 9:16 a la derecha, con avatar circular ampliado, nombre, puntuación, ventas y productos de ejemplo al lado; descripción debajo. Publicaciones en tres columnas y catálogo compacto de dos columnas con categorías Todos, Computación, Celulares y Audio. Ambas cuentas incluyen Subastas; la personal también incluye Deseos con un corazón.
4. **Tasador IA:** un celular con giro 3D y barrido de luz muestra cómo se prepara una publicación. Aparecen sus características, descripción sugerida y recomendación de precio. La animación comienza al entrar en la sección, permite pausar o repetir y conserva la ficha final para leerla. Se eliminan la carga de archivos y los selectores del demo.
5. **Subastas:** texto a la izquierda y ficha 9:16 a la derecha, con fotografía, vendedor, estado, precio de salida y acceso al registro. En móvil el texto aparece primero y la ficha debajo.
6. **Cómo funciona:** elegir perfil, mostrar el producto y publicar como venta o subasta.
7. **Planes:** Básico, Personal Pro y Tienda Pro, con fotos y videos desde Básico, límites de publicación y comparación mensual/anual. Mantiene los precios anteriores y muestra los totales anuales. Los planes de pago se presentan como próximos.
8. **Crear perfil:** acceso al registro y al inicio de sesión.

Se retiran de la portada las cifras promocionales, bloques separados para compradores y vendedores, comparación técnica, misión y visión y promoción de apps nativas. Los planes se reincorporan con límites y beneficios alineados al feed. La ubicación de referencia y el mapa de Google se conservan en el pie: EMI, Av. Rafael Pabón, La Paz; Santa Cruz y Cochabamba, próximamente.

## Alcance funcional

Las publicaciones, perfiles y subastas de la portada son ejemplos identificados como vistas ilustrativas. El feed de producción, almacenamiento multimedia, catálogo público y motor de subastas siguen pendientes. El registro y perfil personal/tienda sí se incorporan posteriormente en la [aplicación de usuario unificada](../APLICACION-USUARIO-UNIFICADA.md), con administración separada.

El tasador utiliza datos locales de demostración para un iPhone 14 Pro, incluidos su descripción, estado y precios. El giro y el escaneo son una ilustración animada; no se conecta a un servicio de IA ni consulta precios actuales. La portada no permite subir archivos ni editar una publicación. El botón de crear publicación dirige al registro existente.

Los componentes de las secciones anteriores se conservan en el repositorio. Se modifica su presencia en la portada, sin retirar pantallas internas.

## Comprobación

Comprobación original de la portada: compilación de producción correcta, navegación interna sin destinos ausentes, alternancia de fotos y video, selección de cuenta personal o tienda, vistas del catálogo y subastas y navegación móvil comprobadas en Chrome. Se revisan 320, 375, 768, 1100, 1440 y 1920 px, con movimiento reducido y sin errores de ejecución ni archivos multimedia ausentes.

Resultado: [validacion-principal-social.json](validacion-principal-social.json). Capturas: `principal-social-*.png`.

Actualización del tasador animado: se comprueban el inicio al entrar en pantalla, revelado por etapas, pausa, continuación, repetición, detención fuera de pantalla, ficha estática con movimiento reducido y enlace al registro. Ambos temas y los mismos seis anchos se revisan sin desbordamientos ni errores de ejecución. La compilación de producción pasa; persisten los avisos previos de tamaño de los paquetes y anotaciones de Zod.

Resultado actual del tasador: [validacion-tasador-animado.json](validacion-tasador-animado.json). Capturas: `tasador-animado-*.png`.

Actualización de medios verticales: [VISTAS-VERTICALES.md](VISTAS-VERTICALES.md), con assets, prompts y validación de feed, catálogo y subastas.

Actores, tipos de cuenta, nuevos límites y esquema propuesto: [ACTORES-CUENTAS-Y-PLANES.md](../ACTORES-CUENTAS-Y-PLANES.md). Los planes son capacidades comerciales y no agregan actores al diagrama. Los límites se definen en código y documentación; su aplicación sobre publicaciones reales depende del CRUD y del control de cuotas en la base de datos.
