// ── validaciones.js ───────────────────────────────────────────────────────
// Patrones y helpers de validación para el formulario de KateRey

// ── 1. EXPRESIONES REGULARES ──────────────────────────────────────────────
const PATRONES = {
  telefono: /^[0-9]{7,8}$/,
  correo:   /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i,
  ci:       /^[0-9]{5,10}(-[0-9A-Za-z]{1,3})?$/,
};

/**
 * Valida un campo de texto y agrega/quita un mensaje de error
 * @param {HTMLInputElement} campo - El input a validar
 * @param {RegExp} patron         - La expresión regular a aplicar
 * @param {string} mensaje        - Mensaje si no pasa la validación
 * @returns {boolean}
 */
function validarCampo(campo, patron, mensaje) {
  if (!campo) return true;
  const valido = patron.test(campo.value.trim());
  campo.setCustomValidity(valido ? "" : mensaje);
  return valido;
}

// ── 2. VALIDAR FECHA MÍNIMA ───────────────────────────────────────────────
/**
 * Establece la fecha mínima en un input[type=date] como hoy
 * @param {HTMLInputElement} inputFecha
 */
function configurarFechaMinima(inputFecha) {
  if (!inputFecha) return;
  const hoy = new Date().toISOString().slice(0, 10);
  inputFecha.min = hoy;
}

// ── 3. VALIDACIÓN EN TIEMPO REAL DEL TELÉFONO ────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  const inputTel = document.querySelector("#telefono");
  if (inputTel) {
    inputTel.addEventListener("input", () => {
      validarCampo(
        inputTel,
        PATRONES.telefono,
        "Ingresa 7 u 8 dígitos numéricos, sin espacios."
      );
    });
  }

  // Configurar fecha mínima automáticamente
  const inputFecha = document.querySelector("#fecha");
  configurarFechaMinima(inputFecha);
});

// Exponer globalmente
window.PATRONES          = PATRONES;
window.validarCampo      = validarCampo;
window.configurarFechaMinima = configurarFechaMinima;
