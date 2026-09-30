# 🗞️ The Daily Chronicle & Tech Review

> **An independent, 9-page daily morning broadsheet web app and booklet reader calibrated for a 20–30 minute subway commute.**

[![Vite](https://img.shields.io/badge/Vite-8.x-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)
[![JavaScript](https://img.shields.io/badge/JavaScript-ESModules-F7DF1E?style=flat-square&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![License: MIT](https://img.shields.io/badge/License-MIT-burgundy.svg?style=flat-square)](#license)
[![Deployed on Vercel](https://img.shields.io/badge/Vercel-Zero--Config-black?style=flat-square&logo=vercel)](https://vercel.com)

---

## 🌟 Overview

**The Daily Chronicle & Tech Review** is an electronic morning newspaper designed with vintage letterpress broadsheet typography, rich paper textures, and classical woodcut engravings. 

Unlike modern algorithmic feeds filled with clickbait and fragmented snippets, *The Daily Chronicle* is structured specifically for an uninterrupted **20 to 30-minute morning commute reading session**. Every topic is presented as a complete, in-depth long-form paper on the page with transparent source attribution—without opening external tabs or popup modals.

---

## ✨ Key Features

### 📖 The 9-Page Broadsheet Compendium: Daily Editorial Desks

*The Daily Chronicle* is not a static document; it is an **automated daily publishing engine**. Each morning at midnight (or upon first opening the app that day), it composes a brand-new edition stamped with today's calendar date, pulling together live API feeds, morning news wire dispatches, real-time market data, and date-matched historical archives.

The 9 pages represent dedicated **editorial beats / desks**, each with an automated pipeline that curates fresh daily content:

1. **Page 1 — The Morning Compass (Cover & Observational Dashboard)**
   * **Editorial Beat**: *Immediate Situational Awareness & Morning Essentials.*
   * **Dynamic Ingest**: Continuously queries Bangkok weather sensors via Open-Meteo (temperature, barometric trend, humidity, winds, solar almanac) paired with live bourse feeds (forex, equity indices, crypto, and local fuel prices). It equips the commuter with essential everyday coordinates before diving into the day's reporting.

2. **Page 2 — The Kingdom's Pulse (Thailand Current Affairs Desk)**
   * **Editorial Beat**: *Domestic Transformation & Ground Reality.*
   * **Dynamic Ingest**: Ingests fresh morning dispatches and developments across Thailand from premier national feeds (Bangkok Post, The Thaiger, and national correspondents). Synthesizes daily infrastructure projects, economic developments, policy changes, and civic news into a comprehensive morning briefing.

3. **Page 3 — The Global Horizon (World News & Geopolitics Desk)**
   * **Editorial Beat**: *Macro Interconnectedness & Strategic Perspectives.*
   * **Dynamic Ingest**: Aggregates international breaking wires (BBC World and global diplomatic channels). Covers daily shifts in trade corridors, maritime agreements, foreign elections, and multilateral summits shaping world affairs and regional commerce.

4. **Page 4 — The Engineering Mind (Technology & Systems Architecture Desk)**
   * **Editorial Beat**: *Deep Technical Thinking & Software Craftsmanship.*
   * **Dynamic Ingest**: Curates daily high-signal computing papers, distributed systems developments, and technical discussions (ingesting Hacker News and leading engineering publications). Provides deep, first-principles analyses rather than ephemeral marketing buzzwords.

5. **Page 5 — The Outer Frontier (Science & Cosmos Desk)**
   * **Editorial Beat**: *Cosmic Wonder & Scientific Discovery.*
   * **Dynamic Ingest**: Fetches daily dispatches on astrophysics, space observatory discoveries (JWST, NASA, ESA), quantum research, and biological breakthroughs (via ScienceDaily and academic feeds), offering a quiet moment of planetary perspective.

6. **Page 6 — The Earth's Rhythm (Weather & Planetary Climatology Desk)**
   * **Editorial Beat**: *Earth Systems Science & Atmospheric Dynamics.*
   * **Dynamic Ingest**: Evaluates live weather model data and seasonal atmospheric patterns (via Open-Meteo). Translates raw meteorological readings into dynamic daily analyses of monsoonal winds, pressure fronts, precipitation models, and regional climate trends.

7. **Page 7 — The Sovereign Ledger (Finance & Capital Markets Desk)**
   * **Editorial Beat**: *Macroeconomic Stewardship & Capital Flows.*
   * **Dynamic Ingest**: Connects live bourse tickers with daily financial journalism. Explores central bank policy announcements, sovereign bond yields, currency volatility, and international liquidity movements.

8. **Page 8 — The Living Chronicle (On This Day in History & Archives Desk)**
   * **Editorial Beat**: *Cultural Memory & Historical Continuity.*
   * **Dynamic Ingest**: Dynamically queries historical event databases (Wikipedia "On This Day" API) for significant milestones, treaties, and cultural achievements that took place on **today's exact calendar date**, paired with rich typographic and regional heritage archives.

9. **Page 9 — The Curiosity Cabinet (Daily Curiosities & Human Trivia Desk)**
   * **Editorial Beat**: *Serendipity, Intellectual Playfulness & A Memorable Close.*
   * **Dynamic Ingest**: Rotates a fresh daily selection of fascinating historical oddities, linguistic etymologies, engineering trivia, and philosophical excerpts to leave the commuter inspired before stepping off the train.

---

### 📊 Real-Time Financial Bourse & Bangkok Meteorology

All telemetry figures are **fetched live on page load** from public market and meteorological APIs, reflecting current real-world values:

* **Live Foreign Exchange (THB Spot Rates)**:
  * USD to THB (`USD/THB`)
  * JPY to THB (`JPY/THB per 100¥`)
  * CNY to THB (`CNY/THB per ¥1`)
* **Live Equities & Digital Assets**:
  * S&P 500 Benchmark Index
  * Bitcoin (`BTC/USD`)
  * Ethereum (`ETH/USD`)
* **Live Commodities & Energy**:
  * Gold Bullion spot price per troy ounce (`XAU/USD`)
  * Crude Oil spot price per barrel (`Brent/USD`)
* **Shell Thailand Retail Fuel Stations (THB/L)**:
  * Gasohol 91
  * Gasohol 95 (FuelSave / V-Power)
  * Gasohol E20
  * Diesel B7
* **Top Telemetry Strip**: A dedicated, spacious meteorological and market ticker displayed across the top of Pages 2 through 9.

---

### 🏛️ Automated Daily Publishing & Monthly Archive Library
* **Automatic Day Check**: Automatically detects new calendar days, composes today's edition with live data, and preserves it permanently in your browser library.
* **Month-Defined Archival Navigation**: Browse past editions organized into clean monthly buckets.
  * `← Newer: [Month Name]` and `Older: [Month Name] →` dynamic controls.
  * Direct **Active Month** dropdown selector.
  * Permanent local persistence with single-click reading and deletion.

---

### 📱 Commute-Ready & Mobile Ergonomics
* **Paper Margin Flipping**: Tap or click the outer 15% margins of the paper to turn pages backward or forward.
* **Keyboard Navigation**: Use `←` (Left Arrow) and `→` (Right Arrow) keys to turn pages.
* **Slide-out Navigation Drawer**: Responsive drawer menu on mobile and tablet viewports.
* **Add to Home Screen (PWA)**: Install directly to your iOS or Android home screen for full-screen booklet reading with zero browser chrome.
* **A4 Print & PDF Export**: Single-click multi-page export to high-resolution A4 booklet PDF via `html2pdf.js`.

---

## 🛠️ Technology Stack

| Layer | Technology | Details |
| :--- | :--- | :--- |
| **Build & Tooling** | [Vite 8](https://vitejs.dev/) | Ultra-fast HMR and optimized static rollup |
| **Logic & Core** | Vanilla JavaScript (ESModules) | No heavy frontend framework runtime overhead |
| **Styling** | Vanilla CSS3 | Custom typography tokens, glassmorphism, paper textures, CSS Grid |
| **Typography** | Google Fonts | `Cinzel`, `Playfair Display`, `Newsreader`, `JetBrains Mono` |
| **PDF Generation** | `html2pdf.js` | Direct client-side A4 document vector/canvas rasterization |
| **Deployment** | [Vercel](https://vercel.com) | Pre-configured `vercel.json` with SPA routing and edge CDN |

---

## 🚀 Getting Started

### Prerequisites
* [Node.js](https://nodejs.org/) (version 18+ recommended)
* `npm` or `pnpm`

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/<your-username>/daily-chronicle.git
   cd daily-chronicle
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the local development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173) in your browser.

4. **Build for production:**
   ```bash
   npm run build
   ```
   Generates production assets in the `dist/` folder.

---

## 🚢 Deploying to Vercel

This repository includes a pre-configured [`vercel.json`](./vercel.json) file for instant zero-config deployments.

### Option A: Via GitHub (Recommended)
1. Push your repository to GitHub.
2. Go to [vercel.com/new](https://vercel.com/new).
3. Import your repository and click **Deploy**.

### Option B: Via Vercel CLI
```bash
npx vercel
```
Accept default settings to receive an instant, free public `https://....vercel.app` link.

---

## 📱 Mobile Subway Reading Tip
Once deployed, open your live link on your iPhone (Safari) or Android (Chrome), tap **Share** (or the three dots menu), and choose **"Add to Home Screen"**. This gives you an app icon on your phone that launches in standalone full-screen mode every morning!

---

## 📄 License
This project is licensed under the [MIT License](./LICENSE).
