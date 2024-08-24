import { Context } from "hono";
import { dbConnect } from "../Connection/db.connect";

export async function getAllBlog(c: Context) {
    try {
        const user = c.get('user')
        
        const prisma: any = await dbConnect(c)
        const getBlog = await prisma.post.findMany({
            where: {
                authorId: user.id
            }
        })
        if (!getBlog) {
            return c.json({ error: "Failed to get Blog" }, 400)
        }
        return c.json({ data: getBlog }, 200)

    }
    catch (e) {
        return c.json({ error: "something went wrong" }, 400)
    }
}