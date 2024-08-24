import { Context } from "hono";
import { dbConnect } from "../Connection/db.connect";
import { ServergetBlogSchema } from "@swasthik/medium-common-types";

export async function getBlogContent(c: Context) {
    try {
        console.log("HIT SERVER");

        const response = ServergetBlogSchema.safeParse(c.req.param())

        if (!response.success) {
            return c.json({ error: response.error.errors[0].message }, 400)
        }

        const prisma: any = await dbConnect(c)

        const getBlog = await prisma.post.findUnique({
            where: {
                slug: response.data.partialSlug
            },
            select: {
                title: true,
                content: true,
                id: true,
                createdAt: true,
                tags: true,
                slug: true,
                author: {
                    select: {
                        username: true
                    }
                }
            }
        })

        if (!getBlog) {
            return c.json({ error: "Failed to get Blog" }, 400)
        }

        if (getBlog.length === 0) {
            return c.json({ msg: "No posts found" }, 200)
        }

        return c.json({ data: getBlog }, 200)

    } catch (error) {
        console.log(error);
        return c.json({ message: "Something went wrong" }, 400)
    }
}