import { describe, it, expect } from 'vitest';
import { formatNumber, formatPercentage } from './format.js';

describe('formatNumber', () => {
  it('should format numbers with commas', () => {
    expect(formatNumber(1000)).toBe('1,000');
    expect(formatNumber(1234567)).toBe('1,234,567');
    expect(formatNumber(0)).toBe('0');
    expect(formatNumber(100)).toBe('100');
  });

  it('should handle decimal numbers', () => {
    expect(formatNumber(1000.5)).toBe('1,000.5');
    expect(formatNumber(1234.56)).toBe('1,234.56');
  });
});

describe('formatPercentage', () => {
  it('should format percentages with one decimal place', () => {
    expect(formatPercentage(0.5)).toBe('0.5%');
    expect(formatPercentage(0.123)).toBe('0.1%');
    expect(formatPercentage(1)).toBe('1.0%');
    expect(formatPercentage(0)).toBe('0.0%');
  });

  it('should handle values greater than 1', () => {
    expect(formatPercentage(1.5)).toBe('1.5%');
    expect(formatPercentage(2.25)).toBe('2.3%');
  });
});
