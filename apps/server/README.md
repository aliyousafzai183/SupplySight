# SupplySight GraphQL Server

The mock GraphQL API server for the SupplySight Daily Inventory Dashboard. Built with Node.js 22+, GraphQL Yoga, and TypeScript.

## 🚀 Features

- **GraphQL API** - Modern GraphQL server with GraphQL Yoga
- **Type Safety** - Full TypeScript coverage
- **Structured Logging** - Pino logger for observability
- **Rate Limiting** - API protection and security
- **Mock Data** - Realistic inventory data for development
- **Development Tools** - GraphQL Playground for testing

## 📁 Project Structure

```
src/
├── resolvers/           # GraphQL resolvers
│   ├── kpis.ts         # KPI data resolvers
│   ├── products.ts     # Product data resolvers
│   └── mutations.ts    # Mutation resolvers
├── data/               # Mock data and seed files
│   └── seed.json       # Sample product data
├── schema.ts           # GraphQL schema definition
├── logger.ts           # Pino logger configuration
├── rateLimit.ts        # Rate limiting middleware
└── index.ts           # Server entry point
```

## 🛠️ Development

### Prerequisites
- Node.js 22+
- npm

### Setup
1. Install dependencies: `npm install`
2. Start development server: `npm run dev`

### Available Scripts
- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server

## 📊 GraphQL Schema

### Types
```graphql
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

type ProductConnection {
  products: [Product!]!
  totalCount: Int!
  hasNextPage: Boolean!
  hasPreviousPage: Boolean!
  currentPage: Int!
  totalPages: Int!
}
```

### Queries
```graphql
type Query {
  products(
    search: String
    warehouse: String
    status: Status
    page: Int = 1
    pageSize: Int = 10
  ): ProductConnection!
  
  warehouses: [String!]!
  
  kpis(range: Int!): [KPI!]!
}
```

### Mutations
```graphql
type Mutation {
  updateDemand(id: ID!, warehouse: String!, demand: Int!): Product!
  transferStock(id: ID!, qty: Int!, from: String!, to: String!): Product!
}
```

## 🔧 Configuration

### Environment Variables
```bash
NODE_ENV=development
PORT=4000
LOG_LEVEL=debug
```

### GraphQL Playground
Access the GraphQL Playground at: http://localhost:4000/graphql

Features:
- Interactive query builder
- Schema documentation
- Query history
- Variable testing

## 📊 Sample Data

The server includes realistic inventory data:

```json
[
  {
    "id": "P-1001",
    "name": "12mm Hex Bolt",
    "sku": "HEX-12-100",
    "warehouse": "BLR-A",
    "stock": 180,
    "demand": 120
  },
  {
    "id": "P-1002",
    "name": "Steel Washer",
    "sku": "WSR-08-500",
    "warehouse": "BLR-A",
    "stock": 50,
    "demand": 80
  }
]
```

## 🧪 Testing

### Manual Testing
Use the GraphQL Playground to test queries and mutations:

1. **Query Products**
   ```graphql
   query {
     products(page: 1, pageSize: 10) {
       products {
         id
         name
         stock
         demand
       }
       totalCount
     }
   }
   ```

2. **Update Demand**
   ```graphql
   mutation {
     updateDemand(id: "P-1001", warehouse: "BLR-A", demand: 150) {
       id
       demand
     }
   }
   ```

3. **Transfer Stock**
   ```graphql
   mutation {
     transferStock(id: "P-1001", qty: 10, from: "BLR-A", to: "DEL-B") {
       id
       warehouse
       stock
     }
   }
   ```

## 🔒 Security & Performance

### Rate Limiting
- Configurable rate limits per IP
- Prevents API abuse
- Configurable time windows

### Input Validation
- GraphQL schema validation
- Business logic validation
- Safe integer handling

### Logging
- Structured JSON logging with Pino
- Request/response logging
- Error tracking
- Performance monitoring

## 🏗️ Production Deployment

### Build Process
```bash
npm run build
```

The build process:
1. TypeScript compilation
2. Asset optimization
3. Environment variable injection

### Environment Configuration
- Production logging levels
- Rate limiting configuration
- CORS settings
- Security headers

### Monitoring
- Request/response logging
- Error tracking
- Performance metrics
- Health check endpoints

## 🔧 Business Logic

### Product Status Calculation
```typescript
const getStatus = (stock: number, demand: number): Status => {
  if (stock > demand) return 'HEALTHY';
  if (stock === demand) return 'LOW';
  return 'CRITICAL';
};
```

### Fill Rate Calculation
```typescript
const fillRate = totalDemand > 0 
  ? products.reduce((sum, p) => sum + Math.min(p.stock, p.demand), 0) / totalDemand * 100
  : 0;
```

### Pagination Logic
- Server-side pagination
- Configurable page sizes
- Total count calculation
- Page navigation metadata

## 🚀 API Endpoints

### GraphQL Endpoint
- **URL**: `/graphql`
- **Method**: POST
- **Content-Type**: application/json

### Health Check
- **URL**: `/health`
- **Method**: GET
- **Response**: Server status and uptime

### GraphQL Playground
- **URL**: `/graphql`
- **Method**: GET
- **Features**: Interactive GraphQL IDE

## 🤝 Contributing

1. Follow TypeScript best practices
2. Add proper error handling
3. Update GraphQL schema documentation
4. Test queries and mutations
5. Update this README as needed

## 📝 License

MIT License - see LICENSE file for details.
