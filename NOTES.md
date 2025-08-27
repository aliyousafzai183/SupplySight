# SupplySight Dashboard - Technical Notes

## Architecture Decisions & Tradeoffs

### Monorepo Structure
**Decision**: Used npm workspaces with `apps/web` and `apps/server` separation
**Rationale**: 
- Keeps UI and API concerns separate while sharing tooling
- Enables independent deployment of frontend and backend
- Matches the assignment requirement for both React app and GraphQL server
- Easier dependency management and versioning

**Alternative Considered**: Single app with embedded GraphQL server
**Tradeoff**: Would simplify setup but violates separation of concerns

### Frontend Framework Choices

#### React 18 + TypeScript + Vite
**Decision**: Modern React with TypeScript and Vite
**Rationale**:
- TypeScript provides compile-time safety for complex business logic
- Vite offers faster development experience than Create React App
- React 18 features (concurrent rendering, automatic batching) for future scalability

#### TanStack Router vs React Router
**Decision**: TanStack Router for type-safe routing
**Rationale**:
- Type-safe route definitions and parameters
- Better integration with TypeScript
- URL-driven state management for filters
**Tradeoff**: Smaller ecosystem compared to React Router

#### Apollo Client vs urql
**Decision**: Apollo Client for GraphQL operations
**Rationale**:
- Mature ecosystem with excellent TypeScript support
- Normalized cache for optimistic updates
- Built-in error handling and loading states
- Better developer tools

### Backend Framework Choices

#### GraphQL Yoga vs Apollo Server
**Decision**: GraphQL Yoga for the mock API
**Rationale**:
- Lighter weight for a mock server
- Modern GraphQL-first approach
- Easy to extend and modify
- Built-in playground for testing

#### Pino vs Winston
**Decision**: Pino for structured logging
**Rationale**:
- Better performance for high-throughput scenarios
- JSON-structured logs for better observability
- Smaller bundle size

### UI/UX Decisions

#### Tailwind CSS vs Styled Components
**Decision**: Tailwind CSS for styling
**Rationale**:
- Rapid development with utility classes
- Consistent design system out of the box
- Smaller bundle size in production
- Matches assignment requirement

#### Recharts vs D3.js
**Decision**: Recharts for data visualization
**Rationale**:
- React-native API
- Built-in responsiveness
- Good TypeScript support
- Faster development than D3.js

## Business Logic Implementation

### Status Calculation
```typescript
const getStatus = (stock: number, demand: number): Status => {
  if (stock > demand) return 'HEALTHY';
  if (stock === demand) return 'LOW';
  return 'CRITICAL';
};
```
**Decision**: Simple, readable logic matching assignment requirements exactly
**Tradeoff**: Could be more sophisticated with thresholds and ranges

### Fill Rate Calculation
```typescript
const fillRate = totalDemand > 0 
  ? products.reduce((sum, p) => sum + Math.min(p.stock, p.demand), 0) / totalDemand * 100
  : 0;
```
**Decision**: Matches assignment specification exactly
**Rationale**: Clear business logic that's easy to understand and test

### Filtering Strategy
**Decision**: Client-side filtering with debounced search
**Rationale**:
- Immediate UI feedback
- Reduces server load
- Better user experience
**Tradeoff**: Could be server-side for large datasets

## Data Layer Architecture

### GraphQL Schema Design
**Decision**: Simple, focused schema matching assignment requirements
**Rationale**:
- Clear separation of concerns
- Easy to extend
- Matches the provided sample data structure

### Caching Strategy
**Decision**: Apollo Client normalized cache
**Rationale**:
- Automatic cache updates across components
- Optimistic updates for mutations
- Reduces unnecessary network requests

### Error Handling
**Decision**: Graceful degradation with user-friendly messages
**Rationale**:
- Better user experience
- Helps with debugging
- Production-ready error boundaries

## Performance Considerations

### Code Splitting
**Decision**: Route-level code splitting with Vite
**Rationale**:
- Faster initial page load
- Better caching strategies
- Progressive loading

### Optimistic Updates
**Decision**: Implemented for mutations
**Rationale**:
- Snappy user experience
- Immediate feedback
- Automatic rollback on errors

