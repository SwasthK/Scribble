import { Context } from "hono";
import { PostStatus, Prisma, MediaType } from '@prisma/client';
import { apiError } from "../../utils/apiError";
import { apiResponse } from "../../utils/apiResponse";
import { dbConnect } from "../../Connection/db.connect";

import { z } from 'zod';
import { createSlug } from '../../utils/createSlug';

const createPostSchema = z.object({
    coverImage: z.string().url({ message: "Invalid Cover Image URL" }).optional(),
    title: z.string()
        .min(10, { message: "Title must be atleast 6 Characters" })
        .max(100, { message: "Title must be atmost 25 Characters" }),
    shortCaption: z.string()
        .min(10, { message: "Short Caption must be atleast 10 Characters" })
        .max(100, { message: "Short Caption must be atmost 100 Characters" }),
    body: z.string()
        .min(300, { message: "Your Content Seems to be Small, Write More !" })
        .max(10000, { message: "You have Reached Your Content Limit" }),
    summary: z.string()
        .min(10, { message: "Summary must be atleast 10 Characters" })
        .max(200, { message: "Summary must be atmost 200 Characters" })
        .optional(),
    allowComments: z.boolean({ message: "Invalid Comment type" }),
    multiMedias: z.array(z.object({
        caption: z.string()
            .min(10, { message: "Caption must be atleast 10 Characters" })
            .max(50, { message: "Caption must be atmost 50 Characters" })
            .optional(),
        altText: z.string({ required_error: "Alt Text is required" })
            .min(5, { message: "Alt Text must be atleast 5 Characters" }),
        url: z.string({ required_error: "Media URL not found" }).url({ message: "Invalid Media URL" }),
        type: z.enum([MediaType.IMAGE, MediaType.AUDIO, MediaType.DOCUMENT, MediaType.VIDEO], { message: "Invalid Media format" }),
    }, { message: "Invalid Multimedia type" }), { message: "Invalid Multimedia type" }).optional(),
    tags: z.array(z.string().uuid({ message: "Invalid Tag ID" }), { message: "Invalid Tag ID" })
        .min(1, { message: "You must add atleast 1 Tag" })
        .max(5, { message: "You can add atmost 5 Tags" }).optional(),
    categories: z.array(z.string().uuid({ message: "Invalid Category ID" }), { message: "Invalid Category ID" })
        .min(1, { message: "You must add atleast 1 Category" })
        .max(5, { message: "You can add atmost 5 Categories" }).optional()
})

const createNewDraftPostSchema = z.object({
    coverImage: z.string().url({ message: "Invalid Cover Image URL" }).optional(),
    title: z.string(),
    shortCaption: z.string(),
    body: z.string(),
    summary: z.string()
        .optional(),
    allowComments: z.boolean({ message: "Invalid Comment type" }),
    multiMedias: z.array(z.object({
        caption: z.string()
            .min(10, { message: "Caption must be atleast 10 Characters" })
            .max(50, { message: "Caption must be atmost 50 Characters" })
            .optional(),
        altText: z.string({ required_error: "Alt Text is required" })
            .min(5, { message: "Alt Text must be atleast 5 Characters" }),
        url: z.string({ required_error: "Media URL not found" }).url({ message: "Invalid Media URL" }),
        type: z.enum([MediaType.IMAGE, MediaType.AUDIO, MediaType.DOCUMENT, MediaType.VIDEO], { message: "Invalid Media format" }),
    }, { message: "Invalid Multimedia type" }), { message: "Invalid Multimedia type" }).optional(),
    tags: z.array(z.string().uuid({ message: "Invalid Tag ID" }), { message: "Invalid Tag ID" })
        .min(1, { message: "You must add atleast 1 Tag" })
        .max(5, { message: "You can add atmost 5 Tags" }).optional(),
    categories: z.array(z.string().uuid({ message: "Invalid Category ID" }), { message: "Invalid Category ID" })
        .min(1, { message: "You must add atleast 1 Category" })
        .max(5, { message: "You can add atmost 5 Categories" }).optional()
})

