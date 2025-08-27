import { describe, it, expect } from 'vitest';
import { formatNumber, formatPercentage, formatDate, calculateFillRate } from './format';

describe('Format Integration Tests', () => {
  describe('Number formatting consistency', () => {
    it('should handle various number formats consistently', () => {
      const testCases = [
        { input: 0, expected: '0' },
        { input: 100, expected: '100' },
        { input: 1000, expected: '1,000' },
        { input: 1234567, expected: '1,234,567' },
        { input: 1000.5, expected: '1,000.5' },
        { input: 1234.56, expected: '1,234.56' },
      ];

      testCases.forEach(({ input, expected }) => {
        expect(formatNumber(input)).toBe(expected);
      });
    });
  });

  describe('Percentage formatting scenarios', () => {
    it('should handle various percentage scenarios', () => {
      const testCases = [
        { input: 0, expected: '0.0%' },
        { input: 0.5, expected: '0.5%' },
        { input: 1, expected: '1.0%' },
        { input: 1.5, expected: '1.5%' },
        { input: 0.123, expected: '0.1%' },
        { input: 2.25, expected: '2.3%' },
      ];

      testCases.forEach(({ input, expected }) => {
        expect(formatPercentage(input)).toBe(expected);
      });
    });
  });

  describe('Date formatting', () => {
    it('should format dates consistently', () => {
      const testDate = '2025-08-27';
      const formatted = formatDate(testDate);
      
      expect(formatted).toMatch(/^[A-Za-z]{3} \d{1,2}$/);
      expect(formatted).toContain('Aug');
    });

    it('should handle different date formats', () => {
      const dates = [
        '2025-01-01',
        '2025-12-25',
        '2025-06-15',
      ];

      dates.forEach(date => {
        const formatted = formatDate(date);
        expect(formatted).toBeDefined();
        expect(typeof formatted).toBe('string');
      });
    });
  });

  describe('Fill rate calculation', () => {
    it('should calculate fill rates correctly', () => {
      expect(calculateFillRate(100, 100)).toBe(1);
      expect(calculateFillRate(50, 100)).toBe(0.5);
      expect(calculateFillRate(150, 100)).toBe(1);
      expect(calculateFillRate(0, 100)).toBe(0);
    });

    it('should handle edge cases', () => {
      expect(calculateFillRate(0, 0)).toBe(1); // demand === 0
      expect(calculateFillRate(100, 0)).toBe(1); // demand === 0
    });
  });

  describe('Format utilities integration', () => {
    it('should work together for dashboard display', () => {
      const stock = 150;
      const demand = 100;
      
      const fillRate = calculateFillRate(stock, demand);
      const formattedFillRate = formatPercentage(fillRate);
      const formattedStock = formatNumber(stock);
      const formattedDemand = formatNumber(demand);
      
      expect(fillRate).toBe(1);
      expect(formattedFillRate).toBe('1.0%');
      expect(formattedStock).toBe('150');
      expect(formattedDemand).toBe('100');
    });
  });
});
