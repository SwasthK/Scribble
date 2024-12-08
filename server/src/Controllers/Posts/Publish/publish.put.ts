import { PostStatus } from "@prisma/client";
import { Context } from "hono";
import { cloudinaryUploader, generateSignature, generateSignatureForReplace, generateUniqueFilename, getCloudinaryHelpers } from "Middleware/cloudinary";
import { apiError } from "utils/apiError";
import { apiResponse } from "utils/apiResponse";
import { createSlug } from "utils/createSlug";
import { mimeTypeSignup } from "Zod/zod";

export async function updatePublishById(c: Context) {
    try {

        const data = c.get('publishData')
        const userId = c.get('user').id
        const postId = c.req.param('postId')
        const prisma = c.get('prisma');
        let cloudinaryHelpers = getCloudinaryHelpers(c);
        const categoryIds = data.categories.split(",").map((id: string) => id.trim());
        const categoryConnections = categoryIds.map((id: string) => ({ id }));

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

        if (data.image) {
            if (!Object.values(mimeTypeSignup).includes(data.image.type)) {
                return apiError(c, 400, "Invalid file type");
            }
            uniqueFilename = generateUniqueFilename(data.image.name);
        }

        let uploadPreset = 'Blog_Cover_Image';

        if (!post.coverImage) {

            if (data.image) {

                const signature = await generateSignature(timestamp, uniqueFilename, uploadPreset, cloudinaryHelpers.CLOUDINARY_API_SECRET);
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
                    uploadPreset,
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
                            allowComments: data.allowComments,
                            status: PostStatus.PUBLISHED,
                            categories: {
                                connect: categoryConnections
                            }
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
        cloudinaryFormData.append('upload_preset', uploadPreset);

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
                allowComments: data.allowComments,
                categories: {
                    connect: categoryConnections
                },
                status: PostStatus.PUBLISHED
            },
            select: {
                id: true,
            }
        });

        return apiResponse(c, 200, updatedPost, "Post published successfully");

    } catch (error: any) {
        console.error("Publish Post Error-Update:", error);
        return apiError(c, 500, "Internal Server Error");
    }
}