import html2pdf from "html2pdf.js";
import { buildEditionData } from "./editionContent.js";
import {
  fetchDailySources,
  fetchLiveWeather,
  fetchLiveMarkets,
  fetchWikiHistory
} from "./newsService.js";
import {
  saveEditionToArchive,
  getEditionFromArchive,
  deleteEditionFromArchive,
  getArchiveMonths
} from "./storageManager.js";

// State
let currentDate = new Date();
let currentPageNumber = 1;
let currentEditionData = null;
let archiveCurrentMonthIndex = 0;

document.addEventListener("DOMContentLoaded", () => {
  initNavigation();
  initMobileDrawer();
  initPageTurning();
  initArchiveModal();
  initPdfExport();
  autoLoadDayEdition();
});

/**
 * Check if today is a new day or if an edition already exists in the archive
 */
async function autoLoadDayEdition() {
  const dateStr = currentDate.toISOString().split("T")[0];
  const dateIndicator = document.getElementById("current-edition-indicator");
  if (dateIndicator) dateIndicator.textContent = dateStr;

  try {
    const existingEdition = getEditionFromArchive(dateStr);
    if (existingEdition && existingEdition.pages) {
      currentEditionData = existingEdition;
      renderFullEdition(existingEdition);
      return;
    }

    showToast("Composing today's morning broadsheet...");
    const month = currentDate.getMonth() + 1;
    const day = currentDate.getDate();

    const [feeds, weather, markets, wiki] = await Promise.all([
      fetchDailySources().catch(() => ({})),
      fetchLiveWeather(13.7563, 100.5018).catch(() => null),
      fetchLiveMarkets().catch(() => null),
      fetchWikiHistory(month, day).catch(() => [])
    ]);

    const edition = buildEditionData(feeds, weather, markets, wiki, currentDate);
    currentEditionData = edition;
    saveEditionToArchive(dateStr, edition);
    renderFullEdition(edition);
  } catch (err) {
    console.error("autoLoadDayEdition error, using local fallback composition:", err);
    const fallbackEdition = buildEditionData({}, null, null, [], currentDate);
    currentEditionData = fallbackEdition;
    renderFullEdition(fallbackEdition);
  }
}

/**
 * Click left and right edge to turn the page
 */
function initPageTurning() {
  // Keyboard left/right arrow keys
  window.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") {
      turnPageRelative(-1);
    } else if (e.key === "ArrowRight") {
      turnPageRelative(1);
    }
  });

  // Clicking outer 15% margins of the paper sheet
  const bookletDoc = document.getElementById("booklet-container");
  bookletDoc?.addEventListener("click", (e) => {
    const rect = bookletDoc.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;

    if (e.target.closest("a, button, input")) return;

    if (clickX < width * 0.15) {
      turnPageRelative(-1);
    } else if (clickX > width * 0.85) {
      turnPageRelative(1);
    }
  });
}

function turnPageRelative(delta) {
  if (currentPageNumber === "all") {
    currentPageNumber = 1;
  } else {
    currentPageNumber = Number(currentPageNumber) + delta;
    if (currentPageNumber < 1) currentPageNumber = 1;
    if (currentPageNumber > 9) currentPageNumber = 9;
  }
  switchPage(String(currentPageNumber));
}

/**
 * Navigation Ribbon and Drawer bindings
 */
function initNavigation() {
  const ribbonBtns = document.querySelectorAll(".nav-page-btn");
  const drawerLinks = document.querySelectorAll(".drawer-link");

  ribbonBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      switchPage(btn.dataset.page);
    });
  });

  drawerLinks.forEach((link) => {
    link.addEventListener("click", () => {
      switchPage(link.dataset.page);
      closeMobileDrawer();
    });
  });
}

