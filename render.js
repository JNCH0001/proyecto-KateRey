// ── 1. SELECCIONAR ──────────────────────────────────────────────────────
const contenedor = document.querySelector("#lista-productos");

// ── 2. CREAR ELEMENTOS ──────────────────────────────────────────────────
function crearTarjeta(producto) {
  const articulo = document.createElement("article");

  articulo.classList.add("tarjeta");
  if (!producto.disponible) {
    articulo.classList.add("agotado");
  }

  // Datos necesarios para el carrito
  articulo.dataset.id = producto.id;
  articulo.dataset.nombre = producto.nombre;
  articulo.dataset.precio = producto.precio;
  articulo.dataset.img = producto.img;

  articulo.innerHTML = `
    <img src="${producto.img}" alt="${producto.nombre}">
    <div class="info-producto">
      <h3>${producto.nombre}</h3>
      <p class="descripcion">${producto.descripcion}</p>
      <p class="precio">Bs ${producto.precio.toFixed(2)}</p>
    </div>
    <button type="button" class="btn-agregar">+ Agregar al pedido</button>
  `;

  return articulo;
}

// ── 3. RENDER ───────────────────────────────────────────────────────────
function render(lista) {
  if (!contenedor) return;

  contenedor.innerHTML = "";

  lista.forEach(producto => {
    if (producto.disponible) {
      contenedor.append(crearTarjeta(producto));
    }
  });

  if (contenedor.children.length === 0) {
    contenedor.innerHTML = "<p>No hay productos que mostrar.</p>";
  }
}

// ── 4. EXPONER PARA USAR DESDE APP.JS ───────────────────────────────────
window.renderizarProductos = () => render(productos);