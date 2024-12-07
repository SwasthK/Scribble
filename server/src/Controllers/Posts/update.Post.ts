import { Context } from 'hono';
import { apiError } from '../../utils/apiError';
import { apiResponse } from '../../utils/apiResponse';
import { PostStatus, Prisma } from '@prisma/client';

import { cloudinaryUploader, generateSignature, generateSignatureForReplace, generateUniqueFilename, getCloudinaryHelpers } from 'Middleware/cloudinary';
import { mimeTypeSignup } from 'Zod/zod';

// const updateDraftPostByIdSchema = z.object({
//     title: z.string({
//         required_error: "Title is required",
//         invalid_type_error: "Title must be a string"
//     }),
//     shortCaption: z.string({
//         required_error: "Short Caption is required",
//         invalid_type_error: "Short Caption be a string"
//     }),
//     body: z.string({
//         required_error: "Body is required",
//         invalid_type_error: "Body must be a string"
//     }),
//     summary: z.string({
//         required_error: "Summary is required",
//         invalid_type_error: "Summary must be a string"
//     }),
//     allowComments: z.boolean({
//         required_error: "Allowed Comments is required",
//         invalid_type_error: "Allowed Comments must be a boolean"
//     })
// })

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
        console.log("Create Post Error: ", error.message);
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            console.error("Prisma Transaction Error: ", error.message);
            return apiError(c, 400, "Post Creation Failed");
        }
        return apiError(c, 500, "Internal Server Error", { code: "CE" });










    }

}


// export async function updatePost(c: Context) {
//     const postId = c.req.param('postId');
//     const userId = c.get('user').id

//     if (!postId) {
//         return apiError(c, 400, 'Post ID is required');
//     }

//     const requestBody = await c.req.json();

//     const response = updateDraftPostByIdSchema.safeParse(requestBody);

//     if (!response.success) {
//         return apiError(c, 400, response.error.errors[0].message);
//     }

//     const data = response.data;

//     const prisma: any = c.get('prisma');

//     const post = await prisma.post.findFirst({
//         where: {
//             AND: [{
//                 id: postId,
//                 author: { id: userId },
//             }]
//         }
//     })

//     if (!post) { return apiError(c, 404, "Post not found") }

//     try {
//         const updateDraft = await await prisma.post.update({
//             where: {
//                 postId
//             },
//             data: {
//                 title: data.title,
//                 shortCaption: data.shortCaption,
//                 summary: data.summary,
//                 body: data.body,
//                 allowedComments: data.allowComments
//             }
//         })

//         // const updateData: any = {}

//         // if (data.coverImage !== undefined) updateData.coverImage = data.coverImage;
//         // if (data.title !== undefined) updateData.title = data.title;
//         // if (slug !== undefined) updateData.slug = slug
//         // if (data.shortCaption !== undefined) updateData.shortCaption = data.shortCaption;
//         // if (data.body !== undefined) updateData.body = data.body;
//         // if (data.summary !== undefined) updateData.summary = data.summary;
//         // if (data.allowComments !== undefined) updateData.allowComments = data.allowComments;

//         // const result = await prisma.$transaction(async (prisma: any) => {

//         //     if (updateData) {
//         //         await prisma.post.update({
//         //             where: { id: post.id },
//         //             data: updateData
//         //         })
//         //     }

//         //     if (data.tags) {
//         //         const { tags } = data
//         //         if (tags.length > 0) {
//         //             await prisma.post.update({
//         //                 where: { id: postId },
//         //                 data: {
//         //                     tags: {
//         //                         set: tags.map((tagId: string) => ({ id: tagId }))
//         //                     }
//         //                 }
//         //             })
//         //         }
//         //     }

//         //     if (data.categories) {
//         //         const { categories } = data
//         //         if (categories.length > 0) {
//         //             await prisma.post.update({
//         //                 where: { id: postId },
//         //                 data: {
//         //                     categories: {
//         //                         set: categories.map((catId: string) => ({ id: catId }))
//         //                     }
//         //                 }
//         //             })
//         //         }
//         //     }

//         //     if (data.multiMedias) {
//         //         const { multiMedias } = data
//         //         if (multiMedias.length > 0) {
//         //             await prisma.multimedia.deleteMany({
//         //                 where: { postId }
//         //             })

//         //             await prisma.multimedia.createMany({
//         //                 data: data.multiMedias.map((media: any) => ({
//         //                     postId,
//         //                     caption: media.caption ?? null,
//         //                     altText: media.altText,
//         //                     url: media.url,
//         //                     type: media.type,
//         //                 }))
//         //             })
//         //         }
//         //     }

//         // })

//         // return apiResponse(c, 200, result, "Saved Changes");
//     } catch (error: any) {
//         console.log("Create Post Error: ", error.message);
//         if (error instanceof Prisma.PrismaClientKnownRequestError) {
//             console.error("Prisma Transaction Error: ", error.message);
//             return apiError(c, 400, "Post Creation Failed");
//         }
//         return apiError(c, 500, "Internal Server Error", { code: "CE" });
//     }

// }