### Memoization
**Decision**: Used React.memo and useMemo where beneficial
**Rationale**:
- Prevents unnecessary re-renders
- Better performance for expensive calculations
- Careful not to over-optimize

## Testing Strategy

### Unit Testing
**Decision**: Vitest + React Testing Library
**Rationale**:
- Fast execution
- Good React component testing
- TypeScript support

### E2E Testing
**Decision**: Playwright for end-to-end testing
**Rationale**:
- Cross-browser testing
- Modern async/await API
- Good debugging tools

### Test Coverage
**Decision**: Focus on business logic and user interactions
**Rationale**:
- Tests that provide value
- Coverage of critical paths
- Maintainable test suite

## Security Considerations

### Input Validation
**Decision**: Zod schemas for runtime validation
**Rationale**:
- Type-safe validation
- Good error messages
- Easy to maintain

### CORS Configuration
**Decision**: Environment-specific CORS settings
**Rationale**:
- Secure in production
- Flexible for development
- Prevents unauthorized access

### GraphQL Security
**Decision**: Basic introspection control
**Rationale**:
- Prevents schema exposure in production
- Maintains development experience
- Simple to implement

## Recent Improvements (Post-Initial Implementation)

### ✅ Stock Transfer Bug Fix
**Fixed**: Critical bug where transferring stock to a new warehouse cloned the product instead of creating a new entry
**Problem**: Apollo Client cache collision for products with same ID in different warehouses
**Solution**: Modified Apollo Client's `typePolicies` to use composite key `['id', 'warehouse']` for Product entities
**Impact**: Stock transfers now work correctly, creating new products in target warehouses

### ✅ Demand Update Bug Fix
**Fixed**: `updateDemand` mutation affecting incorrect products due to only using `id`
**Problem**: Backend resolver only used product ID, not distinguishing by warehouse
**Solution**: Updated GraphQL schema, backend resolver, frontend mutation, and Apollo cache logic to include `warehouse` as distinguishing factor
**Impact**: Demand updates now correctly target specific products in specific warehouses

### ✅ Filter Persistence Enhancement
**Added**: URL-based filter persistence instead of localStorage
**Features**:
- All filters (search, warehouse, status, page) persisted in URL search parameters
- Browser back/forward navigation support
- Shareable URLs with current filter state
- Automatic state synchronization

**Implementation**:
```typescript
const parseQueryParams = (): { initFilters: ProductsFilters; initRange: '7d' | '14d' | '30d' } => {
  const params = new URLSearchParams(window.location.search);
  // Parse filters from URL...
};

useEffect(() => {
  const params = new URLSearchParams();
  // Update URL when filters change...
  window.history.replaceState(null, '', `${window.location.pathname}?${params.toString()}`);
}, [filters, kpiRange]);
```

### ✅ Date Range Enhancement
**Added**: Date range chips moved to top bar affecting entire page
**Features**:
- Date range selection affects both KPI cards and line chart
- Visual enhancement with better color scheme for chips
- Responsive design for mobile devices

### ✅ Comprehensive Test Coverage
**Added**: Complete test suite covering all components and utilities
**Coverage**:
- 18 test files with 191 individual tests
- Unit tests for all components, utilities, and GraphQL operations
- Integration tests for complex workflows
- Mock setup for external dependencies (recharts, react-hot-toast, etc.)

**Test Structure**:
```
✅ Components: KPICard, StatusPill, Pagination, Filters, ProductsTable, Drawer
✅ Routes: Main dashboard route
✅ Features: Product types, queries, mutations
✅ Utilities: Status logic, formatting, environment validation
✅ Integration: Apollo Client, environment setup
```

### ✅ GitHub Actions CI/CD
**Added**: Separate workflows for different concerns
**Workflows**:
- `lint.yml` - ESLint checking
- `typecheck.yml` - TypeScript compilation
- `test.yml` - Unit test execution
- `build.yml` - Production build verification
- `delete-branch.yml` - Automatic branch cleanup

**Features**:
- Environment variables properly configured for CI
- Beautiful PR template with checkboxes
- Automatic branch deletion after merge
- Separate workflows for better visibility

