import { Context } from "hono";
import { apiError } from "../../utils/apiError";
import { dbConnect } from "../../Connection/db.connect";
import { apiResponse } from "../../utils/apiResponse";
import z from 'zod'
import { PostStatus } from "@prisma/client";
import { createSlug } from "utils/createSlug";
import { cloudinaryUploader, fileUploadMessage, generateSignature, generateSignatureForReplace, generateUniqueFilename, getCloudinaryHelpers, mimeTypeSignup } from "Middleware/cloudinary";

export const publishPostSchema = z.object({

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
        .optional().nullable().or(z.literal('')),
    allowComments: z.boolean({ message: "Invalid Comment type" }),
})

export async function updatePublishById(c: Context) {
    try {

        const data = c.get('publishData')
        const userId = c.get('user').id
        const postId = c.req.param('postId')
        const prisma = c.get('prisma');
        let cloudinaryHelpers = getCloudinaryHelpers(c);

        if (!postId) { return apiError(c, 400, "Post ID required") }

        const post = await prisma.post.findFirst({
            where: {
                AND: [{
                    id: postId,
                    authorId: userId
                }]
            }
        })
        if (!post) { return apiError(c, 404, "Post not found") }

        const postSlug = createSlug(data.title, 25)
        const isPostTitleExists = await prisma.post.findFirst({
            where: {
                AND: [
                    { slug: postSlug },
                    { id: { not: postId } }
                ]
            }
        })

        if (isPostTitleExists) { return apiError(c, 400, "Post title already exists") }

        const timestamp = Math.round((new Date).getTime() / 1000);
        let uniqueFilename = '';
        const cloudinaryFormData = new FormData();
        console.log(data);

        if (data.image) {
            if (!Object.values(mimeTypeSignup).includes(data.image.type)) {
                return apiError(c, 400, "Invalid file type");
            }
            uniqueFilename = generateUniqueFilename(data.image.name);
        }

        if (!post.coverImage) {
            if (data.image) {
                const signature = await generateSignature(timestamp, uniqueFilename, cloudinaryHelpers.CLOUDINARY_API_SECRET);
                cloudinaryFormData.append('public_id', uniqueFilename);
                cloudinaryFormData.append('signature', signature);
            } else {
                return apiError(c, 400, "Cover Image is required")
            }
        } else {
            if (data.image) {
                const signature = await generateSignatureForReplace(
                    timestamp,
                    post.coverImagePublicId,
                    cloudinaryHelpers.CLOUDINARY_API_SECRET,
                    true,
                    true
                );
                cloudinaryFormData.append('public_id', post.coverImagePublicId);
                cloudinaryFormData.append('overwrite', 'true');
                cloudinaryFormData.append('invalidate', 'true');
                cloudinaryFormData.append('signature', signature);
            } else {
                try {
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
        }

        cloudinaryFormData.append('file', data.image);
        cloudinaryFormData.append('timestamp', timestamp.toString());
        cloudinaryFormData.append('api_key', cloudinaryHelpers.CLOUDINARY_API_KEY);

        const uploadResponse = await cloudinaryUploader(cloudinaryFormData, cloudinaryHelpers);

        if (!uploadResponse.ok) {
            console.log('Upload File Middleware Error: ', uploadResponse);
            return apiError(c, 400, "Failed to upload an image");
        }

        const uploadResult: any = await uploadResponse.json();

        const updatedPost = await prisma.post.update({
            where: { id: postId },
            data: {
                coverImage: uploadResult.secure_url,
                coverImagePublicId: uploadResult.public_id,
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

        const cleanBody = data.body.replace(/(<br\s*\/?>\s*)+$/i, '');

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