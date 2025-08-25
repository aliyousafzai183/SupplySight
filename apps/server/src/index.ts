import { createYoga } from '@graphql-yoga/node';
import { typeDefs } from './schema.js';
import { productsResolver } from './resolvers/products.js';
import { kpisResolver } from './resolvers/kpis.js';
import { mutationsResolver } from './resolvers/mutations.js';
import { logger } from './logger.js';

const yoga = createYoga({
  schema: {
    typeDefs,
    resolvers: {
      Query: {
        ...productsResolver,
        ...kpisResolver
      },
      Mutation: mutationsResolver
    }
  },
  logging: {
    level: 'info'
  },
  cors: {
    origin: process.env.NODE_ENV === 'production' 
      ? ['https://supply-sight-dev.vercel.app', 'https://supply-sight-prod.vercel.app']
      : ['http://localhost:5173'],
    credentials: true
  }
});

const port = process.env.PORT || 4000;

yoga.start({
  port,
  endpoint: '/graphql'
}).then(() => {
  logger.info(`🚀 GraphQL server running on http://localhost:${port}/graphql`);
  logger.info(`📊 GraphQL Playground available at http://localhost:${port}/graphql`);
});
