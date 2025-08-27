export interface Product {
  id: string;
  name: string;
  sku: string;
  warehouse: string;
  stock: number;
  demand: number;
}

export interface KPI {
  date: string;
  stock: number;
  demand: number;
}

export type Status = 'HEALTHY' | 'LOW' | 'CRITICAL';

export interface ProductsFilters {
  search?: string;
  warehouse?: string;
  status?: Status;
  page?: number;
  pageSize?: number;
}

export interface UpdateDemandInput {
  id: string;
  demand: number;
}

export interface TransferStockInput {
  id: string;
  qty: number;
  from: string;
  to: string;
}
