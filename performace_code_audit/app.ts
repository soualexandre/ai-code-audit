import Fastify from 'fastify';
import dashboardRoutes from './src/modules/dashboard/dashboard.routes';

const app = Fastify({
  logger: true
});

app.register(dashboardRoutes, { prefix: '/api/v1/dashboard' });

export default app;