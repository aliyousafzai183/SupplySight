import { z } from 'zod';

const Env = z.object({
  VITE_GRAPHQL_URL: z.string().url().default('http://localhost:4000/graphql'),
  VITE_SENTRY_DSN: z.string().optional(),
});

export const env = Env.parse({
  VITE_GRAPHQL_URL: import.meta.env.VITE_GRAPHQL_URL || 'http://localhost:4000/graphql',
  VITE_SENTRY_DSN: import.meta.env.VITE_SENTRY_DSN,
});