function switchPage(pageKey) {
  currentPageNumber = pageKey;
  const docContainer = document.getElementById("booklet-container");

  document.querySelectorAll(".nav-page-btn").forEach((btn) => {
    if (btn.dataset.page === String(pageKey)) {
      btn.classList.add("active");
    } else {
      btn.classList.remove("active");
    }
  });

  document.querySelectorAll(".drawer-link").forEach((link) => {
    if (link.dataset.page === String(pageKey)) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });

  if (pageKey === "all") {
    docContainer.classList.add("show-all");
  } else {
    docContainer.classList.remove("show-all");
    document.querySelectorAll(".booklet-page").forEach((page) => {
      if (page.dataset.pageIndex === String(pageKey)) {
        page.classList.add("page-active");
      } else {
        page.classList.remove("page-active");
      }
    });
  }
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function initMobileDrawer() {
  const hamburger = document.getElementById("btn-hamburger");
  const closeBtn = document.getElementById("btn-close-drawer");
  const backdrop = document.getElementById("drawer-backdrop");

  hamburger?.addEventListener("click", openMobileDrawer);
  closeBtn?.addEventListener("click", closeMobileDrawer);
  backdrop?.addEventListener("click", closeMobileDrawer);
}

function openMobileDrawer() {
  document.getElementById("mobile-nav-drawer")?.classList.remove("hidden");
  document.getElementById("drawer-backdrop")?.classList.remove("hidden");
}

function closeMobileDrawer() {
  document.getElementById("mobile-nav-drawer")?.classList.add("hidden");
  document.getElementById("drawer-backdrop")?.classList.add("hidden");
}

/**
 * Archive Management Modal - Defined and Navigated by Month
 */
function initArchiveModal() {
  const openBtn = document.getElementById("btn-open-archive");
  const closeBtn = document.getElementById("archive-modal-close");
  const modal = document.getElementById("archive-modal");
  const prevMonthBtn = document.getElementById("btn-archive-prev");
  const nextMonthBtn = document.getElementById("btn-archive-next");
  const monthSelect = document.getElementById("archive-month-select");

  openBtn?.addEventListener("click", () => {
    archiveCurrentMonthIndex = 0;
    renderMonthlyArchiveList();
    modal?.classList.remove("hidden");
  });

  closeBtn?.addEventListener("click", () => {
    modal?.classList.add("hidden");
  });

  modal?.addEventListener("click", (e) => {
    if (e.target.id === "archive-modal") modal.classList.add("hidden");
  });

  prevMonthBtn?.addEventListener("click", () => {
    if (archiveCurrentMonthIndex > 0) {
      archiveCurrentMonthIndex--;
      renderMonthlyArchiveList();
    }
  });

  nextMonthBtn?.addEventListener("click", () => {
    const months = getArchiveMonths(currentDate);
    if (archiveCurrentMonthIndex < months.length - 1) {
      archiveCurrentMonthIndex++;
      renderMonthlyArchiveList();
    }
  });

  monthSelect?.addEventListener("change", (e) => {
    archiveCurrentMonthIndex = Number(e.target.value);
    renderMonthlyArchiveList();
  });
}

function renderMonthlyArchiveList() {
  const listContainer = document.getElementById("archive-list");
  const statusEl = document.getElementById("archive-page-status");
  const prevBtn = document.getElementById("btn-archive-prev");
  const nextBtn = document.getElementById("btn-archive-next");
  const monthSelect = document.getElementById("archive-month-select");
  const titleEl = document.getElementById("archive-modal-title");

  if (!listContainer) return;

  const months = getArchiveMonths(currentDate);
  if (archiveCurrentMonthIndex >= months.length) {
    archiveCurrentMonthIndex = Math.max(0, months.length - 1);
  }

  const activeMonth = months[archiveCurrentMonthIndex];

  // 1. Populate/Update the Month Dropdown
  if (monthSelect) {
    monthSelect.innerHTML = months.map((m, idx) => `
      <option value="${idx}" ${idx === archiveCurrentMonthIndex ? "selected" : ""}>
        ${m.label} (${m.items.length} ${m.items.length === 1 ? "edition" : "editions"})
      </option>
    `).join("");
  }

  // 2. Update Modal Title & Status defined by Month
  if (titleEl) {
    titleEl.textContent = `${activeMonth.label} Broadsheet Archive`;
  }
  if (statusEl) {
    statusEl.innerHTML = `<strong>${activeMonth.label}</strong> <span style="font-size:11px; opacity:0.8;">(${activeMonth.items.length} ${activeMonth.items.length === 1 ? "edition" : "editions"})</span>`;
  }

  // 3. Define Newer and Older Buttons by Month
  if (prevBtn) {
    if (archiveCurrentMonthIndex > 0) {
      const newerMonth = months[archiveCurrentMonthIndex - 1];
      prevBtn.disabled = false;
      prevBtn.innerHTML = `&larr; Newer: ${newerMonth.label}`;
      prevBtn.title = `Go to ${newerMonth.label}`;
    } else {
      prevBtn.disabled = true;
      prevBtn.innerHTML = `&larr; Newer Month`;
      prevBtn.title = `Already at newest month`;
    }
  }

  if (nextBtn) {
    if (archiveCurrentMonthIndex < months.length - 1) {
      const olderMonth = months[archiveCurrentMonthIndex + 1];
      nextBtn.disabled = false;
      nextBtn.innerHTML = `Older: ${olderMonth.label} &rarr;`;
      nextBtn.title = `Go to ${olderMonth.label}`;
    } else {
      nextBtn.disabled = true;
      nextBtn.innerHTML = `Older Month &rarr;`;
      nextBtn.title = `Earliest archived month`;
    }
  }

  // 4. Render Editions for Active Month
  if (activeMonth.items.length === 0) {
    listContainer.innerHTML = `
      <div class="archive-empty-box">
        <p class="empty-title">No Stored Editions for ${activeMonth.label}</p>
        <p class="empty-sub">Daily morning editions are preserved automatically when published each day.</p>
      </div>
    `;
    return;
  }

  listContainer.innerHTML = activeMonth.items.map(item => `
    <div class="archive-item-row">
      <div class="archive-item-info">
        <span class="archive-item-date">${item.date}</span>
        <span class="archive-item-title">${item.title}</span>
      </div>
      <div class="archive-item-actions">
        <button class="archive-action-btn load-archive-btn" data-date="${item.date}">Read</button>
        <button class="archive-action-btn delete-archive-btn" data-date="${item.date}" style="background: #554440;">Delete</button>
      </div>
    </div>
  `).join("");

  listContainer.querySelectorAll(".load-archive-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const targetDate = btn.dataset.date;
      const edition = getEditionFromArchive(targetDate);
      if (edition) {
        currentEditionData = edition;
        renderFullEdition(edition);
        document.getElementById("archive-modal")?.classList.add("hidden");
        const dateIndicator = document.getElementById("current-edition-indicator");
        if (dateIndicator) dateIndicator.textContent = targetDate;
        showToast(`Loaded edition for ${targetDate}`);
        switchPage("1");
      }
    });
  });

  listContainer.querySelectorAll(".delete-archive-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const targetDate = btn.dataset.date;
      deleteEditionFromArchive(targetDate);
      renderMonthlyArchiveList();
      showToast(`Deleted archive for ${targetDate}`);
    });
  });
}