export async function createDraftPost(c: Context) {
    const authorId = c.get("user").id;

    const prisma: any = await dbConnect(c);

    const requestBody = await c.req.json()

    try {

        const response = createNewDraftPostSchema.safeParse(requestBody)

        if (!response.success) {
            return apiError(c, 400, response.error.errors[0].message)
        }

        const { title, shortCaption, summary, tags, categories, body, coverImage, allowComments, multiMedias } = response.data

        // const slug = createSlug(title, 25)

        // const isPostExist = await prisma.post.findFirst({
        //     where: {
        //         AND: [
        //             { slug },
        //             { status: PostStatus.PUBLISHED }
        //         ]
        //     }
        // })

        // if (isPostExist) {
        //     return apiError(c, 400, "Post name already exist");
        // }

        const result = await prisma.$transaction(async (prisma: any) => {
            const newPost = await prisma.post.create({
                data: {
                    coverImage: coverImage ?? null,
                    title,
                    shortCaption,
                    body,
                    summary,
                    allowComments,
                    author: {
                        connect: { id: authorId }
                    },
                    status: PostStatus.DRAFT,
                }
            });

            if (tags && tags.length > 0) {
                await prisma.post.update({
                    where: { id: newPost.id },
                    data: {
                        tags: {
                            connect: tags.map((tagId: string | number) => ({ id: tagId }))
                        }
                    }
                });
            }

            if (categories && categories.length > 0) {
                await prisma.post.update({
                    where: { id: newPost.id },
                    data: {
                        categories: {
                            connect: categories.map((categoryId: string | number) => ({ id: categoryId }))
                        }
                    }
                });
            }

            if (multiMedias && multiMedias.length > 0) {
                await prisma.multiMedia.createMany({
                    data: multiMedias.map((media: any) => ({
                        postId: newPost.id,
                        caption: media.caption || null,
                        altText: media.altText,
                        url: media.url,
                        type: media.type,
                    })),
                });

                multiMedias.map((media: any) => {
                    console.log("Post ID: ", newPost.id);
                    console.log("Caption: ", media.caption);
                    console.log("Alt Text: ", media.altText);
                    console.log("URL: ", media.url);
                    console.log("Type: ", media.type);
                });
            };

            return newPost;
        }, {
            timeout: 10000,
        });

        return apiResponse(c, 200, result, "Post Created Successfully");

    } catch (error: any) {
        console.log("Create Post Error: ", error.message);
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            console.error("Prisma Transaction Error: ", error.message);
            return apiError(c, 400, "Post Creation Failed");
        }
        return apiError(c, 500, "Internal Server Error", { code: "CE" });
    }
}

