import { gql } from '@apollo/client';
import type { Product } from './types.js';

export const UPDATE_DEMAND = gql`
  mutation UpdateDemand($id: ID!, $warehouse: String!, $demand: Int!) {
    updateDemand(id: $id, warehouse: $warehouse, demand: $demand) {
      id
      name
      sku
      warehouse
      stock
      demand
    }
  }
`;

export const TRANSFER_STOCK = gql`
  mutation TransferStock($id: ID!, $qty: Int!, $from: String!, $to: String!) {
    transferStock(id: $id, qty: $qty, from: $from, to: $to) {
      id
      name
      sku
      warehouse
      stock
      demand
    }
  }
`;

export interface UpdateDemandData {
  updateDemand: Product;
}

export interface UpdateDemandVariables {
  id: string;
  warehouse: string;
  demand: number;
}

export interface TransferStockData {
  transferStock: Product;
}

export interface TransferStockVariables {
  id: string;
  qty: number;
  from: string;
  to: string;
}
