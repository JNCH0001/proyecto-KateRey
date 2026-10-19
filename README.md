# Distribuidor KateRey — Sitio Web de Materiales de Construcción

**Estudiante:** Jhamil Najum Chino Huarachi  
**Proyecto:** Distribuidor KateRey  
**Rubro:** Venta y distribución de materiales de construcción

## Qué resuelve
El sitio web permite presentar un catalogo de materiales de construccion mostrar los precios por unidad o bolsa y facilitar que los clientes preparen sus pedidos Incluye productos como barras corrugadas barras angulares y cemento de las marcas VIACHA Plus y SOBOCE.
## Cómo está construido
- **Estructura HTML5:** Se utilizaron etiquetas semánticas como `<header>` para la cabecera, `<nav>` para el menú de navegación, `<main>` para el contenido principal, `<section>` para el catálogo y el formulario, `<article>` para cada producto, `<aside>` para información complementaria y `<footer>` para el pie de página.
- **Catálogo de productos:** Cada tarjeta contiene una imagen, el nombre del material, una descripción breve, su precio y un botón para agregarlo al pedido. Los atributos `data-producto` y `data-precio` identifican el producto y su precio dentro del HTML.
- **Diseño adaptable:** Se empleó **Flexbox** en la cabecera y el menú para distribuir los elementos y permitir que se acomoden en varias líneas. **CSS Grid** organiza las tarjetas del catálogo mediante `repeat(auto-fit, minmax(16rem, 1fr))`, ajustando las columnas al ancho disponible.
- **Colores y presentación:** La identidad visual utiliza una paleta sobria relacionada con un negocio de materiales de construcción:
  - Azul oscuro `#1a4a7a` como color principal para títulos, navegación y bordes destacados
  - Gris oscuro `#1f2933` para el texto principal.
  - Gris azulado `#5c6b73` para descripciones y texto secundario.
  - Gris muy claro `#f7f8f7` para el fondo y blanco `#ffffff` para las tarjetas.
  Los colores se definieron como variables CSS en `:root`, lo que facilita mantener una apariencia consistente.
- **Interactividad con JavaScript:** Al pulsar “Agregar al pedido” el contador visual del carrito aumenta y el botón muestra temporalmente el mensaje “Agregado”. El indicador cuenta los clics, pero todavía no almacena una lista detallada de productos ni calcula el importe total.
## Archivos del proyecto
- `index.html`: contiene la estructura de la página, el catálogo, el formulario y el script del contador.
- `estilos.css`: define los colores, la tipografía, las tarjetas, los botones y la distribución adaptable.
- `corrugada.jpg`, `angular.jpg`, `viacha.jpg` y `soboce.jpg`: imágenes que deben estar en la misma carpeta que `index.html` para mostrarse correctamente.

## Captura de pantalla
-`C:\Users\LENOVO AMD Ryzen 3\OneDrive\Escritorio\PROYECTO WEB\Captura de pantalla.png`

## Lo más difícil
Una de las dificultades es mantener las tarjetas de los materiales ordenadas en pantallas de diferentes tamaños. Para resolverlo se utiliza CSS Grid con columnas flexibles. También se emplea Flexbox en la cabecera para que el nombre del distribuidor y el menú puedan reorganizarse cuando hay menos espacio. Otro detalle importante es mantener los botones de las tarjetas al final de cada producto.

## Aspectos pendientes de funcionalidad
El contador del carrito es una demostración visual y no representas todavía un carrito completo. Además, el formulario utiliza `action="/pedido"` por lo que necesita un servidor que reciba la información. Aunque el botón indica “Confirmar Pedido por WhatsApp” el código actual no abre WhatsApp automáticamente; esa integración debe añadirse por separado.