/**
 * Render all 9 pages from the edition data structure
 */
function renderFullEdition(edition) {
  for (let i = 1; i <= 9; i++) {
    const el = document.getElementById(`masthead-date-p${i}`);
    if (el) el.textContent = edition.dateFormatted;
  }

  // Page 1: Cover Dashboard
  renderCoverDashboard(edition.pages[1]);

  // Subpage Telemetry Strips (Weather & Prices on top of Pages 2–9)
  const weatherObj = edition.weather || edition.pages?.[1]?.weather || {
    temp: "31°C",
    cond: "Warm & Breezy",
    barometer: "29.98 inHg",
    humidity: "72%",
    wind: "11 km/h SW"
  };
  const pricesObj = edition.prices || edition.pages?.[1]?.prices || {
    usdThb: "฿32.65",
    yenThb: "฿22.10/100¥",
    rmbThb: "฿4.65/¥1",
    sp500: "5,751.07",
    btc: "$64,820",
    eth: "$2,645",
    gold: "$2,682.50/oz",
    crudeOil: "$71.20/bbl",
    shellGasohol91: "฿37.48",
    shellGasohol95: "฿37.85",
    shellGasoholE20: "฿35.74",
    shellDieselB7: "฿32.94",
    shellThaiOil: "฿37.85/L"
  };

  const fxBrief = `USD <strong>${pricesObj.usdThb || "฿32.65"}</strong> &bull; JPY <strong>${pricesObj.yenThb || "฿22.10/100¥"}</strong> &bull; RMB <strong>${pricesObj.rmbThb || "฿4.65/¥1"}</strong>`;
  const stockBrief = `S&P <strong>${pricesObj.sp500 || "5,751.07"}</strong> &bull; BTC <strong>${pricesObj.btc || "$64,820"}</strong> &bull; ETH <strong>${pricesObj.eth || "$2,645"}</strong>`;
  const liveBrief = `Gold <strong>${pricesObj.gold || "$2,682.50/oz"}</strong> &bull; Oil <strong>${pricesObj.crudeOil || "$71.20/bbl"}</strong>`;
  const shellBrief = `91: <strong>${pricesObj.shellGasohol91 || "฿37.48"}</strong> &bull; 95: <strong>${pricesObj.shellGasohol95 || pricesObj.shellThaiOil || "฿37.85"}</strong> &bull; E20: <strong>${pricesObj.shellGasoholE20 || "฿35.74"}</strong> &bull; B7: <strong>${pricesObj.shellDieselB7 || "฿32.94"}</strong>`;

  for (let p = 2; p <= 9; p++) {
    const strip = document.getElementById(`telemetry-strip-p${p}`);
    if (strip) {
      strip.innerHTML = `
        <div class="subpage-telemetry-inner">
          <div class="subpage-telemetry-weather-row">
            <span class="telemetry-weather-brand">🌤️ BANGKOK METEOROLOGICAL OBSERVATORY:</span>
            <span class="telemetry-weather-data"><strong>${weatherObj.temp}</strong> (${weatherObj.cond}) &bull; Barometer: <strong>${weatherObj.barometer}</strong> &bull; Humidity: <strong>${weatherObj.humidity || "72%"}</strong> &bull; Wind: <strong>${weatherObj.wind || "11 km/h SW"}</strong></span>
          </div>
          <div class="subpage-telemetry-prices-row">
            <div class="telemetry-block">
              <span class="telemetry-badge-tag">FX (THB)</span>
              <span class="telemetry-badge-vals">${fxBrief}</span>
            </div>
            <div class="telemetry-block">
              <span class="telemetry-badge-tag">MARKETS</span>
              <span class="telemetry-badge-vals">${stockBrief}</span>
            </div>
            <div class="telemetry-block">
              <span class="telemetry-badge-tag">COMMODITIES</span>
              <span class="telemetry-badge-vals">${liveBrief}</span>
            </div>
            <div class="telemetry-block telemetry-block-shell">
              <span class="telemetry-badge-tag shell-tag">SHELL THAILAND</span>
              <span class="telemetry-badge-vals">${shellBrief}</span>
            </div>
          </div>
        </div>
      `;
    }
  }

  // Pages 2 to 8: In-Depth Articles
  for (let p = 2; p <= 8; p++) {
    renderArticlePage(`content-page-${p}`, edition.pages[p]);
  }

  // Page 9: Trivia
  renderTriviaPage("content-page-9", edition.pages[9]);
}

