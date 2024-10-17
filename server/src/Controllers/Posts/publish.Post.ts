import { Context } from "hono";
import { apiError } from "../../utils/apiError";
import { dbConnect } from "../../Connection/db.connect";
import { PostStatus } from "@prisma/client";
import { apiResponse } from "../../utils/apiResponse";
import { createPostSchema } from "./create.Post";

export async function publishPost(c: Context) {
    try {
        const userId = c.get('user').id

        const prisma = c.get('prisma');

        const parsedBody = createPostSchema.safeParse(await c.req.json());

        if (!parsedBody.success) {
            return apiError(c, 400, parsedBody.error.errors[0].message);
        }

        return apiResponse(c, 200, 'hey', "Post publis");

        // const updatedPost = await prisma.post.update({
        //     where: { id: postId },
        //     data: {
        //         publishedAt: post.status === PostStatus.DRAFT ? new Date() : post.publishedAt,
        //         status: PostStatus.PUBLISHED,
        //     }
        // });

        // return apiResponse(c, 200, updatedPost, "Post published successfully");

    } catch (error: any) {
        console.error("Publish Post Error:", error);
        return apiError(c, 500, "Internal Server Error", { code: "CE" });
    }
}

export async function publishDraftedPost(c: Context) {
    try {
        const postId = c.req.param('postId');
        const userId = c.get('user').id

        if (!postId) {
            return apiError(c, 400, "Post ID is required");
        }

        const prisma = c.get('prisma');

        const parsedBody = createPostSchema.safeParse(await c.req.json());

        if (!parsedBody.success) {
            return apiError(c, 400, parsedBody.error.errors[0].message);
        }

        const post = await prisma.post.findUnique({
            where: { id: postId }
        });

        if (!post) {
            return apiError(c, 404, "Post not found");
        }

        if (post.authorId !== userId) {
            return apiError(c, 403, "You do not have permission to publish this post");
        }

        if (post.status === PostStatus.PUBLISHED) {
            return apiError(c, 400, "This post is already published");
        }

        const updatedPost = await prisma.post.update({
            where: { id: postId },
            data: {
                publishedAt: post.status === PostStatus.DRAFT ? new Date() : post.publishedAt,
                status: PostStatus.PUBLISHED,
            }
        });

        return apiResponse(c, 200, updatedPost, "Post published successfully");

    } catch (error: any) {
        console.error("Publish Post Error:", error);
        return apiError(c, 500, "Internal Server Error", { code: "CE" });
    }
}
