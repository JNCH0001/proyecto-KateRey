let carrito = {};

// Número ÚNICO de WhatsApp (cámbialo por el real de KateRey)
const WHATSAPP_NUMERO = "59169389264";

function agregarAlCarrito(id, nombre, precio, img) {
  if (!carrito[id]) {
    carrito[id] = { id, nombre, precio, img, cantidad: 1 };
  } else {
    carrito[id].cantidad++;
  }
}

function cambiarCantidad(id, delta) {
  if (carrito[id]) {
    carrito[id].cantidad += delta;
    if (carrito[id].cantidad <= 0) {
      delete carrito[id];
    }
  }
}

function obtenerTotalCarrito() {
  let total = 0;
  let count = 0;
  Object.values(carrito).forEach(item => {
    total += item.precio * item.cantidad;
    count += item.cantidad;
  });
  return { total, count };
}

function vaciarCarrito() {
  carrito = {};
}

function generarHTMLCarrito() {
  const lista = document.getElementById('lista-items-carrito');
  if (!lista) return;
  
  const items = Object.values(carrito);

  if (items.length === 0) {
    lista.innerHTML = '<p style="text-align:center; color:var(--color-suave); padding: 1rem;">Tu carrito está vacío.</p>';
    return;
  }

  const { total, count } = obtenerTotalCarrito();

  // Generar filas de la tabla
  const filas = items.map(item => `
    <tr>
      <td>
        <div class="producto-celda">
          <img src="${item.img || 'default.jpg'}" alt="${item.nombre}" class="img-tabla">
          <span>${item.nombre}</span>
        </div>
      </td>
      <td>Bs ${item.precio.toFixed(2)}</td>
      <td>
        <div class="controles-tabla">
          <button type="button" onclick="cambiarCantidadYActualizar('${item.id}', -1)">-</button>
          <span>${item.cantidad}</span>
          <button type="button" onclick="cambiarCantidadYActualizar('${item.id}', 1)">+</button>
        </div>
      </td>
      <td class="subtotal-tabla">Bs ${(item.precio * item.cantidad).toFixed(2)}</td>
      <td>
        <button type="button" class="btn-quitar" onclick="quitarProductoDelCarrito('${item.id}')" title="Quitar este producto">🗑️</button>
      </td>
    </tr>
  `).join("");

  // Armar la tabla completa con su resumen final (tfoot)
  lista.innerHTML = `
    <div class="tabla-carrito-wrapper">
      <table class="tabla-carrito">
        <thead>
          <tr>
            <th>Producto</th>
            <th>Precio</th>
            <th>Cantidad</th>
            <th>Subtotal</th>
            <th>Acción</th>
          </tr>
        </thead>
        <tbody>
          ${filas}
        </tbody>
        <tfoot>
          <tr>
            <td colspan="4" class="resumen-texto">Productos distintos:</td>
            <td colspan="1" class="resumen-valor">${items.length}</td>
          </tr>
          <tr>
            <td colspan="4" class="resumen-texto">Total de unidades:</td>
            <td colspan="1" class="resumen-valor">${count}</td>
          </tr>
          <tr class="fila-total">
            <td colspan="4" class="resumen-texto-total">TOTAL A PAGAR:</td>
            <td colspan="1" class="resumen-valor-total">Bs ${total.toFixed(2)}</td>
          </tr>
        </tfoot>
      </table>
    </div>
  `;
}

// Eliminar un producto de golpe
window.quitarProductoDelCarrito = function(id) {
  if (carrito[id]) {
    delete carrito[id];
    actualizarUICarrito();
  }
};

// Arma el mensaje de WhatsApp con formato de recibo formal
function construirMensajePedido(datosCliente, codigo) {
  const { total } = obtenerTotalCarrito();
  const items = Object.values(carrito);

  if (typeof construirMensajeWhatsAppRecibo === "function") {
    return construirMensajeWhatsAppRecibo(datosCliente, items, total, codigo || "KR-00000");
  }

  // Respaldo de formato de texto
  let msg = `🧾 *RECIBO DE PEDIDO - DISTRIBUIDOR KATEREy*%0A`;
  msg += `━━━━━━━━━━━━━━━━━━━━━━%0A`;
  msg += `📄 *Recibo:* #${codigo || "KR-00000"}%0A`;
  msg += `👤 *Cliente:* ${datosCliente.nombre}%0A`;
  msg += `📞 *Teléfono:* ${datosCliente.telefono}%0A`;
  msg += `📧 *Email:* ${datosCliente.email}%0A`;
  msg += `📅 *Fecha de entrega:* ${datosCliente.fecha}%0A`;
  msg += `📝 *Notas:* ${datosCliente.notas || "Ninguna"}%0A%0A`;
  msg += `📦 *PRODUCTOS:*%0A`;
  items.forEach(i => {
    msg += `• ${i.nombre} (x${i.cantidad}): Bs ${(i.precio * i.cantidad).toFixed(2)}%0A`;
  });
  msg += `%0A━━━━━━━━━━━━━━━━━━━━━━%0A`;
  msg += `💰 *TOTAL: Bs ${total.toFixed(2)}*%0A`;
  msg += `📎 *Nota:* Recibo oficial en PDF generado y descargado.`;
  return msg;
}

function enviarPedidoWhatsApp(datosCliente, codigo) {
  if (Object.keys(carrito).length === 0) return null;
  const msg = construirMensajePedido(datosCliente, codigo);
  const waUrl = `https://wa.me/${WHATSAPP_NUMERO}?text=${msg}`;
  window.open(waUrl, '_blank');
  return waUrl;
}

// Expuesta globalmente para los botones del carrito
window.cambiarCantidadYActualizar = function(id, delta) {
  cambiarCantidad(id, delta);
  actualizarUICarrito();
};