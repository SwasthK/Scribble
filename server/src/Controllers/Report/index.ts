import { postReportSchema } from "Zod/zod";
import { Context } from "hono";
import { apiError } from "utils/apiError";
import { apiResponse } from "utils/apiResponse";

export const reportPost = async (c: Context) => {
    try {
        const userId = c.get("user").id;
        const postId = c.req.param('postId');

        const response = postReportSchema.safeParse(await c.req.json());
        if (!response.success) {
            return apiError(c, 400, response.error.errors[0].message);
        }

        const { data } = response;
        const prisma: any = await c.get("prisma");

        const post = await prisma.post.findUnique({
            where: {
                id: postId
            },
            select: {
                id: true,
                reports: true
            }
        });

        if (!post || !post.id) { return apiError(c, 404, "Post not found") }
        if (post.reports.length > 0) { return apiError(c, 400, "Post already reported") }

        const report = await prisma.postReport.create({
            data: {
                type: data.type,
                reason: data.reason,
                postId: post.id,
                userId
            },
            select: {
                id: true
            }
        });

        return apiResponse(c, 200, "Reported successfully");

    } catch (error: any) {
        console.log("Error while reporting post ", error);
        return apiError(c, 500, "Internal Server Error");
    }
}