function renderCoverDashboard(p1Data) {
  const w = p1Data.weather;
  const p = p1Data.prices;

  const tempEl = document.getElementById("cover-temp");
  const condEl = document.getElementById("cover-cond");
  const baroEl = document.getElementById("cover-baro");
  const humidEl = document.getElementById("cover-humidity");
  const windEl = document.getElementById("cover-wind");
  const sunEl = document.getElementById("cover-sun");
  const rangeEl = document.getElementById("cover-range");

  if (tempEl) tempEl.textContent = w.temp;
  if (condEl) condEl.textContent = w.cond;
  if (baroEl) baroEl.textContent = `Barometer: ${w.barometer}`;
  if (humidEl) humidEl.textContent = w.humidity;
  if (windEl) windEl.textContent = w.wind;
  if (sunEl) sunEl.textContent = w.sun;
  if (rangeEl) rangeEl.textContent = w.range;

  // 1. Currencies
  const usdEl = document.getElementById("price-usd-thb");
  const yenEl = document.getElementById("price-yen-thb");
  const rmbEl = document.getElementById("price-rmb-thb");

  if (usdEl) usdEl.textContent = p?.usdThb || p?.thb || "฿32.65";
  if (yenEl) yenEl.textContent = p?.yenThb || "฿22.10 / 100¥";
  if (rmbEl) rmbEl.textContent = p?.rmbThb || "฿4.65 / ¥1";

  // 2. Stock / Crypto
  const sp500El = document.getElementById("price-sp500");
  const btcEl = document.getElementById("price-btc");
  const ethEl = document.getElementById("price-eth");

  if (sp500El) sp500El.textContent = p?.sp500 || "5,751.07";
  if (btcEl) btcEl.textContent = p?.btc || "$64,820";
  if (ethEl) ethEl.textContent = p?.eth || "$2,645";

  // 3. Live Commodities & Oil
  const goldEl = document.getElementById("price-gold");
  const oilEl = document.getElementById("price-oil");

  if (goldEl) goldEl.textContent = p?.gold || "$2,682.50";
  if (oilEl) oilEl.textContent = p?.crudeOil || p?.oil || "$71.20";

  // 4. Thai Oil (Shell Only): Gasohol 91, 95, E20 and Diesel B7
  const shell91El = document.getElementById("price-shell-91");
  const shell95El = document.getElementById("price-shell-95");
  const shellE20El = document.getElementById("price-shell-e20");
  const shellDieselEl = document.getElementById("price-shell-diesel");
  const legacyShellEl = document.getElementById("price-shell");

  if (shell91El) shell91El.textContent = p?.shellGasohol91 || "฿37.48";
  if (shell95El) shell95El.textContent = p?.shellGasohol95 || p?.shellThaiOil || "฿37.85";
  if (shellE20El) shellE20El.textContent = p?.shellGasoholE20 || "฿35.74";
  if (shellDieselEl) shellDieselEl.textContent = p?.shellDieselB7 || "฿32.94";
  if (legacyShellEl) legacyShellEl.textContent = p?.shellGasohol95 || p?.shellThaiOil || "฿37.85";
}

