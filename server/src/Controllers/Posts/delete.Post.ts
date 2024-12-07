import { Context } from "hono";
import { apiError } from "../../utils/apiError";
import { apiResponse } from "../../utils/apiResponse";
import { PostStatus } from "@prisma/client";
import { deletePostSchema } from "Zod/zod";

export async function deletePublishedPostById(c: Context) {
    const userId = c.get('user').id

    const postId = c.req.param('publishId');

    if (!postId) { return apiError(c, 400, 'Post ID is required'); }

    const validatePostId = deletePostSchema.safeParse({ postId });

    if (!validatePostId.success) { return apiError(c, 400, validatePostId.error.errors[0].message); }


    try {

        const prisma: any = c.get('prisma')

        const post = await prisma.post.findFirst({
            where: { id: postId },
            select: {
                author: {
                    select: {
                        id: true
                    }
                },
                status: true
            }
        });

        if (post && post.author.id === userId && post.status === PostStatus.PUBLISHED) {

            const deletePost = await prisma.post.delete({
                where: {
                    id: postId
                }
            });

            if (!deletePost) {
                return apiError(c, 500, "Failed to delete post");
            }

            return apiResponse(c, 200, {}, "Post deleted successfully");
        }
        else {
            return apiError(c, 404, "Post not found");
        }


    } catch (error: any) {
        console.log("Delete Publlished Post Error", error);
        return apiError(c, 500, "Internal Server Error", { code: "CE" });
    }

}

export async function deleteDraftPostById(c: Context) {
    const userId = c.get('user').id

    const postId = c.req.param('draftId');

    if (!postId) {
        return apiError(c, 400, 'Post ID is required');
    }

    const validatePostId = deletePostSchema.safeParse({ postId });

    if (!validatePostId.success) {
        return apiError(c, 400, validatePostId.error.errors[0].message);
    }

    try {

        const prisma: any = await c.get('prisma');

        const post = await prisma.post.findFirst({
            where: {
                AND: [{
                    id: postId,
                    author: { id: userId },
                    status: PostStatus.DRAFT
                }]
            }
        });

        if (!post) {
            return apiError(c, 404, "Post not found");
        }

        const deletePost = await prisma.post.delete({
            where: {
                id: postId
            }
        });

        if (!deletePost) {
            return apiError(c, 500, "Failed to delete post");
        }

        return apiResponse(c, 200, post, "Post deleted successfully");

    } catch (error: any) {
        console.log("Delete Post Error", error);
        return apiError(c, 500, "Internal Server Error", { code: "CE" });
    }

}

// export async function deleteDraftPost(c: Context) {
//     const userId = c.get('user').id

//     const postId = c.req.param('draftId');

//     if (!postId) {
//         return apiError(c, 400, 'Post ID is required');
//     }

//     const validatePostId = deletePostSchema.safeParse({ postId });

//     if (!validatePostId.success) {
//         return apiError(c, 400, validatePostId.error.errors[0].message);
//     }

//     try {

//         const prisma: any = c.get('prisma');

//         const post = await prisma.post.findFirst({
//             where: {
//                 AND: [{
//                     id: postId,
//                     author: { id: userId },
//                     status: PostStatus.DRAFT
//                 }]
//             }
//         });

//         if (!post) {
//             return apiError(c, 404, "Post not found");
//         }

//         const deletePost = await prisma.post.delete({
//             where: {
//                 id: postId
//             }
//         });

//         if (!deletePost) {
//             return apiError(c, 500, "Failed to delete post");
//         }

//         return apiResponse(c, 200, post, "Post deleted successfully");

//     } catch (error: any) {
//         console.log("Delete Post Error", error);
//         return apiError(c, 500, "Internal Server Error", { code: "CE" });
//     }

// }

export async function deleteDraftBulk(c: Context) {
    const userId = c.get('user').id

    try {

        const prisma: any = c.get('prisma');

        const deletePost = await prisma.post.deleteMany({
            where: {
                AND: [{
                    authorId: userId,
                    status: PostStatus.DRAFT
                }]
            }
        });

        if (deletePost.count === 0) {
            return apiError(c, 404, "No drafts found to delete");
        }

        return apiResponse(c, 200, deletePost, "Post deleted successfully");

    } catch (error: any) {
        console.log("Delete Post Error", error);
        return apiError(c, 500, "Internal Server Error", { code: "CE" });
    }
}