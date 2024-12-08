import { PostStatus } from "@prisma/client";
import { Context } from "hono";
import { apiError } from "utils/apiError";
import { apiResponse } from "utils/apiResponse";

export async function getDraftedPostShortned(c: Context) {
    const user = c.get("user");

    try {
        const prisma = c.get('prisma');

        const posts = await prisma.post.findMany({
            where: {
                authorId: user.id,
                status: PostStatus.DRAFT
            },
            orderBy: {
                updatedAt: 'desc'
            },
            select: {
                id: true,
                authorId: true,
                title: true,
                status: true,
                updatedAt: true
            }
        });

        if (!posts) {
            return apiError(c, 404, "No Drafts Found");
        }

        return apiResponse(c, 200, posts, "Drafts fetched successfully");

    } catch (error: any) {
        console.log("Get All Draft Posts Shortened Error: ", error.message);
        return apiError(c, 500, "Internal Server Error");
    }

}

export async function getDraftedPostFullContentById(c: Context) {
    const user = c.get("user");

    const postId = c.req.param('postId');

    if (!postId) {
        return apiError(c, 400, "Post Id is required");
    }

    try {
        const prisma = c.get('prisma');

        const post = await prisma.post.findFirst({
            where: {
                AND: [{
                    id: postId,
                    authorId: user.id,
                }]
            },
            select: {
                title: true,
                shortCaption: true,
                body: true,
                coverImage: true,
                summary: true,
                allowComments: true,
            }
        });

        if (!post) {
            return apiError(c, 404, "No Draft Found");
        }

        return apiResponse(c, 200, post, "Draft fetched successfully");

    } catch (error: any) {
        console.log("Get Draft Post Full Content Error: ", error.message);
        return apiError(c, 500, "Internal Server Error");
    }

}