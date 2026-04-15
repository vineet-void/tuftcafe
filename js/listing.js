document.addEventListener("DOMContentLoaded", function () {

  const container = document.getElementById("product-list");
  if (!container) {
    console.error("product-list not found");
    return;
  }

  const category = container.dataset.category;

  Object.keys(window.PRODUCTS).forEach(id => {
    const product = window.PRODUCTS[id];

    if (product.category !== category) return;

    const card = document.createElement("div");
    card.className = "card";

    // Determine base price
    let basePrice = product.prices
      ? product.prices[0].value
      : product.price;

    // Sale logic
    let priceHTML;
    if (product.sale && product.salePrice) {
      priceHTML = `
        <span class="old-price">₹${Number(basePrice).toLocaleString()}</span>
        <span class="sale-price">₹${Number(product.salePrice).toLocaleString()}</span>
      `;
    } else {
      priceHTML = `₹${Number(basePrice).toLocaleString()}`;
    }

    card.innerHTML = `
      <a href="product.html?id=${id}" class="product-link">
        <div class="image-wrapper">
          ${product.sale ? '<span class="sale-badge">Sale</span>' : ''}
          <img src="${product.images[0]}" alt="${product.name}" loading="lazy">
        </div>
        <div class="card-content">
          <h3>${product.name}</h3>
          <p class="price">${priceHTML}</p>
        </div>
      </a>
    `;

    container.appendChild(card);
  });

});