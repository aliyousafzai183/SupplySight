import { gql } from '@apollo/client';
import type { Product, KPI } from './types.js';

export const GET_PRODUCTS = gql`
  query GetProducts(
    $search: String
    $warehouse: String
    $status: Status
    $page: Int
    $pageSize: Int
  ) {
    products(
      search: $search
      warehouse: $warehouse
      status: $status
      page: $page
      pageSize: $pageSize
    ) {
      id
      name
      sku
      warehouse
      stock
      demand
    }
  }
`;

export const GET_WAREHOUSES = gql`
  query GetWarehouses {
    warehouses
  }
`;

export const GET_KPIS = gql`
  query GetKPIs($range: Int!) {
    kpis(range: $range) {
      date
      stock
      demand
    }
  }
`;

export interface GetProductsData {
  products: Product[];
}

export interface GetProductsVariables {
  search?: string;
  warehouse?: string;
  status?: 'HEALTHY' | 'LOW' | 'CRITICAL';
  page?: number;
  pageSize?: number;
}

export interface GetWarehousesData {
  warehouses: string[];
}

export interface GetKPIsData {
  kpis: KPI[];
}

export interface GetKPIsVariables {
  range: number;
}
