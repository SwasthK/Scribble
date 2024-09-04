// // import { Context } from "hono";
// // import { dbConnect } from "../../Connection/db.connect";
// // import { apiResponse } from "../../utils/apiResponse";
// // import { apiError } from "../../utils/apiError";

// // export async function createAndPublsih(c: Context) {
// //     const {
// //         coverImage,
// //         postId,
// //         title,
// //         shortCaption,
// //         body,
// //         summary,
// //         authorId,
// //         allowComments,
// //         multiMedias,
// //         categories,
// //         tags,
// //         status,
// //     } = await c.req.json();

// //     // slug will be created here ignore now
// //     // validations of input will be done here ignore now

// //     try {
// //         const prisma: any = await dbConnect(c);

// //         const post = await prisma.post.upsert({
// //             where: { id: postId || "" },
// //             update: {
// //                 coverImage,
// //                 title,
// //                 shortCaption,
// //                 // slug, // Slug generation logic here
// //                 body,
// //                 summary,
// //                 allowComments,
// //                 status: status || "PUBLISHED",
// //                 publishedAt: status === "PUBLISHED" ? new Date() : null,
// //                 categories: {
// //                     connectOrCreate: categories.map((cat: any) => ({
// //                         where: { slug: cat.slug || "" },
// //                         create: { name: cat.name, slug: cat.slug },
// //                     })),
// //                 },
// //                 tags: {
// //                     connectOrCreate: tags.map((tag: any) => ({
// //                         where: { slug: tag.slug || "" },
// //                         create: { name: tag.name, slug: tag.slug },
// //                     })),
// //                 },
// //                 revisions: {
// //                     create: { content: JSON.stringify({ title, shortCaption, body, summary, allowComments, status }) },
// //                 },
// //             },
// //             create: {
// //                 coverImage,
// //                 title,
// //                 shortCaption,
// //                 // slug, // Slug generation logic here
// //                 body,
// //                 summary,
// //                 allowComments,
// //                 status: status || "PUBLISHED",
// //                 publishedAt: status === "PUBLISHED" ? new Date() : null,
// //                 categories: {
// //                     connectOrCreate: categories.map((cat: any) => ({
// //                         where: { slug: cat.slug || "" },
// //                         create: { name: cat.name, slug: cat.slug },
// //                     })),
// //                 },
// //                 tags: {
// //                     connectOrCreate: tags.map((tag: any) => ({
// //                         where: { slug: tag.slug || "" },
// //                         create: { name: tag.name, slug: tag.slug },
// //                     })),
// //                 },
// //                 revisions: {
// //                     create: { content: JSON.stringify({ title, shortCaption, body, summary, allowComments, status }) },
// //                 },
// //             },
// //         });

// //         if (multiMedias && multiMedias.length > 0) {  // Correct check for multiMedias
// //             const multiMediaPostPromises = multiMedias.map(async (media: any) => {
// //                 return await prisma.multiMedia.upsert({
// //                     where: { id: media.id || "" },
// //                     update: {
// //                         caption: media.caption,
// //                         altText: media.altText,
// //                         url: media.url,
// //                         type: media.type,
// //                         postId: post.id,
// //                     },
// //                     create: {
// //                         caption: media.caption,
// //                         altText: media.altText,
// //                         url: media.url,
// //                         type: media.type,
// //                         postId: post.id,
// //                     },
// //                 });
// //             });
// //             await Promise.all(multiMediaPostPromises);
// //         }

// //         return apiResponse(c, 200, post);
// //     } catch (error: any) {
// //         console.log("Publish Controller Error:", error);
// //         return apiError(c, 500, "Internal Server Error", { code: "CE" });
// //     }
// // }



// import { Context } from "hono";

// export async function createOrUpdatePost(c: Context) {
//     const { postId, title, shortCaption, body, summary, authorId, allowComments, multiMedias, categories, tags, status } = await c.req.json();

//     if (!postId) {
//         createNewPost()
//     }

//     if (postId) {
//         updatethePost()
//     }

 

// }