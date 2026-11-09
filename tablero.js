// ── tablero.js ─────────────────────────────────────────────────────────────
// Tablero de Carga y Pedido Rápido con Camión Volqueta Interactivo en Canvas
// Distribuidor KateRey - Gestión interactiva de materiales y simulación de carga
// ─────────────────────────────────────────────────────────────────────────

// ── 1. CONFIGURACIÓN Y ESTADO INICIAL ──────────────────────────────────────
const COLUMNAS = ["stock", "pedido"];

const NOMBRES_COLUMNAS = {
  stock: "Materiales en Stock (Almacén)",
  pedido: "Mi Pedido (Carga para Despacho)",
};

// Capacidad base del camión de transporte en unidades
const CAPACIDAD_CAMION = 100;

// Estado de materiales inicial (conectado a los productos reales de KateRey)
let tablero = {
  stock: [
    { id: 6, nombre: "Cemento SOBOCE (bolsas)", cantidad: 60, precio: 48.0, img: "soboce.jpg", tipo: "cemento" },
    { id: 9, nombre: "Ladrillo 6 huecos (unid.)", cantidad: 350, precio: 1.2, img: "ladrillo.jpg", tipo: "ladrillo" },
    { id: 1, nombre: "Barra corrugada 12m", cantidad: 50, precio: 45.0, img: "corrugada.jpg", tipo: "acero" },
    { id: 11, nombre: "Arena fina (m³)", cantidad: 20, precio: 90.0, img: "arena.jpg", tipo: "arido" },
    { id: 5, nombre: "Cemento VIACHA Plus", cantidad: 40, precio: 46.0, img: "viacha.jpg", tipo: "cemento" },
    { id: 3, nombre: "Alambre de amarre (kg)", cantidad: 30, precio: 12.0, img: "alambre.jpg", tipo: "acero" },
    { id: 12, nombre: "Grava clasificada (m³)", cantidad: 15, precio: 95.0, img: "grava.jpg", tipo: "arido" },
  ],
  pedido: [
    { id: 6, nombre: "Cemento SOBOCE (bolsas)", cantidad: 15, precio: 48.0, img: "soboce.jpg", tipo: "cemento" },
    { id: 1, nombre: "Barra corrugada 12m", cantidad: 10, precio: 45.0, img: "corrugada.jpg", tipo: "acero" },
  ],
};

// ── 2. PINTAR EL TABLERO (DOM) ───────────────────────────────────────────
function renderTablero() {
  const elTablero = document.querySelector("#tablero");
  if (!elTablero) return;

  COLUMNAS.forEach((nombreColumna) => {
    const columna = document.querySelector(`[data-columna="${nombreColumna}"]`);
    if (!columna) return;

    const lista = columna.querySelector(".lista-columna");
    if (!lista) return;

    lista.innerHTML = "";

    const items = tablero[nombreColumna];

    // Estado vacío específico para la columna de Pedido
    if (nombreColumna === "pedido" && items.length === 0) {
      const liVacio = document.createElement("li");
      liVacio.className = "ficha-vacia";
      liVacio.innerHTML = "🚛 <strong>Tu camión está vacío.</strong><br>Pulsa <strong>(+)</strong> en Stock o arrastra materiales aquí para cargarlo.";
      lista.append(liVacio);
    } else {
      items.forEach((item, indice) => {
        const li = document.createElement("li");
        li.className = `ficha ficha-${nombreColumna}`;
        li.draggable = true;

        li.dataset.columna = nombreColumna;
        li.dataset.indice = indice;
        li.dataset.id = item.id;

        if (nombreColumna === "stock") {
          li.innerHTML = `
            <div class="ficha-info">
              <strong>${item.nombre}</strong>
              <span class="ficha-cant">Disponibles: ${item.cantidad} u. · Bs ${item.precio.toFixed(2)} c/u</span>
            </div>
            <button type="button" class="btn-ficha-accion btn-sumar" data-accion="sumar" title="Cargar 1 unidad al camión">+</button>
          `;
          li.title = "Arrastra o pulsa (+) para agregar a tu pedido";
        } else {
          const subtotal = (item.precio * item.cantidad).toFixed(2);
          li.innerHTML = `
            <div class="ficha-info">
              <strong>${item.nombre}</strong>
              <span class="ficha-cant">En el camión: ${item.cantidad} u. = <strong>Bs ${subtotal}</strong></span>
            </div>
            <button type="button" class="btn-ficha-accion btn-restar" data-accion="restar" title="Devolver 1 unidad al stock">-</button>
          `;
          li.title = "Arrastra o pulsa (-) para quitar de tu pedido";
        }

        lista.append(li);
      });
    }

    // Actualizar encabezado del total de unidades
    const totalUnidades = items.reduce((suma, i) => suma + i.cantidad, 0);
    const n = items.length;
    const totalEl = columna.querySelector(".total");
    if (totalEl) {
      if (nombreColumna === "stock") {
        totalEl.textContent = `${n} materiales · ${totalUnidades} u. en almacén`;
      } else {
        totalEl.textContent = `${n} materiales · ${totalUnidades} u. a cargar`;
      }
    }
  });

  // Animar el camión hacia el nuevo nivel de carga
  iniciarAnimacionCamion();
}

