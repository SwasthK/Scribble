import { Context } from "hono";
import { apiError } from "../../utils/apiError";
import { dbConnect } from "../../Connection/db.connect";
import { PostStatus } from "@prisma/client";
import { apiResponse } from "../../utils/apiResponse";

export async function archivePost(c: Context) {

    const userId = c.get('user').id;
    
    const postId = c.req.param('postId');

    if (!postId) {
        return apiError(c, 400, "Post Id is required");
    }

    try {
        const prisma: any = await dbConnect(c);

        const post = await prisma.post.findUnique({
            where: { id: postId }
        })

        if (!post) {
            return apiError(c, 400, "Post Not Found")
        }

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
        return apiError(c, 500, "Internal Server Error", { code: "CE" })
    }

}