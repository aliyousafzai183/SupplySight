import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { logInfo } from '../logger.js';
import { getCurrentData, setCurrentData } from './products.js';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const seedDataPath = join(__dirname, '../data/seed.json');

const saveData = () => {
  const currentData = getCurrentData();
  writeFileSync(seedDataPath, JSON.stringify(currentData, null, 2));
};

export const mutationsResolver = {
  updateDemand: async (_: any, { id, warehouse, demand }: { id: string; warehouse: string; demand: number }) => {
    logInfo('Updating demand', { id, warehouse, demand });

    if (demand < 0) {
      throw new Error('Demand cannot be negative');
    }

    const currentData = getCurrentData();
    const productIndex = currentData.findIndex((product: any) => product.id === id && product.warehouse === warehouse);
    if (productIndex === -1) {
      throw new Error('Product not found');
    }

    const product = { ...currentData[productIndex], demand };
    currentData[productIndex] = product;
    setCurrentData(currentData);
    saveData();

    logInfo('Demand updated successfully', { id, warehouse, demand });
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

    const currentData = getCurrentData();
    const sourceProductIndex = currentData.findIndex((product: any) => product.id === id && product.warehouse === from);
    if (sourceProductIndex === -1) {
      // Find the actual location of the product
      const actualProduct = currentData.find((product: any) => product.id === id);
      if (actualProduct) {
        throw new Error(`Product ${id} is in warehouse ${actualProduct.warehouse}, not ${from}`);
      } else {
        throw new Error(`Product ${id} not found`);
      }
    }

    const sourceProduct = currentData[sourceProductIndex];
    if (sourceProduct.stock < qty) {
      throw new Error('Insufficient stock for transfer');
    }

    // Check if product already exists in target warehouse
    const targetProductIndex = currentData.findIndex((product: any) => product.id === id && product.warehouse === to);
    
    if (targetProductIndex !== -1) {
      // Product exists in target warehouse - add to existing stock
      const targetProduct = currentData[targetProductIndex];
      currentData[targetProductIndex] = {
        ...targetProduct,
        stock: targetProduct.stock + qty
      };
      logInfo('Added to existing product in target warehouse', { 
        warehouse: to, 
        oldStock: targetProduct.stock, 
        newStock: targetProduct.stock + qty 
      });
    } else {
      // Product doesn't exist in target warehouse - create new record
      const newProduct = {
        ...sourceProduct,
        warehouse: to,
        stock: qty
      };
      currentData.push(newProduct);
      logInfo('Created new product in target warehouse', { 
        warehouse: to, 
        stock: qty 
      });
    }

    // Reduce stock from source warehouse
    const oldSourceStock = sourceProduct.stock;
    currentData[sourceProductIndex] = {
      ...sourceProduct,
      stock: sourceProduct.stock - qty
    };
    
    logInfo('Reduced stock in source warehouse', { 
      warehouse: from, 
      oldStock: oldSourceStock, 
      newStock: sourceProduct.stock - qty 
    });

    setCurrentData(currentData);
    saveData();

    logInfo('Stock transferred successfully', { id, qty, from, to });
    return currentData[sourceProductIndex]; // Return the updated source product
  }
};
