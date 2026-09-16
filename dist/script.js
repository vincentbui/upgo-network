const offers = [
  { id: 0, name: "Megamove390-id", category: "🦴 XƯƠNG KHỚP", rank: "TOP 1", country: "Indonesia", flag: "./flag-id.svg", ar: "30–35%", payout: "$24–28", epc: "$1.85", cr: "7.2%", traffic: "🔥 Facebook Ads • TikTok Ads • Native", image: "./offer-01.png?v=real-1" },
  { id: 1, name: "Protolite-th", category: "🍌 TUYẾN TIỀN LIỆT", rank: "TOP 2", country: "Thái Lan", flag: "./flag-th.svg", ar: "30–35%", payout: "$26–30", epc: "$2.10", cr: "6.8%", traffic: "⚡ TikTok Ads • Google Search • Zalo", image: "./offer-02.png?v=real-1" },
  { id: 2, name: "Detarin-th", category: "🪱 KÝ SINH TRÙNG", rank: "TOP 3", country: "Thái Lan", flag: "./flag-th.svg", ar: "35–40%", payout: "$26–30", epc: "$2.35", cr: "8.1%", traffic: "🚀 Native Ads • Facebook Reels • Display", image: "./offer-03.png?v=real-1" },
  { id: 3, name: "Bonivita-my", category: "🦴 XƯƠNG KHỚP", rank: "TOP 4", country: "Malaysia", flag: "./flag-my.svg", ar: "35–40%", payout: "$24–28", epc: "$1.95", cr: "7.5%", traffic: "🔥 Facebook Feed • TikTok Spark • GDN", image: "./offer-04.png?v=real-1" },
  { id: 4, name: "Urafirin-my", category: "🍌 TUYẾN TIỀN LIỆT", rank: "TOP 5", country: "Malaysia", flag: "./flag-my.svg", ar: "30–35%", payout: "$24–28", epc: "$2.05", cr: "6.9%", traffic: "⚡ Google Search • Native Discovery", image: "./offer-05.png?v=real-3" }
];

offers.forEach((offer) => {
  const asset = new Image();
  asset.src = offer.image;
});

let activeOffer = 0;
let currentGeo = "all";
let metricMode = "standard"; // 'standard' | 'advanced'

const carouselTabsContainer = document.querySelector(".carousel-tabs");
const geoBtns = [...document.querySelectorAll(".geo-btn")];
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
const toast = document.querySelector(".toast");
let toastTimer;

function showToast(text, duration = 2600) {
  if (!toast) return;
  toast.textContent = text;
  toast.classList.add("show");
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toast.classList.remove("show"), duration);
}

function getFilteredOffers() {
  if (currentGeo === "all") return offers;
  return offers.filter(o => o.country === currentGeo);
}

function renderTabs() {
  if (!carouselTabsContainer) return;
  const currentList = getFilteredOffers();
  carouselTabsContainer.innerHTML = "";
  currentList.forEach((offer, idx) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.dataset.offerId = String(offer.id);
    btn.dataset.filterIndex = String(idx);
    btn.textContent = String(idx + 1).padStart(2, "0");
    if (offer.id === activeOffer) {
      btn.classList.add("active");
      btn.setAttribute("aria-pressed", "true");
    } else {
      btn.setAttribute("aria-pressed", "false");
    }
    btn.addEventListener("click", () => {
      selectOffer(offer.id);
    });
    carouselTabsContainer.appendChild(btn);
  });
}

function updateMetricDisplay(offer) {
  payout.parentElement.querySelector("small").textContent = "PAYOUT";
  payout.textContent = offer.payout;
  ar.parentElement.querySelector("small").textContent = "AR%";
  ar.textContent = offer.ar;
  const metricCell3 = document.querySelector("#metric-cell-3");
  if (metricCell3) {
    metricCell3.innerHTML = `<small>GEO</small><img id="offer-geo" class="geo-flag" src="${offer.flag}" alt="${offer.country}" width="42" height="28" />`;
  }
}

