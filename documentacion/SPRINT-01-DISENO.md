# Sprint 01 — Identidad azul y rediseño de interfaz

Fecha: 5 de noviembre de 2026.

Estado: entrega visual implementada y validada. No representa el cierre de los requisitos funcionales del marketplace.

## Objetivo y alcance

Aplicar las referencias de `expectativa nuevo diseño/` a la portada y a las pantallas existentes de TechMatch. La dirección visual combina azul hielo, azul eléctrico, azul marino y superficies translúcidas. Se conserva el símbolo original del logo mediante una variante azul con transparencia.

Este sprint entrega interfaz y navegación. La tasación, las ofertas, el catálogo de ejemplo y los pagos no se convierten en servicios reales por este rediseño.

## Requerimientos y criterios de aceptación

Los códigos UI son identificadores de este sprint, no equivalencias con los RF-01 a RF-60 del informe académico.

| ID | Requerimiento | Criterio de aceptación | Implementación |
| --- | --- | --- | --- |
| UI-01 | Conservar la identidad del logo y adaptar su color | Mantener etiqueta, conexiones y nodos; usar azules; conservar el archivo original | `public/logo-blue.png`, `NavBrand`, favicon |
| UI-02 | Compartir la paleta y el tema en el sistema | Tema claro y oscuro disponibles; la selección persiste al navegar y recargar | `ThemeContext`, variables CSS |
| UI-03 | Rediseñar la página principal con transparencias | Navegación flotante, hero, tarjetas, demostración, planes, vista móvil y footer coherentes | Componentes de la landing |
| UI-04 | Unificar autenticación | Registro, login y recuperación usan la misma composición y controles | `AuthLayout`, `FormField` |
| UI-05 | Unificar los paneles por rol | Comprador, vendedor y administrador comparten navegación, encabezado y menú de cuenta | `DashboardLayout` |
| UI-06 | Adaptarse a escritorio y móvil | Sin desborde horizontal a 375 y 1440 px; navegación móvil accesible | CSS responsive y navegación por rol |
| UI-07 | Conservar las interacciones existentes | Demo del tasador, precios anuales, formularios y rutas protegidas siguen disponibles | Comprobación en navegador |
| UI-08 | Mejorar accesibilidad de los controles | Foco visible, etiquetas, estado de selección, cierre con Escape y movimiento reducido | Componentes y estilos compartidos |
| UI-09 | Incorporar fondos y profundidad durante el scroll | Fondos de hardware, desplazamiento por capas y perspectiva 3D con adaptación a móvil | `ScrollBackdrop`, `ScrollScene`, hero |
| UI-10 | Añadir videos breves a las secciones principales | Dos bucles sin sonido, pausa manual, reproducción según visibilidad y respaldo estático | `VideoLoop`, portada y tasador |

Los recursos, su procedencia y las comprobaciones de UI-09 y UI-10 se describen en [Fondos, profundidad y videos](diseno/ANIMACIONES.md).

## Validación

- `npm run build`: compilación de producción.
- Navegador Chrome sin interfaz: revisión de portada, páginas de autenticación y los tres roles a 375 y 1440 px.
- Comprobaciones de navegación móvil, cierre con Escape, persistencia de tema, planes anuales, demo del tasador, buscador y categorías sobre los productos de ejemplo.
- Las capturas de los paneles usan perfiles y respuestas simulados únicamente dentro del navegador de comprobación. No verifican autenticación real, RLS ni datos de producción.
- Permanecen las advertencias de dependencias Zod y del paquete JavaScript principal superior a 500 kB.
- Resultado final: 36 comprobaciones de interfaz completadas, sin errores de ejecución del navegador. Evidencia en [validacion-ui.json](diseno/validacion-ui.json).
- Comprobación adicional de portada a 320, 768, 1024 y 1920 px: sin desbordes horizontales.
- El PNG azul se comprobó con canal alfa transparente. La portada pública también se revisó sin sustituir el contexto de autenticación.

Capturas: [portada clara](diseno/portada-clara.png), [portada oscura](diseno/portada-oscura.png), [comprador](diseno/panel-comprador.png), [vendedor](diseno/panel-vendedor.png) y [administración](diseno/panel-administrador.png).

## Decisiones de implementación

- La variante azul se usa desde `NavBrand` para que no existan logos distintos entre pantallas. `public/logo.png` se conserva.
- La selección de tema se guarda en `techmatch-theme`. El tema inicial es claro.
- Los precios de suscripción del panel vendedor ahora se leen de `plansData.js`, igual que los de la landing.
- Los paneles conservan las funciones disponibles. Las secciones del vendedor que estaban en construcción muestran una presentación de próxima disponibilidad.
- La búsqueda, las categorías y los favoritos del catálogo de muestra funcionan en memoria. No implican persistencia de productos o favoritos.
- El código de creación de sesiones y las comprobaciones de roles no se cambian para facilitar las capturas.

## Próximo sprint funcional propuesto

Objetivo: permitir que un vendedor publique un producto y que un comprador lo encuentre. Antes de asignar los RF definitivos, incorporar al repositorio la especificación de 60 requisitos mencionada en el informe técnico.

1. Versionar el esquema de productos, categorías, imágenes y políticas RLS.
2. Crear, editar, desactivar y consultar productos propios del vendedor.
3. Guardar imágenes con validación de tipo y tamaño.
4. Listar productos publicados para compradores con búsqueda, categorías y paginación.
5. Mostrar el detalle de un producto con datos reales.
6. Verificar que un vendedor no pueda modificar productos ajenos y que un usuario común no pueda cambiar su rol.

Definición de terminado propuesta: los datos sobreviven a una recarga, cada operación informa errores reales, los permisos se comprueban y el recorrido publicación → búsqueda → detalle se valida con cuentas de prueba.

## Logo: procedencia y prompt final

Herramienta: `image_gen.imagegen` integrada, en modo de edición. Entrada: `public/logo.png`. Salida: `public/logo-blue.png`, PNG con transparencia. El original no se sobrescribe.

Prompt final utilizado:

```text
Use case: precise-object-edit. Asset type: TechMatch Bolivia website and application logo, square PNG with genuine transparent background. Input image 1 is the edit target, the existing TechMatch logo. Primary request: create a refined BLUE color variant of this same existing symbol. Preserve its recognizable silhouette, proportions, diagonal price-tag outline, circular central hub with exactly the same small round nodes and connecting lines, and the diagonal connector ending in a ring at upper right. Keep the original identity and arrangement. Change only the turquoise and purple palette into a cohesive electric blue #1C75E8, deep royal blue #164DA6 and ice blue #83BCFF gradient. Clean up edges for crisp small UI use, reduce the original blurry glow to a very subtle highlight and slight dimensional bevel. It should feel polished, restrained and technical. Center the original symbol and let it occupy about 84 percent of the square canvas with a small transparent margin. Remove the white backdrop completely, including all internal negative spaces; use true alpha transparency. No lettering, no wordmark, no text, no extra elements, no new monogram, no badge container, no mockup. Preserve the original icon rather than inventing a new shape.
```
