const offers = [
  { name: "Megamove390-id", category: "🦴 XƯƠNG KHỚP", rank: "TOP 1", country: "Indonesia", flag: "/flag-id.svg", ar: "30–35%", payout: "$24–28", image: "/offer-01.png?v=real-1" },
  { name: "Protolite-th", category: "🍌 TUYẾN TIỀN LIỆT", rank: "TOP 2", country: "Thái Lan", flag: "/flag-th.svg", ar: "30–35%", payout: "$26–30", image: "/offer-02.png?v=real-1" },
  { name: "Detarin-th", category: "🪱 KÝ SINH TRÙNG", rank: "TOP 3", country: "Thái Lan", flag: "/flag-th.svg", ar: "35–40%", payout: "$26–30", image: "/offer-03.png?v=real-1" },
  { name: "Bonivita-my", category: "🦴 XƯƠNG KHỚP", rank: "TOP 4", country: "Malaysia", flag: "/flag-my.svg", ar: "35–40%", payout: "$24–28", image: "/offer-04.png?v=real-1" },
  { name: "Urafirin-my", category: "🍌 TUYẾN TIỀN LIỆT", rank: "TOP 5", country: "Malaysia", flag: "/flag-my.svg", ar: "30–35%", payout: "$24–28", image: "/offer-05.png?v=real-3" }
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
const ar = document.querySelector("#offer-ar");
const payout = document.querySelector("#offer-payout");
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
    geo.src = offer.flag;
    geo.alt = offer.country;
    ar.textContent = offer.ar;
    payout.textContent = offer.payout;
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

document.addEventListener("keydown", (event) => {
  if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
  const target = event.target;
  if (target instanceof HTMLElement && (target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName))) return;
  const rect = offerStage.getBoundingClientRect();
  const offerIsVisible = rect.bottom > 0 && rect.top < window.innerHeight;
  if (!offerIsVisible) return;
  event.preventDefault();
  selectOffer(activeOffer + (event.key === "ArrowRight" ? 1 : -1));
});

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
