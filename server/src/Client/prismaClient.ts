import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { Context, Next } from 'hono';
import { apiError } from 'utils/apiError';

let prisma: any;
let currentDbUrl: string | undefined;

const getPrismaClient = async (dbUrl: any) => {
    if (!prisma || currentDbUrl !== dbUrl) {
        if (prisma) {
            await prisma.$disconnect().catch((error: any) => {
                console.error('Error disconnecting old Prisma Client:', error);
            });
        }

        console.log('Creating new Prisma Client');

        try {
            prisma = new PrismaClient({
                datasourceUrl: dbUrl,
            }).$extends(withAccelerate());

            await prisma.$connect();
            console.log('DB - Connection Established');

        } catch (error) {
            console.error('DB - Connection Failed\n', error);
            prisma = undefined;
            return null;
        }

        currentDbUrl = dbUrl;
    }

    console.log('Not Creating Prisma Client');
    return prisma as PrismaClient;
};

export async function connectPrismaClient(c: Context, next: Next) {
    try {
        const dbUrl: string = c.env.DATABASE_URL;
        const prisma: PrismaClient | null = await getPrismaClient(dbUrl);

        if (!prisma) {
            return apiError(c, 500, 'Internal Server Error');
        }

        c.set('prisma', prisma);
        await next();
    } catch (error) {
        console.error('Prisma Client Middleware Error: ', error);
        return apiError(c, 500, 'Internal Server Error');
    }
}


