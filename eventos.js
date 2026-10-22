// ── 1. LOS ELEMENTOS QUE SE VAN A ESCUCHAR ──────────────────────────────
const buscador = document.querySelector("#buscador");
const btnBuscar = document.querySelector("#btn-buscar");
const filtros = document.querySelector("#filtros");
const resultado = document.querySelector("#resultado");

let categoriaActiva = "todos";
let textoBuscado = "";

// ── 2. UNA SOLA FUNCIÓN QUE DECIDE QUÉ MOSTRAR ──────────────────────────
function actualizar() {
  const query = textoBuscado.trim().toLowerCase();

  const visibles = productos
    .filter(p => categoriaActiva === "todos" || p.categoria === categoriaActiva)
    .filter(p => {
      if (!query) return true;
      const enNombre = p.nombre && p.nombre.toLowerCase().includes(query);
      const enCategoria = p.categoria && p.categoria.toLowerCase().includes(query);
      const enDescripcion = p.descripcion && p.descripcion.toLowerCase().includes(query);
      return enNombre || enCategoria || enDescripcion;
    });

  render(visibles);
  if (resultado) {
    if (query || categoriaActiva !== "todos") {
      resultado.textContent = `Mostrando ${visibles.length} de ${productos.length} productos`;
    } else {
      resultado.textContent = `Total: ${productos.length} productos disponibles`;
    }
  }
  if (typeof activarBotonesAgregar === "function") {
    activarBotonesAgregar();
  }
}

actualizar();

// ── 3. EL EVENTO input Y BOTÓN DE BUSCADOR ───────────────────────────────
if (buscador) {
  buscador.addEventListener("input", (event) => {
    textoBuscado = event.target.value;
    actualizar();
  });

  buscador.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      textoBuscado = buscador.value;
      actualizar();
    }
  });
}

if (btnBuscar) {
  btnBuscar.addEventListener("click", () => {
    if (buscador) {
      textoBuscado = buscador.value;
    }
    actualizar();
  });
}

// ── 4. DELEGACIÓN DE EVENTOS ────────────────────────────────────────────
if (filtros) {
  filtros.addEventListener("click", (event) => {
    const boton = event.target.closest("button");
    if (!boton) return;

    categoriaActiva = boton.dataset.categoria;

    filtros.querySelectorAll("button").forEach(b => b.classList.remove("activo"));
    boton.classList.add("activo");

    actualizar();
  });
}

// ── 6. EXPRESIONES REGULARES, LO JUSTO ──────────────────────────────────
const PATRONES = {
  telefono: /^[0-9]{7,8}$/,
  correo: /^[^@\s]+@[^@\s]+\.[a-z]{2,}$/i,
  ci: /^[0-9]{5,10}(-[0-9A-Za-z]{1,3})?$/,
};

console.log("70123456 válido:", PATRONES.telefono.test("70123456"));
console.log("7012 válido:", PATRONES.telefono.test("7012"));
console.log("ana@correo.bo válido:", PATRONES.correo.test("ana@correo.bo"));

// ── 7. LA VALIDACIÓN DE VERDAD NO ESTÁ AQUÍ ─────────────────────────────
