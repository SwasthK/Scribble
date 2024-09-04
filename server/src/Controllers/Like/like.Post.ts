import { Context } from "hono";
import { apiError } from "../../utils/apiError";
import { dbConnect } from "../../Connection/db.connect";
import { apiResponse } from "../../utils/apiResponse";

export async function likeAndUnlikePost(c: Context) {

    try {
        const postId = c.req.param('postId');
        const userId = c.get('user').id;

        if (!postId || !userId) {
            return apiError(c, 400, 'Request failed');
        }

        const prisma: any = await dbConnect(c);

        const [action, count] = await prisma.$transaction(async (prisma: any) => {

            const existingLike = await prisma.like.findFirst({
                where: {
                    userId: userId,
                    postId: postId
                }
            });

            let action: "liked" | "unliked";

            if (existingLike) {
                await prisma.like.delete({
                    where: {
                        id: existingLike.id
                    }
                });
                action = "unliked";
            } else {
                await prisma.like.create({
                    data: {
                        userId: userId,
                        postId: postId
                    }
                });
                action = "liked";
            }

            const likesCount = await prisma.like.count({
                where: {
                    postId: postId
                }
            });

            return [action, likesCount];
        });

        return apiResponse(c, 200, { action, count });

    } catch (error: any) {
        console.error("Like Post Error:", error);
        return apiError(c, 500, "Internal Server Error", { code: "CE" });
    }
    
}