export async function updateDraftPost(c: Context) {
    const authorId = c.get("user").id;
    const prisma = c.get('prisma');
    const requestBody = await c.req.json();

    try {
        if (!requestBody.id) {
            return apiError(c, 400, "Post ID is required");
        }

        const response = createNewDraftPostSchema.safeParse(requestBody);

        if (!response.success) {
            return apiError(c, 400, response.error.errors[0].message);
        }

        const { title, shortCaption, summary, tags, categories, body, coverImage, allowComments, multiMedias } = response.data;
        // const slug = createSlug(title, 25);

        // Upsert Post (create or update if exists)
        const result = await prisma.$transaction(async (prisma: any) => {
            const updatedPost = await prisma.post.update({
                where: { id: requestBody.id },
                data: {
                    coverImage: coverImage ?? null,
                    title,
                    shortCaption,
                    body,
                    summary,
                    allowComments,
                },
            });

            // Update tags if provided
            if (tags && tags.length > 0) {
                await prisma.post.update({
                    where: { id: updatedPost.id },
                    data: {
                        tags: {
                            connect: tags.map((tagId: string | number) => ({ id: tagId }))
                        }
                    }
                });
            }

            // Update categories if provided
            if (categories && categories.length > 0) {
                await prisma.post.update({
                    where: { id: updatedPost.id },
                    data: {
                        categories: {
                            connect: categories.map((categoryId: string | number) => ({ id: categoryId }))
                        }
                    }
                });
            }

            // Create multimedia if provided
            if (multiMedias && multiMedias.length > 0) {
                await prisma.multiMedia.createMany({
                    data: multiMedias.map((media: any) => ({
                        postId: updatedPost.id,
                        caption: media.caption || null,
                        altText: media.altText,
                        url: media.url,
                        type: media.type,
                    })),
                });
            }

            return updatedPost;
        }, {
            timeout: 10000,
        });

        return apiResponse(c, 200, result, "Post Upserted Successfully");

    } catch (error: any) {
        console.log("Create Post Error: ", error.message);
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            console.error("Prisma Transaction Error: ", error.message);
            return apiError(c, 400, "Post Upsert Failed");
        }
        return apiError(c, 500, "Internal Server Error", { code: "CE" });
    }
}

export async function upSertDraftPost(c: Context) {
    const authorId = c.get("user").id;
    const prisma = c.get('prisma');
    const requestBody = await c.req.json();


    try {
        const response = createNewDraftPostSchema.safeParse(requestBody);

        console.log(requestBody);

        if (!response.success) {
            return apiError(c, 400, response.error.errors[0].message);
        }

        const { title, shortCaption, summary, tags, categories, body, coverImage, allowComments, multiMedias } = response.data;
        const slug = createSlug(title, 25);

        // Upsert Post (create or update if exists)
        const result = await prisma.$transaction(async (prisma: any) => {
            const isPostExist = await prisma.post.findFirst({
                where: {
                    AND: [
                        { slug },
                        { status: PostStatus.PUBLISHED }
                    ]
                }
            });

            if (isPostExist) {
                return apiError(c, 400, "Post name already exist");
            }

            const updatedPost = await prisma.post.upsert({
                where: { id: requestBody.id },
                update: {
                    coverImage: coverImage ?? null,
                    title,
                    shortCaption,
                    body,
                    summary,
                    allowComments,
                },
                create: {
                    coverImage: coverImage ?? null,
                    title,
                    shortCaption,
                    slug,
                    body,
                    summary,
                    allowComments,
                    author: {
                        connect: { id: authorId }
                    },
                    status: PostStatus.DRAFT,
                }
            });

            // Update tags if provided
            if (tags && tags.length > 0) {
                await prisma.post.update({
                    where: { id: updatedPost.id },
                    data: {
                        tags: {
                            connect: tags.map((tagId: string | number) => ({ id: tagId }))
                        }
                    }
                });
            }

            // Update categories if provided
            if (categories && categories.length > 0) {
                await prisma.post.update({
                    where: { id: updatedPost.id },
                    data: {
                        categories: {
                            connect: categories.map((categoryId: string | number) => ({ id: categoryId }))
                        }
                    }
                });
            }

            // Create multimedia if provided
            if (multiMedias && multiMedias.length > 0) {
                await prisma.multiMedia.createMany({
                    data: multiMedias.map((media: any) => ({
                        postId: updatedPost.id,
                        caption: media.caption || null,
                        altText: media.altText,
                        url: media.url,
                        type: media.type,
                    })),
                });
            }

            return updatedPost;
        }, {
            timeout: 10000,
        });

        return apiResponse(c, 200, result, "Post Upserted Successfully");

    } catch (error: any) {
        console.log("Create Post Error: ", error.message);
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            console.error("Prisma Transaction Error: ", error.message);
            return apiError(c, 400, "Post Upsert Failed");
        }
        return apiError(c, 500, "Internal Server Error", { code: "CE" });
    }
}
