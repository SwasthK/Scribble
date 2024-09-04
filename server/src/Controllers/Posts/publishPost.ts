// import { Context } from "hono";
// import { dbConnect } from "../../Connection/db.connect";
// import { apiResponse } from "../../utils/apiResponse";
// import { apiError } from "../../utils/apiError";

// export async function createOrUpdatePublishedPost(c: Context) {
//     try {
//         const {
//             coverImage,
//             postId,
//             title,
//             slug,
//             shortCaption,
//             body,
//             summary,
//             authorId,
//             allowComments,
//             multiMedias,
//             categories,
//             tags,
//             status,
//         } = await c.req.json();

//         const prisma: any = await dbConnect(c);

//         const postResponse = await createOrUpdatePost({ postId, coverImage, title, slug, shortCaption, body, summary, authorId, allowComments, status }, prisma);
//         await createOrUpdateMultiMedia(multiMedias, postResponse.id, prisma);
//         await createOrUpdateCategories(categories, postResponse.id, prisma);
//         await createOrUpdateTags(tags, postResponse.id, prisma);

//         return apiResponse(c, 200, postResponse);
//     } catch (error: any) {
//         console.error('Error creating or updating post:', error);
//         return apiError(c, 500, 'Internal Server Error', { code: 'POST_ERROR' });
//     }
// }

// async function createOrUpdatePost({ postId, coverImage, title, slug, shortCaption, body, summary, authorId, allowComments, status }: any, prisma: any) {
//     try {
//         const post = await prisma.post.upsert({
//             where: { id: postId || "" },
//             update: {
//                 coverImage,
//                 title,
//                 shortCaption,
//                 slug,
//                 body,
//                 summary,
//                 allowComments,
//                 status: status || "DRAFT",
//                 publishedAt: status === "PUBLISHED" ? new Date() : null,
//             },
//             create: {
//                 coverImage,
//                 title,
//                 shortCaption,
//                 slug,
//                 body,
//                 summary,
//                 allowComments,
//                 status: status || "DRAFT",
//                 publishedAt: status === "PUBLISHED" ? new Date() : null,
//             },
//         });
//         return post;
//     } catch (error: any) {
//         console.error('Error creating or updating post:', error);
//         throw new Error('Failed to create or update post');
//     }
// }

// async function createOrUpdateMultiMedia(multiMedias: any[], postId: string, prisma: any) {
//     try {
//         if (!multiMedias || multiMedias.length === 0) {
//             return [];
//         }

//         const multimediaPromises = multiMedias.map(async (media: any) => {
//             return prisma.multiMedia.upsert({
//                 where: { id: media.id || "" },
//                 update: {
//                     caption: media.caption,
//                     altText: media.altText,
//                     url: media.url,
//                     type: media.type,
//                     postId: postId,
//                 },
//                 create: {
//                     caption: media.caption,
//                     altText: media.altText,
//                     url: media.url,
//                     type: media.type,
//                     postId: postId,
//                 }
//             });
//         });

//         const multimediaResults = await Promise.all(multimediaPromises);
//         return multimediaResults;
//     } catch (error: any) {
//         console.error('Error creating or updating multimedia:', error);
//         throw new Error('Failed to create or update multimedia');
//     }
// }

// async function createOrUpdateCategories(categories: any[], postId: string, prisma: any) {
//     try {
//         if (!categories || categories.length === 0) {
//             return [];
//         }

//         const categoryPromises = categories.map(async (cat: any) => {
//             return prisma.category.upsert({
//                 where: { slug: cat.slug || "" },
//                 update: {
//                     name: cat.name,
//                     slug: cat.slug,
//                 },
//                 create: {
//                     name: cat.name,
//                     slug: cat.slug,
//                 }
//             }).then((categoryRecord: any) => {
//                 return prisma.post.update({
//                     where: { id: postId },
//                     data: {
//                         categories: {
//                             connect: { id: categoryRecord.id },
//                         },
//                     },
//                 });
//             });
//         });

//         const categoryResults = await Promise.all(categoryPromises);
//         return categoryResults;
//     } catch (error: any) {
//         console.error('Error creating or updating categories:', error);
//         throw new Error('Failed to create or update categories');
//     }
// }

// async function createOrUpdateTags(tags: any[], postId: string, prisma: any) {
//     try {
//         if (!tags || tags.length === 0) {
//             return [];
//         }

//         const tagPromises = tags.map(async (tag: any) => {
//             return prisma.tag.upsert({
//                 where: { slug: tag.slug || "" },
//                 update: {
//                     name: tag.name,
//                     slug: tag.slug,
//                 },
//                 create: {
//                     name: tag.name,
//                     slug: tag.slug,
//                 }
//             }).then((tagRecord: any) => {
//                 return prisma.post.update({
//                     where: { id: postId },
//                     data: {
//                         tags: {
//                             connect: { id: tagRecord.id },
//                         },
//                     },
//                 });
//             });
//         });

//         const tagResults = await Promise.all(tagPromises);
//         return tagResults;
//     } catch (error: any) {
//         console.error('Error creating or updating tags:', error);
//         throw new Error('Failed to create or update tags');
//     }
// }
