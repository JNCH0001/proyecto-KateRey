// ── jquery-panel.js ──────────────────────────────────────────────────────
// Efectos y animaciones del sitio usando jQuery

$(document).ready(function () {

  // ── 1. ANIMAR LA APARICIÓN DEL RESUMEN DEL CARRITO ─────────────────────
  const $resumen = $("#resumen-carrito");

  // Usamos MutationObserver para detectar cuando app.js muestra el carrito
  if ($resumen.length) {
    const observer = new MutationObserver(function () {
      if ($resumen.css("display") !== "none") {
        $resumen.hide().slideDown(400);
      }
    });
    observer.observe($resumen[0], { attributes: true, attributeFilter: ["style"] });
  }

  // ── 2. EFECTO HOVER EN LAS TARJETAS DE PRODUCTO ─────────────────────────
  // Delegación de eventos: funciona aunque las tarjetas se creen dinámicamente
  // Solo en dispositivos con mouse real (evita que en móvil la tarjeta se quede trabada al tocar)
  if (window.matchMedia && window.matchMedia("(hover: hover)").matches) {
    $("#lista-productos").on("mouseenter", ".tarjeta", function () {
      $(this).stop(true, true).animate({ marginTop: "-4px" }, 150);
    }).on("mouseleave", ".tarjeta", function () {
      $(this).stop(true, true).animate({ marginTop: "0px" }, 150);
    });
  }

  // ── 3. SCROLL SUAVE AL HACER CLIC EN EL CARRITO ─────────────────────────
  $(".carrito-indicador a").on("click", function (e) {
    e.preventDefault();
    const destino = $("#resumen-carrito");
    if (destino.length && destino.css("display") !== "none") {
      $("html, body").animate(
        { scrollTop: destino.offset().top - 20 },
        600
      );
    }
  });

  // ── 4. FEEDBACK VISUAL EN EL BOTÓN "SEGUIR COMPRANDO" ───────────────────
  $("#btn-seguir").on("click", function () {
    $("html, body").animate(
      { scrollTop: $("#Catalogo").offset().top - 20 },
      500
    );
  });

  // ── 5. FUNCIÓN DE RESALTADO REUTILIZABLE ─────────────────────────────────
  function resaltar($seleccion, milisegundos) {
    milisegundos = milisegundos || 1200;
    $seleccion.addClass("resaltado");
    setTimeout(function () {
      $seleccion.removeClass("resaltado");
    }, milisegundos);
    return $seleccion;
  }

  // Exponer globalmente por si otros scripts la necesitan
  window.resaltar = resaltar;

});
