import { gql } from '@apollo/client';
import type { KPI, ProductConnection } from '../types';

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
      products {
        id
        name
        sku
        warehouse
        stock
        demand
      }
      totalCount
      hasNextPage
      hasPreviousPage
      currentPage
      totalPages
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
  products: ProductConnection;
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
