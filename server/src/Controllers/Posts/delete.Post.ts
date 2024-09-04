import { Context } from "hono";
import z from "zod";
import { apiError } from "../../utils/apiError";
import { dbConnect } from "../../Connection/db.connect";
import { apiResponse } from "../../utils/apiResponse";

const deletePostSchema = z.object({
    postId: z.string({ required_error: "Post ID required", invalid_type_error: "Invalid Post ID" })
        .uuid({ message: "Invalid Post ID" }),
})

export async function deletePost(c: Context) {
    const userId = c.get('user').id

    const postId = c.req.param('postId');

    if (!postId) {
        return apiError(c, 400, 'Post ID is required');
    }

    const validatePostId = deletePostSchema.safeParse({ postId });

    if (!validatePostId.success) {
        return apiError(c, 400, validatePostId.error.errors[0].message);
    }

    try {

        const prisma: any = await dbConnect(c);

        const post = await prisma.post.findFirst({
            where: {
                AND: [{
                    id: postId,
                    author: { id: userId }
                }]
            }
        });

        if (!post) {
            return apiError(c, 404, "Post not found");
        }

        const deletePost = await prisma.post.delete({
            where: {
                id: postId
            }
        });

        if (!deletePost) {
            return apiError(c, 500, "Failed to delete post");
        }

        return apiResponse(c, 200, post, "Post deleted successfully");

    } catch (error: any) {
        console.log("Delete Post Error", error);
        return apiError(c, 500, "Internal Server Error", { code: "CE" });
    }

}