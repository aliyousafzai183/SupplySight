import { describe, it, expect, vi } from 'vitest';
import { toastConfig, showSuccessToast, showErrorToast } from './toast';
import { toastMessages, showToast } from './toast-utils';

// Mock react-hot-toast
vi.mock('react-hot-toast', () => ({
  default: {
    success: vi.fn(),
    error: vi.fn(),
    loading: vi.fn(),
  },
}));

describe('toast', () => {
  it('should have toast configuration', () => {
    expect(toastConfig).toBeDefined();
    expect(toastConfig.position).toBe('top-center');
  });

  it('should have helper functions', () => {
    expect(typeof showSuccessToast).toBe('function');
    expect(typeof showErrorToast).toBe('function');
  });
});

describe('toastMessages', () => {
  it('should have product messages', () => {
    expect(toastMessages.product).toBeDefined();
    expect(toastMessages.product.demandUpdated).toBeDefined();
    expect(toastMessages.product.stockTransferred).toBeDefined();
  });

  it('should have filter messages', () => {
    expect(toastMessages.filters).toBeDefined();
    expect(toastMessages.filters.applied).toBeDefined();
    expect(toastMessages.filters.reset).toBeDefined();
  });

  it('should have general messages', () => {
    expect(toastMessages.general).toBeDefined();
    expect(toastMessages.general.loading).toBeDefined();
    expect(toastMessages.general.error).toBeDefined();
  });
});

describe('showToast', () => {
  it('should have success method', () => {
    expect(typeof showToast.success).toBe('function');
  });
});
