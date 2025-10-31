import { FastifyRequest, FastifyReply } from 'fastify';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const getDashboardData = async (request: FastifyRequest, reply: FastifyReply) => {
  
  await delay(2000); 

  const mockData = {
    totalUsers: 1450,
    newSignups: 32,
    pendingOrders: 15,
    revenue: 5430.75,
    metrics: [
      { day: 'Segunda', visits: 300 },
      { day: 'Terça', visits: 450 },
      { day: 'Quarta', visits: 600 }
    ]
  };

  return mockData;
};