import { Context } from "hono";
import { GlobalResponse } from "utils/responses";
import { LikesResponse } from "utils/responseData";
import { apiError } from "utils/apiError";
import { apiResponse } from "utils/apiResponse";

export async function likeAndUnlikePost(c: Context) {

    try {
        const postId = c.req.param('postId');
        const userId = c.get('user').id;

        if (!postId) { return apiError(c, 400, LikesResponse.PostIdRequired); }

        const prisma: any = c.get('prisma');

        const response = await prisma.$transaction(async (prisma: any) => {

            const existingLike = await prisma.like.findFirst({
                where: {
                    userId: userId,
                    postId: postId
                }
            });
            if (existingLike) {
                await prisma.like.delete({
                    where: {
                        id: existingLike.id
                    }
                });
                return LikesResponse.Unliked
            } else {
                await prisma.like.create({
                    data: {
                        userId: userId,
                        postId: postId
                    }
                });
                return LikesResponse.Liked
            }
        });

        if (!response) { return apiError(c, 400, LikesResponse.LikesError) }

        return apiResponse(c, 200, response);

    } catch (error: any) {
        console.error(LikesResponse.ConsoleError, error);
        if (error.message === LikesResponse.LikesError) {
            return apiError(c, 400, error.message)
        }
        return apiError(c, 500, GlobalResponse.INTERNALERROR);
    }

}
