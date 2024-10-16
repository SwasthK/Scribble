import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { Context } from 'hono';
import { Log } from '../utils/log';
import { apiError } from '../utils/apiError';

export async function dbConnect(c: Context<{ Bindings: { DATABASE_URL: string, JWT_SECRET: string } }>) {

    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    })
        .$extends(withAccelerate())

    try {
        await prisma.$connect();
        Log('Database', 'Connection established successfully');
        return prisma;
    } catch (error: any) {
        Log('Database', 'Connection Failed,', `Error: ${error.message}`);
        return apiError(c, 500, 'Internal Server Error');
    }

}