import { Context } from "hono";
import { apiError } from "../../utils/apiError";
import { dbConnect } from "../../Connection/db.connect";
import { apiResponse } from "../../utils/apiResponse";
import z from 'zod'
import { PostStatus } from "@prisma/client";
import { createSlug } from "utils/createSlug";
import { fileUploadMessage } from "Middleware/cloudinary";

export const publishPostSchema = z.object({
    // coverImage: z.string().url({ message: "Invalid Cover Image URL" }).optional(),
    title: z.string()
        .min(6, { message: "Title must be atleast 6 Characters" })
        .max(25, { message: "Title must be atmost 25 Characters" }),
    shortCaption: z.string()
        .min(10, { message: "Short Caption must be atleast 10 Characters" })
        .max(100, { message: "Short Caption must be atmost 100 Characters" }),
    body: z.string()
        .min(250, { message: "Your Content Seems to be Small, Write More !" })
        .max(10000, { message: "You have Reached Your Content Limit" }),
    summary: z.string()
        .min(10, { message: "Summary must be atleast 10 Characters" })
        .max(200, { message: "Summary must be atmost 200 Characters" })
        .optional(),
    allowComments: z.boolean({ message: "Invalid Comment type" }),
})

export async function updatePublishById(c: Context) {
    try {

        const userId = c.get('user').id
        const postId = c.req.param('postId')
        if (!postId) {
            return apiError(c, 400, "Post ID required")
        }

        const prisma = c.get('prisma');

        const parsedBody = publishPostSchema.safeParse(await c.req.json());

        if (!parsedBody.success) {
            return apiError(c, 400, parsedBody.error.errors[0].message);
        }

        const data = parsedBody.data

        const post = await prisma.post.findFirst({
            where: {
                AND: [{
                    id: postId,
                    authorId: userId
                }]
            }
        })

        if (!post) { return apiError(c, 404, "Post not found") }

        if (!post.coverImage) { return apiError(c, 404, "Cover Image is required") }

        const postSlug = createSlug(data.title, 25)

        const isPostTitleExists = await prisma.post.findFirst({
            where: { AND: [{ slug: postSlug, status: PostStatus.PUBLISHED }] }
        })

        if (isPostTitleExists) { return apiError(c, 400, "Post title already exists") }

        const updatedPost = await prisma.post.update({
            where: { id: postId },
            data: {
                title: data.title,
                slug: postSlug,
                shortCaption: data.shortCaption,
                body: data.body,
                summary: data?.summary,
                status: PostStatus.PUBLISHED
            }
        });

        return apiResponse(c, 200, updatedPost, "Post published successfully");

    } catch (error: any) {
        console.error("Publish Post Error:", error);
        return apiError(c, 500, "Internal Server Error", { code: "CE" });
    }
}

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

        const newPost = await prisma.post.create({
            data: {
                coverImage: secure_url,
                coverImagePublicId: cloudinaryData?.public_id ? cloudinaryData.public_id : null,
                title: data.title,
                slug: postSlug,
                shortCaption: data.shortCaption,
                body: data.body,
                summary: data?.summary,
                allowComments: data.allowComments,
                author: {
                    connect: { id: userId }
                },
                status: PostStatus.PUBLISHED,
            }
        });

        if (!newPost) { return apiError(c, 400, "Failed to create a post") }

        return apiResponse(c, 200, newPost, "Post published successfully");

    } catch (error: any) {
        console.error("Publish Post Error:", error);
        return apiError(c, 500, "Internal Server Error", { code: "CE" });
    }
}