// ── 3. OPERACIONES DE SUMAR Y RESTAR MATERIALES ─────────────────────────
function sumarAlPedido(indiceStock, cantidadPaso = 1) {
  const itemStock = tablero.stock[indiceStock];
  if (!itemStock || itemStock.cantidad <= 0) return;

  const cantidadAMover = Math.min(cantidadPaso, itemStock.cantidad);
  itemStock.cantidad -= cantidadAMover;

  // Buscar si ya está en pedido
  const itemPedido = tablero.pedido.find(p => p.id === itemStock.id || p.nombre === itemStock.nombre);
  if (itemPedido) {
    itemPedido.cantidad += cantidadAMover;
  } else {
    tablero.pedido.push({
      ...itemStock,
      cantidad: cantidadAMover,
    });
  }

  renderTablero();

  if (typeof mostrarNotificacion === "function") {
    mostrarNotificacion(`+${cantidadAMover} ${itemStock.nombre} cargado al camión`, "info", 1200);
  }
}

function restarDelPedido(indicePedido, cantidadPaso = 1) {
  const itemPedido = tablero.pedido[indicePedido];
  if (!itemPedido || itemPedido.cantidad <= 0) return;

  const cantidadAMover = Math.min(cantidadPaso, itemPedido.cantidad);
  itemPedido.cantidad -= cantidadAMover;

  // Devolver al stock
  const itemStock = tablero.stock.find(s => s.id === itemPedido.id || s.nombre === itemPedido.nombre);
  if (itemStock) {
    itemStock.cantidad += cantidadAMover;
  } else {
    tablero.stock.push({
      ...itemPedido,
      cantidad: cantidadAMover,
    });
  }

  // Si llegó a cero, retirar de la lista del pedido
  if (itemPedido.cantidad <= 0) {
    tablero.pedido.splice(indicePedido, 1);
  }

  renderTablero();

  if (typeof mostrarNotificacion === "function") {
    mostrarNotificacion(`-${cantidadAMover} ${itemPedido.nombre} devuelto al stock`, "info", 1200);
  }
}

// ── 4. DRAG & DROP ENTRE STOCK Y PEDIDO ──────────────────────────────────
let dropReciente = false;

