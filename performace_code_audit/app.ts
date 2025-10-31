import Fastify from 'fastify';
import dashboardRoutes from './src/dashboard.routes';
import { deepStrictEqual } from 'assert';

const app = Fastify({
  logger: true
});

app.register(dashboardRoutes, { prefix: '/api/v1/dashboard' });

export default app;