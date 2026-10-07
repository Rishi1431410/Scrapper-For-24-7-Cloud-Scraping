# AuraBuy 24/7 Autonomous Scraper Microservice

Autonomous Indian e-commerce intelligence microservice engineered for **AuraBuy Intelligence**. Continuously audits live prices, stock levels, No-Cost EMI interest subventions, and hidden hardware bottlenecks across **Amazon India**, **Flipkart**, **Croma**, and **Reliance Digital** for Mumbai pincode `400001`.

---

## 🚀 Quick Start (Local Execution)

1. Navigate to the `scraper-service` folder:
   ```bash
   cd scraper-service
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the live REST API:
   ```bash
   npm start
   ```
4. Test the health check endpoint:
   - Browser or curl: `http://localhost:5000/health`
   - Live products API: `http://localhost:5000/api/products?q=gaming+laptop`

---

## ☁️ Step 2: Deploy Free 24/7 on Render.com (3 Minutes)

1. Push your repository to **GitHub**.
2. Go to [Render.com](https://render.com) and sign in with GitHub.
3. Click **New +** → **Web Service** → Select this repository.
4. Fill in the deployment settings:
   - **Name**: `aurabuy-scraper-service`
   - **Root Directory**: `scraper-service`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
   - **Instance Type**: `Free`
5. Click **Create Web Service**.
6. Render will generate a live URL (e.g. `https://aurabuy-scraper-service.onrender.com`).
7. **Connect to AuraBuy**:
   - Open AuraBuy in your browser.
   - Click **Settings (⚙️)** → **"24/7 Cloud Scraper"** tab.
   - Paste `https://aurabuy-scraper-service.onrender.com/api/products` into the URL box.
   - Click **"⚡ Test Scraper Endpoint"** → **"Save & Activate Scraper"**.

---

## ⏰ Step 3: Run Every Hour with GitHub Actions Cron (100% Free)

This repository includes [`.github/workflows/hourly_scraper.yml`](../.github/workflows/hourly_scraper.yml).
- Runs automatically at the top of every hour (`cron: '0 * * * *'`).
- Runs in the cloud on GitHub's free runners.
- Audits the top models across Laptops, Smartphones, Smart TVs, and Headphones.
- Saves the latest deals in `scraper-service/best_deals.json`.

---

## 🔑 Option A & Option B API Keys Configuration

You can provide API keys via environment variables or in AuraBuy's Settings UI:

| Provider | Purpose | Free Tier | URL |
| :--- | :--- | :--- | :--- |
| **ScraperAPI (Option A)** | Residential Indian IP rotation, anti-bot shield bypass | 5,000 Free Requests | [scraperapi.com](https://www.scraperapi.com) |
| **Bright Data (Option A)** | High-concurrency proxy pool | Free Trial | [brightdata.com](https://brightdata.com) |
| **SerpApi (Option B)** | Real-time Google Shopping India Buy Box | 100 Free Monthly | [serpapi.com](https://serpapi.com) |
| **Rainforest API (Option B)** | Amazon India Buy Box & Lightning Deals | Free Trial | [rainforestapi.com](https://www.rainforestapi.com) |

> **Note**: Even with zero API keys, AuraBuy runs with direct resilient scraping and verified high-fidelity fallback catalogs with zero downtime.
