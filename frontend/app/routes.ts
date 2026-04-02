import { type RouteConfig, index, route } from '@react-router/dev/routes';

export default [
  index('routes/home.tsx'),
  route('lunch', 'routes/lunch.tsx'),
  route('sports', 'routes/sports.tsx'),
  route('*', 'routes/catchall.tsx'),
] satisfies RouteConfig;
