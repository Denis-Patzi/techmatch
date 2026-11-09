# Revisión del nuevo diagrama y preparación de la demostración

> Actualización posterior: el [Sprint 02: aplicación social y CRUD](SPRINT-02-APP-SOCIAL-Y-CRUD.md) incorpora productos persistentes, multimedia, deseos y gestión administrativa. La revisión original de abajo se conserva como diagnóstico previo.

Fecha: 8 de noviembre de 2026. Fuente: [nuevo diagrama.png](<nuevo diagrama.png>).

La revisión es estática, a partir del código del repositorio. No se ejecutaron operaciones sobre usuarios, productos o datos de producción ni se comprobaron las políticas de la base de datos desplegada.

## Alcance por caso de uso

| Diagrama de alto nivel | Evidencia actual en el código | Estado para una demostración en vivo |
| --- | --- | --- |
| UC01 — Gestión de usuarios | Registro e inicio de sesión en `AuthContext`; lectura y edición del perfil. El administrador consulta perfiles, cambia rol y verificación y elimina filas de `profiles`. | Parcialmente conectado a Supabase. Falta verificar persistencia, permisos y ciclo completo con cuentas de prueba. Eliminar una fila de `profiles` no demuestra la eliminación de la cuenta de autenticación. |
| UC02 — Gestión de productos | `SellerCatalogTab` muestra una fila fija; Nueva Publicación y Editar no tienen acciones. El marketplace usa una lista local; el tasador y la portada usan datos de ejemplo. | El CRUD persistente de publicaciones es la prioridad. Faltan crear, listar, editar y eliminar publicaciones propias y reflejar los cambios en catálogo y búsqueda. |
| UC03 — Gestión de ventas | Negociaciones del vendedor aparece como Próximamente; ofertas del comprador utiliza datos locales. | No se encontró un flujo persistente de venta, negociación, pago o seguimiento en los componentes revisados. |
| UC04 — Gestión de plataforma | Usuarios parcialmente conectado; moderación, verificaciones y seguridad usan simulaciones. Suscripciones presenta precios y opciones, sin activación real. | Faltan operaciones persistentes y permisos específicos por función. Las pantallas de administración visuales no bastan para acreditar este módulo. |

Los códigos visibles antiguos, como CU05, CU16 y CU17, pertenecen a la descomposición anterior. Conviene documentar su correspondencia con UC01–UC04; un caso de alto nivel puede contener varios casos detallados.

## Demostración mínima que conviene preparar

1. Registrar una cuenta de prueba, iniciar sesión y modificar su perfil. Recargar y comprobar los cambios.
2. Crear una publicación, verla en el catálogo, editar su precio y descripción y eliminarla. Comprobar cada operación tras recargar.
3. Iniciar sesión con otra cuenta y verificar que no puede editar ni eliminar publicaciones ajenas.
4. Ingresar como administrador y demostrar las acciones autorizadas sobre usuarios y publicaciones, con efectos comprobables en la base de datos.
5. Diferenciar eliminación de un perfil, desactivación y eliminación de una cuenta completa. No presentar la operación actual sobre `profiles` como borrado completo de autenticación.

No todos los actores deben disponer de todas las operaciones. El comprador consulta productos y gestiona sus propios datos; quien publica administra sus publicaciones; el administrador realiza las funciones de gestión y moderación definidas. Las restricciones deben comprobarse también en la base de datos.

El concepto reciente permite publicar desde cuentas personales y de tienda. Por tanto, tipo de cuenta (personal/tienda) y función (comprar/vender/administrar) deben alinearse antes de cerrar los permisos: actualmente el panel de comprador no ofrece el CRUD del catálogo.

## Planes y portada

Las suscripciones siguen dentro de UC04. Los planes se ocultaron de la portada al priorizar feed, perfiles y subastas; sus componentes y datos se conservan, y el vendedor todavía tiene una vista de suscripciones.

Es razonable recuperar un bloque breve de planes al final de la portada si las suscripciones continúan en el modelo del proyecto. Antes debe revisarse `plansData.js`: el plan Básico excluye videos mientras el concepto actual los presenta como parte central del feed. Los límites, beneficios, importes y activación deben ser coherentes con el alcance acordado. Esta entrega incorpora el mapa solicitado y no modifica los planes.

Actualización posterior a esta revisión: los planes ya fueron redefinidos y reincorporados a la portada. Básico incluye cinco videos al mes; Personal Pro y Tienda Pro amplían los cupos manteniendo los precios. La definición vigente está en [ACTORES-CUENTAS-Y-PLANES.md](ACTORES-CUENTAS-Y-PLANES.md). Las observaciones anteriores describen la situación previa a esa actualización.

## Ubicación de referencia

Se añade un mapa de Google pequeño al pie, con acceso a abrirlo en Google Maps, carga diferida y tamaño adaptable. Se conserva la referencia a la Escuela Militar de Ingeniería, Campus Irpavi, Av. Rafael Pabón, La Paz, y el aviso de próximas sucursales en Santa Cruz y Cochabamba.

La dirección de referencia y el mapa incrustado se tomaron de la [página oficial de la EMI, Unidad Académica La Paz](https://www.emi.edu.bo/universidad/unidades-academicas/lapaz). Se utiliza su mapa publicado para identificar el campus Irpavi. El enlace externo usa el formato de [Maps URLs](https://developers.google.com/maps/documentation/urls/get-started).

Validación: Google devolvió HTTP 200 para el mapa incrustado y se inspeccionó visualmente el marcador de la EMI. El recuadro y el enlace se comprobaron a 320, 375, 768 y 1440 px, sin desbordes de página ni errores de ejecución. Se revisaron los temas claro y oscuro. Resultado: [validacion-mapa-pie.json](diseno/validacion-mapa-pie.json); capturas `diseno/mapa-pie-*.png`. La compilación de producción pasa; conserva los avisos previos de Zod y tamaño de paquetes.
