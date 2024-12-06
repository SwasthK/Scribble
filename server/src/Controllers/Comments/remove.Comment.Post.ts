import { Context } from "hono";
import { apiError } from "../../utils/apiError";
import { apiResponse } from "../../utils/apiResponse";
import { removeCommentSchema } from "Zod/zod";

export const removeComment = async (c: Context) => {
    try {

        const userId = c.get('user').id;

        const body = await c.req.json()
            .catch(() => apiError(c, 400, "Invalid JSON body"));

        const response = removeCommentSchema.safeParse(body);

        if (!response.success) {
            return apiError(c, 400, response.error.errors[0].message);
        }

        const { postId, commentId } = response.data;

        const prisma: any = await c.get('prisma');

        const post = await prisma.post.findUnique({
            where: { id: response.data.postId },
        });

        if (!post) {
            return apiError(c, 404, "Post not found");
        }

        const comment = await prisma.comment.findUnique({
            where: { id: commentId },
        });

        if (!comment) {
            return apiError(c, 404, "Comment not found");
        }

        if (comment.authorId !== userId) {
            return apiError(c, 403, "You are not authorized to delete this comment");
        }

        if (!comment.parentId) {

            await prisma.comment.deleteMany({
                where: { parentId: commentId },
            });

            await prisma.comment.delete({
                where: { id: commentId },
            });

        }

        else {

            await prisma.comment.delete({
                where: { id: commentId },
            });

        }

        return apiResponse(c, 200, {}, "Comment removed successfully");
    } catch (error: any) {
        console.error("Remove Comment Error: ", error.message);
        return apiError(c, 500, "Internal Server Error", { code: "CE" });
    }
};
