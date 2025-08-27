import { readFileSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { logInfo } from '../logger.js';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

// Read initial data
let seedData = JSON.parse(
  readFileSync(join(__dirname, '../data/seed.json'), 'utf-8')
);

// Export function to get current data (for mutations to use)
export const getCurrentData = () => seedData;
export const setCurrentData = (data: any[]) => {
  seedData = data;
};

export type Product = {
  id: string;
  name: string;
  sku: string;
  warehouse: string;
  stock: number;
  demand: number;
};

export type Status = 'HEALTHY' | 'LOW' | 'CRITICAL';

export const getStatus = (stock: number, demand: number): Status => {
  if (stock > demand) return 'HEALTHY';
  if (stock === demand) return 'LOW';
  return 'CRITICAL';
};

export const productsResolver = {
  products: async (
    _: any,
    {
      search,
      warehouse,
      status,
      page = 1,
      pageSize = 10
    }: {
      search?: string;
      warehouse?: string;
      status?: Status;
      page?: number;
      pageSize?: number;
    }
  ) => {
    logInfo('Querying products', { search, warehouse, status, page, pageSize });

    let filteredProducts = [...seedData];

    // Apply search filter
    if (search) {
      const searchLower = search.toLowerCase();
      filteredProducts = filteredProducts.filter(
        (product) =>
          product.name.toLowerCase().includes(searchLower) ||
          product.sku.toLowerCase().includes(searchLower) ||
          product.id.toLowerCase().includes(searchLower)
      );
    }

    // Apply warehouse filter
    if (warehouse) {
      filteredProducts = filteredProducts.filter(
        (product) => product.warehouse === warehouse
      );
    }

    // Apply status filter
    if (status) {
      filteredProducts = filteredProducts.filter(
        (product) => getStatus(product.stock, product.demand) === status
      );
    }

    // Apply pagination
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

    const totalCount = filteredProducts.length;
    const totalPages = Math.ceil(totalCount / pageSize);
    const hasNextPage = page < totalPages;
    const hasPreviousPage = page > 1;

    logInfo('Products query result', {
      total: totalCount,
      returned: paginatedProducts.length,
      page,
      pageSize,
      totalPages
    });

    return {
      products: paginatedProducts,
      totalCount,
      hasNextPage,
      hasPreviousPage,
      currentPage: page,
      totalPages
    };
  },

  warehouses: async () => {
    logInfo('Querying warehouses');
    const warehouses = [...new Set(seedData.map((product: any) => product.warehouse))];
    logInfo('Warehouses query result', { count: warehouses.length });
    return warehouses;
  }
};
