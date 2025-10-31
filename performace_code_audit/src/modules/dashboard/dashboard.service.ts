import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';

type ID = string;

interface User {
    id: ID;
    name: string;
    email: string;
    role: 'admin' | 'user' | 'viewer';
    lastLogin: string;
}

interface Notification {
    id: ID;
    title: string;
    body: string;
    read: boolean;
    createdAt: string;
    severity: 'info' | 'warning' | 'critical';
}

interface Configs {
    theme: 'light' | 'dark';
    itemsPerPage: number;
    enableNotifications: boolean;
    features: Record<string, boolean>;
}

interface Metrics {
    activeUsers: number;
    newSignups: number;
    errorsLast24h: number;
    cpuUsagePercent: number;
    memoryUsageMb: number;
    requestsPerMinute: number;
    custom?: Record<string, number>;
}

interface DashboardSummary {
    user: User;
    unreadNotifications: number;
    configs: Configs;
    metrics: Metrics;
    generatedAt: string;
}

const delay = (ms = 2000) => new Promise((res) => setTimeout(res, ms));

export default class DashboardService {
    constructor() {
    }

    async getUser(): Promise<User> {
        await delay();
        return {
            id: 'user_123',
            name: 'Alexandre Souza',
            email: 'alexandre@example.com',
            role: 'admin',
            lastLogin: new Date().toISOString(),
        };
    }

    async getNotifications(limit = 10): Promise<Notification[]> {
        await delay();
        const now = Date.now();
        const sample: Notification[] = Array.from({ length: Math.min(limit, 10) }).map((_, i) => ({
            id: `notif_${i + 1}`,
            title: ['Backup completed', 'New login', 'High memory usage', 'Feature rollout'][i % 4],
            body: `This is a mock notification #${i + 1}`,
            read: i % 3 === 0,
            createdAt: new Date(now - i * 1000 * 60 * 15).toISOString(),
            severity: (['info', 'warning', 'critical'] as const)[i % 3],
        }));
        return sample;
    }

    async getConfigs(): Promise<Configs> {
        await delay();
        return {
            theme: 'dark',
            itemsPerPage: 25,
            enableNotifications: true,
            features: {
                betaDashboard: true,
                advancedMetrics: false,
                exportCsv: true,
            },
        };
    }

    async getMetrics(timeframe: '1h' | '24h' | '7d' = '24h'): Promise<Metrics> {
        await delay();
        const factor = timeframe === '1h' ? 0.6 : timeframe === '7d' ? 1.4 : 1;
        return {
            activeUsers: Math.round(120 * factor),
            newSignups: Math.round(8 * factor),
            errorsLast24h: Math.round(2 * factor),
            cpuUsagePercent: +(35 * factor).toFixed(1),
            memoryUsageMb: Math.round(1024 * factor),
            requestsPerMinute: Math.round(400 * factor),
            custom: {
                dbConnections: Math.round(15 * factor),
                cacheHitsPercent: Math.round(89 * factor) % 100,
            },
        };
    }

    async getSummary(): Promise<DashboardSummary> {
        const [user, notifications, configs, metrics] = await Promise.all([
            this.getUser(),
            this.getNotifications(5),
            this.getConfigs(),
            this.getMetrics(),
        ]);

        return {
            user,
            unreadNotifications: notifications.filter((n) => !n.read).length,
            configs,
            metrics,
            generatedAt: new Date().toISOString(),
        };
    }

    /**
     * Convenience to return all dashboard fragments.
     * Each fragment intentionally waits ~2s, but calls are done in parallel.
     */
    async getAll(): Promise<{
        user: User;
        notifications: Notification[];
        configs: Configs;
        metrics: Metrics;
        summary: DashboardSummary;
    }> {
        const [user, notifications, configs, metrics, summary] = await Promise.all([
            this.getUser(),
            this.getNotifications(10),
            this.getConfigs(),
            this.getMetrics(),
            this.getSummary(),
        ]);

        return { user, notifications, configs, metrics, summary };
    }
}

export async function registerDashboardRoutes(fastify: FastifyInstance) {
    const svc = new DashboardService();

    fastify.get('/dashboard/user', async (_req: FastifyRequest, reply: FastifyReply) => {
        const data = await svc.getUser();
        return reply.send(data);
    });

    fastify.get('/dashboard/notifications', async (req: FastifyRequest<{ Querystring: { limit?: string } }>, reply: FastifyReply) => {
        const limit = req.query?.limit ? Math.max(1, Math.min(50, Number(req.query.limit))) : 10;
        const data = await svc.getNotifications(limit);
        return reply.send(data);
    });

    fastify.get('/dashboard/configs', async (_req: FastifyRequest, reply: FastifyReply) => {
        const data = await svc.getConfigs();
        return reply.send(data);
    });

    fastify.get('/dashboard/metrics', async (req: FastifyRequest<{ Querystring: { timeframe?: '1h' | '24h' | '7d' } }>, reply: FastifyReply) => {
        const tf = req.query?.timeframe ?? '24h';
        const data = await svc.getMetrics(tf);
        return reply.send(data);
    });

    fastify.get('/dashboard/summary', async (_req: FastifyRequest, reply: FastifyReply) => {
        const data = await svc.getSummary();
        return reply.send(data);
    });

    fastify.get('/dashboard/all', async (_req: FastifyRequest, reply: FastifyReply) => {
        const data = await svc.getAll();
        return reply.send(data);
    });

    fastify.get('/dashboard/ping', async (_req: FastifyRequest, reply: FastifyReply) => {
        return reply.send({ ok: true, ts: new Date().toISOString() });
    });
}