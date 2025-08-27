import { ApolloClient, InMemoryCache, createHttpLink, from } from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import { env } from './env.js';

const httpLink = createHttpLink({
  uri: env.VITE_GRAPHQL_URL,
});

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors)
    graphQLErrors.forEach(({ message, locations, path }) =>
      console.error(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
      )
    );
  if (networkError) console.error(`[Network error]: ${networkError}`);
});

export const client = new ApolloClient({
  link: from([errorLink, httpLink]),
  cache: new InMemoryCache({
    // Use a composite key (id + warehouse) to distinguish the same product
    // stored in different warehouses. This prevents cache collisions when
    // transferring stock, where the same product ID can exist in multiple
    // warehouses with independent stock/demand values.
    typePolicies: {
      Product: {
        keyFields: ['id', 'warehouse'],
      },
    },
  }),
  defaultOptions: {
    watchQuery: {
      errorPolicy: 'all',
    },
    query: {
      errorPolicy: 'all',
    },
  },
});
