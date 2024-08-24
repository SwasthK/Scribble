import { Context } from "hono";
import { dbConnect } from "../Connection/db.connect";

export async function get_Blog_bulk(c: Context) {
    try {

        const prisma: any = await dbConnect(c);
        const getBlogBulk = await prisma.post.findMany({
            select: {
                title: true,
                content: true,
                id: true,
                createdAt: true,
                tags: true,
                slug: true,
                author: {
                    select: {
                        username: true,
                        avatarUrl: true
                    }
                }
            }
        });

        if (!getBlogBulk) {
            return c.json({ error: "Failed to get Blog" }, 400);
        }
        return c.json({ data: getBlogBulk }, 200);
    }
    catch (e) {
        console.log(e);
        return c.json({ error: "something went wrong" }, 400);
    }
}