function renderArticlePage(containerId, data) {
  const container = document.getElementById(containerId);
  if (!container || !data) return;

  const firstLetter = data.leadParagraph.charAt(0);
  const restLead = data.leadParagraph.slice(1);

  const sectionsHtml = data.sections.map(sec => `
    <h3 class="prose-subheading">${sec.heading}</h3>
    <p>${sec.content}</p>
  `).join("");

  const imageHtml = data.image ? `
    <div class="article-inline-engraving">
      <div class="vintage-engraving-frame">
        <div class="engraving-container" style="max-height: 220px;">
          <img class="newspaper-img" src="${data.image.src}" alt="${data.title}" />
        </div>
        <figcaption class="caption">${data.image.caption}</figcaption>
      </div>
    </div>
  ` : "";

  container.innerHTML = `
    <article class="unabridged-article">
      <header class="article-header">
        <span class="article-kicker-tag">${data.category}</span>
        <h2 class="article-full-title">${data.title}</h2>
        <p class="article-deck">${data.deck}</p>
        <div class="article-meta-line">
          <span>By <strong>${data.author}</strong></span>
          <span>${data.desk}</span>
          <span class="read-badge">${data.readTime}</span>
        </div>
        <div class="verified-source-box">
          <span>Source: <strong>${data.sourceName}</strong></span>
          <a href="${data.sourceUrl}" target="_blank" rel="noopener noreferrer" class="source-anchor">Source &rarr;</a>
        </div>
      </header>

      ${imageHtml}

      <div class="article-prose">
        <p class="lead-p">
          <span class="drop-cap">${firstLetter}</span>${restLead}
        </p>
        ${sectionsHtml}
      </div>
    </article>
  `;
}

