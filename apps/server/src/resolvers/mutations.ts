import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { logInfo } from '../logger.js';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const seedDataPath = join(__dirname, '../data/seed.json');

let seedData = JSON.parse(readFileSync(seedDataPath, 'utf-8'));

const saveData = () => {
  writeFileSync(seedDataPath, JSON.stringify(seedData, null, 2));
};

export const mutationsResolver = {
  updateDemand: async (_: any, { id, demand }: { id: string; demand: number }) => {
    logInfo('Updating demand', { id, demand });

    if (demand < 0) {
      throw new Error('Demand cannot be negative');
    }

    const productIndex = seedData.findIndex((product: any) => product.id === id);
    if (productIndex === -1) {
      throw new Error('Product not found');
    }

    const product = { ...seedData[productIndex], demand };
    seedData[productIndex] = product;
    saveData();

    logInfo('Demand updated successfully', { id, demand });
    return product;
  },

  transferStock: async (
    _: any,
    { id, qty, from, to }: { id: string; qty: number; from: string; to: string }
  ) => {
    logInfo('Transferring stock', { id, qty, from, to });

    if (qty <= 0) {
      throw new Error('Transfer quantity must be positive');
    }

    const productIndex = seedData.findIndex((product: any) => product.id === id);
    if (productIndex === -1) {
      throw new Error('Product not found');
    }

    const product = seedData[productIndex];
    if (product.warehouse !== from) {
      throw new Error('Product is not in the specified source warehouse');
    }

    if (product.stock < qty) {
      throw new Error('Insufficient stock for transfer');
    }

    // For this mock implementation, we'll just update the warehouse
    // In a real system, you'd have separate inventory records per warehouse
    const updatedProduct = { ...product, warehouse: to, stock: product.stock - qty };
    seedData[productIndex] = updatedProduct;
    saveData();

    logInfo('Stock transferred successfully', { id, qty, from, to });
    return updatedProduct;
  }
};
