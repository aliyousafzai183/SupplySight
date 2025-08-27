import { createRootRoute, createRoute } from '@tanstack/react-router';
import { Dashboard } from './routes/index/index.tsx';

const rootRoute = createRootRoute();

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: Dashboard,
});

export const routeTree = rootRoute.addChildren([indexRoute]);