function renderTriviaPage(containerId, data) {
  const container = document.getElementById(containerId);
  if (!container || !data) return;

  const cardsHtml = data.items.map(item => `
    <div class="trivia-item-card">
      <h4 class="trivia-item-title">${item.title}</h4>
      <p class="trivia-item-body">${item.content}</p>
    </div>
  `).join("");

  const imageHtml = data.image ? `
    <div class="article-inline-engraving">
      <div class="vintage-engraving-frame">
        <div class="engraving-container" style="max-height: 200px;">
          <img class="newspaper-img" src="${data.image.src}" alt="Trivia Engraving" />
        </div>
        <figcaption class="caption">${data.image.caption}</figcaption>
      </div>
    </div>
  ` : "";

  container.innerHTML = `
    <header class="article-header">
      <span class="article-kicker-tag">${data.category}</span>
      <h2 class="article-full-title">${data.title}</h2>
      <p class="article-deck">${data.deck}</p>
      <div class="article-meta-line">
        <span>By <strong>${data.author}</strong></span>
        <span>${data.desk}</span>
        <span class="read-badge">${data.readTime}</span>
      </div>
      <div class="verified-source-box">
        <span>Source: <strong>${data.sourceName}</strong></span>
        <a href="${data.sourceUrl}" target="_blank" rel="noopener noreferrer" class="source-anchor">Source &rarr;</a>
      </div>
    </header>

    ${imageHtml}

    <div class="trivia-cards-grid">
      ${cardsHtml}
    </div>
  `;
}

/**
 * Full A4 Multi-page PDF Export
 */
function initPdfExport() {
  document.getElementById("btn-download-pdf")?.addEventListener("click", async () => {
    const container = document.getElementById("booklet-container");
    const dateStr = currentEditionData?.date || currentDate.toISOString().split("T")[0];
    const filename = `The_Daily_Chronicle_A4_${dateStr}.pdf`;

    showToast("Generating 20-30 min commute A4 newspaper booklet PDF...");

    const prevShowAll = container.classList.contains("show-all");
    container.classList.add("show-all");

    const opt = {
      margin: [10, 10, 10, 10],
      filename: filename,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        letterRendering: true,
        scrollY: 0
      },
      jsPDF: {
        unit: "mm",
        format: "a4",
        orientation: "portrait"
      },
      pagebreak: { mode: ["css", "legacy"] }
    };

    try {
      await html2pdf().set(opt).from(container).save();
      showToast("Complete A4 newspaper downloaded!");
    } catch (err) {
      console.error("PDF generation failed:", err);
      window.print();
    } finally {
      if (!prevShowAll && currentPageNumber !== "all") {
        container.classList.remove("show-all");
      }
    }
  });
}

function showToast(msg) {
  const toast = document.getElementById("toast");
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.remove("hidden");
  setTimeout(() => {
    toast.classList.add("hidden");
  }, 3500);
}
