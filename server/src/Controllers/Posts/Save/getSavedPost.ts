import { Context } from "hono";
import { apiError } from "utils/apiError";
import { apiResponse } from "utils/apiResponse";
import { GlobalResponse, savePostResponse } from "utils/responses";

export async function getSavedPost(c: Context) {
    const userId = c.get("user").id;
    const prisma: any = c.get('prisma');
    try {

        const savedPosts = await prisma.post.findMany({
            where: {
                savedBy: {
                    some: {
                        userId
                    }
                }
            },
            select: {
                id: true,
                coverImage: true,
                slug: true
            }
        })

        if (!savedPosts || savedPosts.length === 0) {
            return apiResponse(c, 400, savedPosts, savePostResponse.NOSAVEDPOST)
        }

        return apiResponse(c, 200, savedPosts, savePostResponse.FETCHSUCCESS);

    } catch (error) {
        console.log("Handle Get Saved Post Error : ", error);
        return apiError(c, 500, GlobalResponse.INTERNALERROR);
    }
}