let offerTransition;
function showOffer(offerId) {
  window.clearTimeout(offerTransition);
  const currentList = getFilteredOffers();
  let targetOffer = currentList.find(o => o.id === offerId);
  if (!targetOffer) {
    targetOffer = currentList[0] || offers[0];
  }
  activeOffer = targetOffer.id;
  const activeFilteredIdx = currentList.findIndex(o => o.id === activeOffer);

  offerStage.classList.add("is-switching");
  offerTransition = window.setTimeout(() => {
    image.src = targetOffer.image;
    image.alt = `Mockup minh họa ${targetOffer.name}`;
    name.textContent = targetOffer.name;
    category.textContent = targetOffer.category;
    rank.textContent = targetOffer.rank;
    updateMetricDisplay(targetOffer);
    watermark.textContent = String(targetOffer.id + 1).padStart(2, "0");

    // Update active tab states
    const tabButtons = carouselTabsContainer.querySelectorAll("button");
    tabButtons.forEach((btn, i) => {
      const isActive = i === activeFilteredIdx;
      btn.classList.toggle("active", isActive);
      btn.setAttribute("aria-pressed", String(isActive));
    });

    // Update progress percentage according to current filter size
    if (progress) {
      const totalInFilter = Math.max(currentList.length, 1);
      const pct = ((activeFilteredIdx + 1) / totalInFilter) * 100;
      progress.style.width = `${pct}%`;
    }

    geoBtns.forEach((b) => {
      const g = b.dataset.geo;
      if (currentGeo !== "all") {
        b.classList.toggle("is-active", g === targetOffer.country);
      }
    });

    window.requestAnimationFrame(() => offerStage.classList.remove("is-switching"));
  }, 260);
}

let offerAutoplay;
function startOfferAutoplay() {
  window.clearTimeout(offerAutoplay);
  if (document.hidden) return;
  offerAutoplay = window.setTimeout(() => {
    const currentList = getFilteredOffers();
    const currIdx = currentList.findIndex(o => o.id === activeOffer);
    const nextIdx = (currIdx + 1) % currentList.length;
    showOffer(currentList[nextIdx].id);
    startOfferAutoplay();
  }, 5200);
}

function selectOffer(offerId) {
  showOffer(offerId);
  startOfferAutoplay();
}

document.querySelector("#prev-offer").addEventListener("click", () => {
  const currentList = getFilteredOffers();
  const currIdx = currentList.findIndex(o => o.id === activeOffer);
  const prevIdx = (currIdx - 1 + currentList.length) % currentList.length;
  selectOffer(currentList[prevIdx].id);
});

document.querySelector("#next-offer").addEventListener("click", () => {
  const currentList = getFilteredOffers();
  const currIdx = currentList.findIndex(o => o.id === activeOffer);
  const nextIdx = (currIdx + 1) % currentList.length;
  selectOffer(currentList[nextIdx].id);
});

geoBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    const targetGeo = btn.dataset.geo;
    currentGeo = targetGeo;
    geoBtns.forEach(b => b.classList.toggle("is-active", b === btn));
    
    // Re-render tabs to match exact count of filtered items
    renderTabs();
    const currentList = getFilteredOffers();
    selectOffer(currentList[0].id);

    if (targetGeo === "all") {
      showToast("Hiển thị tất cả 5 Top Offers tại SEA");
    } else {
      showToast(`Đã lọc Offers thị trường: ${targetGeo} (${currentList.length} offer)`);
    }
  });
});

// Initialize tabs on first load
renderTabs();

const copyOfferBtn = document.querySelector("#copy-offer");
if (copyOfferBtn) {
  copyOfferBtn.addEventListener("click", async () => {
    const offer = offers[activeOffer];
    const textToCopy = `${offer.name} (${offer.country}) - Payout: ${offer.payout}`;
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(textToCopy);
      } else {
        const ta = document.createElement("textarea");
        ta.value = textToCopy;
        ta.style.position = "fixed";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        ta.remove();
      }
      copyOfferBtn.classList.add("copied");
      const span = copyOfferBtn.querySelector("span");
      const origText = span ? span.textContent : "";
      if (span) span.textContent = "Đã chép! ✓";
      showToast(`Đã sao chép: ${offer.name} 📋`);
      setTimeout(() => {
        copyOfferBtn.classList.remove("copied");
        if (span) span.textContent = origText;
      }, 2000);
    } catch {
      showToast(`Đã chọn: ${offer.name}`);
    }
  });
}

const amBackdrop = document.querySelector("#am-modal-backdrop");
const amCloseBtn = document.querySelector("#am-modal-close");
const openAmButtons = document.querySelectorAll(".open-am-modal");
const copyTgHandleBtn = document.querySelector("#copy-tg-handle");
const topicPills = document.querySelectorAll(".topic-pill");

