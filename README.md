# SupplySight Dashboard

A production-ready Daily Inventory Dashboard built with React, TypeScript, and GraphQL. This project demonstrates modern web development practices with a focus on clean architecture, excellent developer experience, and real-world quality gates.

## 🚀 Features

- **React 18 + TypeScript + Tailwind CSS** - Modern, type-safe UI development
- **GraphQL API** - Mock server with Apollo Yoga for realistic data operations
- **Real-time Dashboard** - Live KPI cards, trend charts, and product management
- **Advanced Filtering** - Search, warehouse, and status-based filtering
- **Interactive Product Management** - Update demand and transfer stock operations
- **Responsive Design** - Mobile-first approach with Tailwind CSS
- **Production Ready** - Error handling, loading states, and accessibility

## 📊 Dashboard Features

### KPI Cards
- **Total Stock** - Sum of all product stock levels
- **Total Demand** - Sum of all product demand
- **Fill Rate** - Calculated as `sum(min(stock, demand)) / sum(demand) * 100%`

### Product Status System
- 🟢 **Healthy** - Stock > Demand
- 🟡 **Low** - Stock = Demand  
- 🔴 **Critical** - Stock < Demand (with red row highlighting)

### Interactive Features
- **Live Filtering** - Search by name, SKU, or ID
- **Warehouse Filtering** - Filter by specific warehouses
- **Status Filtering** - Filter by product status
- **Product Details Drawer** - Click any row to view details and perform actions
- **Stock Operations** - Update demand and transfer stock between warehouses

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first styling
- **Apollo Client** - GraphQL client with normalized cache
- **TanStack Router** - Type-safe routing
- **Recharts** - Data visualization
- **Vite** - Build tool and dev server

### Backend
- **Node.js 22+** - Runtime
- **GraphQL Yoga** - GraphQL server
- **Pino** - Structured logging
- **TypeScript** - Type safety

### Development
- **Vitest** - Unit testing
- **React Testing Library** - Component testing
- **Playwright** - E2E testing
- **ESLint** - Code linting
- **Prettier** - Code formatting

## 🚀 Quick Start

### Prerequisites
- Node.js 22+ 
- npm

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd SupplySight
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   # Create .env file in apps/web/
   echo "VITE_GRAPHQL_URL=http://localhost:4000/graphql" > apps/web/.env
   ```

4. **Start development servers**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   - Frontend: http://localhost:5173
   - GraphQL Playground: http://localhost:4000/graphql

## 📁 Project Structure

```
supply-sight/
├── apps/
│   ├── web/                    # React frontend
│   │   ├── src/
│   │   │   ├── app/
│   │   │   │   ├── components/ # Reusable UI components
│   │   │   │   └── routes/     # Page components
│   │   │   ├── features/       # Feature-based organization
│   │   │   │   └── products/   # Product domain
│   │   │   └── lib/           # Utilities and config
│   │   └── ...
│   └── server/                 # GraphQL API
│       ├── src/
│       │   ├── resolvers/      # GraphQL resolvers
│       │   ├── data/          # Seed data
│       │   └── ...
│       └── ...
└── ...
```

## 🧪 Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Type checking
npm run typecheck

# Linting
npm run lint
```

## 🏗️ Building for Production

```bash
# Build both apps
npm run build

# Start production servers
npm start
```

## 🔧 Development Scripts

- `npm run dev` - Start development servers
- `npm run build` - Build for production
- `npm run start` - Start production servers
- `npm run test` - Run unit tests
- `npm run test:e2e` - Run E2E tests
- `npm run lint` - Run ESLint
- `npm run typecheck` - Run TypeScript compiler

## 📊 Sample Data

The application comes with sample product data:

- **12mm Hex Bolt** (HEX-12-100) - BLR-A warehouse
- **Steel Washer** (WSR-08-500) - BLR-A warehouse  
- **M8 Nut** (NUT-08-200) - PNQ-C warehouse
- **Bearing 608ZZ** (BRG-608-50) - DEL-B warehouse

## 🎯 Business Logic

### Status Calculation
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
  ? products.reduce((sum, p) => sum + Math.min(p.stock, p.demand), 0) / totalDemand
  : 1;
```

## 🔒 Security & Performance

- **Input Validation** - Zod schemas for form validation
- **CORS Protection** - Configured for production domains
- **Rate Limiting** - API protection
- **Optimistic Updates** - Snappy UI interactions
- **Error Boundaries** - Graceful error handling
- **Accessibility** - ARIA labels and keyboard navigation

## 🚀 Deployment

The application is designed for deployment on Vercel with:

- **Environment Variables** - Secure configuration management
- **Build Optimization** - Vite for fast builds
- **CDN Integration** - Static asset optimization
- **Preview Deployments** - Automatic PR deployments

## 📝 License

MIT License - see LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

---

Built with ❤️ using modern web technologies
