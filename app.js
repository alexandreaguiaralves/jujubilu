(function () {
  const products = window.CATALOG_PRODUCTS || [];
  const root = document.getElementById("catalog-pages");

  if (!root) {
    return;
  }

  const pages = [
    { file: "pagina-01.jpg", number: "01", line: "Linha Premium", from: "001", to: "006" },
    { file: "pagina-02.jpg", number: "02", line: "Linha Premium", from: "007", to: "012" },
    { file: "pagina-03.jpg", number: "03", line: "Linha Econômica", from: "013", to: "018" },
    { file: "pagina-04.jpg", number: "04", line: "Linha Premium", from: "019", to: "024" },
    { file: "pagina-05.jpg", number: "05", line: "Linha Supremo", from: "025", to: "030" },
    { file: "pagina-06.jpg", number: "06", line: "Linha Supremo", from: "031", to: "035" },
  ];

  function inRange(id, from, to) {
    return id >= from && id <= to;
  }

  function priceChips(product) {
    const order = [20, 15, 10];
    const chips = order
      .filter((qty) => product.prices && product.prices[qty] != null)
      .map(
        (qty) =>
          `<span class="price-chip"><b>${qty} unds</b> R$ ${product.prices[qty]}</span>`
      );

    if (product.pricesAlt) {
      chips.push(
        `<span class="price-chip"><b>${product.pricesAlt.label}</b> R$ ${product.pricesAlt.value}</span>`
      );
    }

    if (!chips.length && product.minOrder && product.prices) {
      chips.push(
        `<span class="price-chip"><b>mín. ${product.minOrder}</b> R$ ${product.prices[product.minOrder]}</span>`
      );
    }

    return chips.join("");
  }

  root.innerHTML = pages
    .map((page) => {
      const items = products.filter((product) =>
        inRange(product.id, page.from, page.to)
      );

      const list = items
        .map(
          (product) => `
            <li class="ref-card">
              <div class="ref-top">
                <span class="ref-id">${product.id}</span>
                <div>
                  <h4>${product.name}</h4>
                  <p class="ref-size">${product.size}</p>
                </div>
              </div>
              <div class="ref-prices">${priceChips(product)}</div>
            </li>
          `
        )
        .join("");

      return `
        <article class="catalog-spread">
          <figure class="catalog-page-photo">
            <img
              src="catalogo/pages/${page.file}"
              alt="Página ${page.number} do catálogo Jujubilu 2026"
            />
          </figure>
          <div class="catalog-page-info">
            <div class="page-heading">
              <span class="page-badge">${page.number}</span>
              <div>
                <p class="page-line">${page.line}</p>
                <h3>Refs ${page.from} a ${page.to}</h3>
              </div>
            </div>
            <ul class="page-refs">${list}</ul>
          </div>
        </article>
      `;
    })
    .join("");
})();
