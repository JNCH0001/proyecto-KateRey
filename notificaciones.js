// ── notificaciones.js ─────────────────────────────────────────────────────
// Sistema de notificaciones en pantalla para Distribuidor KateRey

/**
 * Muestra una notificación tipo toast en pantalla
 * @param {string} mensaje - Texto a mostrar
 * @param {string} tipo    - "exito" | "error" | "info"
 * @param {number} duracion - Milisegundos antes de que desaparezca (por defecto 3500)
 */
function mostrarNotificacion(mensaje, tipo, duracion) {
  tipo     = tipo     || "info";
  duracion = duracion || 3500;

  // Crear o reutilizar el contenedor de notificaciones
  let contenedor = document.getElementById("notif-contenedor");
  if (!contenedor) {
    contenedor = document.createElement("div");
    contenedor.id = "notif-contenedor";
    contenedor.style.cssText = [
      "position:fixed",
      "bottom:1.5rem",
      "right:1.5rem",
      "display:flex",
      "flex-direction:column",
      "gap:0.5rem",
      "z-index:9999",
      "max-width:320px",
    ].join(";");
    document.body.appendChild(contenedor);
  }

  // Crear la notificación
  const notif = document.createElement("div");
  notif.textContent = mensaje;

  const colores = {
    exito: { bg: "#2e7d32", color: "#fff" },
    error: { bg: "#c62828", color: "#fff" },
    info:  { bg: "#1f2933", color: "#fff" },
  };
  const estilo = colores[tipo] || colores.info;

  notif.style.cssText = [
    `background:${estilo.bg}`,
    `color:${estilo.color}`,
    "padding:0.75rem 1.1rem",
    "border-radius:6px",
    "font-size:0.93rem",
    "font-family:inherit",
    "box-shadow:0 4px 12px rgba(0,0,0,0.2)",
    "opacity:0",
    "transition:opacity 0.25s ease",
    "cursor:pointer",
  ].join(";");

  contenedor.appendChild(notif);

  // Fade-in
  requestAnimationFrame(() => {
    requestAnimationFrame(() => { notif.style.opacity = "1"; });
  });

  // Auto-cerrar
  const timer = setTimeout(() => cerrar(notif), duracion);

  // Cerrar al hacer clic
  notif.addEventListener("click", () => {
    clearTimeout(timer);
    cerrar(notif);
  });

  function cerrar(el) {
    el.style.opacity = "0";
    setTimeout(() => {
      if (el.parentNode) el.parentNode.removeChild(el);
    }, 300);
  }
}

// Exponer globalmente
window.mostrarNotificacion = mostrarNotificacion;
