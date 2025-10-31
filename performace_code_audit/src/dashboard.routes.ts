import { FastifyInstance } from 'fastify';
import { getDashboardData } from './dasboard.controller';

async function dashboardRoutes(fastify: FastifyInstance) {
  fastify.get('/', getDashboardData);
}

export default dashboardRoutes;