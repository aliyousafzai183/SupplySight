import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ProductsTable } from './ProductsTable';
import type { Product } from '../../features/products/types';

// Mock the Drawer component
vi.mock('./Drawer', () => ({
  Drawer: ({ isOpen, onClose, product }: any) => 
    isOpen ? (
      <div data-testid="drawer" data-product-id={product?.id}>
        <button onClick={onClose}>Close</button>
        <div>Product Details: {product?.name}</div>
      </div>
    ) : null,
}));

describe('ProductsTable', () => {
  const mockProducts: Product[] = [
    {
      id: 'P-1001',
      name: 'Test Product 1',
      sku: 'TEST-001',
      warehouse: 'BLR-A',
      stock: 100,
      demand: 80,
    },
    {
      id: 'P-1002',
      name: 'Test Product 2',
      sku: 'TEST-002',
      warehouse: 'DEL-B',
      stock: 50,
      demand: 100,
    },
  ];

  const defaultProps = {
    data: {
      products: mockProducts,
      totalCount: mockProducts.length,
      hasNextPage: false,
      hasPreviousPage: false,
      currentPage: 1,
      totalPages: 1,
    },
    loading: false,
    onProductClick: vi.fn(),
    onPageChange: vi.fn(),
  };

  describe('Basic rendering', () => {
    it('should render table headers', () => {
      render(<ProductsTable {...defaultProps} />);
      
      expect(screen.getByText('Product')).toBeInTheDocument();
      expect(screen.getByText('SKU')).toBeInTheDocument();
      expect(screen.getByText('Warehouse')).toBeInTheDocument();
      expect(screen.getByText('Stock')).toBeInTheDocument();
      expect(screen.getByText('Demand')).toBeInTheDocument();
      expect(screen.getByText('Status')).toBeInTheDocument();
    });

    it('should render product rows', () => {
      render(<ProductsTable {...defaultProps} />);
      
      expect(screen.getByText('Test Product 1')).toBeInTheDocument();
      expect(screen.getByText('Test Product 2')).toBeInTheDocument();
      expect(screen.getByText('TEST-001')).toBeInTheDocument();
      expect(screen.getByText('TEST-002')).toBeInTheDocument();
    });

    it('should render warehouse information', () => {
      render(<ProductsTable {...defaultProps} />);
      
      expect(screen.getByText('BLR-A')).toBeInTheDocument();
      expect(screen.getByText('DEL-B')).toBeInTheDocument();
    });

    it('should render stock and demand values', () => {
      render(<ProductsTable {...defaultProps} />);
      
      expect(screen.getAllByText('100')).toHaveLength(2);
      expect(screen.getByText('80')).toBeInTheDocument();
      expect(screen.getByText('50')).toBeInTheDocument();
    });
  });

  describe('Status display', () => {
    it('should render status pills', () => {
      render(<ProductsTable {...defaultProps} />);
      
      // Should render status pills for each product
      const statusPills = screen.getAllByRole('status');
      expect(statusPills.length).toBe(2);
    });

    it('should show correct status for healthy products', () => {
      const healthyProducts = [
        { ...mockProducts[0], stock: 100, demand: 80 },
      ];
      
      render(<ProductsTable {...defaultProps} data={{ ...defaultProps.data, products: healthyProducts }} />);
      
      expect(screen.getByText('Healthy')).toBeInTheDocument();
    });

    it('should show correct status for low stock products', () => {
      const lowStockProducts = [
        { ...mockProducts[0], stock: 80, demand: 80 },
      ];
      
      render(<ProductsTable {...defaultProps} data={{ ...defaultProps.data, products: lowStockProducts }} />);
      
      expect(screen.getByText('Low')).toBeInTheDocument();
    });

    it('should show correct status for critical products', () => {
      const criticalProducts = [
        { ...mockProducts[0], stock: 20, demand: 80 },
      ];
      
      render(<ProductsTable {...defaultProps} data={{ ...defaultProps.data, products: criticalProducts }} />);
      
      expect(screen.getByText('Critical')).toBeInTheDocument();
    });
  });

  describe('Actions', () => {
    it('should make rows clickable', () => {
      render(<ProductsTable {...defaultProps} />);
      
      const rows = screen.getAllByRole('row');
      // Header row + 2 product rows
      expect(rows.length).toBe(3);
    });

    it('should call onProductClick when row is clicked', () => {
      const onProductClick = vi.fn();
      render(<ProductsTable {...defaultProps} onProductClick={onProductClick} />);
      
      const productRows = screen.getAllByRole('row').slice(1); // Skip header row
      fireEvent.click(productRows[0]);
      
      expect(onProductClick).toHaveBeenCalledWith(mockProducts[0]);
    });
  });

  describe('Loading state', () => {
    it('should show loading skeleton when loading', () => {
      render(<ProductsTable {...defaultProps} loading={true} />);
      
      // Should not show actual product data
      expect(screen.queryByText('Test Product 1')).not.toBeInTheDocument();
      expect(screen.queryByText('Test Product 2')).not.toBeInTheDocument();
      
      // Should show skeleton elements
      const skeletonElements = document.querySelectorAll('.animate-pulse');
      expect(skeletonElements.length).toBeGreaterThan(0);
    });

    it('should show actual data when not loading', () => {
      render(<ProductsTable {...defaultProps} loading={false} />);
      
      expect(screen.getByText('Test Product 1')).toBeInTheDocument();
      expect(screen.getByText('Test Product 2')).toBeInTheDocument();
    });
  });

  describe('Empty state', () => {
    it('should show empty state when no products', () => {
      render(<ProductsTable {...defaultProps} data={{ ...defaultProps.data, products: [] }} />);
      
      expect(screen.getByText('No Products Found')).toBeInTheDocument();
      expect(screen.getByText('We couldn\'t find any products matching your current filters.')).toBeInTheDocument();
    });

    it('should not show empty state when products exist', () => {
      render(<ProductsTable {...defaultProps} />);
      
      expect(screen.queryByText('No Products Found')).not.toBeInTheDocument();
    });
  });

  describe('Table structure', () => {
    it('should have proper table structure', () => {
      render(<ProductsTable {...defaultProps} />);
      
      const table = screen.getByRole('table');
      expect(table).toBeInTheDocument();
      
      const thead = table.querySelector('thead');
      expect(thead).toBeInTheDocument();
      
      const tbody = table.querySelector('tbody');
      expect(tbody).toBeInTheDocument();
    });

    it('should have correct number of rows', () => {
      render(<ProductsTable {...defaultProps} />);
      
      const rows = screen.getAllByRole('row');
      // Header row + 2 product rows
      expect(rows.length).toBe(3);
    });
  });

  describe('Accessibility', () => {
    it('should have proper table headers', () => {
      render(<ProductsTable {...defaultProps} />);
      
      const headers = screen.getAllByRole('columnheader');
      expect(headers.length).toBe(6);
    });

    it('should have proper row structure', () => {
      render(<ProductsTable {...defaultProps} />);
      
      const rows = screen.getAllByRole('row');
      rows.forEach(row => {
        expect(row.tagName).toBe('TR');
      });
    });

    it('should have proper table structure', () => {
      render(<ProductsTable {...defaultProps} />);
      
      const rows = screen.getAllByRole('row');
      rows.forEach(row => {
        expect(row.tagName).toBe('TR');
      });
    });
  });

  describe('Responsive design', () => {
    it('should have responsive table classes', () => {
      render(<ProductsTable {...defaultProps} />);
      
      const table = screen.getByRole('table');
      expect(table).toHaveClass('w-full');
    });

    it('should have proper container classes', () => {
      render(<ProductsTable {...defaultProps} />);
      
      const container = screen.getByRole('table').closest('.table-container');
      expect(container).toBeInTheDocument();
    });
  });

  describe('Edge cases', () => {
    it('should handle products with missing data', () => {
      const incompleteProducts = [
        { ...mockProducts[0], name: undefined, sku: undefined },
      ] as any;
      
      render(<ProductsTable {...defaultProps} data={{ ...defaultProps.data, products: incompleteProducts }} />);
      
      // Should still render the row
      expect(screen.getByRole('table')).toBeInTheDocument();
    });

    it('should handle very long product names', () => {
      const longNameProducts = [
        { ...mockProducts[0], name: 'This is a very long product name that should be handled properly in the table layout' },
      ];
      
      render(<ProductsTable {...defaultProps} data={{ ...defaultProps.data, products: longNameProducts }} />);
      
      expect(screen.getByText('This is a very long product name that should be handled properly in the table layout')).toBeInTheDocument();
    });

    it('should handle zero values', () => {
      const zeroProducts = [
        { ...mockProducts[0], stock: 0, demand: 0 },
      ];
      
      render(<ProductsTable {...defaultProps} data={{ ...defaultProps.data, products: zeroProducts }} />);
      
      expect(screen.getAllByText('0')).toHaveLength(2);
    });
  });
});
