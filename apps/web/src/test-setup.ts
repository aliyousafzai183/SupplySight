import '@testing-library/jest-dom';
import { vi } from 'vitest';
import React from 'react';

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
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock recharts
vi.mock('recharts', () => {
  const LineChartComponent = ({ children, data, ...props }: any) => {
    return React.createElement('div', { 
      'data-testid': 'line-chart', 
      'data-chart-data': JSON.stringify(data), 
      ...props 
    }, children);
  };

  return {
    LineChart: LineChartComponent,
    Line: ({ dataKey, stroke, strokeWidth, ...props }: any) => {
      return React.createElement('div', { 
        'data-testid': `line-${dataKey}`, 
        'data-stroke': stroke, 
        'data-stroke-width': strokeWidth, 
        ...props 
      });
    },
    XAxis: ({ dataKey, ...props }: any) => {
      return React.createElement('div', { 'data-testid': `xaxis-${dataKey}`, ...props });
    },
    YAxis: ({ ...props }: any) => {
      return React.createElement('div', { 'data-testid': 'yaxis', ...props });
    },
    CartesianGrid: ({ strokeDasharray, ...props }: any) => {
      return React.createElement('div', { 'data-testid': 'cartesian-grid', 'data-stroke-dasharray': strokeDasharray, ...props });
    },
    Tooltip: ({ content, ...props }: any) => {
      return React.createElement('div', { 'data-testid': 'tooltip', ...props }, content && content({}));
    },
    Legend: ({ ...props }: any) => {
      return React.createElement('div', { 'data-testid': 'legend', ...props });
    },
    ResponsiveContainer: ({ children, ...props }: any) => {
      return React.createElement('div', { 'data-testid': 'responsive-container', ...props }, children);
    },
    Area: ({ dataKey, ...props }: any) => {
      return React.createElement('div', { 'data-testid': `area-${dataKey}`, ...props });
    },
    AreaChart: ({ children, data, ...props }: any) => {
      return React.createElement('div', { 'data-testid': 'area-chart', 'data-chart-data': JSON.stringify(data), ...props }, children);
    },
    Bar: ({ dataKey, ...props }: any) => {
      return React.createElement('div', { 'data-testid': `bar-${dataKey}`, ...props });
    },
    BarChart: ({ children, data, ...props }: any) => {
      return React.createElement('div', { 'data-testid': 'bar-chart', 'data-chart-data': JSON.stringify(data), ...props }, children);
    },
    PieChart: ({ children, data, ...props }: any) => {
      return React.createElement('div', { 'data-testid': 'pie-chart', 'data-chart-data': JSON.stringify(data), ...props }, children);
    },
    Pie: ({ dataKey, ...props }: any) => {
      return React.createElement('div', { 'data-testid': `pie-${dataKey}`, ...props });
    },
    Cell: ({ ...props }: any) => {
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
