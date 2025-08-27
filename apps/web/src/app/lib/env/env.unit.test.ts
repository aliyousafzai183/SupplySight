import { describe, it, expect, vi } from 'vitest';
import { env } from './env.js';

// Mock import.meta.env
vi.mock('import.meta', () => ({
  env: {
    VITE_GRAPHQL_URL: 'http://localhost:4000/graphql',
    VITE_SENTRY_DSN: 'test-dsn',
  },
}));

describe('Environment Configuration', () => {
  it('should have VITE_GRAPHQL_URL configured', () => {
    expect(env.VITE_GRAPHQL_URL).toBeDefined();
    expect(typeof env.VITE_GRAPHQL_URL).toBe('string');
  });

  it('should validate required environment variables', () => {
    expect(() => {
      // This should not throw if env is properly configured
      env.VITE_GRAPHQL_URL;
    }).not.toThrow();
  });
});
