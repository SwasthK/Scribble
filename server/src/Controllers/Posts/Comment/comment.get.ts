import { Context } from "hono";
import { apiError } from "../../../utils/apiError";
import { apiResponse } from "../../../utils/apiResponse";

export async function getCommentsWithoutReply(c: Context) {
    try {
        const postId = c.req.param("postId");
        if (!postId) { return apiError(c, 400, "Post ID is required"); }

        const prisma: any = await c.get("prisma");

        const comments = await prisma.comment.findMany({
            where: { postId, parentId: null },
            select: {
                content: true,
                createdAt: true,
                author: {
                    select: {
                        username: true,
                        avatarUrl: true
                    }
                }
            },

            orderBy: { createdAt: "desc" }
        })
        console.log("comments", comments);

        return apiResponse(c, 200, { comments }, "Comments retrieved successfully");
    }

    catch (error: any) {
        console.log("Error in getCommentsWithoutReply: ", error);
        return apiError(c, 500, "Internal server error");
    }
}