function inicializarDragAndDrop() {
  const elTablero = document.querySelector("#tablero");
  if (!elTablero) return;

  elTablero.addEventListener("dragstart", (event) => {
    const ficha = event.target.closest(".ficha");
    if (!ficha) return;

    event.dataTransfer.setData("text/plain", JSON.stringify({
      columna: ficha.dataset.columna,
      indice: Number(ficha.dataset.indice),
    }));
    event.dataTransfer.effectAllowed = "move";
    ficha.classList.add("arrastrando");
  });

  elTablero.addEventListener("dragend", (event) => {
    const ficha = event.target.closest(".ficha");
    if (ficha) ficha.classList.remove("arrastrando");
    document.querySelectorAll(".columna").forEach(c => c.classList.remove("encima"));
  });

  elTablero.addEventListener("dragover", (event) => {
    const columna = event.target.closest(".columna");
    if (!columna) return;

    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
    columna.classList.add("encima");
  });

  elTablero.addEventListener("dragleave", (event) => {
    const columna = event.target.closest(".columna");
    if (columna && !columna.contains(event.relatedTarget)) {
      columna.classList.remove("encima");
    }
  });

  elTablero.addEventListener("drop", (event) => {
    const columna = event.target.closest(".columna");
    if (!columna) return;

    event.preventDefault();
    columna.classList.remove("encima");

    try {
      const dataRaw = event.dataTransfer.getData("text/plain");
      if (!dataRaw) return;

      const origen = JSON.parse(dataRaw);
      const destino = columna.dataset.columna;

      if (!origen.columna || !destino || origen.columna === destino) return;

      dropReciente = true;
      setTimeout(() => { dropReciente = false; }, 200);

      // Si se arrastra de Stock a Pedido: mover 5 unidades (o las disponibles)
      if (origen.columna === "stock" && destino === "pedido") {
        sumarAlPedido(origen.indice, 5);
      }
      // Si se arrastra de Pedido a Stock: devolver 5 unidades (o las cargadas)
      else if (origen.columna === "pedido" && destino === "stock") {
        restarDelPedido(origen.indice, 5);
      }
    } catch (err) {
      console.warn("Drop no válido:", err);
    }
  });

  // Delegación de clics: botones (+) y (-) y toques en las fichas
  elTablero.addEventListener("click", (e) => {
    if (dropReciente) return;

    const btnAccion = e.target.closest(".btn-ficha-accion");
    if (btnAccion) {
      e.stopPropagation();
      const ficha = btnAccion.closest(".ficha");
      if (!ficha) return;

      const col = ficha.dataset.columna;
      const idx = Number(ficha.dataset.indice);

      if (col === "stock" && btnAccion.dataset.accion === "sumar") {
        sumarAlPedido(idx, 1);
      } else if (col === "pedido" && btnAccion.dataset.accion === "restar") {
        restarDelPedido(idx, 1);
      }
      return;
    }

    // Tocar el cuerpo de la ficha también transfiere 1 unidad (ideal para móvil)
    const ficha = e.target.closest(".ficha");
    if (ficha && e.detail > 0) {
      const col = ficha.dataset.columna;
      const idx = Number(ficha.dataset.indice);

      if (col === "stock") {
        sumarAlPedido(idx, 1);
      } else if (col === "pedido") {
        restarDelPedido(idx, 1);
      }
    }
  });
}

// ── 5. CONFIRMAR PEDIDO Y PASAR AL CARRITO/DATOS ─────────────────────────
function inicializarBotonPedirTablero() {
  const btnPedir = document.querySelector("#btn-pedir-tablero");
  if (!btnPedir) return;

  btnPedir.addEventListener("click", () => {
    const totalUnidades = tablero.pedido.reduce((acc, i) => acc + i.cantidad, 0);

    if (totalUnidades <= 0) {
      if (typeof mostrarNotificacion === "function") {
        mostrarNotificacion("Tu camión está vacío. Pulsa (+) en Stock para agregar materiales.", "error", 2500);
      } else {
        alert("Tu camión está vacío. Agrega materiales a tu pedido antes de continuar.");
      }
      return;
    }

    // Sincronizar todos los materiales de tablero.pedido con el Carrito global
    if (typeof carrito !== "undefined") {
      tablero.pedido.forEach((item) => {
        const id = String(item.id || item.nombre);
        const precio = item.precio || 40.0;
        const img = item.img || "soboce.jpg";

        if (!carrito[id]) {
          carrito[id] = { id, nombre: item.nombre, precio, img, cantidad: item.cantidad };
        } else {
          carrito[id].cantidad += item.cantidad;
        }
      });

      if (typeof actualizarUICarrito === "function") {
        actualizarUICarrito();
      }
    }

    // Anotar resumen de la carga en el formulario de pedido
    const campoNotas = document.querySelector("#notas");
    if (campoNotas) {
      const resumenTexto = tablero.pedido.map(p => `${p.cantidad} u. ${p.nombre}`).join(", ");
      const etiquetaCamion = `[Carga Camión KateRey: ${resumenTexto}]`;
      if (!campoNotas.value.includes("Camión KateRey")) {
        campoNotas.value = campoNotas.value ? `${etiquetaCamion} ${campoNotas.value}` : etiquetaCamion;
      }
    }

    if (typeof mostrarNotificacion === "function") {
      mostrarNotificacion(`¡${totalUnidades} unidades pasadas a tu pedido! Completa tus datos de entrega.`, "exito", 2800);
    }

    // Desplazamiento fluido hacia el formulario de pedido
    const secPedido = document.querySelector("#pedido");
    if (secPedido) {
      secPedido.scrollIntoView({ behavior: "smooth" });
    }
  });
}

