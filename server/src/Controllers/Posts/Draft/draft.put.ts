import { PostStatus, Prisma } from "@prisma/client";
import { Context } from "hono";
import { cloudinaryUploader, generateSignature, generateSignatureForReplace, generateUniqueFilename, getCloudinaryHelpers } from "Middleware/cloudinary";
import { apiError } from "utils/apiError";
import { apiResponse } from "utils/apiResponse";
import { mimeTypeSignup } from "Zod/zod";

export async function updateDraftPostById(c: Context) {

    const data = c.get('draftData');
    const postId = c.req.param('postId');
    const userId = c.get('user').id;
    const prisma: any = c.get('prisma');

    if (!postId) { return apiError(c, 400, 'Post ID is required'); }

    const post = await prisma.post.findFirst({
        where: {
            AND: [{
                id: postId,
                authorId: userId
            }]
        }
    })
    if (!post) { return apiError(c, 404, "Post not found") }

    if (data.image) {
        if (Object.values(mimeTypeSignup).includes(data.image.type as mimeTypeSignup)) {
            let uploadPreset = 'Profile_Image'
            let cloudinaryHelpers = getCloudinaryHelpers(c);
            const timestamp = Math.round((new Date).getTime() / 1000);
            const uniqueFilename = generateUniqueFilename(data.image.name);
            const cloudinaryFormData = new FormData();
            cloudinaryFormData.append('file', data.image);
            cloudinaryFormData.append('timestamp', timestamp.toString());
            cloudinaryFormData.append('api_key', cloudinaryHelpers.CLOUDINARY_API_KEY);

            if (post.coverImage && post.coverImagePublicId) {
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
                cloudinaryFormData.append('upload_preset', uploadPreset);
            }
            else {
                const signature = await generateSignature(timestamp, uniqueFilename, uploadPreset, cloudinaryHelpers.CLOUDINARY_API_SECRET);
                cloudinaryFormData.append('public_id', uniqueFilename);
                cloudinaryFormData.append('signature', signature);
                cloudinaryFormData.append('upload_preset', uploadPreset);
            }
            try {
                const uploadResponse = await cloudinaryUploader(cloudinaryFormData, cloudinaryHelpers);

                if (!uploadResponse.ok) {
                    console.log('Upload File Middleware Error: ', uploadResponse);
                    return apiError(c, 400, "Failed to upload an image");
                }

                const uploadResult: any = await uploadResponse.json();

                try {
                    const updateDraft = await prisma.post.update({
                        where: {
                            id: postId
                        },
                        data: {
                            coverImage: uploadResult.secure_url,
                            coverImagePublicId: uploadResult.public_id,
                            title: data.title,
                            shortCaption: data.shortCaption,
                            summary: data.summary,
                            body: data.body,
                            allowComments: data.allowComments,
                            status: PostStatus.DRAFT
                        }
                    })
                    return apiResponse(c, 200, updateDraft, "Saved Changes");
                } catch (error) {
                    return apiError(c, 500, "Internal Server Error", { code: "CE" });
                }

            } catch (error) {
                console.error("Cloudinary Error: ", error);
                return apiError(c, 400, "Cloudinary Upload Failed");
            }
        } else {
            return apiError(c, 400, "Invalid Image Type")
        }
    }

    try {
        const updateDraft = await prisma.post.update({
            where: {
                id: postId
            },
            data: {
                title: data.title,
                shortCaption: data.shortCaption,
                summary: data.summary,
                body: data.body,
                allowComments: data.allowComments,
                status: PostStatus.DRAFT
            }
        })
        return apiResponse(c, 200, updateDraft, "Saved Changes");
    } catch (error: any) {
        console.log("Update Draft Error: ", error.message);
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            console.error("Prisma Transaction Error-Update Draft: ", error.message);
            return apiError(c, 400, "Draft Post Creation Failed");
        }
        return apiError(c, 500, "Internal Server Error");
    }

}
