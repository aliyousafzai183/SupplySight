import '@testing-library/jest-dom';
import { vi } from 'vitest';
import React from 'react';

// Mock environment variables
vi.stubEnv('VITE_GRAPHQL_URL', 'http://localhost:4000/graphql');
vi.stubEnv('VITE_SENTRY_DSN', '');

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock IntersectionObserver
Object.defineProperty(window, 'IntersectionObserver', {
  writable: true,
  value: vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  })),
});

// Mock ResizeObserver
Object.defineProperty(window, 'ResizeObserver', {
  writable: true,
  value: vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  })),
});

// Mock recharts
vi.mock('recharts', () => {
  const LineChartComponent = ({ children, data, ...props }: { children?: React.ReactNode; data?: unknown; [key: string]: unknown }) => {
    return React.createElement('div', { 
      'data-testid': 'line-chart', 
      'data-chart-data': JSON.stringify(data), 
      ...props 
    }, children);
  };

  return {
    LineChart: LineChartComponent,
    Line: ({ dataKey, stroke, strokeWidth, ...props }: { dataKey?: string; stroke?: string; strokeWidth?: number; [key: string]: unknown }) => {
      return React.createElement('div', { 
        'data-testid': `line-${dataKey}`, 
        'data-stroke': stroke, 
        'data-stroke-width': strokeWidth, 
        ...props 
      });
    },
    XAxis: ({ dataKey, ...props }: { dataKey?: string; [key: string]: unknown }) => {
      return React.createElement('div', { 'data-testid': `xaxis-${dataKey}`, ...props });
    },
    YAxis: ({ ...props }: { [key: string]: unknown }) => {
      return React.createElement('div', { 'data-testid': 'yaxis', ...props });
    },
    CartesianGrid: ({ strokeDasharray, ...props }: { strokeDasharray?: string; [key: string]: unknown }) => {
      return React.createElement('div', { 'data-testid': 'cartesian-grid', 'data-stroke-dasharray': strokeDasharray, ...props });
    },
    Tooltip: ({ content, ...props }: { content?: () => React.ReactNode; [key: string]: unknown }) => {
      return React.createElement('div', { 'data-testid': 'tooltip', ...props }, content && content());
    },
    Legend: ({ ...props }: { [key: string]: unknown }) => {
      return React.createElement('div', { 'data-testid': 'legend', ...props });
    },
    ResponsiveContainer: ({ children, ...props }: { children?: React.ReactNode; [key: string]: unknown }) => {
      return React.createElement('div', { 'data-testid': 'responsive-container', ...props }, children);
    },
    Area: ({ dataKey, ...props }: { dataKey?: string; [key: string]: unknown }) => {
      return React.createElement('div', { 'data-testid': `area-${dataKey}`, ...props });
    },
    AreaChart: ({ children, data, ...props }: { children?: React.ReactNode; data?: unknown; [key: string]: unknown }) => {
      return React.createElement('div', { 'data-testid': 'area-chart', 'data-chart-data': JSON.stringify(data), ...props }, children);
    },
    Bar: ({ dataKey, ...props }: { dataKey?: string; [key: string]: unknown }) => {
      return React.createElement('div', { 'data-testid': `bar-${dataKey}`, ...props });
    },
    BarChart: ({ children, data, ...props }: { children?: React.ReactNode; data?: unknown; [key: string]: unknown }) => {
      return React.createElement('div', { 'data-testid': 'bar-chart', 'data-chart-data': JSON.stringify(data), ...props }, children);
    },
    PieChart: ({ children, data, ...props }: { children?: React.ReactNode; data?: unknown; [key: string]: unknown }) => {
      return React.createElement('div', { 'data-testid': 'pie-chart', 'data-chart-data': JSON.stringify(data), ...props }, children);
    },
    Pie: ({ dataKey, ...props }: { dataKey?: string; [key: string]: unknown }) => {
      return React.createElement('div', { 'data-testid': `pie-${dataKey}`, ...props });
    },
    Cell: ({ ...props }: { [key: string]: unknown }) => {
      return React.createElement('div', { 'data-testid': 'cell', ...props });
    },
  };
});

// Mock @tanstack/react-router
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
