import { PostStatus } from "@prisma/client";
import { Context } from "hono";
import { apiError } from "utils/apiError";
import { apiResponse } from "utils/apiResponse";

export async function getArchivedPost(c: Context) {
    const userId = c.get("user").id;

    try {
        const prisma = c.get('prisma');

        const posts = await prisma.post.findMany({
            where: {
                authorId: userId,
                status: PostStatus.ARCHIVED
            },
            select: {
                id: true,
                title: true,
                slug: true,
                coverImage: true,
            }
        });

        if (!posts) {
            return apiError(c, 404, "No Post Found");
        }

        if (posts.length === 0) {
            return apiError(c, 404, "No Post Found");
        }

        return apiResponse(c, 200, posts, "Posts fetched successfully");

    } catch (error: any) {
        console.log("Get All Archived Posts Error: ", error.message);
        return apiError(c, 500, "Internal Server Error");
    }

}