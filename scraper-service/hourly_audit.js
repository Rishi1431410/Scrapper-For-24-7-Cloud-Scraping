import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { auditUniversalProducts } from './scraper_engine.js';

dotenv.config();

const CATEGORIES_TO_AUDIT = [
  { category: 'laptops', query: 'gaming laptop rtx 4060' },
  { category: 'smartphones', query: 'flagship 5g smartphone' },
  { category: 'smart_tvs', query: '55 inch 4k 120hz oled tv' },
  { category: 'headphones', query: 'noise cancelling wireless headphones anc' }
];

async function runHourlySurveillanceSweep() {
  console.log(`[${new Date().toISOString()}] 🚀 Initiating AuraBuy 24/7 Hourly Surveillance Sweep...`);
  const aggregatedDeals = [];

  for (const item of CATEGORIES_TO_AUDIT) {
    console.log(`🔍 Auditing category: ${item.category} (${item.query})...`);
    try {
      const result = await auditUniversalProducts(item.query, item.category, process.env);
      if (result.products && result.products.length > 0) {
        aggregatedDeals.push(...result.products);
        console.log(`  ✓ Found ${result.products.length} audited models via ${result.providerUsed}`);
      }
    } catch (err) {
      console.warn(`  ✕ Error auditing ${item.category}: ${err.message}`);
    }
  }

  const payload = {
    generatedAt: new Date().toISOString(),
    totalAudited: aggregatedDeals.length,
    pincode: process.env.MUMBAI_PINCODE || '400001',
    deals: aggregatedDeals
  };

  const outputPath = path.resolve('best_deals.json');
  fs.writeFileSync(outputPath, JSON.stringify(payload, null, 2));
  console.log(`✅ Hourly audit complete! Saved ${aggregatedDeals.length} deals to ${outputPath}`);
}

runHourlySurveillanceSweep().catch(console.error);
