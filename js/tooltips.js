export async function initTooltips(db, contentSelector) {
    const { collection, getDocs } = await import("https://www.gstatic.com/firebasejs/12.14.0/firebase-firestore.js");

    const snapshot = await getDocs(collection(db, "glossary"));
    const terms = [];
    snapshot.forEach(d => terms.push({ id: d.id, ...d.data() }));
    if (terms.length === 0) return;

    const container = document.querySelector(contentSelector);
    if (!container) return;

    // Сортируем по длине чтобы длинные термины заменялись первыми
    terms.sort((a, b) => b.word.length - a.word.length);

    function processNode(node) {
        if (node.nodeType === 3) {
            // Текстовый узел
            let html = node.textContent;
            let replaced = false;
            terms.forEach(term => {
                const regex = new RegExp(`\\b(${term.word})\\b`, "gi");
                if (regex.test(html)) {
                    html = html.replace(regex, `<a class="term-link" data-term-id="${term.id}" data-term-word="${term.word}" data-term-short="${term.short}" href="glossary.html#term-${term.id}">$1</a>`);
                    replaced = true;
                }
            });
            if (replaced) {
                const span = document.createElement("span");
                span.innerHTML = html;
                node.parentNode.replaceChild(span, node);
            }
        } else if (node.nodeType === 1 && !["A", "SCRIPT", "STYLE"].includes(node.tagName)) {
            Array.from(node.childNodes).forEach(processNode);
        }
    }

    processNode(container);

    // Тултип
    let tooltip = null;

    document.addEventListener("mouseover", (e) => {
        const link = e.target.closest(".term-link");
        if (!link) return;

        if (tooltip) tooltip.remove();
        tooltip = document.createElement("div");
        tooltip.className = "term-tooltip";
        tooltip.innerHTML = `
            <div class="term-tooltip-word">${link.dataset.termWord}</div>
            <div class="term-tooltip-desc">${link.dataset.termShort}</div>
            <div class="term-tooltip-hint">Нажми для подробностей</div>
        `;
        document.body.appendChild(tooltip);
        positionTooltip(e);
    });

    document.addEventListener("mousemove", (e) => {
        if (tooltip) positionTooltip(e);
    });

    document.addEventListener("mouseout", (e) => {
        if (e.target.closest(".term-link") && !e.relatedTarget?.closest(".term-link")) {
            if (tooltip) { tooltip.remove(); tooltip = null; }
        }
    });

    function positionTooltip(e) {
        if (!tooltip) return;
        const x = Math.min(e.clientX + 12, window.innerWidth - 300);
        const y = e.clientY + 20;
        tooltip.style.left = x + "px";
        tooltip.style.top = y + "px";
    }
}