import { describe, it, expect } from 'vitest';
import { client } from './apollo.js';

describe('Apollo Client', () => {
  it('should be configured with InMemoryCache', () => {
    expect(client.cache).toBeDefined();
  });

  it('should have default options configured', () => {
    expect(client.defaultOptions).toBeDefined();
    expect(client.defaultOptions.watchQuery).toBeDefined();
    expect(client.defaultOptions.query).toBeDefined();
  });

  it('should have error policy set to all', () => {
    expect(client.defaultOptions.watchQuery?.errorPolicy).toBe('all');
    expect(client.defaultOptions.query?.errorPolicy).toBe('all');
  });
});
