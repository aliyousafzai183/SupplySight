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

describe('Toast Integration Tests', () => {
  describe('Toast configuration integration', () => {
    it('should have consistent toast configuration', () => {
      expect(toastConfig.position).toBe('top-center');
      expect(toastConfig.toastOptions).toBeDefined();
      expect(toastConfig.toastOptions?.duration).toBe(4000);
      expect(toastConfig.toastOptions?.style).toBeDefined();
    });

    it('should have proper success and error themes', () => {
      const successTheme = toastConfig.toastOptions?.success?.iconTheme;
      const errorTheme = toastConfig.toastOptions?.error?.iconTheme;

      expect(successTheme?.primary).toBe('#10b981');
      expect(successTheme?.secondary).toBe('#fff');
      expect(errorTheme?.primary).toBe('#ef4444');
      expect(errorTheme?.secondary).toBe('#fff');
    });
  });

  describe('Toast message patterns', () => {
    it('should have consistent message patterns', () => {
      // Product messages
      expect(toastMessages.product.demandUpdated(100)).toContain('100');
      expect(toastMessages.product.stockTransferred(50, 'DEL-B')).toContain('50');
      expect(toastMessages.product.stockTransferred(50, 'DEL-B')).toContain('DEL-B');

      // Filter messages
      expect(toastMessages.filters.applied(['search', 'warehouse'])).toContain('search');
      expect(toastMessages.filters.applied(['search', 'warehouse'])).toContain('warehouse');

      // General messages
      expect(toastMessages.general.loading).toBe('Loading...');
      expect(toastMessages.general.error).toBe('Something went wrong. Please try again.');
    });

    it('should handle dynamic message generation', () => {
      const demand = 150;
      const warehouse = 'BLR-A';
      const amount = 25;

      const demandMessage = toastMessages.product.demandUpdated(demand);
      const transferMessage = toastMessages.product.stockTransferred(amount, warehouse);
      const limitMessage = toastMessages.product.stockLimitExceeded(amount);

      expect(demandMessage).toContain(demand.toString());
      expect(transferMessage).toContain(amount.toString());
      expect(transferMessage).toContain(warehouse);
      expect(limitMessage).toContain(amount.toString());
    });
  });

  describe('Toast helper functions', () => {
    it('should have working helper functions', () => {
      expect(typeof showSuccessToast).toBe('function');
      expect(typeof showErrorToast).toBe('function');
      expect(typeof showToast.success).toBe('function');

      // Test that helpers return values
      expect(showSuccessToast('test')).toBe('test');
      expect(showErrorToast('error')).toBe('error');
    });
  });

  describe('Toast message validation', () => {
    it('should generate valid product messages', () => {
      const messages = [
        toastMessages.product.demandUpdated(100),
        toastMessages.product.stockTransferred(50, 'DEL-B'),
        toastMessages.product.stockLimitExceeded(25),
        toastMessages.product.productSelected('Test Product'),
      ];

      messages.forEach(message => {
        expect(message).toBeDefined();
        expect(typeof message).toBe('string');
        expect(message.length).toBeGreaterThan(0);
      });
    });

    it('should generate valid filter messages', () => {
      const filterMessages = [
        toastMessages.filters.applied(['search']),
        toastMessages.filters.applied(['warehouse', 'status']),
        toastMessages.filters.reset,
      ];

      filterMessages.forEach(message => {
        expect(message).toBeDefined();
        expect(typeof message).toBe('string');
        expect(message.length).toBeGreaterThan(0);
      });
    });
  });

  describe('Toast configuration validation', () => {
    it('should have valid style configuration', () => {
      const style = toastConfig.toastOptions?.style;
      
      expect(style?.background).toBe('#fff');
      expect(style?.color).toBe('#363636');
      expect(style?.borderRadius).toBe('12px');
      expect(style?.boxShadow).toBeDefined();
      expect(style?.border).toBeDefined();
      expect(style?.backdropFilter).toBe('blur(8px)');
    });
  });
});
