document.addEventListener("DOMContentLoaded", () => {

/* ================= SALE SECTION (2x2 = max 4) ================= */

const saleGrid = document.getElementById("saleGrid");
if (saleGrid) {
  let count = 0;
  Object.entries(window.PRODUCTS).forEach(([key, product]) => {
    if (!product.sale) return;
    if (count >= 4) return;
    saleGrid.appendChild(createHomeCard(key, product));
    count++;
  });
}

/* ================= BEST SELLERS SECTION (2x2x2 = max 6) ================= */

const bestGrid = document.getElementById("bestGrid");
if (bestGrid) {
  let count = 0;
  Object.entries(window.PRODUCTS).forEach(([key, product]) => {
    if (!product.bestSeller) return;
    if (count >= 6) return;
    bestGrid.appendChild(createHomeCard(key, product));
    count++;
  });
}

/* ================= CUSTOM DEMANDS SECTION (3x2 = max 6) ================= */

const customContainer = document.getElementById("customGrid");
if (customContainer && window.PRODUCTS) {
  let count = 0;
  Object.entries(window.PRODUCTS).forEach(([key, product]) => {
    if (!product.customDemand) return;
    if (count >= 6) return;

    const imgSrc = product.images && product.images.length ? product.images[0] : (product.image || "");
    const allImages = product.images && product.images.length ? product.images : [product.image];

    const card = document.createElement("div");
    card.className = "home-card";
    card.style.cursor = "pointer";
    card.innerHTML = `
      <div class="home-card-img-wrap">
        <img src="${imgSrc}" alt="${product.name}" loading="lazy">
      </div>
      <div class="home-card-content">
        <h4>${product.name}</h4>
      </div>
    `;
    card.addEventListener("click", () => openLightbox(allImages, 0));
    customContainer.appendChild(card);
    count++;
  });
}

/* ================= HERO SLIDESHOW ================= */

const slides = document.querySelectorAll(".hero-slide");
const dotsContainer = document.getElementById("heroDots");

if (slides.length && dotsContainer) {
  let current = 0;

  slides.forEach((_, i) => {
    const dot = document.createElement("div");
    dot.className = "hero-dot" + (i === 0 ? " active" : "");
    dot.addEventListener("click", () => goTo(i));
    dotsContainer.appendChild(dot);
  });

  function goTo(index) {
    slides[current].classList.remove("active");
    dotsContainer.children[current].classList.remove("active");
    current = index;
    slides[current].classList.add("active");
    dotsContainer.children[current].classList.add("active");
  }

  setInterval(() => goTo((current + 1) % slides.length), 4000);
}

/* ================= REUSABLE HOME CARD ================= */

function createHomeCard(key, product) {
  const card = document.createElement("div");
  card.className = "home-card";

  const imgSrc = product.images && product.images.length ? product.images[0] : (product.image || "");

  let priceHTML;
  if (product.sale && product.salePrice) {
    priceHTML = `<span class="old-price">&#8377;${product.price}</span><span class="sale-price">&#8377;${product.salePrice}</span>`;
  } else {
    priceHTML = `&#8377;${product.price || ""}`;
  }

  card.innerHTML = `
    <a href="product.html?id=${key}">
      <div class="home-card-img-wrap">
        <img src="${imgSrc}" alt="${product.name}" loading="lazy">
      </div>
      <div class="home-card-content">
        <h4>${product.name}</h4>
        ${product.customDemand ? "" : `<p class="price">${priceHTML}</p>`}
      </div>
    </a>
  `;
  return card;
}

/* ================= LIGHTBOX ================= */

let _lbImages = [], _lbIndex = 0;

function openLightbox(images, startIndex) {
  _lbImages = images;
  _lbIndex = startIndex || 0;
  const overlay = document.getElementById("lightboxOverlay");
  if (!overlay) return;
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
  document.querySelectorAll(".lightbox-dot").forEach((d, i) => d.classList.toggle("active", i === _lbIndex));
}

function lightboxNext() { _lbIndex = (_lbIndex + 1) % _lbImages.length; _updateLightbox(); }
function lightboxPrev() { _lbIndex = (_lbIndex - 1 + _lbImages.length) % _lbImages.length; _updateLightbox(); }

function closeLightbox() {
  const overlay = document.getElementById("lightboxOverlay");
  if (overlay) overlay.classList.remove("open");
  document.body.style.overflow = "";
}

const overlay = document.getElementById("lightboxOverlay");
if (overlay) {
  overlay.addEventListener("click", (e) => { if (e.target === overlay) closeLightbox(); });
}
document.addEventListener("keydown", (e) => {
  if (!overlay || !overlay.classList.contains("open")) return;
  if (e.key === "ArrowRight") lightboxNext();
  if (e.key === "ArrowLeft") lightboxPrev();
  if (e.key === "Escape") closeLightbox();
});

});

/* ================= GLOBAL SCROLL FUNCTIONS ================= */
function scrollSale(direction) {
  const el = document.getElementById("saleSlider");
  if (el) el.scrollBy({ left: direction * 300, behavior: "smooth" });
}
function scrollBest(direction) {
  const el = document.getElementById("bestSellerSlider");
  if (el) el.scrollBy({ left: direction * 300, behavior: "smooth" });
}
