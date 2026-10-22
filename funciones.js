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
  lista.innerHTML = '';
  Object.values(carrito).forEach(item => {
    const div = document.createElement('div');
    div.className = 'item-carrito';
    div.innerHTML = `
      <img src="${item.img}" alt="${item.nombre}">
      <div class="detalle-item">
        <h4>${item.nombre}</h4>
        <p>Bs ${item.precio.toFixed(2)} x ${item.cantidad} = <strong>Bs ${(item.precio * item.cantidad).toFixed(2)}</strong></p>
        <div class="controles-cantidad">
          <button onclick="cambiarCantidadYActualizar('${item.id}', -1)">-</button>
          <span>${item.cantidad}</span>
          <button onclick="cambiarCantidadYActualizar('${item.id}', 1)">+</button>
        </div>
      </div>
    `;
    lista.appendChild(div);
  });
}

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