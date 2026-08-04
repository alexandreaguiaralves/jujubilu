(function () {
  const products = window.CATALOG_PRODUCTS || [];
  const root = document.getElementById("products-grid");

  if (!root) {
    return;
  }

  function formatPrices(product) {
    const order = [20, 15, 10];
    const rows = order
      .filter((qty) => product.prices && product.prices[qty] != null)
      .map(
        (qty) =>
          `<li><span>${qty} unds</span><strong>R$ ${product.prices[qty]}</strong></li>`
      );

    if (product.pricesAlt) {
      rows.push(
        `<li><span>${product.pricesAlt.label}</span><strong>R$ ${product.pricesAlt.value}</strong></li>`
      );
    }

    if (!rows.length && product.minOrder && product.prices) {
      rows.push(
        `<li><span>mín. ${product.minOrder} unds</span><strong>R$ ${product.prices[product.minOrder]}</strong></li>`
      );
    }

    return rows.join("");
  }

  root.innerHTML = products
    .map((product) => {
      const note = product.note
        ? `<p class="card-note">${product.note}</p>`
        : "";

      return `
        <article class="product-card-item">
          <div class="card-image">
            <img src="catalogo/images/${product.id}.jpg" alt="${product.name}" />
            <span class="card-ref">${product.id}</span>
          </div>
          <div class="card-body">
            <h3>${product.name}</h3>
            <p class="card-size">${product.size}</p>
            ${note}
            <ul class="card-prices">
              ${formatPrices(product)}
            </ul>
          </div>
        </article>
      `;
    })
    .join("");
})();