// ── 6. DIBUJAR EL CAMIÓN VOLQUETA Y SU NIVEL DE CARGA EN CANVAS ──────────
let canvas = null;
let ctx = null;

function obtenerContextoCanvas() {
  if (!canvas) canvas = document.querySelector("#grafico");
  if (canvas && !ctx) ctx = canvas.getContext("2d");
  return ctx;
}

// Estado animado de llenado (0 a 1)
let porcentajeCargaActual = 0;
let animacionId = null;

function dibujarCamion(porcentaje) {
  const contexto = obtenerContextoCanvas();
  if (!contexto || !canvas) return;

  const w = canvas.width;
  const h = canvas.height;

  // Limpiar lienzo
  contexto.clearRect(0, 0, w, h);

  // Leer tokens de color del CSS para respetar modo oscuro y claro
  const estilo = getComputedStyle(document.body);
  const colorPrincipal = estilo.getPropertyValue("--color-principal").trim() || "#1f2933";
  const colorAcento = estilo.getPropertyValue("--color-acento").trim() || "#0284c7";
  const colorTexto = estilo.getPropertyValue("--color-texto").trim() || "#1f2933";
  const esOscuro = document.body.classList.contains("tema-oscuro");

  const totalUnidadesPedido = tablero.pedido.reduce((acc, i) => acc + i.cantidad, 0);
  const capacidad = Math.max(CAPACIDAD_CAMION, totalUnidadesPedido);
  const porcentajeReal = Math.min(1, totalUnidadesPedido / capacidad);

  // ── A. CARRETERA / SUELO ──
  const sueloY = 215;
  contexto.beginPath();
  contexto.moveTo(20, sueloY);
  contexto.lineTo(w - 20, sueloY);
  contexto.strokeStyle = esOscuro ? "#475569" : "#cbd5e1";
  contexto.lineWidth = 3;
  contexto.stroke();

  // Línea de pavimento discontinua
  contexto.beginPath();
  contexto.setLineDash([12, 10]);
  contexto.moveTo(25, sueloY + 12);
  contexto.lineTo(w - 25, sueloY + 12);
  contexto.strokeStyle = "#eab308";
  contexto.lineWidth = 2;
  contexto.stroke();
  contexto.setLineDash([]); // restaurar continua

  // ── B. ESTRUCTURA DEL CAMIÓN VOLQUETA ──
  // Posiciones base del camión
  const posX = 70;
  const tolvaX = posX + 20;
  const tolvaY = 95;
  const tolvaW = 230;
  const tolvaH = 88;

  // 1. Chasis inferior de acero
  contexto.fillStyle = esOscuro ? "#334155" : "#1e293b";
  contexto.fillRect(posX + 10, 180, 360, 14);

  // Tanque de combustible metálico
  contexto.fillStyle = esOscuro ? "#64748b" : "#475569";
  contexto.beginPath();
  contexto.roundRect(posX + 185, 175, 55, 18, 4);
  contexto.fill();
  contexto.strokeStyle = "#94a3b8";
  contexto.lineWidth = 1;
  contexto.stroke();

  // 2. Interior de la Tolva (Caja de carga)
  contexto.save();
  contexto.beginPath();
  // Forma trapezoidal de volqueta: compuerta trasera inclinada
  contexto.moveTo(tolvaX - 15, tolvaY);
  contexto.lineTo(tolvaX + tolvaW, tolvaY);
  contexto.lineTo(tolvaX + tolvaW, tolvaY + tolvaH);
  contexto.lineTo(tolvaX, tolvaY + tolvaH);
  contexto.closePath();
  contexto.fillStyle = esOscuro ? "#0f172a" : "#1e293b";
  contexto.fill();
  contexto.clip(); // Limitar la carga al interior de la tolva

  // 3. CARGA DINÁMICA DE MATERIAL (Se llena de abajo hacia arriba)
  if (porcentaje > 0.01) {
    const altoCarga = tolvaH * Math.min(1, porcentaje);
    const yCarga = (tolvaY + tolvaH) - altoCarga;

    // Degradado de material de construcción (arena dorada / cemento / áridos)
    const gradMaterial = contexto.createLinearGradient(0, yCarga, 0, tolvaY + tolvaH);
    gradMaterial.addColorStop(0, "#f59e0b"); // arena dorada superior
    gradMaterial.addColorStop(0.5, "#d97706");
    gradMaterial.addColorStop(1, "#78350f"); // grava profunda

    contexto.fillStyle = gradMaterial;
    contexto.fillRect(tolvaX - 20, yCarga, tolvaW + 30, altoCarga + 5);

    // Textura de piedras y áridos
    contexto.fillStyle = "rgba(255, 255, 255, 0.25)";
    for (let p = 0; p < 18; p++) {
      const px = tolvaX + (p * 13) % tolvaW;
      const py = yCarga + ((p * 7) % Math.max(10, altoCarga));
      contexto.fillRect(px, py, 4, 3);
    }

    // Montículo superior cuando la carga está alta (> 60%)
    if (porcentaje > 0.6) {
      contexto.beginPath();
      contexto.moveTo(tolvaX, yCarga);
      contexto.quadraticCurveTo(tolvaX + tolvaW / 2, yCarga - (15 * (porcentaje - 0.5)), tolvaX + tolvaW, yCarga);
      contexto.fillStyle = "#f59e0b";
      contexto.fill();
    }
  }
  contexto.restore();

  // Borde y nervios de refuerzo de la Tolva
  contexto.beginPath();
  contexto.moveTo(tolvaX - 15, tolvaY);
  contexto.lineTo(tolvaX + tolvaW, tolvaY);
  contexto.lineTo(tolvaX + tolvaW, tolvaY + tolvaH);
  contexto.lineTo(tolvaX, tolvaY + tolvaH);
  contexto.closePath();
  contexto.strokeStyle = esOscuro ? "#94a3b8" : "#334155";
  contexto.lineWidth = 4;
  contexto.stroke();

  // Nervios verticales industriales en la tolva
  contexto.strokeStyle = esOscuro ? "#64748b" : "#475569";
  contexto.lineWidth = 3;
  [tolvaX + 60, tolvaX + 120, tolvaX + 180].forEach(nx => {
    contexto.beginPath();
    contexto.moveTo(nx, tolvaY + 2);
    contexto.lineTo(nx, tolvaY + tolvaH - 2);
    contexto.stroke();
  });

  // Visera protectora de la tolva sobre la cabina
  contexto.beginPath();
  contexto.moveTo(tolvaX + tolvaW - 5, tolvaY);
  contexto.lineTo(tolvaX + tolvaW + 35, tolvaY - 12);
  contexto.lineTo(tolvaX + tolvaW + 30, tolvaY);
  contexto.closePath();
  contexto.fillStyle = esOscuro ? "#475569" : "#334155";
  contexto.fill();

  // 4. Tubo de escape cromado vertical
  const escapeX = tolvaX + tolvaW + 6;
  contexto.fillStyle = "#94a3b8";
  contexto.fillRect(escapeX, 70, 7, 110);
  contexto.beginPath();
  contexto.arc(escapeX + 3.5, 70, 5, Math.PI, 0);
  contexto.fillStyle = "#cbd5e1";
  contexto.fill();

  // 5. CABINA DELANTERA DEL CAMIÓN
  const cabX = tolvaX + tolvaW + 15;
  const cabY = 100;
  const cabW = 85;
  const cabH = 92;

  // Cuerpo de la cabina con color corporativo KateRey
  const gradCabina = contexto.createLinearGradient(cabX, cabY, cabX + cabW, cabY + cabH);
  gradCabina.addColorStop(0, "#0284c7"); // Azul KateRey
  gradCabina.addColorStop(1, "#0369a1");

  contexto.beginPath();
  contexto.moveTo(cabX, cabY + 12);
  contexto.lineTo(cabX + 45, cabY); // Techo
  contexto.lineTo(cabX + cabW, cabY + 28); // Parabrisas inclinado
  contexto.lineTo(cabX + cabW, cabY + cabH); // Frente vertical
  contexto.lineTo(cabX, cabY + cabH); // Base
  contexto.closePath();
  contexto.fillStyle = gradCabina;
  contexto.fill();
  contexto.strokeStyle = "#075985";
  contexto.lineWidth = 2;
  contexto.stroke();

  // Parabrisas / Ventana frontal
  contexto.beginPath();
  contexto.moveTo(cabX + 48, cabY + 10);
  contexto.lineTo(cabX + cabW - 5, cabY + 34);
  contexto.lineTo(cabX + 35, cabY + 46);
  contexto.lineTo(cabX + 12, cabY + 20);
  contexto.closePath();
  contexto.fillStyle = "rgba(186, 230, 253, 0.85)"; // Vidrio celeste claro
  contexto.fill();
  contexto.strokeStyle = "#0284c7";
  contexto.lineWidth = 1.5;
  contexto.stroke();

  // Reflejo blanco en el vidrio
  contexto.beginPath();
  contexto.moveTo(cabX + 38, cabY + 14);
  contexto.lineTo(cabX + 22, cabY + 42);
  contexto.strokeStyle = "rgba(255, 255, 255, 0.6)";
  contexto.lineWidth = 2.5;
  contexto.stroke();

  // Faro delantero con haz de luz
  const faroX = cabX + cabW;
  const faroY = cabY + 68;
  contexto.fillStyle = "#fef08a"; // Amarillo foco
  contexto.fillRect(faroX - 3, faroY, 5, 12);

  // Proyección de luz frontal
  const gradLuz = contexto.createRadialGradient(faroX + 2, faroY + 6, 2, faroX + 60, faroY + 6, 65);
  gradLuz.addColorStop(0, "rgba(254, 240, 138, 0.35)");
  gradLuz.addColorStop(1, "rgba(254, 240, 138, 0)");
  contexto.fillStyle = gradLuz;
  contexto.beginPath();
  contexto.moveTo(faroX + 2, faroY);
  contexto.lineTo(faroX + 65, faroY - 20);
  contexto.lineTo(faroX + 65, faroY + 35);
  contexto.closePath();
  contexto.fill();

  // Parachoques delantero
  contexto.fillStyle = esOscuro ? "#475569" : "#334155";
  contexto.fillRect(cabX + cabW - 4, cabY + 76, 10, 18);

  // Logo de KateRey en la puerta
  contexto.fillStyle = "#ffffff";
  contexto.font = "bold 10px system-ui, sans-serif";
  contexto.textAlign = "center";
  contexto.fillText("KATEREY", cabX + 25, cabY + 64);

  // Baliza ámbar en el techo
  contexto.fillStyle = "#f59e0b";
  contexto.beginPath();
  contexto.roundRect(cabX + 24, cabY - 5, 14, 6, 2);
  contexto.fill();

  // 6. RUEDAS INDUSTRIALES PESADAS
  const ruedasX = [posX + 55, posX + 125, cabX + 50]; // Doble eje trasero + eje delantero
  ruedasX.forEach((rx) => {
    // Guardabarros
    contexto.beginPath();
    contexto.arc(rx, 192, 28, Math.PI, 0);
    contexto.fillStyle = esOscuro ? "#1e293b" : "#334155";
    contexto.fill();

    // Llanta exterior de goma negra
    contexto.beginPath();
    contexto.arc(rx, 204, 23, 0, Math.PI * 2);
    contexto.fillStyle = "#111827";
    contexto.fill();
    contexto.strokeStyle = "#374151";
    contexto.lineWidth = 3;
    contexto.stroke();

    // Rin metálico interior
    contexto.beginPath();
    contexto.arc(rx, 204, 13, 0, Math.PI * 2);
    contexto.fillStyle = esOscuro ? "#94a3b8" : "#cbd5e1";
    contexto.fill();

    // Pernos / tuercas centrales
    contexto.beginPath();
    contexto.arc(rx, 204, 4, 0, Math.PI * 2);
    contexto.fillStyle = "#1e293b";
    contexto.fill();
  });

  // ── C. PANEL SUPERIOR DE DATOS / HUD ──
  // Título e indicador de estado del camión
  contexto.textAlign = "left";
  contexto.font = "bold 14px system-ui, sans-serif";
  contexto.fillStyle = colorTexto;
  contexto.fillText("VOLQUETA DE DESPACHO KATEREY", 25, 30);

  // Badge con el estado de carga
  const pctNum = Math.round(porcentaje * 100);
  let textoEstado = "";
  let colorBadge = "#64748b";

  if (totalUnidadesPedido === 0) {
    textoEstado = "⚪ Camión Vacío (0 unidades)";
    colorBadge = "#64748b";
  } else if (pctNum < 100) {
    textoEstado = `🟡 Cargando: ${pctNum}% (${totalUnidadesPedido} u.)`;
    colorBadge = "#d97706";
  } else {
    textoEstado = `🟢 ¡Carga Completa! (${totalUnidadesPedido} u. listas)`;
    colorBadge = "#16a34a";
  }

  // Fondo redondeado del badge
  contexto.font = "bold 13px system-ui, sans-serif";
  const badgeWidth = contexto.measureText(textoEstado).width + 24;
  contexto.fillStyle = colorBadge;
  contexto.beginPath();
  contexto.roundRect(w - badgeWidth - 25, 14, badgeWidth, 26, 13);
  contexto.fill();

  contexto.fillStyle = "#ffffff";
  contexto.textAlign = "center";
  contexto.fillText(textoEstado, w - badgeWidth / 2 - 25, 32);

  // Barra de progreso delgada de carga
  const barX = 25;
  const barY = 44;
  const barW = w - 50;
  contexto.fillStyle = esOscuro ? "#334155" : "#e2e8f0";
  contexto.beginPath();
  contexto.roundRect(barX, barY, barW, 6, 3);
  contexto.fill();

  if (porcentaje > 0) {
    const fillBarW = Math.max(8, barW * porcentaje);
    contexto.fillStyle = pctNum >= 100 ? "#16a34a" : "#0284c7";
    contexto.beginPath();
    contexto.roundRect(barX, barY, fillBarW, 6, 3);
    contexto.fill();
  }

  // Mensaje guía inferior
  contexto.font = "italic 11px system-ui, sans-serif";
  contexto.fillStyle = esOscuro ? "#94a3b8" : "#64748b";
  contexto.textAlign = "center";
  contexto.fillText("💡 Pulsa (+) en Stock para cargar la volqueta o (-) en Pedido para retirar material", w / 2, 248);
}

