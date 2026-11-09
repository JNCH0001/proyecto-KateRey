// ── preferencias.js ─────────────────────────────────────────────────────
// Gestión de preferencias del usuario con localStorage

// ── 1. CLAVE Y VALORES POR DEFECTO ──────────────────────────────────────
const CLAVE_PREFS = "katerey:preferencias";
const PREFERENCIAS_POR_DEFECTO = { tema: "claro" };

// ── 2. LEER CON try/catch ────────────────────────────────────────────────
function leerPreferencias() {
  try {
    const texto = localStorage.getItem(CLAVE_PREFS);
    if (!texto) return { ...PREFERENCIAS_POR_DEFECTO };

    const guardado = JSON.parse(texto);
    return { ...PREFERENCIAS_POR_DEFECTO, ...guardado };

  } catch (error) {
    console.warn("Preferencias corruptas, se usan las por defecto:", error.message);
    return { ...PREFERENCIAS_POR_DEFECTO };
  }
}

// ── 3. GUARDAR CON try/catch ─────────────────────────────────────────────
function guardarPreferencias(prefs) {
  try {
    localStorage.setItem(CLAVE_PREFS, JSON.stringify(prefs));
    return true;
  } catch (error) {
    console.warn("No se pudo guardar:", error.message);
    return false;
  }
}

let preferencias = leerPreferencias();

// ── 4. APLICAR PREFERENCIAS AL DOM ──────────────────────────────────────
function aplicarPreferencias() {
  document.body.classList.toggle("tema-oscuro", preferencias.tema === "oscuro");

  const boton = document.querySelector("#tema-toggle");
  if (boton) {
    const esOscuro = preferencias.tema === "oscuro";
    boton.setAttribute("aria-pressed", String(esOscuro));
    boton.setAttribute("aria-checked", String(esOscuro));
    boton.classList.toggle("activo", esOscuro);
    const thumb = boton.querySelector(".switch-thumb");
    if (thumb) {
      thumb.textContent = esOscuro ? "🌙" : "☀️";
    } else {
      boton.textContent = esOscuro ? "☀️ Modo Claro" : "🌙 Modo Oscuro";
    }
  }

  // Notificar cambio para actualizar gráficos como canvas
  window.dispatchEvent(new CustomEvent("tema-cambiado", { detail: { tema: preferencias.tema } }));
}

// Exponer globalmente
window.aplicarPreferencias = aplicarPreferencias;
window.preferencias = preferencias;

// ── 5. GEOLOCALIZACIÓN ───────────────────────────────────────────────────
const UBICACION_KATEREY = { lat: -16.5, lng: -68.15 };

function distanciaKm(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const aRad = (g) => (g * Math.PI) / 180;
  const dLat = aRad(lat2 - lat1);
  const dLng = aRad(lng2 - lng1);
  const a = Math.sin(dLat / 2) ** 2 +
    Math.cos(aRad(lat1)) * Math.cos(aRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// ── 6. INICIAR AL CARGAR EL DOM ──────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {

  aplicarPreferencias();

  // Botón de tema oscuro/claro
  const botonTema = document.querySelector("#tema-toggle");
  if (botonTema) {
    botonTema.addEventListener("click", () => {
      preferencias.tema = preferencias.tema === "oscuro" ? "claro" : "oscuro";
      guardarPreferencias(preferencias);
      aplicarPreferencias();
    });
  }

  // Botón de geolocalización
  const btnUbicarme = document.querySelector("#ubicarme");
  const estadoUbicacion = document.querySelector("#estado-ubicacion");

  if (btnUbicarme && estadoUbicacion) {
    btnUbicarme.addEventListener("click", () => {

      if (!navigator.geolocation) {
        estadoUbicacion.textContent = "Tu navegador no permite compartir la ubicación.";
        return;
      }

      estadoUbicacion.textContent = "Pidiendo permiso...";

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude, accuracy } = position.coords;
          const km = distanciaKm(latitude, longitude, UBICACION_KATEREY.lat, UBICACION_KATEREY.lng);
          estadoUbicacion.textContent =
            `Estás a ${km.toFixed(1)} km de KateRey (precisión: ${Math.round(accuracy)} m).`;
        },
        (error) => {
          const mensajes = {
            1: "No diste permiso de ubicación.",
            2: "No se pudo determinar tu ubicación.",
            3: "Tardó demasiado. Intenta de nuevo.",
          };
          estadoUbicacion.textContent = mensajes[error.code] || "No se pudo obtener la ubicación.";
        },
        { enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 }
      );
    });
  }

});
