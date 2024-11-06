import { PostStatus } from "@prisma/client";
import { Context } from "hono";
import { apiError } from "utils/apiError";
import { apiResponse } from "utils/apiResponse";
import { GlobalResponse, savePostResponse } from "utils/responses";

enum saveAction {
    SAVE = "save",
    UNSAVE = "unsave"
}

export const handleSavePost = async (c: Context) => {
    const userId = c.get("user").id;
    try {
        const postId = c.req.param("postId");
        if (!postId) {
            return apiError(c, 400, savePostResponse.POSTID);
        }

        const body = await c.req.json().catch(() => {
            return apiError(c, 400, savePostResponse.INVALIDBODY);
        });

        if (!body || !(body.action === saveAction.SAVE || body.action === saveAction.UNSAVE)) {
            return apiError(c, 400, savePostResponse.INVALIDBODY);
        }

        const prisma: any = c.get('prisma');

        const findPost = await prisma.post.findUnique({
            where: { id: postId },
            select: {
                status: true,
                authorId: true
            }
        });

        if (!findPost) {
            return apiError(c, 400, savePostResponse.NOPOST);
        }

        if (findPost.authorId === userId) {
            return apiError(c, 400, savePostResponse.OWNPOST);
        }

        if (findPost.status !== PostStatus.PUBLISHED) {
            return apiError(c, 400, savePostResponse.POSTNOTPUBLISHED);
        }

        const response = await prisma.$transaction(async (prisma: any) => {

            const existingSave = await prisma.SavedBlog.findFirst({
                where: {
                    userId,
                    postId
                }
            });

            if (body.action === saveAction.SAVE && !existingSave) {
                await prisma.SavedBlog.create({
                    data: {
                        userId,
                        postId
                    }
                });
                return savePostResponse.SAVED;
            } else if (body.action === saveAction.UNSAVE && existingSave) {
                await prisma.SavedBlog.delete({
                    where: { id: existingSave.id }
                });
                return savePostResponse.UNSAVED;
            }
            throw new Error(savePostResponse.NOCHANGE);
        });

        if (!response) {
            throw new Error();
        }

        return apiResponse(c, 200, response);

    } catch (error: any) {
        console.log(savePostResponse.ERRORLOG, error);
        if (error.message === savePostResponse.NOCHANGE) {
            return apiResponse(c, 400, savePostResponse.NOCHANGE);
        }
        return apiError(c, 500, GlobalResponse.INTERNALERROR);
    }
};


