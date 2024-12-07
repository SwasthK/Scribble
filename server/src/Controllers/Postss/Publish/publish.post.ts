import { PostStatus } from "@prisma/client";
import { Context } from "hono";
import { apiError } from "utils/apiError";
import { apiResponse } from "utils/apiResponse";
import { createSlug } from "utils/createSlug";
import { fileUploadMessage } from "Zod/zod";

export async function createNewPublishPost(c: Context) {
    try {
        const message = c.get('fileUploadMessage');
        const fileHandle: Record<string, any> = {};

        switch (message) {
            case fileUploadMessage.TYPEERROR:
                return apiError(c, 400, "Invalid file type");

            case fileUploadMessage.NOFILE:
                return apiError(c, 400, "No file uploaded");

            case fileUploadMessage.SUCCESS:
                fileHandle.success = true;
                break;

            default:
                fileHandle.error = true;
                break;
        }

        const cloudinaryData = c.get('fileUploadResponse');

        const secure_url = fileHandle.success && !fileHandle.error ?
            cloudinaryData.secure_url || `https://picsum.photos/500/300`
            :
            `https://picsum.photos/500/300`;

        const userId = c.get('user').id;
        const prisma: any = c.get('prisma');
        const data = c.get('publishData');

        const postSlug = createSlug(data.title, 25);

        const isPostTitleExists = await prisma.post.findFirst({
            where: { slug: postSlug }
        });

        if (isPostTitleExists) {
            return apiError(c, 400, "Post title already exists");
        }

        const cleanBody = data.body.replace(/(<br\s*\/?>\s*)+$/i, '');

        const categoryIds = data.categories.split(",").map((id: string) => id.trim());

        const categoryConnections = categoryIds.map((id: string) => ({ id }));

        const newPost = await prisma.post.create({
            data: {
                coverImage: secure_url,
                coverImagePublicId: cloudinaryData?.public_id ? cloudinaryData.public_id : null,
                title: data.title,
                slug: postSlug,
                shortCaption: data.shortCaption,
                body: cleanBody,
                summary: data?.summary,
                allowComments: data.allowComments,
                author: {
                    connect: { id: userId }
                },
                categories: {
                    connect: categoryConnections
                },
                status: PostStatus.PUBLISHED,
            }
        });

        if (!newPost) { return apiError(c, 400, "Failed to create a post") }

        return apiResponse(c, 200, newPost, "Post published successfully");

    } catch (error: any) {
        console.error("Publish Post Error-Create:", error);
        return apiError(c, 500, "Internal Server Error");
    }
}