// ── 7. ANIMACIÓN FLUIDA A 60 FPS (LERP) ──────────────────────────────────
function iniciarAnimacionCamion() {
  const contexto = obtenerContextoCanvas();
  if (!contexto || !canvas) return;

  const totalUnidadesPedido = tablero.pedido.reduce((acc, i) => acc + i.cantidad, 0);
  const capacidad = Math.max(CAPACIDAD_CAMION, totalUnidadesPedido);
  const objetivo = Math.min(1, totalUnidadesPedido / capacidad);

  if (animacionId) cancelAnimationFrame(animacionId);

  function loop() {
    const diff = objetivo - porcentajeCargaActual;

    if (Math.abs(diff) > 0.005) {
      porcentajeCargaActual += diff * 0.15; // Interpolación suave (lerp)
      dibujarCamion(porcentajeCargaActual);
      animacionId = requestAnimationFrame(loop);
    } else {
      porcentajeCargaActual = objetivo;
      dibujarCamion(porcentajeCargaActual);
    }
  }

  loop();
}

// ── 8. SOPORTE TÁCTIL EN PANTALLAS MÓVILES ───────────────────────────────
function habilitarSoporteTactil() {
  const elTablero = document.querySelector("#tablero");
  if (!elTablero) return;

  let fichaTactil = null;
  let columnaOrigen = null;
  let indiceOrigen = null;

  elTablero.addEventListener("touchstart", (e) => {
    // Si se tocó un botón de acción (+) o (-), dejar que el click lo maneje
    if (e.target.closest(".btn-ficha-accion")) return;

    const ficha = e.target.closest(".ficha");
    if (!ficha) return;

    fichaTactil = ficha;
    columnaOrigen = ficha.dataset.columna;
    indiceOrigen = Number(ficha.dataset.indice);
    ficha.classList.add("arrastrando");
  }, { passive: true });

  elTablero.addEventListener("touchmove", (e) => {
    if (!fichaTactil) return;

    const touch = e.touches[0];
    const elementoBajoDedo = document.elementFromPoint(touch.clientX, touch.clientY);
    const columna = elementoBajoDedo ? elementoBajoDedo.closest(".columna") : null;

    document.querySelectorAll(".columna").forEach(c => c.classList.remove("encima"));
    if (columna) columna.classList.add("encima");
  }, { passive: true });

  elTablero.addEventListener("touchend", (e) => {
    if (!fichaTactil) return;

    const touch = e.changedTouches[0];
    const elementoBajoDedo = document.elementFromPoint(touch.clientX, touch.clientY);
    const columnaDestino = elementoBajoDedo ? elementoBajoDedo.closest(".columna") : null;

    fichaTactil.classList.remove("arrastrando");
    document.querySelectorAll(".columna").forEach(c => c.classList.remove("encima"));

    if (columnaDestino && columnaDestino.dataset.columna !== columnaOrigen) {
      const destino = columnaDestino.dataset.columna;
      if (columnaOrigen === "stock" && destino === "pedido") {
        sumarAlPedido(indiceOrigen, 5);
      } else if (columnaOrigen === "pedido" && destino === "stock") {
        restarDelPedido(indiceOrigen, 5);
      }
    }

    fichaTactil = null;
    columnaOrigen = null;
    indiceOrigen = null;
  });
}

