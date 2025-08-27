import { createRootRoute, createRoute } from '@tanstack/react-router';
import { Dashboard } from './routes/index.js';

const rootRoute = createRootRoute();

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: Dashboard,
});

export const routeTree = rootRoute.addChildren([indexRoute]);
