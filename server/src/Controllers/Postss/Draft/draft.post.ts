import { PostStatus, Prisma } from "@prisma/client";
import { Context } from "hono";
import { apiError } from "utils/apiError";
import { apiResponse } from "utils/apiResponse";
import { fileUploadMessage } from "Zod/zod";

export async function createNewDraftPost(c: Context) {
    try {

        const message = c.get('fileUploadMessage');
        const fileHandle: Record<string, any> = {};

        switch (message) {
            case fileUploadMessage.TYPEERROR:
                return apiError(c, 400, "Invalid file type");

            case fileUploadMessage.NOFILE:
                break;

            case fileUploadMessage.SUCCESS:
                fileHandle.success = true;
                break;

            default:
                fileHandle.error = true;
                break;
        }

        const cloudinaryData = c.get('fileUploadResponse')
        console.log(cloudinaryData);

        const secure_url = (fileHandle.success && !fileHandle.error) ? cloudinaryData.secure_url : null;

        const authorId = c.get("user").id;
        const prisma: any = c.get('prisma');
        const data = c.get('draftData');

        const newPost = await prisma.post.create({
            data: {
                coverImage: secure_url,
                coverImagePublicId: cloudinaryData?.public_id ? cloudinaryData.public_id : null,
                title: data.title,
                shortCaption: data.shortCaption,
                body: data.body,
                summary: data?.summary,
                allowComments: data.allowComments,
                author: {
                    connect: { id: authorId }
                },
                status: PostStatus.DRAFT
            }
        });
        if (!newPost) { return apiError(c, 400, "Failed to create a post") }

        return apiResponse(c, 200, newPost, "Post Drafted successfully");


    } catch (error: any) {
        console.log("Create Draft Post Error: ", error.message);
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            console.error("Prisma Transaction Error-Create Draft Post: ", error.message);
            return apiError(c, 400, "Post Creation Failed");
        }
        return apiError(c, 500, "Internal Server Error");
    }

}