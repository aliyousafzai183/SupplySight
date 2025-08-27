import { describe, it, expect } from 'vitest';
import { getStatus } from './status.js';

describe('getStatus', () => {
  it('should return HEALTHY when stock > demand', () => {
    expect(getStatus(100, 50)).toBe('HEALTHY');
    expect(getStatus(200, 100)).toBe('HEALTHY');
    expect(getStatus(1, 0)).toBe('HEALTHY');
  });

  it('should return LOW when stock === demand', () => {
    expect(getStatus(50, 50)).toBe('LOW');
    expect(getStatus(100, 100)).toBe('LOW');
    expect(getStatus(0, 0)).toBe('LOW');
  });

  it('should return CRITICAL when stock < demand', () => {
    expect(getStatus(50, 100)).toBe('CRITICAL');
    expect(getStatus(0, 1)).toBe('CRITICAL');
    expect(getStatus(10, 50)).toBe('CRITICAL');
  });
});
