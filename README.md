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

### 📖 Authentic 9-Page Broadsheet Compendium
* **Page 1 — Cover & Live Morning Dashboard**: Bangkok Meteorological Observatory, atmospheric almanac, commercial currency bourse, and daily Table of Contents.
* **Page 2 — Thailand Current Situation**: Domestic economic initiatives, hyperscaler cloud campuses in the EEC, LTR visa corridors, and PromptPay payment architecture.
* **Page 3 — World News & Geopolitics**: Maritime transport accords, supply chain resilience, and international diplomacy dispatches.
* **Page 4 — Tech & Software Engineering**: Distributed consensus systems (Raft protocol mechanics, leader elections, log replication, and edge inference).
* **Page 5 — Science & Astrophysics**: JWST cosmic discoveries, prebiotic carbon compounds, and observational spectroscopy in the early universe.
* **Page 6 — Weather & Climatology**: Southwest monsoon dynamics, Intertropical Convergence Zone (ITCZ) oscillation, and barometric pressure mechanics.
* **Page 7 — Finance & Global Markets**: Sovereign debt yields, foreign exchange reserves, treasury management, and real-time capital flows.
* **Page 8 — History & Printing Heritage**: The evolution of the printing press in Siam, from Dr. Dan Beach Bradley and King Mongkut (Rama IV) to the Royal Gazette.
* **Page 9 — Daily Trivia & Curiosities**: Curated historical oddities (the origin of the broadsheet format, Grace Hopper's first computer bug, QWERTY typebar geometry, and Roman chariot wheel gauges).

---

### 📊 Real-Time Financial Bourse & Bangkok Meteorology
* **Foreign Exchange (THB Spot Rates)**:
  * USD to THB (`฿32.65`)
  * YEN to THB per 100¥ (`฿22.10 / 100¥`)
  * RMB to THB per ¥1 (`฿4.65 / ¥1`)
* **Equities & Digital Assets**:
  * S&P 500 Index
  * Bitcoin (BTC in USD)
  * Ethereum (ETH in USD)
* **Live Commodities & Thai Fuel**:
  * Gold Bullion per troy ounce (USD)
  * Crude Oil per barrel (Brent / USD)
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
