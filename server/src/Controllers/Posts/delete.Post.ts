import { Context } from "hono";
import { apiError } from "../../utils/apiError";
import { apiResponse } from "../../utils/apiResponse";
import { PostStatus } from "@prisma/client";
import { deletePostSchema } from "Zod/zod";





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

