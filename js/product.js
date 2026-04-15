// js/product.js

document.addEventListener("DOMContentLoaded", () => {

  // ---------- GET PRODUCT ID ----------
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  if (!window.PRODUCTS || !window.PRODUCTS[id]) {
    console.error("Product not found");
    return;
  }

  const product = window.PRODUCTS[id];

  // ---------- SAFE IMAGE ARRAY ----------
  const images = product.images && product.images.length
    ? product.images
    : [product.image];

  // ---------- ELEMENTS ----------
  const mainImage = document.getElementById("mainImage");
  const title = document.getElementById("product-title");
  const priceContainer = document.getElementById("product-price");
  const desc = document.getElementById("product-description");
  if (desc) desc.style.display = "none";
  const sizesDiv = document.getElementById("product-sizes");
  const detailsList = document.getElementById("product-details");
  const thumbs = document.getElementById("thumbs");
  const whatsappBtn = document.getElementById("whatsappOrder");
  const instaBtn = document.getElementById("instaOrder");

  // ---------- BASIC INFO ----------
  title.textContent = product.name;

  /* ================= PRICE ================= */

  priceContainer.innerHTML = "";

  let basePrice = product.prices
    ? product.prices[0].value
    : product.price;

  if (product.sale && product.salePrice) {
    priceContainer.innerHTML = `
      <span class="old-price">₹${Number(basePrice).toLocaleString()}</span>
      <span class="sale-price">₹${Number(product.salePrice).toLocaleString()}</span>
    `;
  } 
  else if (product.prices) {
    product.prices.forEach(p => {
      const priceLine = document.createElement("div");
      priceLine.textContent = `${p.label}: ₹${p.value}`;
      priceContainer.appendChild(priceLine);
    });
  } 
  else if(product.price){
    priceContainer.textContent =
      `₹${Number(product.price).toLocaleString()}`;
  }

  /* ================= ORDER MESSAGE ================= */

  const finalPrice = product.sale && product.salePrice
    ? product.salePrice
    : basePrice;

  const message =
`Hi, I want to order this rug:

Product: ${product.name}
Price: ₹${Number(finalPrice || 0).toLocaleString()}

Please share order details.`;

  const encodedMessage = encodeURIComponent(message);

  whatsappBtn.href =
    "https://wa.me/916377308219?text=" + encodedMessage;

  instaBtn.href = "https://instagram.com/tuftcafe";

  /* ================= SIZES ================= */

  if (product.sizes && sizesDiv) {
    product.sizes.forEach(size => {
      const span = document.createElement("span");
      span.className = "size-box";
      span.textContent = size;
      sizesDiv.appendChild(span);
    });
  }

  /* ================= DETAILS ================= */

  if (product.details && detailsList) {
    product.details.forEach(d => {
      const li = document.createElement("li");
      li.textContent = d;
      detailsList.appendChild(li);
    });
  }

  /* ================= IMAGE GALLERY ================= */

  let current = 0;

  function showImage(index) {
    current = index;
    mainImage.src = images[current];
  }

  if (thumbs) {
    images.forEach((img, i) => {
      const t = document.createElement("img");
      t.src = img;
      t.loading = "lazy";
      t.className = "thumb";
      t.onclick = () => showImage(i);
      thumbs.appendChild(t);
    });
  }

  window.nextImage = function () {
    current = (current + 1) % images.length;
    showImage(current);
  };

  window.prevImage = function () {
    current =
      (current - 1 + images.length) %
      images.length;
    showImage(current);
  };

  showImage(0);

  /* ================= ACCORDION DESCRIPTION ================= */

  const descBox = document.getElementById("descContent");
  if (descBox) {
    try {
      const desc = product.description;
      

      // If description is an array with actual content
      if (Array.isArray(desc) && desc.filter(d => d.trim()).length > 0) {
        const items = desc.filter(d => d.trim()); // remove empty strings
        descBox.innerHTML = `<ul>${items.map(d => `<li>${d}</li>`).join("")}</ul>`;
      }
      // If description is a plain string
      else if (typeof desc === "string" && desc.trim()) {
        descBox.innerHTML = `<p>${desc}</p>`;
      }
      // Fallback to category description
      else {
        const cat = product.category || "floor";
        const fallback = (window.CATEGORY_DESCRIPTIONS && window.CATEGORY_DESCRIPTIONS[cat])
          ? window.CATEGORY_DESCRIPTIONS[cat]
          : ["Handcrafted tufted rug made with care and precision."];
        if (Array.isArray(fallback)) {
          descBox.innerHTML = `<ul>${fallback.map(d => `<li>${d}</li>`).join("")}</ul>`;
        } else {
          descBox.innerHTML = `<p>${fallback}</p>`;
        }
      }
    } catch(e) {
      descBox.innerHTML = "<p>Handcrafted tufted rug made with care and precision.</p>";
    }
  }

  /* ================= GLOBAL INFO ================= */

  const refund = document.getElementById("refundContent");
  if (refund) {
    refund.innerHTML = `<ul>
      <li>No returns accepted on custom-made rugs as each piece is made to order.</li>
      <li>Replacement is only applicable for products that arrive damaged or defective.</li>
      <li>An unboxing video is mandatory for any damage/replacement claim — claims without video will not be accepted.</li>
      <li>Orders cannot be cancelled once production has started.</li>
      <li>In case of a size or colour mismatch from what was agreed upon, we will rectify it at no extra cost.</li>
      <li>Refunds (if applicable) are processed within 7–10 business days.</li>
    </ul>`;
  }

  const care = document.getElementById("careContent");
  if (care) {
    care.innerHTML = `<ul>
      <li>Do not machine wash — hand wash or spot clean only.</li>
      <li>Use a mild detergent and cold water for cleaning.</li>
      <li>Gently blot stains — do not rub or scrub harshly.</li>
      <li>Do not pull or tug the yarn loops — this may cause damage.</li>
      <li>Dry flat in shade — avoid direct sunlight to prevent colour fading.</li>
      <li>Vacuum on low suction with the nozzle, not the roller brush.</li>
      <li>Store rolled (not folded) when not in use.</li>
    </ul>`;
  }
/* ================= RELATED PRODUCTS ================= */


  const relatedContainer =
    document.getElementById("relatedProducts");

  if (relatedContainer && window.PRODUCTS) {

    const currentCategory = product.category;
    let count = 0;

    Object.entries(window.PRODUCTS).forEach(([key, p]) => {

      if (key === id) return;                          // skip current product
      if (p.category !== currentCategory) return;     // same category only
      if (count >= 8) return;                         // show up to 8

      const relatedImages =
        p.images && p.images.length
        ? p.images
        : [p.image];

      const card = document.createElement("div");
      card.className = "related-card";

      const priceHTML = p.salePrice
        ? `<span class="old-price">₹${p.price}</span>
           <span class="sale-price">₹${p.salePrice}</span>`
        : (p.price ? `₹${p.price}` : "");

      card.innerHTML = `
        <a href="product.html?id=${key}">
          <img src="${relatedImages[0]}" alt="${p.name}" loading="lazy">
          <h4>${p.name}</h4>
          <p class="price">${priceHTML}</p>
        </a>
      `;

      relatedContainer.appendChild(card);
      count++;
    });

    // Hide the whole section if no related products found
    if (count === 0) {
      relatedContainer.closest(".related-section").style.display = "none";
    }
  }

  /* ================= DELIVERY DATES ================= */

  function formatDate(date){
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit"
    });
  }

  const today = new Date();

  document.getElementById("orderedDate").textContent =
    formatDate(today);

  const prodStart = new Date(today);
  prodStart.setDate(today.getDate() + 1);

  const prodEnd = new Date(today);
  prodEnd.setDate(today.getDate() + 27);

  document.getElementById("productionDate").textContent =
    `${formatDate(prodStart)} - ${formatDate(prodEnd)}`;

  const delStart = new Date(today);
  delStart.setDate(today.getDate() + 28);

  const delEnd = new Date(today);
  delEnd.setDate(today.getDate() + 35);

  document.getElementById("deliveryDate").textContent =
    `${formatDate(delStart)} - ${formatDate(delEnd)}`;


  /* ================= ACCORDION ================= */

  function openAccordion(item) {
    const body = item.querySelector(".accordion-body");
    const inner = item.querySelector(".accordion-body-inner");
    if (!body || !inner) return;
    item.classList.add("active");
    body.style.height = inner.offsetHeight + "px";
  }

  function closeAccordion(item) {
    const body = item.querySelector(".accordion-body");
    if (!body) return;
    item.classList.remove("active");
    body.style.height = "0";
  }

  document.querySelectorAll(".accordion-title").forEach(title => {
    title.addEventListener("click", () => {
      const item = title.parentElement;
      const isOpen = item.classList.contains("active");
      // close all
      document.querySelectorAll(".accordion-item").forEach(closeAccordion);
      // toggle clicked
      if (!isOpen) openAccordion(item);
    });
  });

  // Open description by default
  const firstAccordion = document.querySelector(".accordion-item");
  if (firstAccordion) openAccordion(firstAccordion);

});

