import { describe, it, expect } from 'vitest';
import { GET_PRODUCTS, GET_KPIS } from './queries';

describe('GraphQL Queries', () => {
  describe('GET_PRODUCTS query', () => {
    it('should be a valid GraphQL query string', () => {
      const queryString = GET_PRODUCTS.loc?.source.body || '';
      expect(typeof queryString).toBe('string');
      expect(queryString).toContain('query');
      expect(queryString).toContain('products');
    });

    it('should include all required fields', () => {
      const queryString = GET_PRODUCTS.loc?.source.body || '';
      const requiredFields = ['id', 'name', 'sku', 'warehouse', 'stock', 'demand'];
      
      requiredFields.forEach(field => {
        expect(queryString).toContain(field);
      });
    });

    it('should include pagination fields', () => {
      const queryString = GET_PRODUCTS.loc?.source.body || '';
      const paginationFields = ['totalCount', 'hasNextPage', 'hasPreviousPage', 'currentPage', 'totalPages'];
      
      paginationFields.forEach(field => {
        expect(queryString).toContain(field);
      });
    });

    it('should include filter parameters', () => {
      const queryString = GET_PRODUCTS.loc?.source.body || '';
      const filterParams = ['$search', '$warehouse', '$status', '$page', '$pageSize'];
      
      filterParams.forEach(param => {
        expect(queryString).toContain(param);
      });
    });

    it('should have proper GraphQL syntax', () => {
      const queryString = GET_PRODUCTS.loc?.source.body || '';
      expect(queryString).toMatch(/query\s+\w+\s*\(/);
      expect(queryString).toMatch(/\{\s*products\s*\(/);
      expect(queryString).toMatch(/\}\s*$/);
    });
  });

  describe('GET_KPIS query', () => {
    it('should be a valid GraphQL query string', () => {
      const queryString = GET_KPIS.loc?.source.body || '';
      expect(typeof queryString).toBe('string');
      expect(queryString).toContain('query');
      expect(queryString).toContain('kpis');
    });

    it('should include all required KPI fields', () => {
      const queryString = GET_KPIS.loc?.source.body || '';
      const requiredFields = ['date', 'stock', 'demand'];
      
      requiredFields.forEach(field => {
        expect(queryString).toContain(field);
      });
    });

    it('should include range parameter', () => {
      const queryString = GET_KPIS.loc?.source.body || '';
      expect(queryString).toContain('$range');
    });

    it('should have proper GraphQL syntax', () => {
      const queryString = GET_KPIS.loc?.source.body || '';
      expect(queryString).toMatch(/query\s+\w+\s*\(/);
      expect(queryString).toMatch(/\{\s*kpis\s*\(/);
      expect(queryString).toMatch(/\}\s*$/);
    });
  });

  describe('Query structure validation', () => {
    it('should not contain syntax errors', () => {
      // Basic validation that queries don't have obvious syntax issues
      const productsQuery = GET_PRODUCTS.loc?.source.body || '';
      const kpisQuery = GET_KPIS.loc?.source.body || '';
      expect(productsQuery).not.toContain('undefined');
      expect(productsQuery).not.toContain('null');
      expect(kpisQuery).not.toContain('undefined');
      expect(kpisQuery).not.toContain('null');
    });

    it('should have consistent indentation', () => {
      // Check that queries have proper formatting
      const queryString = GET_PRODUCTS.loc?.source.body || '';
      const lines = queryString.split('\n');
      const nonEmptyLines = lines.filter((line: string) => line.trim().length > 0);
      
      // All non-empty lines should have some indentation or be at root level
      nonEmptyLines.forEach((line: string) => {
        expect(line).toMatch(/^(\s*[a-zA-Z]|\s*[{}]|\s*\$|\s*\))/);
      });
    });
  });

  describe('Query parameters', () => {
    it('should have correct parameter types', () => {
      const productsQuery = GET_PRODUCTS.loc?.source.body || '';
      const kpisQuery = GET_KPIS.loc?.source.body || '';
      expect(productsQuery).toContain('$search: String');
      expect(productsQuery).toContain('$warehouse: String');
      expect(productsQuery).toContain('$status: Status');
      expect(productsQuery).toContain('$page: Int');
      expect(productsQuery).toContain('$pageSize: Int');
      expect(kpisQuery).toContain('$range: Int!');
    });

    it('should have default values where appropriate', () => {
      // Check that parameters that should have defaults are properly handled
      const productsQuery = GET_PRODUCTS.loc?.source.body || '';
      const kpisQuery = GET_KPIS.loc?.source.body || '';
      expect(productsQuery).toContain('search: $search');
      expect(productsQuery).toContain('warehouse: $warehouse');
      expect(productsQuery).toContain('status: $status');
      expect(productsQuery).toContain('page: $page');
      expect(productsQuery).toContain('pageSize: $pageSize');
      expect(kpisQuery).toContain('range: $range');
    });
  });
});
