// ── 1. COMPROBAR QUE CARGÓ ──────────────────────────────────────────────
console.log("jQuery versión:", $.fn.jquery);

// ── 2. ESPERAR AL DOM ───────────────────────────────────────────────────

// ── 3. SELECCIONAR ──────────────────────────────────────────────────────
const vanillaP = document.querySelector("#salida-vanilla");
const jqueryP = $("#salida-jquery");

console.log("vanilla es un elemento:", vanillaP instanceof HTMLElement);
console.log("jQuery es una colección de", jqueryP.length);

console.log("mismo elemento:", $(vanillaP)[0] === vanillaP);

// ── 4. LEER Y ESCRIBIR CONTENIDO ────────────────────────────────────────
vanillaP.textContent = "Cambiado con vanilla: document.querySelector + textContent";
jqueryP.text("Cambiado con jQuery: $() + .text()");

// ── 5. CLASES ───────────────────────────────────────────────────────────

// ── 6. EVENTOS ──────────────────────────────────────────────────────────
document.querySelector("#boton-vanilla").addEventListener("click", () => {
    vanillaP.classList.toggle("resaltado");
});

$("#boton-jquery").on("click", function () {
    $(this).closest("section").find("#salida-jquery").toggleClass("resaltado");
});

// ── 7. CHAINING ─────────────────────────────────────────────────────────
$("#salida-jquery")
    .addClass("destacado")
    .attr("data-origen", "jquery")
    .css("cursor", "pointer");

vanillaP.classList.add("destacado");
vanillaP.setAttribute("data-origen", "vanilla");
vanillaP.style.cursor = "pointer";

// ── 8. LA COMPARACIÓN QUE IMPORTA ───────────────────────────────────────
console.log("Tarjetas que ve jQuery:", $(".tarjeta").length);
console.log("Tarjetas que ve vanilla:", document.querySelectorAll(".tarjeta").length);
