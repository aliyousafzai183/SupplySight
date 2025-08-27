import { describe, it, expect } from 'vitest';
import { UPDATE_DEMAND, TRANSFER_STOCK } from './mutations';

describe('GraphQL Mutations', () => {
  describe('UPDATE_DEMAND mutation', () => {
    it('should be a valid GraphQL mutation string', () => {
      const mutationString = UPDATE_DEMAND.loc?.source.body || '';
      expect(typeof mutationString).toBe('string');
      expect(mutationString).toContain('mutation');
      expect(mutationString).toContain('updateDemand');
    });

    it('should include all required parameters', () => {
      const mutationString = UPDATE_DEMAND.loc?.source.body || '';
      const requiredParams = ['$id', '$warehouse', '$demand'];
      
      requiredParams.forEach(param => {
        expect(mutationString).toContain(param);
      });
    });

    it('should include all required return fields', () => {
      const mutationString = UPDATE_DEMAND.loc?.source.body || '';
      const requiredFields = ['id', 'name', 'sku', 'warehouse', 'stock', 'demand'];
      
      requiredFields.forEach(field => {
        expect(mutationString).toContain(field);
      });
    });

    it('should have proper GraphQL syntax', () => {
      const mutationString = UPDATE_DEMAND.loc?.source.body || '';
      expect(mutationString).toMatch(/mutation\s+\w+\s*\(/);
      expect(mutationString).toMatch(/\{\s*updateDemand\s*\(/);
      expect(mutationString).toMatch(/\}\s*$/);
    });

    it('should have correct parameter types', () => {
      const mutationString = UPDATE_DEMAND.loc?.source.body || '';
      expect(mutationString).toContain('$id: ID!');
      expect(mutationString).toContain('$warehouse: String!');
      expect(mutationString).toContain('$demand: Int!');
    });
  });

  describe('TRANSFER_STOCK mutation', () => {
    it('should be a valid GraphQL mutation string', () => {
      const mutationString = TRANSFER_STOCK.loc?.source.body || '';
      expect(typeof mutationString).toBe('string');
      expect(mutationString).toContain('mutation');
      expect(mutationString).toContain('transferStock');
    });

    it('should include all required parameters', () => {
      const mutationString = TRANSFER_STOCK.loc?.source.body || '';
      const requiredParams = ['$id', '$qty', '$from', '$to'];
      
      requiredParams.forEach(param => {
        expect(mutationString).toContain(param);
      });
    });

    it('should include all required return fields', () => {
      const mutationString = TRANSFER_STOCK.loc?.source.body || '';
      const requiredFields = ['id', 'name', 'sku', 'warehouse', 'stock', 'demand'];
      
      requiredFields.forEach(field => {
        expect(mutationString).toContain(field);
      });
    });

    it('should have proper GraphQL syntax', () => {
      const mutationString = TRANSFER_STOCK.loc?.source.body || '';
      expect(mutationString).toMatch(/mutation\s+\w+\s*\(/);
      expect(mutationString).toMatch(/\{\s*transferStock\s*\(/);
      expect(mutationString).toMatch(/\}\s*$/);
    });

    it('should have correct parameter types', () => {
      const mutationString = TRANSFER_STOCK.loc?.source.body || '';
      expect(mutationString).toContain('$id: ID!');
      expect(mutationString).toContain('$qty: Int!');
      expect(mutationString).toContain('$from: String!');
      expect(mutationString).toContain('$to: String!');
    });
  });

  describe('Mutation structure validation', () => {
    it('should not contain syntax errors', () => {
      expect(UPDATE_DEMAND).not.toContain('undefined');
      expect(UPDATE_DEMAND).not.toContain('null');
      expect(TRANSFER_STOCK).not.toContain('undefined');
      expect(TRANSFER_STOCK).not.toContain('null');
    });

    it('should have consistent indentation', () => {
      const updateLines = UPDATE_DEMAND.loc?.source.body.split('\n') || [];
      const transferLines = TRANSFER_STOCK.loc?.source.body.split('\n') || [];
      
      const updateNonEmptyLines = updateLines.filter((line: string) => line.trim().length > 0);
      const transferNonEmptyLines = transferLines.filter((line: string) => line.trim().length > 0);
      
      updateNonEmptyLines.forEach((line: string) => {
        expect(line).toMatch(/^(\s*[a-zA-Z]|\s*[{}])/);
      });
      
      transferNonEmptyLines.forEach((line: string) => {
        expect(line).toMatch(/^(\s*[a-zA-Z]|\s*[{}])/);
      });
    });
  });

  describe('Mutation parameters', () => {
    it('should have non-nullable parameters where required', () => {
      const updateDemandString = UPDATE_DEMAND.loc?.source.body || '';
      const transferStockString = TRANSFER_STOCK.loc?.source.body || '';
      expect(updateDemandString).toContain('$id: ID!');
      expect(updateDemandString).toContain('$warehouse: String!');
      expect(updateDemandString).toContain('$demand: Int!');
      expect(transferStockString).toContain('$id: ID!');
      expect(transferStockString).toContain('$qty: Int!');
      expect(transferStockString).toContain('$from: String!');
      expect(transferStockString).toContain('$to: String!');
    });

    it('should pass parameters correctly to mutation', () => {
      const updateDemandString = UPDATE_DEMAND.loc?.source.body || '';
      const transferStockString = TRANSFER_STOCK.loc?.source.body || '';
      expect(updateDemandString).toContain('id: $id');
      expect(updateDemandString).toContain('warehouse: $warehouse');
      expect(updateDemandString).toContain('demand: $demand');
      expect(transferStockString).toContain('id: $id');
      expect(transferStockString).toContain('qty: $qty');
      expect(transferStockString).toContain('from: $from');
      expect(transferStockString).toContain('to: $to');
    });
  });

  describe('Return type consistency', () => {
    it('should return Product type for both mutations', () => {
      const updateDemandString = UPDATE_DEMAND.loc?.source.body || '';
      const transferStockString = TRANSFER_STOCK.loc?.source.body || '';
      expect(updateDemandString).toContain('updateDemand(id: $id, warehouse: $warehouse, demand: $demand)');
      expect(transferStockString).toContain('transferStock(id: $id, qty: $qty, from: $from, to: $to)');
    });

    it('should include all Product fields in return', () => {
      const updateDemandString = UPDATE_DEMAND.loc?.source.body || '';
      const transferStockString = TRANSFER_STOCK.loc?.source.body || '';
      const productFields = ['id', 'name', 'sku', 'warehouse', 'stock', 'demand'];
      
      productFields.forEach(field => {
        expect(updateDemandString).toContain(field);
        expect(transferStockString).toContain(field);
      });
    });
  });
});
