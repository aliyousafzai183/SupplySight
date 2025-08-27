import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Filters } from './Filters';
import type { ProductsFilters } from '../../features/products/types';

describe('Filters', () => {
  const defaultProps = {
    filters: {
      search: '',
      warehouse: '',
      status: undefined,
      page: 1,
      pageSize: 10,
    } as ProductsFilters,
    onFiltersChange: vi.fn(),
    warehouses: ['BLR-A', 'DEL-B', 'PNQ-C'],
    loading: false,
  };

  describe('Basic rendering', () => {
    it('should render all filter inputs', () => {
      render(<Filters {...defaultProps} />);
      
      expect(screen.getByLabelText(/search products/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/warehouse/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/status/i)).toBeInTheDocument();
    });

    it('should render action buttons', () => {
      render(<Filters {...defaultProps} />);
      
      expect(screen.getByRole('button', { name: /reset/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /apply filters/i })).toBeInTheDocument();
    });
  });

  describe('Search functionality', () => {
    it('should update search input value', () => {
      render(<Filters {...defaultProps} />);
      
      const searchInput = screen.getByLabelText(/search products/i);
      fireEvent.change(searchInput, { target: { value: 'test search' } });
      
      expect(searchInput).toHaveValue('test search');
    });

    it('should have correct placeholder text', () => {
      render(<Filters {...defaultProps} />);
      
      const searchInput = screen.getByLabelText(/search products/i);
      expect(searchInput).toHaveAttribute('placeholder', 'Search by name, SKU, or warehouse...');
    });
  });

  describe('Warehouse filter', () => {
    it('should render warehouse options', () => {
      render(<Filters {...defaultProps} />);
      
      const warehouseSelect = screen.getByLabelText(/warehouse/i);
      expect(warehouseSelect).toBeInTheDocument();
      
      // Check for default option
      expect(screen.getByText('All Warehouses')).toBeInTheDocument();
    });

    it('should render all warehouse options', () => {
      render(<Filters {...defaultProps} />);
      
      expect(screen.getByText('BLR-A')).toBeInTheDocument();
      expect(screen.getByText('DEL-B')).toBeInTheDocument();
      expect(screen.getByText('PNQ-C')).toBeInTheDocument();
    });

    it('should update warehouse selection', () => {
      render(<Filters {...defaultProps} />);
      
      const warehouseSelect = screen.getByLabelText(/warehouse/i);
      fireEvent.change(warehouseSelect, { target: { value: 'BLR-A' } });
      
      expect(warehouseSelect).toHaveValue('BLR-A');
    });
  });

  describe('Status filter', () => {
    it('should render status options', () => {
      render(<Filters {...defaultProps} />);
      
      const statusSelect = screen.getByLabelText(/status/i);
      expect(statusSelect).toBeInTheDocument();
      
      // Check for default option
      expect(screen.getByText('All Status')).toBeInTheDocument();
    });

    it('should render all status options', () => {
      render(<Filters {...defaultProps} />);
      
      expect(screen.getByText('Healthy')).toBeInTheDocument();
      expect(screen.getByText('Low')).toBeInTheDocument();
      expect(screen.getByText('Critical')).toBeInTheDocument();
    });

    it('should update status selection', () => {
      render(<Filters {...defaultProps} />);
      
      const statusSelect = screen.getByLabelText(/status/i);
      fireEvent.change(statusSelect, { target: { value: 'HEALTHY' } });
      
      expect(statusSelect).toHaveValue('HEALTHY');
    });
  });

  describe('Filter interactions', () => {
    it('should call onFiltersChange when Apply Filters is clicked', () => {
      const onFiltersChange = vi.fn();
      render(<Filters {...defaultProps} onFiltersChange={onFiltersChange} />);
      
      fireEvent.click(screen.getByRole('button', { name: /apply filters/i }));
      
      expect(onFiltersChange).toHaveBeenCalledWith({
        search: '',
        warehouse: '',
        status: undefined,
        page: 1,
        pageSize: 10,
      });
    });

    it('should call onFiltersChange with updated values when filters are changed', () => {
      const onFiltersChange = vi.fn();
      render(<Filters {...defaultProps} onFiltersChange={onFiltersChange} />);
      
      const searchInput = screen.getByLabelText(/search products/i);
      fireEvent.change(searchInput, { target: { value: 'test' } });
      
      fireEvent.click(screen.getByRole('button', { name: /apply filters/i }));
      
      expect(onFiltersChange).toHaveBeenCalledWith({
        search: 'test',
        warehouse: '',
        status: undefined,
        page: 1,
        pageSize: 10,
      });
    });

    it('should reset filters when Reset button is clicked', () => {
      const onFiltersChange = vi.fn();
      render(<Filters {...defaultProps} onFiltersChange={onFiltersChange} />);
      
      fireEvent.click(screen.getByRole('button', { name: /reset/i }));
      
      expect(onFiltersChange).toHaveBeenCalledWith({
        search: '',
        warehouse: '',
        status: undefined,
        page: 1,
        pageSize: 10,
      });
    });
  });

  describe('Loading state', () => {
    it('should disable inputs when loading', () => {
      render(<Filters {...defaultProps} loading={true} />);
      
      const searchInput = screen.getByLabelText(/search products/i);
      const warehouseSelect = screen.getByLabelText(/warehouse/i);
      const statusSelect = screen.getByLabelText(/status/i);
      
      expect(searchInput).toBeDisabled();
      expect(warehouseSelect).toBeDisabled();
      expect(statusSelect).toBeDisabled();
    });

    it('should enable inputs when not loading', () => {
      render(<Filters {...defaultProps} loading={false} />);
      
      const searchInput = screen.getByLabelText(/search products/i);
      const warehouseSelect = screen.getByLabelText(/warehouse/i);
      const statusSelect = screen.getByLabelText(/status/i);
      
      expect(searchInput).not.toBeDisabled();
      expect(warehouseSelect).not.toBeDisabled();
      expect(statusSelect).not.toBeDisabled();
    });
  });

  describe('Accessibility', () => {
    it('should have proper labels for all inputs', () => {
      render(<Filters {...defaultProps} />);
      
      expect(screen.getByLabelText(/search products/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/warehouse/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/status/i)).toBeInTheDocument();
    });

    it('should have proper button types', () => {
      render(<Filters {...defaultProps} />);
      
      const resetButton = screen.getByRole('button', { name: /reset/i });
      const applyButton = screen.getByRole('button', { name: /apply filters/i });
      
      expect(resetButton).toHaveAttribute('type', 'button');
      expect(applyButton).toHaveAttribute('type', 'button');
    });
  });

  describe('Edge cases', () => {
    it('should handle empty warehouse list', () => {
      render(<Filters {...defaultProps} warehouses={[]} />);
      
      const warehouseSelect = screen.getByLabelText(/warehouse/i);
      expect(warehouseSelect).toBeInTheDocument();
      expect(screen.getByText('All Warehouses')).toBeInTheDocument();
    });

    it('should handle initial filter values', () => {
      const initialFilters = {
        search: 'initial search',
        warehouse: 'BLR-A',
        status: 'HEALTHY' as const,
        page: 2,
        pageSize: 20,
      };
      
      render(<Filters {...defaultProps} filters={initialFilters} />);
      
      expect(screen.getByLabelText(/search products/i)).toHaveValue('initial search');
      expect(screen.getByLabelText(/warehouse/i)).toHaveValue('BLR-A');
      expect(screen.getByLabelText(/status/i)).toHaveValue('HEALTHY');
    });
  });
});
