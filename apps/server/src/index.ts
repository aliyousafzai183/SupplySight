import { createYoga } from 'graphql-yoga';
import { createSchema } from 'graphql-yoga';
import { createServer } from 'http';
import { typeDefs } from './schema.js';
import { productsResolver } from './resolvers/products.js';
import { kpisResolver } from './resolvers/kpis.js';
import { mutationsResolver } from './resolvers/mutations.js';
import { logInfo } from './logger.js';

const schema = createSchema({
  typeDefs,
  resolvers: {
    Query: {
      ...productsResolver,
      ...kpisResolver
    },
    Mutation: mutationsResolver
  }
});

const yoga = createYoga({
  schema,
  cors: {
    origin: process.env.NODE_ENV === 'production' 
      ? ['https://supply-sight-dev.vercel.app', 'https://supply-sight-prod.vercel.app']
      : ['http://localhost:5173'],
    credentials: true
  }
});

const server = createServer(yoga);

const port = process.env.PORT || 4000;

server.listen(port, () => {
  logInfo(`🚀 GraphQL server running on http://localhost:${port}/graphql`);
  logInfo(`📊 GraphQL Playground available at http://localhost:${port}/graphql`);
});
