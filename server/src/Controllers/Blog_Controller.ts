import { Context } from "hono";
import { createSlug } from "../utils/createSlug";
import { dbConnect } from "../Connection/db.connect";
import { ServerBlogSchema } from "@swasthik/medium-common-types";

export async function blog(c: Context) {
    try {
        const user = c.get('user')

        const response = ServerBlogSchema.safeParse(await c.req.json())
        if (!response.success) {
            return c.json({ error: response.error.errors[0].message }, 400)
        }

        const { title, content, published, tags } = response.data

        const slug = createSlug(title, 20)

        const prisma: any = await dbConnect(c);

        const createPost = await prisma.post.create({
            data: {
                title,
                content,
                published,
                authorId: user.id,
                tags,
                slug
            }
        })

        if (!createPost) {
            return c.json({ error: "Failed to create Post" }, 403)
        }

        return c.json({ msg: "Post Created Successfully", data: createPost }, 200)
    } catch (error: any) {
        if (error.code === 'P2002') {
            return c.json({ error: "Post with same title already exists" }, 400)
        }
        return c.json({ error: "Something went wrong" }, 400)
    }
}