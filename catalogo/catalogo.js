(function () {
  const products = window.CATALOG_PRODUCTS || [];
  const PAGE_SIZE = 6;
  const LINE_LABELS = [
    "Linha Premium",
    "Linha Premium",
    "Linha Econômica",
    "Linha Premium",
    "Linha Supremo",
    "Linha Supremo",
  ];

  function chunk(items, size) {
    const pages = [];
    for (let i = 0; i < items.length; i += size) {
      pages.push(items.slice(i, i + size));
    }
    return pages;
  }

  function formatPrices(product) {
    const order = [20, 15, 10];
    const rows = order
      .filter((qty) => product.prices && product.prices[qty] != null)
      .map(
        (qty) =>
          `<div class="price-row"><span>${qty} unds</span><span>R$ ${product.prices[qty]}</span></div>`
      );

    if (product.pricesAlt) {
      rows.push(
        `<div class="price-row"><span>${product.pricesAlt.label}</span><span>R$ ${product.pricesAlt.value}</span></div>`
      );
    }

    if (!rows.length && product.minOrder) {
      rows.push(
        `<div class="price-row"><span>mín. ${product.minOrder} unds</span><span>R$ ${product.prices[product.minOrder]}</span></div>`
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
        <div class="product-photo">
          <img src="images/${product.id}.jpg" alt="${product.name}" />
        </div>
        <div class="product-id">${product.id}</div>
        <h3 class="product-name">${product.name}</h3>
        <p class="product-size">${product.size}</p>
        ${note}
        <div class="prices">${formatPrices(product)}</div>
      </article>
    `;
  }

  function pageMarkup(pageProducts, index) {
    const line = LINE_LABELS[index] || "Catálogo";
    const gridClass = pageProducts.length === 5 ? "grid grid-5" : "grid";

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

        <div class="${gridClass}">
          ${pageProducts.map(productCard).join("")}
        </div>

        <footer class="page-footer">
          <div class="site">www.jujubilulembrancinhas.com.br</div>
        </footer>

        <svg class="candy candy-left" aria-hidden="true"><use href="#lolly"></use></svg>
        <svg class="candy candy-right" aria-hidden="true"><use href="#lolly"></use></svg>
      </section>
    `;
  }

  const root = document.getElementById("catalog");
  const pages = chunk(products, PAGE_SIZE);
  root.innerHTML = pages.map(pageMarkup).join("");
})();
