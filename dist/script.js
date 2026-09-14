const offers = [
  { name: "VitaCore Daily", category: "NUTRA", rank: "TOP 1", geo: "🇻🇳 Việt Nam", image: "/offer-01.png" },
  { name: "DermaGlow Plus", category: "BEAUTY", rank: "TOP 2", geo: "🇹🇭 Thái Lan", image: "/offer-02.png" },
  { name: "FlexMove Active", category: "WELLNESS", rank: "TOP 3", geo: "🇮🇩 Indonesia", image: "/offer-03.png" },
  { name: "PureBalance", category: "NUTRA", rank: "TOP 4", geo: "🇲🇾 Malaysia", image: "/offer-04.png" },
  { name: "ActiveMen Pro", category: "PERSONAL CARE", rank: "TOP 5", geo: "🌏 Đông Nam Á", image: "/offer-05.png" }
];

offers.forEach((offer) => {
  const asset = new Image();
  asset.src = offer.image;
});

let activeOffer = 0;
const tabs = [...document.querySelectorAll(".carousel-tabs button")];
const image = document.querySelector("#offer-image");
const name = document.querySelector("#offer-name");
const category = document.querySelector("#offer-category");
const rank = document.querySelector("#offer-rank");
const geo = document.querySelector("#offer-geo");
const watermark = document.querySelector(".rank-watermark");
const progress = document.querySelector(".progress i");
const offerStage = document.querySelector(".offer-stage");

let offerTransition;
function showOffer(index) {
  window.clearTimeout(offerTransition);
  activeOffer = (index + offers.length) % offers.length;
  const offer = offers[activeOffer];
  offerStage.classList.add("is-switching");
  offerTransition = window.setTimeout(() => {
    image.src = offer.image;
    image.alt = `Mockup minh họa ${offer.name}`;
    name.textContent = offer.name;
    category.textContent = offer.category;
    rank.textContent = offer.rank;
    geo.textContent = offer.geo;
    watermark.textContent = String(activeOffer + 1).padStart(2, "0");
    tabs.forEach((tab, i) => { tab.classList.toggle("active", i === activeOffer); tab.setAttribute('aria-pressed', String(i === activeOffer)); });
    progress.style.width = `${(activeOffer + 1) * 20}%`;
    window.requestAnimationFrame(() => offerStage.classList.remove("is-switching"));
  }, 260);
}

let offerAutoplay;

function startOfferAutoplay() {
  window.clearTimeout(offerAutoplay);
  if (document.hidden) return;
  offerAutoplay = window.setTimeout(() => {
    showOffer(activeOffer + 1);
    startOfferAutoplay();
  }, 5200);
}

function selectOffer(index) {
  showOffer(index);
  startOfferAutoplay();
}

tabs.forEach((tab) => tab.addEventListener("click", () => selectOffer(Number(tab.dataset.index))));
document.querySelector("#prev-offer").addEventListener("click", () => selectOffer(activeOffer - 1));
document.querySelector("#next-offer").addEventListener("click", () => selectOffer(activeOffer + 1));

document.addEventListener("visibilitychange", () => {
  if (document.hidden) window.clearTimeout(offerAutoplay);
  else startOfferAutoplay();
});
startOfferAutoplay();

const menuToggle = document.querySelector(".menu-toggle");
const mobileNav = document.querySelector("#mobile-nav");
menuToggle.addEventListener("click", () => {
  const isOpen = mobileNav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});
mobileNav.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => {
  mobileNav.classList.remove("open");
  menuToggle.setAttribute("aria-expanded", "false");
}));

const toast = document.querySelector(".toast");
let toastTimer;
document.querySelectorAll(".pending-link").forEach((link) => link.addEventListener("click", (event) => {
  if (link.getAttribute("href") === "#") {
    event.preventDefault();
    toast.classList.add("show");
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => toast.classList.remove("show"), 2600);
  }
}));
