// ── ELEMENTOS DEL DOM ───────────────────────────────────────────────────
const listaItems     = document.getElementById('lista-items-carrito');
const montoTotal     = document.getElementById('monto-total');
const totalCarrito   = document.getElementById('total-carrito');
const sectionCarrito = document.getElementById('resumen-carrito');
const btnWhatsApp    = document.getElementById('btn-whatsapp');
const btnSeguir      = document.getElementById('btn-seguir');

// ── ACTUALIZAR INTERFAZ DEL CARRITO ─────────────────────────────────────
function actualizarUICarrito() {
  generarHTMLCarrito();

  const { total, count } = obtenerTotalCarrito();

  montoTotal.textContent = `Bs ${total.toFixed(2)}`;
  totalCarrito.textContent = count;

  if (count === 0) {
    sectionCarrito.style.display = 'none';
  } else {
    sectionCarrito.style.display = 'block';
  }
}

// ── EVENTOS DE LOS BOTONES "AGREGAR" ────────────────────────────────────
function activarBotonesAgregar() {
  const btnsAgregar = document.querySelectorAll('.btn-agregar');

  btnsAgregar.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const articulo = e.target.closest('article');
      const id     = articulo.dataset.id;
      const nombre = articulo.dataset.nombre;
      const precio = parseFloat(articulo.dataset.precio);
      const img    = articulo.dataset.img;

      agregarAlCarrito(id, nombre, precio, img);

      // Feedback visual
      const textoOriginal = btn.textContent;
      btn.textContent = '✓ Agregado';
      btn.classList.add('agregado');

      setTimeout(() => {
        btn.textContent = textoOriginal;
        btn.classList.remove('agregado');
      }, 1500);

      actualizarUICarrito();
      sectionCarrito.scrollIntoView({ behavior: 'smooth' });
    });
  });
}

// ── BOTONES DEL RESUMEN ─────────────────────────────────────────────────
if (btnWhatsApp) {
  btnWhatsApp.addEventListener('click', enviarPedidoWhatsApp);
}


// ── INICIO ──────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  // 1. Pintamos los productos
  renderizarProductos();

  // 2. Activamos los botones de agregar
  activarBotonesAgregar();
});
// ── FORMULARIO DE PEDIDO ────────────────────────────────────────────────
// ── BOTÓN "Continuar" del carrito ────────────────────────────────────────
const btnIrFormulario = document.getElementById('btn-ir-formulario');
if (btnIrFormulario) {
  btnIrFormulario.addEventListener('click', () => {
    document.getElementById('pedido').scrollIntoView({ behavior: 'smooth' });
  });
}

// ── FORMULARIO DE PEDIDO (usa el carrito) ────────────────────────────────
const formulario = document.querySelector("#formulario-pedido");

if (formulario) {
  formulario.addEventListener("submit", (event) => {
    event.preventDefault();

    // 1. Validación nativa
    if (!formulario.reportValidity()) return;

    // 2. Debe haber productos en el carrito
    const { count, total } = obtenerTotalCarrito();
    if (count === 0) {
      alert("Tu carrito está vacío. Agrega productos antes de confirmar el pedido.");
      document.getElementById('Catalogo').scrollIntoView({ behavior: 'smooth' });
      return;
    }

    // 3. Validar fecha >= hoy
    const fechaInput = formulario.querySelector("#fecha");
    const hoy = new Date().toISOString().slice(0, 10);
    if (fechaInput.value < hoy) {
      fechaInput.setCustomValidity("La fecha de entrega no puede ser anterior a hoy.");
      fechaInput.reportValidity();
      fechaInput.addEventListener("input", () => fechaInput.setCustomValidity(""), { once: true });
      return;
    }

    // 4. Recolectar datos
    const datos = Object.fromEntries(new FormData(formulario));
    const items = Object.values(carrito);
    const codigo = typeof generarCodigoPedido === "function" ? generarCodigoPedido() : `KR-${Date.now().toString().slice(-5)}`;

    // 5. Generar y descargar el Recibo en formato PDF
    if (typeof generarPDFRecibo === "function") {
      generarPDFRecibo(datos, items, total, codigo);
    }

    // 6. Enviar por WhatsApp (con formato de recibo y código)
    const waUrl = enviarPedidoWhatsApp(datos, codigo);

    if (waUrl) {
      // 7. Mostrar tarjeta de confirmación en la página
      const seccionConfirmacion = document.getElementById("confirmacion-pedido");
      const spanCodigo = document.getElementById("conf-codigo-recibo");
      const btnReDescargar = document.getElementById("btn-re-descargar-pdf");
      const linkWA = document.getElementById("btn-abrir-whatsapp-link");

      if (seccionConfirmacion) {
        if (spanCodigo) spanCodigo.textContent = codigo;
        if (linkWA) linkWA.href = waUrl;

        const btnCompartir = document.getElementById("btn-compartir-pdf");
        if (btnCompartir) {
          btnCompartir.onclick = () => {
            if (typeof compartirReciboPDF === "function") {
              compartirReciboPDF(datos, items, total, codigo);
            }
          };
        }

        if (btnReDescargar) {
          btnReDescargar.onclick = () => {
            if (typeof generarPDFRecibo === "function") {
              generarPDFRecibo(datos, items, total, codigo);
            }
          };
        }

        seccionConfirmacion.style.display = "block";
        seccionConfirmacion.scrollIntoView({ behavior: "smooth" });
      }

      // 8. Vaciar carrito y refrescar UI
      vaciarCarrito();
      actualizarUICarrito();
      formulario.reset();

      // 9. Ocultar resumen
      sectionCarrito.style.display = 'none';
    }
  });
}