function openAmModal() {
  if (!amBackdrop) return;
  amBackdrop.classList.add("is-open");
  amBackdrop.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-locked");
}

function closeAmModal() {
  if (!amBackdrop) return;
  amBackdrop.classList.remove("is-open");
  amBackdrop.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-locked");
}

openAmButtons.forEach(btn => {
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    openAmModal();
  });
});

if (amCloseBtn) amCloseBtn.addEventListener("click", closeAmModal);
if (amBackdrop) {
  amBackdrop.addEventListener("click", (e) => {
    if (e.target === amBackdrop) closeAmModal();
  });
}

if (copyTgHandleBtn) {
  copyTgHandleBtn.addEventListener("click", () => {
    showToast("Kênh Telegram chính thức sẽ được công bố khi UPGO mở cổng.");
  });
}

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && amBackdrop && amBackdrop.classList.contains("is-open")) {
    closeAmModal();
    return;
  }
  if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
  const target = event.target;
  if (target instanceof HTMLElement && (target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName))) return;
  const rect = offerStage.getBoundingClientRect();
  const offerIsVisible = rect.bottom > 0 && rect.top < window.innerHeight;
  if (!offerIsVisible) return;
  const currentList = getFilteredOffers();
  const currIdx = currentList.findIndex(o => o.id === activeOffer);
  const nextIdx = event.key === "ArrowRight" 
    ? (currIdx + 1) % currentList.length 
    : (currIdx - 1 + currentList.length) % currentList.length;
  selectOffer(currentList[nextIdx].id);
});

document.addEventListener("visibilitychange", () => {
  if (document.hidden) window.clearTimeout(offerAutoplay);
  else startOfferAutoplay();
});
startOfferAutoplay();

const menuToggle = document.querySelector(".menu-toggle");
const mobileNav = document.querySelector("#mobile-nav");
if (menuToggle && mobileNav) {
  menuToggle.addEventListener("click", () => {
    const isOpen = mobileNav.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });
  mobileNav.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => {
    mobileNav.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
  }));
}

/* ==========================================================
   Feature 1: Earnings & Scale Volume Calculator
   ========================================================== */
const calcSlider = document.querySelector("#calc-orders-slider");
const calcOrdersDisplay = document.querySelector("#calc-orders-display");
const calcResultMonthly = document.querySelector("#calc-result-monthly");
const calcResultDaily = document.querySelector("#calc-result-daily");
const calcTierBadge = document.querySelector("#calc-tier-badge");
const calcPills = document.querySelectorAll(".calc-pill");

let currentCalcPayout = 26;
let currentCalcOrders = 50;

function updateCalculator() {
  if (!calcSlider || !calcResultMonthly) return;
  const orders = Number(calcSlider.value);
  currentCalcOrders = orders;
  if (calcOrdersDisplay) calcOrdersDisplay.textContent = orders;

  const dailyRevenue = orders * currentCalcPayout;
  const monthlyRevenue = dailyRevenue * 30;

  calcResultMonthly.textContent = `$${monthlyRevenue.toLocaleString()}`;
  if (calcResultDaily) calcResultDaily.textContent = `$${dailyRevenue.toLocaleString()}`;

  // Update tier badge
  if (calcTierBadge) {
    if (orders >= 150) {
      calcTierBadge.textContent = "🔥 Diamond Scale Tier (Daily Payout)";
      calcTierBadge.className = "tier-badge tier-diamond";
    } else if (orders >= 50) {
      calcTierBadge.textContent = "⚡ VIP Publisher Tier (Net-7)";
      calcTierBadge.className = "tier-badge tier-vip";
    } else {
      calcTierBadge.textContent = "🌱 Starter Publisher Tier";
      calcTierBadge.className = "tier-badge tier-starter";
    }
  }
}

if (calcSlider) {
  calcSlider.addEventListener("input", updateCalculator);
}

calcPills.forEach(pill => {
  pill.addEventListener("click", () => {
    calcPills.forEach(p => p.classList.remove("is-active"));
    pill.classList.add("is-active");
    currentCalcPayout = Number(pill.dataset.payout) || 26;
    updateCalculator();
    showToast(`Đã chọn mức payout thị trường: $${currentCalcPayout}/lead`);
  });
});
updateCalculator();

/* ==========================================================
   Feature 5: Live Activity Social Proof Feed
   ========================================================== */
