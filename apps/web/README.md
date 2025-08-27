# SupplySight Web App

The frontend React application for the SupplySight Daily Inventory Dashboard. Built with React 18, TypeScript, Tailwind CSS, and Apollo Client.

## 🚀 Features

- **Modern React Stack** - React 18 with TypeScript and Vite
- **GraphQL Integration** - Apollo Client with normalized cache and optimistic updates
- **Responsive Design** - Mobile-first approach with Tailwind CSS
- **Type Safety** - Full TypeScript coverage throughout the application
- **Testing** - Comprehensive test suite with Vitest and React Testing Library
- **Performance** - Code splitting, memoization, and optimized builds

## 📁 Project Structure

```
src/
├── app/
│   ├── components/          # Reusable UI components
│   │   ├── KPICard/        # KPI display cards
│   │   ├── StatusPill/     # Product status indicators
│   │   ├── Filters/        # Search and filter controls
│   │   ├── ProductsTable/  # Product data table
│   │   ├── Drawer/         # Product details panel
│   │   ├── LineChart/      # Stock vs Demand chart
│   │   └── Pagination/     # Table pagination
│   ├── features/           # Feature-based organization
│   │   └── products/       # Product domain logic
│   │       ├── queries/    # GraphQL queries
│   │       ├── mutations/  # GraphQL mutations
│   │       └── types/      # TypeScript types
│   ├── routes/             # Page components
│   │   └── index/          # Main dashboard
│   └── lib/               # Utilities and configuration
│       ├── apollo/        # Apollo Client setup
│       ├── env/           # Environment validation
│       ├── status/        # Business logic
│       ├── format/        # Formatting utilities
│       └── toast/         # Toast notifications
├── test-setup.ts          # Test configuration
└── main.tsx              # Application entry point
```

## 🛠️ Development

### Prerequisites
- Node.js 22+
- npm

### Setup
1. Install dependencies: `npm install`
2. Create `.env` file with required environment variables
3. Start development server: `npm run dev`

### Environment Variables
```bash
VITE_GRAPHQL_URL=http://localhost:4000/graphql
VITE_SENTRY_DSN=  # Optional
```

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run test:unit` - Run unit tests
- `npm run test:watch` - Run tests in watch mode
- `npm run lint` - Run ESLint
- `npm run typecheck` - Run TypeScript compiler

## 🧪 Testing

The application includes comprehensive testing:

- **Unit Tests** - Component and utility testing with Vitest + RTL
- **Integration Tests** - GraphQL operations and complex workflows
- **Mock Setup** - External dependencies mocked for reliable testing

### Test Structure
- Each component has co-located test files
- Tests follow the pattern: `ComponentName.unit.test.tsx`
- Integration tests use the pattern: `ComponentName.int.test.ts`

### Running Tests
```bash
# Run all tests
npm run test:unit

# Run specific test file
npm run test:unit src/app/components/KPICard/KPICard.unit.test.tsx

# Run tests in watch mode
npm run test:watch
```

## 🏗️ Build & Deployment

### Production Build
```bash
npm run build
```

The build process:
1. TypeScript compilation
2. Vite bundling with code splitting
3. Asset optimization
4. Environment variable injection

### Bundle Analysis
The build creates optimized chunks:
- Main application bundle
- Vendor dependencies (React, etc.)
- Apollo Client bundle
- Charts bundle (Recharts)

### Deployment
Designed for deployment on Vercel with:
- Environment variable management
- Automatic preview deployments
- CDN integration for static assets

## 🔧 Configuration

### Vite Configuration
- React plugin with Fast Refresh
- TypeScript support
- Tailwind CSS integration
- Build optimization

### Apollo Client
- Normalized cache configuration
- Optimistic updates for mutations
- Error handling and loading states
- Type-safe GraphQL operations

### Tailwind CSS
- Custom color scheme
- Responsive design utilities
- Component-specific styles
- Dark mode support (ready)

## 📊 Business Logic

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

## 🎨 UI Components

### KPICard
Displays key performance indicators with loading states and animations.

### StatusPill
Visual indicators for product status (Healthy, Low, Critical) with appropriate colors.

### ProductsTable
Data table with sorting, filtering, and pagination capabilities.

### Drawer
Slide-out panel for product details and operations (update demand, transfer stock).

### LineChart
Responsive chart showing stock vs demand trends over time.

## 🔒 Security & Performance

- **Input Validation** - Zod schemas for form validation
- **Type Safety** - TypeScript throughout the application
- **Error Boundaries** - Graceful error handling
- **Accessibility** - ARIA labels and keyboard navigation
- **Performance** - Memoization and code splitting

## 🤝 Contributing

1. Follow the established code organization patterns
2. Add tests for new features
3. Ensure TypeScript compilation passes
4. Run linting before committing
5. Update documentation as needed
