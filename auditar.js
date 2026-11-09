(function auditar() {
    const fallos = [];
    const avisos = [];
    const bien = [];

    const revisar = (condicion, mensajeOk, mensajeFallo, grave = true) => {
        if (condicion) bien.push(mensajeOk);
        else (grave ? fallos : avisos).push(mensajeFallo);
    };

    // ── 1. LO BÁSICO DEL DOCUMENTO ────────────────────────────────────────
    revisar(document.querySelector('meta[charset]'),
        "charset declarado",
        "FALTA <meta charset>: los acentos se van a ver mal");

    revisar(document.querySelector('meta[name="viewport"]'),
        "viewport declarado",
        "FALTA <meta name=viewport>: en el celular se ve todo diminuto");

    revisar(document.title && document.title.trim().length > 3,
        `título: "${document.title}"`,
        "El <title> está vacío o no dice nada");

    revisar(document.documentElement.lang,
        `idioma declarado: ${document.documentElement.lang}`,
        'FALTA lang en <html>: el lector de pantalla no sabe en qué idioma leer');

    revisar(document.querySelector('meta[name="description"]'),
        "description declarada",
        "Sin <meta description>: el buscador va a inventar el resumen", false);

    // ── 2. ESTRUCTURA SEMÁNTICA ───────────────────────────────────────────
    const h1s = document.querySelectorAll("h1");
    revisar(h1s.length === 1,
        "exactamente un <h1>",
        `Hay ${h1s.length} elementos <h1>: debe haber exactamente uno`);

    revisar(document.querySelectorAll("main").length === 1,
        "un <main>",
        `Hay ${document.querySelectorAll("main").length} elementos <main>: debe haber uno`);

    const niveles = [...document.querySelectorAll("h1,h2,h3,h4,h5,h6")]
        .map(h => Number(h.tagName[1]));
    const saltos = niveles.filter((n, i) => i > 0 && n - niveles[i - 1] > 1);
    revisar(saltos.length === 0,
        "jerarquía de encabezados sin saltos",
        `La jerarquía de encabezados salta niveles ${saltos.length} vez/veces (por ejemplo de h2 a h4)`);

    const sospechosos = [...document.querySelectorAll("div")].filter(d =>
        /header|nav|main|footer|aside|article|section|menu/i.test(d.className || ""));
    revisar(sospechosos.length === 0,
        "sin div que deberían ser semánticos",
        `${sospechosos.length} <div> con nombre de clase semántico (${sospechosos.slice(0, 3).map(d => "." + String(d.className).split(" ")[0]).join(", ")}): probablemente deberían ser <header>, <nav>, etc.`,
        false);

    // ── 3. IMÁGENES ───────────────────────────────────────────────────────
    const imgs = [...document.querySelectorAll("img")];
    const sinAlt = imgs.filter(i => !i.hasAttribute("alt"));
    revisar(sinAlt.length === 0,
        `${imgs.length} imágenes, todas con alt`,
        `${sinAlt.length} imágenes SIN atributo alt (${sinAlt.slice(0, 3).map(i => i.src.split("/").pop()).join(", ")})`);

    const sinTamano = imgs.filter(i => !i.getAttribute("width") || !i.getAttribute("height"));
    revisar(sinTamano.length === 0,
        "todas las imágenes reservan su espacio",
        `${sinTamano.length} imágenes sin width/height: la página va a saltar mientras cargan`,
        false);

    const desbordadas = imgs.filter(i => i.getBoundingClientRect().width > document.documentElement.clientWidth + 1);
    revisar(desbordadas.length === 0,
        "ninguna imagen se sale de la pantalla",
        `${desbordadas.length} imágenes más anchas que la pantalla: falta max-width:100%`);

    // ── 4. FORMULARIOS ────────────────────────────────────────────────────
    const campos = [...document.querySelectorAll("input, select, textarea")]
        .filter(c => c.type !== "hidden");

    const sinEtiqueta = campos.filter(c => {
        if (c.id && document.querySelector(`label[for="${CSS.escape(c.id)}"]`)) return false;
        if (c.closest("label")) return false;
        if (c.getAttribute("aria-label") || c.getAttribute("aria-labelledby")) return false;
        return true;
    });
    revisar(sinEtiqueta.length === 0,
        `${campos.length} campos, todos con etiqueta`,
        `${sinEtiqueta.length} campos SIN <label> asociado: son cajas sin nombre`);

    const chicos = campos.filter(c => parseFloat(getComputedStyle(c).fontSize) < 16);
    revisar(chicos.length === 0,
        "ningún campo por debajo de 16px",
        `${chicos.length} campos con font-size menor a 16px: iOS hará zoom al tocarlos`);

    // ── 5. ÁREA TÁCTIL ────────────────────────────────────────────────────
    const controles = [...document.querySelectorAll("button, a, input, select, textarea")]
        .filter(c => c.offsetParent !== null && c.type !== "hidden");
    const pequenos = controles.filter(c => {
        const r = c.getBoundingClientRect();

        if (c.tagName === "A" && c.closest("p")) return false;

        if (c.type === "checkbox" || c.type === "radio") {
            const etiqueta = (c.id && document.querySelector(`label[for="${CSS.escape(c.id)}"]`))
                || c.closest("label");
            if (etiqueta && etiqueta.getBoundingClientRect().height >= 44) return false;
        }

        return r.height > 0 && r.height < 44;
    });
    revisar(pequenos.length === 0,
        `${controles.length} controles, todos de 44px o más`,
        `${pequenos.length} controles por debajo de 44px de alto: se fallan con el dedo`,
        false);

    // ── 6. FOCO VISIBLE ───────────────────────────────────────────────────
    let quitanFoco = 0;
    for (const hoja of document.styleSheets) {
        let reglas;
        try { reglas = hoja.cssRules; } catch { continue; }
        const recorrer = (lista) => {
            for (const r of lista) {

                if (r.cssRules && r.cssRules.length) { recorrer(r.cssRules); continue; }
                if (!r.selectorText || !r.style) continue;
                const o = r.style.outline || r.style.outlineStyle || r.style.outlineWidth;
                if (/focus/i.test(r.selectorText) && (o === "none" || o === "0" || o === "0px")) {
                    if (!r.style.boxShadow && !r.style.border) quitanFoco++;
                }
            }
        };
        recorrer(reglas);
    }
    revisar(quitanFoco === 0,
        "no se elimina el indicador de foco",
        `${quitanFoco} reglas quitan el foco sin reemplazarlo: la página no se puede usar con teclado`);

    // ── 7. RESPONSIVE ─────────────────────────────────────────────────────
    const doc = document.documentElement;
    revisar(doc.scrollWidth <= doc.clientWidth + 1,
        `sin scroll horizontal a ${doc.clientWidth}px`,
        `HAY SCROLL HORIZONTAL: la página pide ${doc.scrollWidth}px en ${doc.clientWidth}px`);

    if (doc.scrollWidth > doc.clientWidth + 1) {
        const culpables = [...document.querySelectorAll("*")]
            .filter(el => el.getBoundingClientRect().right > doc.clientWidth + 1)
            .slice(0, 5)
            .map(el => el.tagName.toLowerCase() + (el.id ? "#" + el.id : "") +
                (el.className ? "." + String(el.className).split(" ")[0] : ""));
        fallos.push("   Culpables del desborde: " + culpables.join(", "));
    }

    // ── 8. CÓDIGO OLVIDADO ────────────────────────────────────────────────
    const enlacesVacios = [...document.querySelectorAll('a[href="#"], a:not([href])')];
    revisar(enlacesVacios.length === 0,
        "sin enlaces vacíos",
        `${enlacesVacios.length} enlaces que no llevan a ningún lado (href="#" o sin href)`,
        false);

    // ── EL INFORME ────────────────────────────────────────────────────────
    const linea = "─".repeat(64);
    console.log("\n" + linea);
    console.log(` AUDITORÍA · ${document.title || "sin título"}`);
    console.log(` ${location.href}`);
    console.log(` Ancho de ventana: ${doc.clientWidth}px`);
    console.log(linea);

    console.log(`\n✓ BIEN (${bien.length})`);
    bien.forEach(m => console.log("   ✓ " + m));

    if (avisos.length) {
        console.log(`\n⚠ MEJORABLE (${avisos.length})`);
        avisos.forEach(m => console.log("   ⚠ " + m));
    }

    if (fallos.length) {
        console.log(`\n⨯ HAY QUE ARREGLAR (${fallos.length})`);
        fallos.forEach(m => console.log("   ⨯ " + m));
    }

    console.log("\n" + linea);
    console.log(fallos.length === 0
        ? " Sin fallos graves. Ahora repite la auditoría a 320px de ancho."
        : ` ${fallos.length} fallos que corregir. Empieza por los de arriba.`);
    console.log(linea + "\n");

    return { fallos: fallos.length, avisos: avisos.length, bien: bien.length };
})();
