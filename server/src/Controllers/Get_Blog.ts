import { Context } from "hono";
import { dbConnect } from "../Connection/db.connect";
import { ServergetBlogSchema } from "@swasthik/medium-common-types";

export async function getBlog(c: Context) {
    try {

        const response = ServergetBlogSchema.safeParse(c.req.param())
        if (!response.success) {
            return c.json({ error: response.error.errors[0].message }, 400)
        }

        const { partialSlug } = c.req.param()

        const prisma: any = await dbConnect(c)

        // const getBlog = await prisma.post.findMany({
        //     where: {
        //         slug: {
        //             contains: partialSlug.toLowerCase(),
        //             mode: "insensitive"
        //         }
        //     }
        // })

        console.log("heyyy");
        const getBlog = await prisma.post.findUnique({ where: { slug: partialSlug } })

        if (!getBlog) {
            return c.json({ error: "Failed to get Blog" }, 400)
        }

        // if (getBlog.length === 0) {
        //     return c.json({ msg: "No posts found" }, 200)
        // }

        return c.json({ data: getBlog }, 200)

    } catch (error) {
        console.log(error);
        return c.json({ message: "Something went wrong" }, 400)
    }
}