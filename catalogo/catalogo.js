(function () {
  const products = window.CATALOG_PRODUCTS || [];
  const PAGE_SIZE = 4;
  const LINE_LABELS = [
    "Linha Premium",
    "Linha Premium",
    "Linha Econômica",
    "Linha Premium",
    "Linha Supremo",
    "Linha Supremo",
    "Linha Premium",
    "Linha Econômica",
    "Linha Supremo",
  ];

  function chunk(items, size) {
    const pages = [];
    for (let i = 0; i < items.length; i += size) {
      pages.push(items.slice(i, i + size));
    }
    return pages;
  }

  function gridClass(count) {
    if (count === 3) return "grid grid-3";
    if (count === 2) return "grid grid-2";
    if (count === 1) return "grid grid-1";
    return "grid";
  }

  function formatPrices(product) {
    const order = [20, 15, 10];
    const rows = order
      .filter((qty) => product.prices && product.prices[qty] != null)
      .map(
        (qty) =>
          `<span class="price-chip"><em>${qty}</em> R$ ${product.prices[qty]}</span>`
      );

    if (product.pricesAlt) {
      rows.push(
        `<span class="price-chip"><em>${product.pricesAlt.label}</em> R$ ${product.pricesAlt.value}</span>`
      );
    }

    if (!rows.length && product.minOrder && product.prices) {
      rows.push(
        `<span class="price-chip"><em>mín. ${product.minOrder}</em> R$ ${product.prices[product.minOrder]}</span>`
      );
    }

    return rows.join("");
  }

  function productCard(product) {
    const note = product.note
      ? `<p class="product-note">${product.note}</p>`
      : "";

    return `
      <article class="product">
        <div class="product-visual">
          <div class="product-photo">
            <img src="images/${product.id}.jpg?v=20260816b" alt="${product.name}" />
          </div>
          <div class="product-ref" aria-label="Referência ${product.id}">${product.id}</div>
        </div>
        <div class="product-details">
          <h3 class="product-name">${product.name}</h3>
          <p class="product-size">${product.size}</p>
          ${note}
          <div class="prices">${formatPrices(product)}</div>
        </div>
      </article>
    `;
  }

  function pageMarkup(pageProducts, index) {
    const line = LINE_LABELS[index] || "Catálogo";

    return `
      <section class="page" aria-label="Página ${index + 1}">
        <svg class="bow bow-left" aria-hidden="true"><use href="#bow"></use></svg>
        <svg class="bow bow-right" aria-hidden="true"><use href="#bow"></use></svg>

        <header class="brand">
          <div class="brand-mark" aria-hidden="true">👑</div>
          <div class="brand-name">Jujubilu</div>
          <div class="brand-ribbon">Lembrancinhas</div>
        </header>

        <div class="page-titles">
          <div class="page-line">${line}</div>
          <h2 class="page-title">CATÁLOGO</h2>
        </div>

        <div class="${gridClass(pageProducts.length)}">
          ${pageProducts.map(productCard).join("")}
        </div>

        <footer class="page-footer">
          <div class="site">www.jujubilulembrancinhas.com.br</div>
        </footer>
      </section>
    `;
  }

  const root = document.getElementById("catalog");
  const pages = chunk(products, PAGE_SIZE);
  root.innerHTML = pages.map(pageMarkup).join("");
})();
