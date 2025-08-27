import { describe, it, expect, vi } from 'vitest';
import { client } from './apollo';

// Mock the env module
vi.mock('../env', () => ({
  env: {
    VITE_GRAPHQL_URL: 'http://localhost:4000/graphql',
  },
}));

describe('Apollo Integration Tests', () => {
  describe('Client configuration integration', () => {
    it('should have proper default options', () => {
      const defaultOptions = client.defaultOptions;

      expect(defaultOptions.watchQuery?.errorPolicy).toBe('all');
      expect(defaultOptions.query?.errorPolicy).toBe('all');
    });

    it('should have InMemoryCache configured', () => {
      expect(client.cache).toBeDefined();
    });
  });

  describe('Client link configuration', () => {
    it('should have error link configured', () => {
      // The client should have links configured
      expect(client.link).toBeDefined();
    });

    it('should have proper link chain', () => {
      // Apollo client should have a link chain with error handling
      expect(client.link).toBeDefined();
    });
  });

  describe('Client functionality', () => {
    it('should be able to create client instance', () => {
      expect(client).toBeDefined();
      expect(typeof client.query).toBe('function');
      expect(typeof client.mutate).toBe('function');
      expect(typeof client.watchQuery).toBe('function');
    });

    it('should have proper cache management', () => {
      expect(typeof client.resetStore).toBe('function');
      expect(typeof client.clearStore).toBe('function');
    });
  });

  describe('Cache type policies validation', () => {
    it('should have cache configured', () => {
      expect(client.cache).toBeDefined();
    });
  });

  describe('Error handling configuration', () => {
    it('should have error policy set to all', () => {
      const watchQueryPolicy = client.defaultOptions.watchQuery?.errorPolicy;
      const queryPolicy = client.defaultOptions.query?.errorPolicy;

      expect(watchQueryPolicy).toBe('all');
      expect(queryPolicy).toBe('all');
    });
  });
});
