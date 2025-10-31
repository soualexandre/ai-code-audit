import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { getDashboardData } from './dasboard.controller';
import DashboardService from './dashboard.service';

async function dashboardRoutes(fastify: FastifyInstance) {
  const svc = new DashboardService();
  
  fastify.get('/', getDashboardData);
  
      fastify.get('/user', async (_req: FastifyRequest, reply: FastifyReply) => {
          const data = await svc.getUser();
          return reply.send(data);
      });
  
      fastify.get('/notifications', async (req: FastifyRequest<{ Querystring: { limit?: string } }>, reply: FastifyReply) => {
          const limit = req.query?.limit ? Math.max(1, Math.min(50, Number(req.query.limit))) : 10;
          const data = await svc.getNotifications(limit);
          return reply.send(data);
      });
  
      fastify.get('/configs', async (_req: FastifyRequest, reply: FastifyReply) => {
          const data = await svc.getConfigs();
          return reply.send(data);
      });
  
      fastify.get('/metrics', async (req: FastifyRequest<{ Querystring: { timeframe?: '1h' | '24h' | '7d' } }>, reply: FastifyReply) => {
          const tf = req.query?.timeframe ?? '24h';
          const data = await svc.getMetrics(tf);
          return reply.send(data);
      });
  
      fastify.get('/summary', async (_req: FastifyRequest, reply: FastifyReply) => {
          const data = await svc.getSummary();
          return reply.send(data);
      });
  
      fastify.get('/all', async (_req: FastifyRequest, reply: FastifyReply) => {
          const data = await svc.getAll();
          return reply.send(data);
      });
  
      fastify.get('/ping', async (_req: FastifyRequest, reply: FastifyReply) => {
          return reply.send({ ok: true, ts: new Date().toISOString() });
      });
}

export default dashboardRoutes;