### ✅ Code Organization Enhancement
**Added**: Wrapper folder structure with barrel exports
**Structure**:
```
components/
├── KPICard/
│   ├── KPICard.tsx
│   ├── KPICard.unit.test.tsx
│   └── index.ts
├── StatusPill/
│   ├── StatusPill.tsx
│   ├── StatusPill.unit.test.tsx
│   └── index.ts
└── ...
```

**Benefits**:
- Better organization and discoverability
- Co-located tests with components
- Clean import paths with barrel exports
- Easier maintenance and refactoring

### ✅ Environment Variable Fix
**Fixed**: GitHub Actions environment variable issues
**Problem**: Tests failing in CI due to missing `VITE_GRAPHQL_URL` environment variable
**Solution**: 
- Added environment variables to all relevant workflows
- Updated Zod schema with default values
- Added environment mocking in test setup
**Impact**: All tests now pass in both local and CI environments

## Future Improvements

### Short Term (1-2 weeks)
1. ✅ **Pagination**: Implemented proper server-side pagination with ProductConnection
2. **Sorting**: Add column sorting to the products table
3. **Export**: CSV export functionality
4. **Real-time Updates**: WebSocket integration for live data
5. ✅ **Advanced Filtering**: Multi-select filters and date ranges
6. ✅ **URL State Management**: Filters and pagination state persisted in URL
7. ✅ **Optimistic Updates**: Mutations now update cache immediately with rollback on error

### Medium Term (1-2 months)
1. **Authentication**: User authentication and authorization
2. **Multi-warehouse**: Proper multi-warehouse inventory management
3. **Audit Trail**: Track all inventory changes
4. **Notifications**: Alert system for critical stock levels
5. **Mobile App**: React Native companion app

### Long Term (3-6 months)
1. **Machine Learning**: Demand forecasting
2. **Integration**: ERP system integrations
3. **Analytics**: Advanced reporting and analytics
4. **Microservices**: Break down into microservices
5. **Internationalization**: Multi-language support

## Technical Debt & Limitations

### Current Limitations
1. **Mock Data**: Using file-based storage instead of real database
2. **Single Warehouse**: Simplified warehouse model
3. **No Authentication**: No user management system
4. **Limited Error Handling**: Basic error boundaries
5. **No Offline Support**: Requires internet connection

### Technical Debt
1. **Type Definitions**: Some `any` types in GraphQL resolvers
2. **Error Messages**: Could be more user-friendly
3. **Loading States**: Some components lack loading states
4. **Accessibility**: Basic ARIA support, could be improved
5. **Performance**: No virtualization for large datasets

## Deployment Strategy

### Development
- Local development with hot reloading
- GraphQL Playground for API testing
- Environment-specific configurations

### Staging
- Vercel preview deployments
- Automated testing on PRs
- Environment variable management

### Production
- Vercel production deployment
- CDN for static assets
- Monitoring and error tracking

## Lessons Learned

### What Worked Well
1. **TypeScript**: Caught many bugs early
2. **Monorepo**: Good separation of concerns
3. **GraphQL**: Flexible API design
4. **Tailwind**: Rapid UI development
5. **Apollo Client**: Excellent developer experience
6. **URL State Management**: Improved user experience significantly
7. **Optimistic Updates**: Made the app feel much more responsive
8. **Code Splitting**: Dramatically improved initial load performance

### What Could Be Improved
1. **Project Setup**: Should have used proper scaffolding tools
2. **Testing**: More comprehensive test coverage needed
3. **Documentation**: More inline documentation
4. **Error Handling**: More robust error boundaries
5. **Performance**: More performance optimization

## Conclusion

This project successfully demonstrates modern web development practices with a focus on:
- Clean, maintainable code architecture
- Type safety throughout the stack
- Excellent developer experience
- Production-ready patterns and practices
- Scalable and extensible design
- Performance optimization through code splitting
- Enhanced user experience through optimistic updates and URL state management

The application meets all assignment requirements while providing a solid foundation for future enhancements and real-world deployment. The recent improvements have significantly enhanced the user experience and performance of the application.