// ── 9. INICIALIZACIÓN COMPLETA ──────────────────────────────────────────
function iniciarTablero() {
  renderTablero();
  inicializarDragAndDrop();
  inicializarBotonPedirTablero();
  habilitarSoporteTactil();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", iniciarTablero);
} else {
  iniciarTablero();
}

// Repintar con los colores correctos si cambia el tema claro/oscuro
window.addEventListener("tema-cambiado", () => {
  dibujarCamion(porcentajeCargaActual);
});

// Exponer globalmente
window.tablero = tablero;
window.renderTablero = renderTablero;
window.dibujarCamion = dibujarCamion;
window.sumarAlPedido = sumarAlPedido;
window.restarDelPedido = restarDelPedido;
// ── 10. FUNCIÓN PARA RECIBIR PRODUCTOS DESDE EL CATÁLOGO ─────────────────
// Esto permite que al hacer clic en "Agregar" desde el catálogo, 
// el producto también suba al camión del tablero.
window.agregarAlTableroDesdeCatalogo = function(id, nombre, precio) {
  // 1. Buscar si el producto ya existe en el stock del tablero
  const itemStock = tablero.stock.find(p => String(p.id) === String(id) || p.nombre === nombre);

  if (itemStock && itemStock.cantidad > 0) {
    // Si hay stock, mover 1 unidad al pedido
    const idx = tablero.stock.indexOf(itemStock);
    if (typeof sumarAlPedido === "function") {
      sumarAlPedido(idx, 1);
    }
  } else {
    // Si el producto no está en el tablero o no hay stock, 
    // lo agregamos directo al pedido (sin stock previo, cantidad 1)
    const itemPedido = tablero.pedido.find(p => String(p.id) === String(id) || p.nombre === nombre);
    if (itemPedido) {
      itemPedido.cantidad += 1;
    } else {
      tablero.pedido.push({
        id: id,
        nombre: nombre,
        precio: precio,
        cantidad: 1,
        img: "soboce.jpg", // Imagen por defecto si no tiene
        tipo: "material"
      });
    }
    if (typeof renderTablero === "function") {
      renderTablero();
    }
  }
};