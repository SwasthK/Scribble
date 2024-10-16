import { Context } from "hono";
import { apiResponse } from "../../utils/apiResponse";
import { apiError } from "../../utils/apiError";
import z from "zod";
import { dbConnect } from "../../Connection/db.connect";

const addCommentSchema = z.object({
    content: z.string({ required_error: "Comment cannnot be empty" }).min(1, "Comment content cannot be empty"),
    postId: z.string({ required_error: "Post ID required" }).uuid("Invalid post ID"),
    parentId: z.string({ required_error: "Invalid" }).uuid().optional()
}, {
    required_error: "Comment is required",
    message: "Invalid data"
});

export async function addComments(c: Context) {
    try {

        const authorId = c.get("user").id;

        const body = await c.req.json().catch((error: any) => {
            return apiError(c, 400, "Invalid request body");
        });

        const response = addCommentSchema.safeParse(body);

        if (!response.success) {
            return apiError(c, 400, response.error.errors[0].message);
        }

        const { content, postId, parentId } = response.data;

        const prisma: any = await dbConnect(c);

        const [post, author] = await Promise.all([
            prisma.post.findUnique({ where: { id: postId } }),
            prisma.user.findUnique({ where: { id: authorId } })
        ]);

        if (!post) {
            return apiError(c, 404, "Post not found");
        }

        if (!author) {
            return apiError(c, 404, "Author not found");
        }

        if (post.allowComments === false) {
            return apiError(c, 400, "Comments are disabled for this post");
        }

        if (parentId) {
            const parentComment = await prisma.comment.findUnique({
                where: { id: parentId },
            });

            if (!parentComment) {
                return apiError(c, 404, "Parent comment not found");
            }
        }

        const comment = await prisma.$transaction([
            prisma.comment.create({
                data: {
                    content,
                    authorId,
                    postId,
                    parentId: parentId ?? null
                }
            })
        ]);

        if (!comment) {
            return apiError(c, 500, "An error occurred while adding the comment");
        }

        return apiResponse(c, 200, { comment }, "Comment added successfully");

    } catch (error: any) {
        console.error("Add Comments Error: ", error.message);
        return apiError(c, 500, "Internal Server Error", { code: "CE" });
    }

}
