import { readFileSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { logInfo } from '../logger.js';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const seedData = JSON.parse(
  readFileSync(join(__dirname, '../data/seed.json'), 'utf-8')
);

export type KPI = {
  date: string;
  stock: number;
  demand: number;
};

export const kpisResolver = {
  kpis: async (_: any, { range }: { range: number }) => {
    logInfo('Querying KPIs', { range });

    // Calculate base totals from seed data
    const totalStock = seedData.reduce((sum: number, product: any) => sum + product.stock, 0);
    const totalDemand = seedData.reduce((sum: number, product: any) => sum + product.demand, 0);

    // Generate trend data for the specified range
    const kpis: KPI[] = [];
    const today = new Date();

    for (let i = range - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);

      // Add some realistic variation to the trend
      const variation = 0.1; // 10% variation
      const stockVariation = 1 + (Math.random() - 0.5) * variation;
      const demandVariation = 1 + (Math.random() - 0.5) * variation;

      kpis.push({
        date: date.toISOString().split('T')[0],
        stock: Math.round(totalStock * stockVariation),
        demand: Math.round(totalDemand * demandVariation)
      });
    }

    logInfo('KPIs query result', { count: kpis.length, range });
    return kpis;
  }
};
