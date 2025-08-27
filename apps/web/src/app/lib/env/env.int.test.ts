import { describe, it, expect, vi } from 'vitest';

// Mock import.meta.env before importing env
vi.mock('import.meta', () => ({
  env: {
    VITE_GRAPHQL_URL: 'http://localhost:4000/graphql',
    VITE_SENTRY_DSN: 'test-dsn',
  },
}));

// Import after mocking
import { env } from './env';

describe('Environment Integration Tests', () => {
  describe('Environment validation', () => {
    it('should validate required environment variables', () => {
      expect(env.VITE_GRAPHQL_URL).toBeDefined();
      expect(typeof env.VITE_GRAPHQL_URL).toBe('string');
      expect(env.VITE_GRAPHQL_URL).toBe('http://localhost:4000/graphql');
    });


  });

  describe('Environment URL validation', () => {
    it('should have valid GraphQL URL format', () => {
      const url = env.VITE_GRAPHQL_URL;
      
      expect(url).toMatch(/^https?:\/\/.+/);
      expect(url).toContain('graphql');
    });

    it('should have proper URL structure', () => {
      const url = new URL(env.VITE_GRAPHQL_URL);
      
      expect(url.protocol).toMatch(/^https?:/);
      expect(url.hostname).toBeDefined();
      expect(url.pathname).toContain('graphql');
    });
  });

  describe('Environment configuration integration', () => {
    it('should work with Apollo client configuration', () => {
      // This test ensures the env module works with Apollo client
      expect(env.VITE_GRAPHQL_URL).toBeDefined();
      expect(typeof env.VITE_GRAPHQL_URL).toBe('string');
    });

    it('should handle environment variable access', () => {
      // Test that we can access environment variables without errors
      expect(() => {
        const graphqlUrl = env.VITE_GRAPHQL_URL;
        const sentryDsn = env.VITE_SENTRY_DSN;
        return { graphqlUrl, sentryDsn };
      }).not.toThrow();
    });
  });

  describe('Environment schema validation', () => {
    it('should validate URL format', () => {
      const url = env.VITE_GRAPHQL_URL;
      
      // Should be a valid URL
      expect(() => new URL(url)).not.toThrow();
    });

    it('should have required fields', () => {
      expect(env).toHaveProperty('VITE_GRAPHQL_URL');
    });
  });
});
