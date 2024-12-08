import { Context } from "hono";
import { apiError } from "../../../utils/apiError";
import { PostStatus } from "@prisma/client";
import { apiResponse } from "../../../utils/apiResponse";

export async function archivePost(c: Context) {

    const userId = c.get('user').id;

    const postId = c.req.param('postId');

    if (!postId) { return apiError(c, 400, "Post Id is required"); }

    try {
        const prisma: any = c.get('prisma');

        const post = await prisma.post.findUnique({
            where: { id: postId }
        })

        if (!post) { return apiError(c, 400, "Post Not Found") }

        if (userId !== post.authorId) {
            return apiError(c, 400, "You have no permission to archive this post")
        }

        if (post.status === PostStatus.ARCHIVED) {
            return apiError(c, 400, "Post is already archived")
        }

        if (post.status === PostStatus.DRAFT) {
            return apiError(c, 400, "You're post is in DRAFT , first PUBLISH it")
        }

        const archivePost = await prisma.post.update({
            where: { id: post.id },
            data: { status: PostStatus.ARCHIVED }
        })

        if (!archivePost) {
            return apiError(c, 400, "Archive post Failed")
        }

        return apiResponse(c, 200, archivePost, "Post Archived Successfully")

    } catch (error: any) {
        console.log("Archive Post Error : ", error);
        return apiError(c, 500, "Internal Server Error")
    }

}

export async function unArchivePost(c: Context) {

    const userId = c.get('user').id;

    const postId = c.req.param('postId');

    if (!postId) { return apiError(c, 400, "Post Id is required"); }

    try {
        const prisma: any = c.get('prisma');

        const post = await prisma.post.findUnique({
            where: { id: postId }
        })

        if (!post) { return apiError(c, 400, "Post Not Found") }

        if (userId !== post.authorId) {
            return apiError(c, 400, "You have no permission to unarchive this post")
        }

        if (post.status === PostStatus.DRAFT) {
            return apiError(c, 400, "You're post is in DRAFT , first PUBLISH it")
        }

        if (post.status === PostStatus.PUBLISHED) {
            return apiError(c, 400, "You're post is already Published")
        }

        if (post.status === PostStatus.ARCHIVED) {
            const unArchivePost = await prisma.post.update({
                where: { id: post.id },
                data: { status: PostStatus.PUBLISHED }
            })

            if (!unArchivePost) {
                return apiError(c, 400, "UnArchive post Failed")
            }

            return apiResponse(c, 200, unArchivePost, "Post UnArchived Successfully")
        }

    } catch (error: any) {
        console.log("UnArchive Post Error : ", error);
        return apiError(c, 500, "Internal Server Error")
    }
}

