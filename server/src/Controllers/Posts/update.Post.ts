import { Context } from 'hono';
import { apiError } from '../../utils/apiError';
import { apiResponse } from '../../utils/apiResponse';
import { dbConnect } from '../../Connection/db.connect';
import { MediaType, Prisma } from '@prisma/client';

import { z } from 'zod';
import { createSlug } from '../../utils/createSlug';

const updatePostSchema = z.object({
    coverImage: z.string().url({ message: "Invalid Cover Image URL" }).optional(),
    title: z.string()
        .min(10, { message: "Title must be atleast 6 Characters" })
        .max(100, { message: "Title must be atmost 25 Characters" })
        .optional(),
    shortCaption: z.string()
        .min(10, { message: "Short Caption must be atleast 10 Characters" })
        .max(100, { message: "Short Caption must be atmost 100 Characters" })
        .optional(),
    body: z.string()
        .min(100, { message: "Your Content Seems to be Small, Write More !" })
        .max(10000, { message: "You have Reached Your Content Limit" })
        .optional(),
    summary: z.string()
        .min(10, { message: "Summary must be atleast 10 Characters" })
        .max(200, { message: "Summary must be atmost 200 Characters" })
        .optional(),
    allowComments: z.boolean({ message: "Invalid Comment type" }).optional(),
    multiMedias: z.array(z.object({
        caption: z.string()
            .min(10, { message: "Caption must be atleast 10 Characters" })
            .max(50, { message: "Caption must be atmost 50 Characters" })
            .optional(),
        altText: z.string()
            .min(10, { message: "Alt Text must be atleast 10 Characters" }),
        url: z.string().url({ message: "Invalid Media URL" }),
        type: z.enum([MediaType.IMAGE, MediaType.AUDIO, MediaType.DOCUMENT, MediaType.VIDEO], { message: "Invalid Media type" }),
    }), { message: "Invalid Multimedia Type" }).optional(),
    tags: z.array(z.string().uuid({ message: "Invalid Tag ID" }), { message: "Invalid Tag ID" })
        .min(1, { message: "You must add atleast 1 Tag" })
        .max(5, { message: "You can add atmost 5 Tags" })
        .optional(),
    categories: z.array(z.string().uuid({ message: "Invalid Category ID" }), { message: "Invalid Category ID" })
        .min(1, { message: "You must add atleast 1 Category" })
        .max(5, { message: "You can add atmost 5 Categories" })
        .optional(),
}).refine((data) => Object.values(data).some(value => value !== undefined), {
    message: "No update field provided",
});;


export async function updatePost(c: Context) {
    const postId = c.req.param('postId');
    const userId = c.get('user').id

    if (!postId) {
        return apiError(c, 400, 'Post ID is required');
    }

    const requestBody = await c.req.json();

    const response = updatePostSchema.safeParse(requestBody);

    if (!response.success) {
        return apiError(c, 400, response.error.errors[0].message);
    }

    const data = response.data;

    let slug = undefined

    if (data.title) {
        slug = createSlug(data.title, 25)
    }

    const prisma: any = await dbConnect(c);

    const post = await prisma.post.findFirst({
        where: {
            AND: [{
                id: postId,
                author: { id: userId }
            }]
        }
    })

    if (!post) { return apiError(c, 404, "Post not found") }

    try {

        const updateData: any = {}

        if (data.coverImage !== undefined) updateData.coverImage = data.coverImage;
        if (data.title !== undefined) updateData.title = data.title;
        if (slug !== undefined) updateData.slug = slug
        if (data.shortCaption !== undefined) updateData.shortCaption = data.shortCaption;
        if (data.body !== undefined) updateData.body = data.body;
        if (data.summary !== undefined) updateData.summary = data.summary;
        if (data.allowComments !== undefined) updateData.allowComments = data.allowComments;

        const result = await prisma.$transaction(async (prisma: any) => {

            if (updateData) {
                await prisma.post.update({
                    where: { id: post.id },
                    data: updateData
                })
            }

            if (data.tags) {
                const { tags } = data
                if (tags.length > 0) {
                    await prisma.post.update({
                        where: { id: postId },
                        data: {
                            tags: {
                                set: tags.map((tagId: string) => ({ id: tagId }))
                            }
                        }
                    })
                }
            }

            if (data.categories) {
                const { categories } = data
                if (categories.length > 0) {
                    await prisma.post.update({
                        where: { id: postId },
                        data: {
                            categories: {
                                set: categories.map((catId: string) => ({ id: catId }))
                            }
                        }
                    })
                }
            }

            if (data.multiMedias) {
                const { multiMedias } = data
                if (multiMedias.length > 0) {
                    await prisma.multimedia.deleteMany({
                        where: { postId }
                    })

                    await prisma.multimedia.createMany({
                        data: data.multiMedias.map((media: any) => ({
                            postId,
                            caption: media.caption ?? null,
                            altText: media.altText,
                            url: media.url,
                            type: media.type,
                        }))
                    })
                }
            }

        })

        return apiResponse(c, 200, result, "Saved Changes");
    } catch (error: any) {
        console.log("Create Post Error: ", error.message);
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            console.error("Prisma Transaction Error: ", error.message);
            return apiError(c, 400, "Post Creation Failed");
        }
        return apiError(c, 500, "Internal Server Error", { code: "CE" });
    }

}