import { gql } from 'graphql-tag';

export const typeDefs = gql`
  type Product {
    id: ID!
    name: String!
    sku: String!
    warehouse: String!
    stock: Int!
    demand: Int!
  }

  enum Status {
    HEALTHY
    LOW
    CRITICAL
  }

  type KPI {
    date: String!
    stock: Int!
    demand: Int!
  }

  type Query {
    products(
      search: String
      warehouse: String
      status: Status
      page: Int = 1
      pageSize: Int = 10
    ): [Product!]!
    warehouses: [String!]!
    kpis(range: Int!): [KPI!]!
  }

  type Mutation {
    updateDemand(id: ID!, demand: Int!): Product!
    transferStock(id: ID!, qty: Int!, from: String!, to: String!): Product!
  }
`;