const liveCard = document.querySelector("#live-activity-card");
const activityTitle = document.querySelector("#activity-title");
const activityDesc = document.querySelector("#activity-desc");
const activityTime = document.querySelector("#activity-time");
const activityClose = document.querySelector("#activity-close");

const liveEvents = [
  { title: "Publisher vừa kích hoạt Offer", desc: "Megamove390-id • Payout $28 • <strong>+1,200 leads</strong>", time: "1 phút trước" },
  { title: "Đã hoàn tất Payout tuần", desc: "Thanh toán thành công <strong>$14,850</strong> qua USDT cho Top Media Buyer", time: "3 phút trước" },
  { title: "Publisher mới gia nhập", desc: "Team Media Buyer từ TP.HCM vừa mở tài khoản Scale SEA", time: "5 phút trước" },
  { title: "Tăng Payout Cap Offer", desc: "Detarin-th • Nâng cap lên <strong>500 leads/ngày</strong> cho Publisher VIP", time: "8 phút trước" },
  { title: "CR bứt phá thị trường Thái Lan", desc: "Protolite-th ghi nhận <strong>AR đạt 38.5%</strong> trên nguồn TikTok Ads", time: "12 phút trước" }
];

let liveIndex = 0;
let liveTimer;

function showNextLiveEvent() {
  if (!liveCard) return;
  const ev = liveEvents[liveIndex % liveEvents.length];
  liveIndex++;

  if (activityTitle) activityTitle.textContent = ev.title;
  if (activityDesc) activityDesc.innerHTML = ev.desc;
  if (activityTime) activityTime.textContent = ev.time;

  liveCard.classList.add("is-visible");

  // Auto dismiss after 5.5s
  setTimeout(() => {
    liveCard.classList.remove("is-visible");
  }, 5500);
}

if (activityClose) {
  activityClose.addEventListener("click", () => {
    if (liveCard) liveCard.classList.remove("is-visible");
    clearInterval(liveTimer);
  });
}

// Initial delay then trigger every 14 seconds
setTimeout(() => {
  showNextLiveEvent();
  liveTimer = setInterval(showNextLiveEvent, 14000);
}, 3500);

document.querySelectorAll(".pending-link").forEach((link) => link.addEventListener("click", (event) => {
  if (link.getAttribute("href") === "#") {
    event.preventDefault();
    showToast("Liên kết sẽ được cập nhật trước khi phát hành.");
  }
}));

// ============================================================
// DARK / LIGHT THEME TOGGLE (DEFAULT: LIGHT)
// ============================================================
const THEME_STORAGE_KEY = "upgo_theme_preference";
const themeToggleBtn = document.querySelector("#theme-toggle");
const themeToggleMobileBtn = document.querySelector("#theme-toggle-mobile");

function getCurrentTheme() {
  // Always default to 'light' unless user explicitly switched to 'dark'
  return localStorage.getItem(THEME_STORAGE_KEY) || "light";
}

function applyTheme(theme) {
  if (theme === "dark") {
    document.documentElement.setAttribute("data-theme", "dark");
  } else {
    document.documentElement.removeAttribute("data-theme");
  }
  
  const isDark = theme === "dark";
  const ariaLabel = isDark ? "Chuyển sang chế độ sáng" : "Chuyển sang chế độ tối";
  
  if (themeToggleBtn) {
    themeToggleBtn.setAttribute("aria-label", ariaLabel);
    themeToggleBtn.setAttribute("title", ariaLabel);
  }
  if (themeToggleMobileBtn) {
    themeToggleMobileBtn.setAttribute("aria-label", ariaLabel);
    const modeText = themeToggleMobileBtn.querySelector(".theme-mode-text");
    if (modeText) {
      modeText.textContent = isDark ? "Chế độ: Tối" : "Chế độ: Sáng";
    }
  }
}

function toggleTheme() {
  const current = getCurrentTheme();
  const nextTheme = current === "dark" ? "light" : "dark";
  try {
    localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
  } catch (e) {
    // localStorage might be unavailable in private mode
  }
  applyTheme(nextTheme);
  showToast(nextTheme === "dark" ? "🌙 Đã chuyển sang chế độ Tối" : "☀️ Đã chuyển sang chế độ Sáng", 1800);
}

// Initialize theme on page load (Default: Light)
applyTheme(getCurrentTheme());

if (themeToggleBtn) {
  themeToggleBtn.addEventListener("click", toggleTheme);
}
if (themeToggleMobileBtn) {
  themeToggleMobileBtn.addEventListener("click", toggleTheme);
}

