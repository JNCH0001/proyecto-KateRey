// ── remoto.js ─────────────────────────────────────────────────────────────
// Carga productos desde datos.json usando fetch (async/await)

// ── 1. REFERENCIA AL BOTÓN QUE SÍ EXISTE EN EL HTML ──────────────────────
const btnCargarRemoto = document.querySelector("#cargar-remoto");

// ── 2. FUNCIÓN DE CARGA CON fetch ─────────────────────────────────────────
async function cargarProductosDesdeJSON(url = "datos.json") {
  const contenedor = document.querySelector("#lista-productos");
  if (!contenedor) return;

  contenedor.innerHTML = "<p>Cargando productos desde el servidor...</p>";

  try {
    const respuesta = await fetch(url);

    if (!respuesta.ok) {
      throw new Error(`El servidor respondió ${respuesta.status}`);
    }

    const datos = await respuesta.json();

    // Actualizamos el array global de productos con los del JSON
    // Los scripts se cargan en orden, así que 'productos' ya existe de datos.js
    if (datos.productos && Array.isArray(datos.productos)) {
      // Fusionamos: actualizamos precios/stock de los que ya existen, añadimos nuevos
      datos.productos.forEach(remoto => {
        const idx = productos.findIndex(p => p.id === remoto.id);
        if (idx !== -1) {
          productos[idx] = { ...productos[idx], ...remoto };
        } else {
          productos.push(remoto);
        }
      });
    }

    // Re-renderizamos
   if (typeof render === "function") {
  render(productos);
} else if (typeof actualizar === "function") {
  actualizar();          // ← usa el pipeline real de eventos.js (filtros + buscador)
} else {
  contenedor.innerHTML = ""; // al menos no dejes el mensaje de carga
}

    // Reactivamos los botones de agregar
    if (typeof activarBotonesAgregar === "function") {
      activarBotonesAgregar();
    }

    if (typeof mostrarNotificacion === "function") {
      mostrarNotificacion(`${datos.productos.length} productos cargados desde JSON`, "exito");
    }

    console.log("Productos remotos cargados con éxito:", datos.productos.length);

  } catch (error) {
    if (contenedor) {
      contenedor.innerHTML = `<p class="error">No se pudieron cargar los productos: ${error.message}</p>`;
    }
    if (typeof mostrarNotificacion === "function") {
      mostrarNotificacion("Error al cargar productos remotos", "error");
    }
    console.error("Error al cargar JSON:", error);
  }
}

// ── 3. ESCUCHAR EL CLIC DEL BOTÓN ────────────────────────────────────────
if (btnCargarRemoto) {
  btnCargarRemoto.addEventListener("click", () => cargarProductosDesdeJSON());
}

// ── 4. JSON: análisis y serialización ────────────────────────────────────
// Ejemplo educativo en consola (no afecta la UI)
const ejemploJson = '{"nombre":"Cemento SOBOCE","precio":48,"disponible":true}';
const ejemploObj = JSON.parse(ejemploJson);
console.log("JSON parseado:", ejemploObj.precio, typeof ejemploObj.precio);
console.log("JSON serializado:", JSON.stringify(ejemploObj));