/* ================= LIGHTBOX (for custom rug image gallery) ================= */

let _lbImages = [];
let _lbIndex = 0;

function openLightbox(images, startIndex) {
  _lbImages = images;
  _lbIndex = startIndex || 0;
  const overlay = document.getElementById("lightboxOverlay");
  if (!overlay) return;

  // Build dots
  const dotsEl = document.getElementById("lightboxDots");
  dotsEl.innerHTML = "";
  _lbImages.forEach((_, i) => {
    const d = document.createElement("div");
    d.className = "lightbox-dot" + (i === _lbIndex ? " active" : "");
    d.onclick = () => { _lbIndex = i; _updateLightbox(); };
    dotsEl.appendChild(d);
  });

  _updateLightbox();
  overlay.classList.add("open");
  document.body.style.overflow = "hidden";
}

function _updateLightbox() {
  document.getElementById("lightboxImg").src = _lbImages[_lbIndex];
  const dots = document.querySelectorAll(".lightbox-dot");
  dots.forEach((d, i) => d.classList.toggle("active", i === _lbIndex));
}

function lightboxNext() {
  _lbIndex = (_lbIndex + 1) % _lbImages.length;
  _updateLightbox();
}

function lightboxPrev() {
  _lbIndex = (_lbIndex - 1 + _lbImages.length) % _lbImages.length;
  _updateLightbox();
}

function closeLightbox() {
  const overlay = document.getElementById("lightboxOverlay");
  if (overlay) overlay.classList.remove("open");
  document.body.style.overflow = "";
}

// Close on overlay background click
document.addEventListener("DOMContentLoaded", () => {
  const overlay = document.getElementById("lightboxOverlay");
  if (overlay) {
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) closeLightbox();
    });
  }

  // Keyboard support
  document.addEventListener("keydown", (e) => {
    if (!overlay || !overlay.classList.contains("open")) return;
    if (e.key === "ArrowRight") lightboxNext();
    if (e.key === "ArrowLeft") lightboxPrev();
    if (e.key === "Escape") closeLightbox();
  });
});
