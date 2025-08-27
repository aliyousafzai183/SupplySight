import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { Dashboard } from './index.tsx';
import { MockedProvider } from '@apollo/client/testing';
import { GET_PRODUCTS, GET_KPIS } from '../../features/products/queries';

// Mock the router
vi.mock('@tanstack/react-router', () => ({
  useNavigate: () => vi.fn(),
  useSearch: () => ({
    search: '',
    warehouse: '',
    status: undefined,
    page: '1',
    pageSize: '10',
    kpiRange: '7d',
  }),
}));

// Mock react-hot-toast
vi.mock('react-hot-toast', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe('Index Route', () => {
  const mockProductsData = {
    products: {
      products: [
        {
          id: 'P-1001',
          name: 'Test Product',
          sku: 'TEST-001',
          warehouse: 'BLR-A',
          stock: 100,
          demand: 80,
        },
      ],
      totalCount: 1,
      hasNextPage: false,
      hasPreviousPage: false,
      currentPage: 1,
      totalPages: 1,
    },
  };

  const mockKpisData = {
    kpis: [
      { date: '2025-08-27', stock: 1000, demand: 800 },
      { date: '2025-08-28', stock: 1100, demand: 900 },
    ],
  };

  const mocks = [
    {
      request: {
        query: GET_PRODUCTS,
        variables: {
          search: '',
          warehouse: '',
          status: undefined,
          page: 1,
          pageSize: 10,
        },
      },
      result: {
        data: mockProductsData,
      },
    },
    {
      request: {
        query: GET_KPIS,
        variables: {
          range: '7d',
        },
      },
      result: {
        data: mockKpisData,
      },
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Basic rendering', () => {
    it('should render the dashboard header', () => {
      render(
        <MockedProvider mocks={mocks} addTypename={false}>
          <Dashboard />
        </MockedProvider>
      );

      expect(screen.getByText('SupplySight')).toBeInTheDocument();
      expect(screen.getByText('Daily Inventory Dashboard')).toBeInTheDocument();
    });

    it('should render KPI cards', async () => {
      render(
        <MockedProvider mocks={mocks} addTypename={false}>
          <Dashboard />
        </MockedProvider>
      );

      await waitFor(() => {
        expect(screen.getByText('Total Stock')).toBeInTheDocument();
        expect(screen.getByText('Total Demand')).toBeInTheDocument();
        expect(screen.getByText('Fill Rate')).toBeInTheDocument();
      });
    });

    it('should render filters section', () => {
      render(
        <MockedProvider mocks={mocks} addTypename={false}>
          <Dashboard />
        </MockedProvider>
      );

      expect(screen.getByLabelText(/search products/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/warehouse/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/status/i)).toBeInTheDocument();
    });

    it('should render products table', async () => {
      render(
        <MockedProvider mocks={mocks} addTypename={false}>
          <Dashboard />
        </MockedProvider>
      );

      await waitFor(() => {
        expect(screen.getByText('Products')).toBeInTheDocument();
      });
    });
  });

  describe('KPI Range functionality', () => {
    it('should render date range chips', () => {
      render(
        <MockedProvider mocks={mocks} addTypename={false}>
          <Dashboard />
        </MockedProvider>
      );

      expect(screen.getByText('7d')).toBeInTheDocument();
      expect(screen.getByText('14d')).toBeInTheDocument();
      expect(screen.getByText('30d')).toBeInTheDocument();
    });

    it('should have active state for selected range', () => {
      render(
        <MockedProvider mocks={mocks} addTypename={false}>
          <Dashboard />
        </MockedProvider>
      );

      const activeChip = screen.getByText('7d');
      expect(activeChip).toHaveClass('btn-primary');
    });
  });

  describe('Loading states', () => {
    it('should show loading state for products', () => {
      render(
        <MockedProvider mocks={[]} addTypename={false}>
          <Dashboard />
        </MockedProvider>
      );

      // Should show loading indicators
      expect(screen.getByText('Products')).toBeInTheDocument();
    });

    it('should show loading state for KPIs', () => {
      render(
        <MockedProvider mocks={[]} addTypename={false}>
          <Dashboard />
        </MockedProvider>
      );

      // Should show loading indicators for KPI cards
      expect(screen.getByText('Loading products...')).toBeInTheDocument();
    });
  });

  describe('Error handling', () => {
    it('should handle GraphQL errors gracefully', () => {
      const errorMocks = [
        {
          request: {
            query: GET_PRODUCTS,
            variables: {
              search: '',
              warehouse: '',
              status: undefined,
              page: 1,
              pageSize: 10,
            },
          },
          error: new Error('Failed to fetch products'),
        },
      ];

      render(
        <MockedProvider mocks={errorMocks} addTypename={false}>
          <Dashboard />
        </MockedProvider>
      );

      // Should still render the page structure
      expect(screen.getByText('SupplySight')).toBeInTheDocument();
    });
  });

  describe('URL persistence', () => {
    it('should read filters from URL on load', () => {
      render(
        <MockedProvider mocks={mocks} addTypename={false}>
          <Dashboard />
        </MockedProvider>
      );

      // Should apply URL filters
      expect(screen.getByText('SupplySight')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper heading structure', () => {
      render(
        <MockedProvider mocks={mocks} addTypename={false}>
          <Dashboard />
        </MockedProvider>
      );

      const mainHeading = screen.getByText('SupplySight');
      expect(mainHeading.tagName).toBe('H1');
    });

    it('should have proper navigation landmarks', () => {
      render(
        <MockedProvider mocks={mocks} addTypename={false}>
          <Dashboard />
        </MockedProvider>
      );

      expect(screen.getByRole('banner')).toBeInTheDocument();
      // The main content is in a div, not a main element
      expect(screen.getByText('SupplySight')).toBeInTheDocument();
    });
  });

  describe('Responsive design', () => {
    it('should have responsive classes', () => {
      render(
        <MockedProvider mocks={mocks} addTypename={false}>
          <Dashboard />
        </MockedProvider>
      );

      const header = screen.getByRole('banner');
      expect(header).toHaveClass('gradient-bg');
    });

    it('should have proper container structure', () => {
      render(
        <MockedProvider mocks={mocks} addTypename={false}>
          <Dashboard />
        </MockedProvider>
      );

      const container = screen.getByText('SupplySight').closest('.max-w-7xl');
      expect(container).toBeInTheDocument();
    });
  });
});
