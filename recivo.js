// ── RECIVO.JS ─────────────────────────────────────────────────────────────
// Generación de recibo en formato PDF y utilidades de comprobante de compra

/**
 * Genera un código único para el recibo del pedido
 */
function generarCodigoPedido() {
  const timestamp = Date.now().toString().slice(-5);
  const random = Math.floor(Math.random() * 90 + 10);
  return `KR-${timestamp}${random}`;
}

/**
 * Crea la instancia de jsPDF con el diseño corporativo de KateRey
 */
function crearDocumentoPDF(datosCliente, itemsCarrito, total, codigo) {
  if (!window.jspdf || !window.jspdf.jsPDF) return null;

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4"
  });

  const fechaHoy = new Date().toLocaleDateString("es-BO", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });

  // ── CABECERA / ENCABEZADO ─────────────────────────────────────────
  doc.setFillColor(31, 41, 51); // #1f2933
  doc.rect(15, 12, 180, 28, "F");

  // Título comercial
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.setTextColor(255, 255, 255);
  doc.text("DISTRIBUIDOR KATEREy", 22, 22);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(218, 225, 231);
  doc.text("Material de construcción garantizado", 22, 28);
  doc.text("Av. Principal s/n | Tel: 69389264 | Bolivia", 22, 34);

  // Bloque del recibo (derecha)
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(255, 255, 255);
  doc.text("RECIBO DE PEDIDO", 188, 22, { align: "right" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(255, 215, 0); // Dorado
  doc.text(`N° ${codigo}`, 188, 28, { align: "right" });

  doc.setFontSize(8);
  doc.setTextColor(218, 225, 231);
  doc.text(fechaHoy, 188, 34, { align: "right" });

  // ── DATOS DEL CLIENTE ─────────────────────────────────────────────
  doc.setFillColor(245, 247, 250);
  doc.setDrawColor(209, 213, 219);
  doc.roundedRect(15, 45, 180, 36, 2, 2, "FD");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(31, 41, 51);
  doc.text("DATOS DEL CLIENTE Y ENTREGA", 20, 52);

  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.text("Cliente:", 20, 60);
  doc.text("Teléfono:", 20, 67);
  doc.text("Email:", 20, 74);

  doc.setFont("helvetica", "normal");
  doc.setTextColor(55, 65, 81);
  doc.text(datosCliente.nombre || "No especificado", 42, 60);
  doc.text(datosCliente.telefono || "No especificado", 42, 67);
  doc.text(datosCliente.email || "No especificado", 42, 74);

  doc.setFont("helvetica", "bold");
  doc.setTextColor(31, 41, 51);
  doc.text("Entrega prevista:", 110, 60);
  doc.text("Indicaciones:", 110, 67);

  doc.setFont("helvetica", "normal");
  doc.setTextColor(55, 65, 81);
  doc.text(datosCliente.fecha || "A coordinar", 145, 60);

  const notasTexto = doc.splitTextToSize(datosCliente.notas || "Sin observaciones adicionales.", 45);
  doc.text(notasTexto, 145, 67);

  // ── TABLA DE PRODUCTOS ────────────────────────────────────────────
  let y = 88;

  // Encabezado de la tabla
  doc.setFillColor(43, 56, 70);
  doc.rect(15, y, 180, 8, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(255, 255, 255);
  doc.text("PRODUCTO", 20, y + 5.5);
  doc.text("CANT.", 115, y + 5.5, { align: "center" });
  doc.text("P. UNITARIO", 150, y + 5.5, { align: "right" });
  doc.text("SUBTOTAL", 188, y + 5.5, { align: "right" });

  y += 8;

  // Filas de productos
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(31, 41, 51);

  itemsCarrito.forEach((item, index) => {
    if (index % 2 === 0) {
      doc.setFillColor(255, 255, 255);
    } else {
      doc.setFillColor(248, 250, 252);
    }
    doc.rect(15, y, 180, 7.5, "F");

    doc.text(item.nombre, 20, y + 5);
    doc.text(String(item.cantidad), 115, y + 5, { align: "center" });
    doc.text(`Bs ${item.precio.toFixed(2)}`, 150, y + 5, { align: "right" });
    doc.text(`Bs ${(item.precio * item.cantidad).toFixed(2)}`, 188, y + 5, { align: "right" });

    doc.setDrawColor(229, 231, 235);
    doc.line(15, y + 7.5, 195, y + 7.5);

    y += 7.5;
  });

  // ── TOTAL ─────────────────────────────────────────────────────────
  y += 4;
  doc.setFillColor(31, 41, 51);
  doc.roundedRect(120, y, 75, 12, 1.5, 1.5, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(255, 255, 255);
  doc.text("TOTAL ESTIMADO:", 125, y + 8);
  doc.setTextColor(74, 222, 128);
  doc.text(`Bs ${total.toFixed(2)}`, 190, y + 8, { align: "right" });

  // ── TÉRMINOS Y PIE DE PÁGINA ──────────────────────────────────────
  const pieY = 250;
  doc.setDrawColor(209, 213, 219);
  doc.line(15, pieY, 195, pieY);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(31, 41, 51);
  doc.text("Términos del pedido:", 15, pieY + 6);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(107, 114, 128);
  doc.text("• Este recibo es una solicitud formal generada en Distribuidor KateRey.", 15, pieY + 11);
  doc.text("• La confirmación final, forma de pago y entrega se coordinan por WhatsApp al +591 69389264.", 15, pieY + 16);
  doc.text("• Gracias por confiar en nuestros materiales de construcción garantizados.", 15, pieY + 21);

  return doc;
}

/**
 * Genera y descarga el archivo PDF del recibo usando jsPDF
 */
function generarPDFRecibo(datosCliente, itemsCarrito, total, codigoPedido) {
  const codigo = codigoPedido || generarCodigoPedido();

  try {
    const doc = crearDocumentoPDF(datosCliente, itemsCarrito, total, codigo);
    if (doc) {
      doc.save(`Recibo_KateRey_${codigo}.pdf`);
      return codigo;
    }
  } catch (err) {
    console.error("Error al generar PDF con jsPDF:", err);
  }

  // Fallback si la librería no estuviera disponible
  generarReciboFallback(datosCliente, itemsCarrito, total, codigo);
  return codigo;
}

/**
 * Obtiene el archivo PDF en memoria como objeto File
 */
function obtenerArchivoPDF(datosCliente, itemsCarrito, total, codigo) {
  try {
    const doc = crearDocumentoPDF(datosCliente, itemsCarrito, total, codigo);
    if (doc) {
      const blob = doc.output("blob");
      return new File([blob], `Recibo_KateRey_${codigo}.pdf`, { type: "application/pdf" });
    }
  } catch (err) {
    console.error("Error al obtener Blob del PDF:", err);
  }
  return null;
}

/**
 * Comprueba si el navegador actual soporta compartir archivos directamente (Web Share API)
 */
function soportaCompartirArchivos() {
  if (!navigator.share || !navigator.canShare) return false;
  try {
    const archivoPrueba = new File(["test"], "test.pdf", { type: "application/pdf" });
    return navigator.canShare({ files: [archivoPrueba] });
  } catch (e) {
    return false;
  }
}

/**
 * Comparte el archivo PDF directamente hacia WhatsApp u otras apps nativas
 */
async function compartirReciboPDF(datosCliente, itemsCarrito, total, codigo) {
  const archivo = obtenerArchivoPDF(datosCliente, itemsCarrito, total, codigo);
  if (!archivo) {
    alert("No se pudo preparar el archivo PDF para compartir.");
    return false;
  }

  if (navigator.canShare && navigator.canShare({ files: [archivo] })) {
    try {
      await navigator.share({
        files: [archivo],
        title: `Recibo de Pedido ${codigo} - KateRey`,
        text: `Hola KateRey, te adjunto el recibo oficial en PDF de mi pedido #${codigo}`
      });
      return true;
    } catch (err) {
      if (err.name !== "AbortError") {
        console.error("Error al compartir PDF:", err);
      }
      return false;
    }
  } else {
    // Si no está disponible en este dispositivo, descargar y abrir WhatsApp
    generarPDFRecibo(datosCliente, itemsCarrito, total, codigo);
    alert("Tu dispositivo o navegador no soporta el envío directo de archivos. El PDF ya fue descargado en tu dispositivo para que lo adjuntes con el ícono de clip (📎) en WhatsApp.");
    return false;
  }
}

/**
 * Fallback nativo en HTML/CSS imprimible por si no carga la librería externa
 */
function generarReciboFallback(datosCliente, itemsCarrito, total, codigo) {
  const ventana = window.open("", "_blank");
  if (!ventana) {
    alert("Por favor permite las ventanas emergentes para ver el recibo.");
    return;
  }

  const filasHTML = itemsCarrito.map(i => `
    <tr>
      <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${i.nombre}</td>
      <td style="padding: 8px; text-align: center; border-bottom: 1px solid #e5e7eb;">${i.cantidad}</td>
      <td style="padding: 8px; text-align: right; border-bottom: 1px solid #e5e7eb;">Bs ${i.precio.toFixed(2)}</td>
      <td style="padding: 8px; text-align: right; border-bottom: 1px solid #e5e7eb;">Bs ${(i.precio * i.cantidad).toFixed(2)}</td>
    </tr>
  `).join("");

  ventana.document.write(`
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <title>Recibo ${codigo} - KateRey</title>
      <style>
        body { font-family: system-ui, sans-serif; padding: 2rem; color: #1f2933; max-width: 700px; margin: auto; }
        .header { background: #1f2933; color: white; padding: 1.5rem; border-radius: 6px; display: flex; justify-content: space-between; }
        .datos { background: #f8f9fa; border: 1px solid #e5e7eb; padding: 1rem; border-radius: 6px; margin: 1.5rem 0; }
        table { width: 100%; border-collapse: collapse; margin-top: 1rem; }
        th { background: #283038; color: white; padding: 8px; text-align: left; }
        .total { text-align: right; font-size: 1.25rem; font-weight: bold; margin-top: 1.5rem; color: #166534; }
        @media print { button { display: none; } }
      </style>
    </head>
    <body>
      <div class="header">
        <div>
          <h2 style="margin: 0;">DISTRIBUIDOR KATEREy</h2>
          <p style="margin: 4px 0 0 0; font-size: 0.9rem;">Material de construcción garantizado</p>
        </div>
        <div style="text-align: right;">
          <h3 style="margin: 0;">RECIBO</h3>
          <p style="margin: 4px 0 0 0; color: #facc15;">N° ${codigo}</p>
        </div>
      </div>
      <div class="datos">
        <p><strong>Cliente:</strong> ${datosCliente.nombre} | <strong>Teléfono:</strong> ${datosCliente.telefono}</p>
        <p><strong>Email:</strong> ${datosCliente.email} | <strong>Entrega:</strong> ${datosCliente.fecha}</p>
        <p><strong>Notas:</strong> ${datosCliente.notas || "Ninguna"}</p>
      </div>
      <table>
        <thead>
          <tr>
            <th>Producto</th>
            <th style="text-align: center;">Cantidad</th>
            <th style="text-align: right;">P. Unitario</th>
            <th style="text-align: right;">Subtotal</th>
          </tr>
        </thead>
        <tbody>
          ${filasHTML}
        </tbody>
      </table>
      <div class="total">
        TOTAL: Bs ${total.toFixed(2)}
      </div>
      <div style="margin-top: 2rem; text-align: center;">
        <button onclick="window.print()" style="padding: 10px 20px; font-weight: bold; cursor: pointer;">Guardar como PDF / Imprimir</button>
      </div>
    </body>
    </html>
  `);
  ventana.document.close();
}

/**
 * Construye el mensaje estructurado para WhatsApp que acompaña al recibo PDF
 */
function construirMensajeWhatsAppRecibo(datosCliente, itemsCarrito, total, codigo) {
  let msg = `🧾 *RECIBO DE PEDIDO - DISTRIBUIDOR KATEREy*%0A`;
  msg += `━━━━━━━━━━━━━━━━━━━━━━%0A`;
  msg += `📄 *Nro de Recibo:* #${codigo}%0A`;
  msg += `👤 *Cliente:* ${datosCliente.nombre}%0A`;
  msg += `📞 *Teléfono:* ${datosCliente.telefono}%0A`;
  msg += `📧 *Email:* ${datosCliente.email}%0A`;
  msg += `📅 *Fecha de entrega:* ${datosCliente.fecha}%0A`;
  msg += `📝 *Indicaciones:* ${datosCliente.notas || "Ninguna"}%0A%0A`;
  msg += `📦 *DETALLE DE PRODUCTOS:*%0A`;

  itemsCarrito.forEach(i => {
    msg += `• ${i.nombre} (x${i.cantidad}): Bs ${(i.precio * i.cantidad).toFixed(2)}%0A`;
  });

  msg += `%0A━━━━━━━━━━━━━━━━━━━━━━%0A`;
  msg += `💰 *TOTAL A PAGAR: Bs ${total.toFixed(2)}*%0A`;
  msg += `━━━━━━━━━━━━━━━━━━━━━━%0A`;
  msg += `📎 *Nota:* Mi recibo formal en PDF ha sido generado y descargado con el código #${codigo}.`;

  return msg;
}
