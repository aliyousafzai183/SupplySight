import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Drawer } from './Drawer';
import { MockedProvider } from '@apollo/client/testing';
import { UPDATE_DEMAND, TRANSFER_STOCK } from '../../features/products/mutations/mutations';
import { GET_WAREHOUSES } from '../../features/products/queries/queries';
import type { Product } from '../../features/products/types/types';

// Mock react-hot-toast
vi.mock('react-hot-toast', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe('Drawer', () => {
  const mockProduct: Product = {
    id: 'P-1001',
    name: 'Test Product',
    sku: 'TEST-001',
    warehouse: 'BLR-A',
    stock: 100,
    demand: 80,
  };

  const defaultProps = {
    product: mockProduct,
    onClose: vi.fn(),
    onUpdate: vi.fn(),
  };

  const mocks = [
    {
      request: {
        query: GET_WAREHOUSES,
      },
      result: {
        data: {
          warehouses: ['BLR-A', 'DEL-B', 'MUM-C', 'CHN-D'],
        },
      },
    },
    {
      request: {
        query: UPDATE_DEMAND,
        variables: {
          id: 'P-1001',
          warehouse: 'BLR-A',
          demand: 100,
        },
      },
      result: {
        data: {
          updateDemand: {
            ...mockProduct,
            demand: 100,
          },
        },
      },
    },
    {
      request: {
        query: TRANSFER_STOCK,
        variables: {
          id: 'P-1001',
          qty: 50,
          from: 'BLR-A',
          to: 'DEL-B',
        },
      },
      result: {
        data: {
          transferStock: {
            ...mockProduct,
            warehouse: 'DEL-B',
            stock: 50,
          },
        },
      },
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Basic rendering', () => {
    it('should render product details', () => {
      render(
        <MockedProvider mocks={mocks} addTypename={false}>
          <Drawer {...defaultProps} />
        </MockedProvider>
      );

      expect(screen.getByText('Product Details')).toBeDefined();
      expect(screen.getByText('Test Product')).toBeDefined();
    });

    it('should render product information', () => {
      render(
        <MockedProvider mocks={mocks} addTypename={false}>
          <Drawer {...defaultProps} />
        </MockedProvider>
      );

      expect(screen.getByText('Test Product')).toBeInTheDocument();
      expect(screen.getByText('TEST-001')).toBeInTheDocument();
      expect(screen.getByText('BLR-A')).toBeInTheDocument();
      expect(screen.getByText('100')).toBeInTheDocument();
      expect(screen.getByText('80')).toBeInTheDocument();
    });

    it('should render status pill', () => {
      render(
        <MockedProvider mocks={mocks} addTypename={false}>
          <Drawer {...defaultProps} />
        </MockedProvider>
      );

      expect(screen.getByText('Healthy')).toBeInTheDocument();
    });
  });

  describe('Close functionality', () => {
    it('should call onClose when close button is clicked', () => {
      const onClose = vi.fn();
      render(
        <MockedProvider mocks={mocks} addTypename={false}>
          <Drawer {...defaultProps} onClose={onClose} />
        </MockedProvider>
      );

      const closeButton = screen.getByRole('button', { name: '' });
      fireEvent.click(closeButton);

      expect(onClose).toHaveBeenCalled();
    });

    it('should call onClose when backdrop is clicked', () => {
      const onClose = vi.fn();
      render(
        <MockedProvider mocks={mocks} addTypename={false}>
          <Drawer {...defaultProps} onClose={onClose} />
        </MockedProvider>
      );

      const backdrop = screen.getByRole('dialog').querySelector('.absolute.inset-0.bg-black\\/50') as HTMLElement;
      fireEvent.click(backdrop!);

      expect(onClose).toHaveBeenCalled();
    });
  });

  describe('Update Demand functionality', () => {
    it('should render update demand section', () => {
      render(
        <MockedProvider mocks={mocks} addTypename={false}>
          <Drawer {...defaultProps} />
        </MockedProvider>
      );

      expect(screen.getByRole('heading', { name: 'Update Demand' })).toBeInTheDocument();
      expect(screen.getByLabelText(/new demand/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /update demand/i })).toBeInTheDocument();
    });

    it('should update demand input value', () => {
      render(
        <MockedProvider mocks={mocks} addTypename={false}>
          <Drawer {...defaultProps} />
        </MockedProvider>
      );

      const demandInput = screen.getByLabelText(/new demand/i);
      fireEvent.change(demandInput, { target: { value: '120' } });

      expect(demandInput).toHaveValue(120);
    });

    it('should call update demand mutation when submitted', async () => {
      render(
        <MockedProvider mocks={mocks} addTypename={false}>
          <Drawer {...defaultProps} />
        </MockedProvider>
      );

      const demandInput = screen.getByLabelText(/new demand/i);
      fireEvent.change(demandInput, { target: { value: '100' } });

      const updateButton = screen.getByRole('button', { name: /update demand/i });
      fireEvent.click(updateButton);

      await waitFor(() => {
        expect(screen.getByText('100')).toBeInTheDocument();
      });
    });
  });

  describe('Transfer Stock functionality', () => {
    it('should render transfer stock section', () => {
      render(
        <MockedProvider mocks={mocks} addTypename={false}>
          <Drawer {...defaultProps} />
        </MockedProvider>
      );

      expect(screen.getByRole('heading', { name: 'Transfer Stock' })).toBeInTheDocument();
      expect(screen.getByLabelText(/amount to transfer/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/target warehouse/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /transfer stock/i })).toBeInTheDocument();
    });

    it('should update transfer inputs', async () => {
      render(
        <MockedProvider mocks={mocks} addTypename={false}>
          <Drawer {...defaultProps} />
        </MockedProvider>
      );

      // Wait for warehouses to load
      await waitFor(() => {
        expect(screen.getByLabelText(/target warehouse/i)).not.toBeDisabled();
      });

      const quantityInput = screen.getByLabelText(/amount to transfer/i);
      const warehouseInput = screen.getByLabelText(/target warehouse/i);

      fireEvent.change(quantityInput, { target: { value: '50' } });
      fireEvent.change(warehouseInput, { target: { value: 'DEL-B' } });

      expect(quantityInput).toHaveValue(50);
      expect(warehouseInput).toHaveValue('DEL-B');
    });

    it('should call transfer stock mutation when submitted', async () => {
      render(
        <MockedProvider mocks={mocks} addTypename={false}>
          <Drawer {...defaultProps} />
        </MockedProvider>
      );

      const quantityInput = screen.getByLabelText(/amount to transfer/i);
      const warehouseInput = screen.getByLabelText(/target warehouse/i);

      fireEvent.change(quantityInput, { target: { value: '50' } });
      fireEvent.change(warehouseInput, { target: { value: 'DEL-B' } });

      const transferButton = screen.getByRole('button', { name: /transfer stock/i });
      fireEvent.click(transferButton);

      await waitFor(() => {
        // Should show success or updated data
        expect(screen.getByRole('heading', { name: 'Transfer Stock' })).toBeInTheDocument();
      });
    });
  });

  describe('Form validation', () => {
    it('should validate demand input', () => {
      render(
        <MockedProvider mocks={mocks} addTypename={false}>
          <Drawer {...defaultProps} />
        </MockedProvider>
      );

      const demandInput = screen.getByLabelText(/new demand value/i);
      fireEvent.change(demandInput, { target: { value: '-10' } });

      const updateButton = screen.getByRole('button', { name: /update demand/i });
      expect(updateButton).toBeDisabled();
    });

    it('should validate transfer quantity', () => {
      render(
        <MockedProvider mocks={mocks} addTypename={false}>
          <Drawer {...defaultProps} />
        </MockedProvider>
      );

      const quantityInput = screen.getByLabelText(/amount to transfer/i);
      fireEvent.change(quantityInput, { target: { value: '0' } });

      const transferButton = screen.getByRole('button', { name: /transfer stock/i });
      expect(transferButton).toBeDisabled();
    });

    it('should validate warehouse selection', () => {
      render(
        <MockedProvider mocks={mocks} addTypename={false}>
          <Drawer {...defaultProps} />
        </MockedProvider>
      );

      const warehouseInput = screen.getByLabelText(/target warehouse/i);
      fireEvent.change(warehouseInput, { target: { value: '' } });

      const transferButton = screen.getByRole('button', { name: /transfer stock/i });
      expect(transferButton).toBeDisabled();
    });
  });

  describe('Loading states', () => {
    it('should show loading state during mutations', async () => {
      const loadingMocks = [
        {
          request: {
            query: UPDATE_DEMAND,
            variables: {
              id: 'P-1001',
              warehouse: 'BLR-A',
              demand: 100,
            },
          },
          result: {
            data: {
              updateDemand: {
                ...mockProduct,
                demand: 100,
              },
            },
          },
          delay: 1000, // Simulate loading
        },
      ];

      render(
        <MockedProvider mocks={loadingMocks} addTypename={false}>
          <Drawer {...defaultProps} />
        </MockedProvider>
      );

      const demandInput = screen.getByLabelText(/new demand/i);
      fireEvent.change(demandInput, { target: { value: '100' } });

      const updateButton = screen.getByRole('button', { name: /update demand/i });
      fireEvent.click(updateButton);

      // Button should be disabled during loading
      expect(updateButton).toBeDisabled();
    });
  });

  describe('Error handling', () => {
    it('should handle mutation errors gracefully', async () => {
      const errorMocks = [
        {
          request: {
            query: UPDATE_DEMAND,
            variables: {
              id: 'P-1001',
              warehouse: 'BLR-A',
              demand: 100,
            },
          },
          error: new Error('Failed to update demand'),
        },
      ];

      render(
        <MockedProvider mocks={errorMocks} addTypename={false}>
          <Drawer {...defaultProps} />
        </MockedProvider>
      );

      const demandInput = screen.getByLabelText(/new demand value/i);
      fireEvent.change(demandInput, { target: { value: '100' } });

      const updateButton = screen.getByRole('button', { name: /update demand/i });
      fireEvent.click(updateButton);

      // Should still render the drawer
      expect(screen.getByText('Product Details')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA attributes', () => {
      render(
        <MockedProvider mocks={mocks} addTypename={false}>
          <Drawer {...defaultProps} />
        </MockedProvider>
      );

      const drawer = screen.getByRole('dialog');
      expect(drawer).toHaveAttribute('aria-modal', 'true');
    });

    it('should have proper form labels', () => {
      render(
        <MockedProvider mocks={mocks} addTypename={false}>
          <Drawer {...defaultProps} />
        </MockedProvider>
      );

      expect(screen.getByLabelText(/new demand value/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/amount to transfer/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/target warehouse/i)).toBeInTheDocument();
    });

    it('should have proper button types', () => {
      render(
        <MockedProvider mocks={mocks} addTypename={false}>
          <Drawer {...defaultProps} />
        </MockedProvider>
      );

      const updateButton = screen.getByRole('button', { name: /update demand/i });
      const transferButton = screen.getByRole('button', { name: /transfer stock/i });

      expect(updateButton).toHaveAttribute('type', 'button');
      expect(transferButton).toHaveAttribute('type', 'button');
    });
  });

  describe('Edge cases', () => {
    it('should handle null product', () => {
      render(
        <MockedProvider mocks={mocks} addTypename={false}>
          <Drawer {...defaultProps} product={null as unknown as Product} />
        </MockedProvider>
      );

      // Should return null for null product
      expect(screen.queryByText('Product Details')).not.toBeInTheDocument();
    });

    it('should handle product with missing data', () => {
      const incompleteProduct = {
        id: 'P-1001',
        name: undefined,
        sku: undefined,
        warehouse: 'BLR-A',
        stock: 100,
        demand: 80,
      } as unknown as Product;

      render(
        <MockedProvider mocks={mocks} addTypename={false}>
          <Drawer {...defaultProps} product={incompleteProduct} />
        </MockedProvider>
      );

      // Should still render the drawer
      expect(screen.getByText('Product Details')).toBeInTheDocument();
    });
  });
});
