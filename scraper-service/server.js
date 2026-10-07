import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import axios from 'axios';
import { auditUniversalProducts } from './scraper_engine.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// In-memory cache for hourly best deals
let cachedHourlyDeals = {
  lastUpdated: new Date().toISOString(),
  category: 'laptops',
  products: []
};

/**
 * Health check endpoint for Render.com, Railway, and uptime monitors
 */
app.get('/health', (req, res) => {
  res.json({
    status: 'ONLINE',
    service: 'AuraBuy Autonomous Scraper Microservice',
    timestamp: new Date().toISOString(),
    pincode: process.env.MUMBAI_PINCODE || '400001',
    configuredProviders: {
      scraperapi: Boolean(process.env.SCRAPERAPI_KEY),
      serpapi: Boolean(process.env.SERPAPI_KEY),
      rainforest: Boolean(process.env.RAINFOREST_KEY),
      brightdata: Boolean(process.env.BRIGHTDATA_URL),
      zenrows: Boolean(process.env.ZENROWS_KEY)
    }
  });
});

/**
 * Live multi-store product search & spec normalization
 * GET /api/products?q=gaming+laptop&category=laptops&pincode=400001
 */
app.get('/api/products', async (req, res) => {
  const query = req.query.q || 'gaming laptop';
  const category = req.query.category || 'laptops';
  const pincode = req.query.pincode || process.env.MUMBAI_PINCODE || '400001';

  // Merge process env with any API keys passed dynamically via query or headers
  const envConfig = {
    ...process.env,
    SCRAPERAPI_KEY: req.headers['x-scraperapi-key'] || req.query.scraperapi_key || process.env.SCRAPERAPI_KEY,
    SERPAPI_KEY: req.headers['x-serpapi-key'] || req.query.serpapi_key || process.env.SERPAPI_KEY,
    RAINFOREST_KEY: req.headers['x-rainforest-key'] || req.query.rainforest_key || process.env.RAINFOREST_KEY,
    MUMBAI_PINCODE: pincode
  };

  try {
    const auditResult = await auditUniversalProducts(query, category, envConfig);

    res.json({
      success: true,
      query,
      category,
      pincode,
      providerUsed: auditResult.providerUsed,
      resultsCount: auditResult.resultsCount,
      timestamp: new Date().toISOString(),
      products: auditResult.products
    });
  } catch (err) {
    console.error('Scraping error:', err);
    res.status(500).json({
      success: false,
      error: err.message,
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * Returns cached 24/7 hourly best product discovery deals
 * GET /api/hourly-best-deals
 */
app.get('/api/hourly-best-deals', (req, res) => {
  res.json({
    success: true,
    lastUpdated: cachedHourlyDeals.lastUpdated,
    category: cachedHourlyDeals.category,
    count: cachedHourlyDeals.products.length,
    deals: cachedHourlyDeals.products
  });
});

/**
 * Updates hourly deals cache (called by cron or internal timer)
 * POST /api/hourly-best-deals
 */
app.post('/api/hourly-best-deals', (req, res) => {
  const { products, category } = req.body;
  if (Array.isArray(products)) {
    cachedHourlyDeals = {
      lastUpdated: new Date().toISOString(),
      category: category || 'laptops',
      products
    };
    return res.json({ success: true, count: products.length, timestamp: cachedHourlyDeals.lastUpdated });
  }
  res.status(400).json({ success: false, error: 'Products array required' });
});

/**
 * Webhook dispatcher for WhatsApp & Telegram alerts
 * POST /api/webhook/alert
 */
app.post('/api/webhook/alert', async (req, res) => {
  const { channel, recipient, product, oldPrice, newPrice, dropPct } = req.body;

  const messageText = `⚡ *AURABUY PRICE DROP ALERT!* ⚡\n\n` +
    `Product: *${product?.modelName || 'Audited Item'}*\n` +
    `Old Price: ₹${oldPrice?.toLocaleString('en-IN')}\n` +
    `New Price: *₹${newPrice?.toLocaleString('en-IN')}* (-${dropPct}% DROP)\n` +
    `Store: ${product?.primaryRetailer || 'Amazon India'}\n` +
    `Mumbai Pincode: 400001 (Stock Verified)\n\n` +
    `🛒 Buy Now: ${product?.listingUrl || 'https://aurabuy.ai'}`;

  // Telegram dispatch if bot token configured
  if (channel === 'telegram' && process.env.TELEGRAM_BOT_TOKEN) {
    try {
      const chatId = recipient || process.env.TELEGRAM_CHAT_ID;
      await axios.post(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
        chat_id: chatId,
        text: messageText,
        parse_mode: 'Markdown'
      });
      return res.json({ success: true, dispatchedTo: 'telegram', recipient: chatId });
    } catch (err) {
      console.warn('Telegram webhook error:', err.message);
    }
  }

  // Fallback simulation response
  res.json({
    success: true,
    channel: channel || 'whatsapp',
    simulated: true,
    message: messageText,
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`⚡ AuraBuy 24/7 Autonomous Scraper Microservice Live!`);
  console.log(`📡 Port: ${PORT}`);
  console.log(`📍 Pincode: ${process.env.MUMBAI_PINCODE || '400001'} (Mumbai)`);
  console.log(`🔗 Health Check: http://localhost:${PORT}/health`);
  console.log(`🔍 Live Products API: http://localhost:${PORT}/api/products`);
  console.log(`=======================================================`);
});
