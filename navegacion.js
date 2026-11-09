// ── 1. EL MENÚ HAMBURGUESA, ACCESIBLE ───────────────────────────────────
const boton = document.querySelector("#hamburguesa");
const menu = document.querySelector("#lista-nav");

function abrirMenu() {
    menu.hidden = false;
    boton.setAttribute("aria-expanded", "true");
}

function cerrarMenu({ devolverFoco = false } = {}) {
    menu.hidden = true;
    boton.setAttribute("aria-expanded", "false");

    if (devolverFoco) boton.focus();
}

boton.addEventListener("click", () => {
    const abierto = boton.getAttribute("aria-expanded") === "true";
    abierto ? cerrarMenu() : abrirMenu();
});

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && boton.getAttribute("aria-expanded") === "true") {
        cerrarMenu({ devolverFoco: true });
    }
});

menu.addEventListener("click", (event) => {
    if (event.target.closest("a")) cerrarMenu();
});

// ── 2. <dialog> NATIVO ──────────────────────────────────────────────────
const dialogo = document.querySelector("#dialogo-horarios");

document.querySelector("#abrir-dialogo").addEventListener("click", () => {
    dialogo.showModal();
});

dialogo.addEventListener("click", (event) => {
    if (event.target === dialogo) dialogo.close();
});

// ── 3. FORMULARIOS EN PANTALLA CHICA ────────────────────────────────────
const camposChicos = [...document.querySelectorAll("input, select, textarea")]
    .filter(el => parseFloat(getComputedStyle(el).fontSize) < 16);

console.log(
    camposChicos.length === 0
        ? "Todos los campos tienen 16px o más: iOS no hará zoom."
        : `⚠ ${camposChicos.length} campos con menos de 16px: iOS hará zoom al tocarlos.`
);

// ── 4. LA HAMBURGUESA NO SIEMPRE ES LA RESPUESTA ────────────────────────
