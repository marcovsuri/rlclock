import { type RouteConfig, index, route } from '@react-router/dev/routes';

export default [
  index('routes/home.tsx'),
  route('lunch', 'routes/lunch.tsx'),
  route('sports', 'routes/sports.tsx'),

  // Admin
  route('admin/signin', 'routes/admin/signin.tsx'),
  route('admin', 'routes/admin/layout.tsx', [
    index('routes/admin/index.tsx'),
    route('dashboard', 'routes/admin/dashboard.tsx'),
    route('change-password', 'routes/admin/change-password.ts'),
    route('signout', 'routes/admin/signout.ts'),
  ]),

  // Catch all
  route('*', 'routes/catchall.tsx'),
] satisfies RouteConfig;
