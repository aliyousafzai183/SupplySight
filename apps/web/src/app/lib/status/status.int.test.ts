import { describe, it, expect } from 'vitest';
import { getStatus, getStatusColor, getStatusIcon } from './status';

describe('Status Integration Tests', () => {
  describe('Status consistency across functions', () => {
    it('should have consistent status colors and icons', () => {
      const testCases = [
        { stock: 100, demand: 50, expectedStatus: 'HEALTHY' },
        { stock: 50, demand: 50, expectedStatus: 'LOW' },
        { stock: 30, demand: 50, expectedStatus: 'CRITICAL' },
      ];

      testCases.forEach(({ stock, demand, expectedStatus }) => {
        const status = getStatus(stock, demand);
        const color = getStatusColor(status);
        const icon = getStatusIcon(status);

        expect(status).toBe(expectedStatus);
        expect(color).toBeDefined();
        expect(icon).toBeDefined();
        expect(typeof color).toBe('string');
        expect(typeof icon).toBe('string');
      });
    });

    it('should handle edge cases consistently', () => {
      // Zero values
      expect(getStatus(0, 0)).toBe('LOW');
      expect(getStatus(0, 1)).toBe('CRITICAL');
      expect(getStatus(1, 0)).toBe('HEALTHY');

      // Large numbers
      expect(getStatus(1000000, 500000)).toBe('HEALTHY');
      expect(getStatus(500000, 500000)).toBe('LOW');
      expect(getStatus(100000, 500000)).toBe('CRITICAL');
    });
  });

  describe('Status color mapping', () => {
    it('should return correct CSS classes for each status', () => {
      expect(getStatusColor('HEALTHY')).toContain('green');
      expect(getStatusColor('LOW')).toContain('yellow');
      expect(getStatusColor('CRITICAL')).toContain('red');
    });
  });

  describe('Status icon mapping', () => {
    it('should return appropriate icons for each status', () => {
      expect(getStatusIcon('HEALTHY')).toBe('🟢');
      expect(getStatusIcon('LOW')).toBe('🟡');
      expect(getStatusIcon('CRITICAL')).toBe('🔴');
    });
  });
});
