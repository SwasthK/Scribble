import { Context } from "hono";
import { apiError } from "../../utils/apiError";
import { dbConnect } from "../../Connection/db.connect";
import { apiResponse } from "../../utils/apiResponse";
import { PostStatus } from "@prisma/client";

export async function getPostById(c: Context) {

    const postId = c.req.param('postId');
    if (!postId) {
        return apiError(c, 400, "Post Id is required");
    }

    try {
        const prisma: any = await dbConnect(c);

        const post = await prisma.post.findUnique({
            where: { id: postId },
            select: {
                title: true,
                shortCaption: true,
            }
        });

        if (!post) {
            return apiError(c, 404, "Post Not Found");
        }

        return apiResponse(c, 200, post, "Post fetched successfully");

    } catch (error: any) {
        console.log("Get Post By Id Error: ", error.message);
        return apiError(c, 500, "Internal Server Error", { code: "CE" });
    }
}

export async function getPostByTitle(c: Context) {

    const postTitle = c.req.param('postTitle');

    if (!postTitle) {
        return apiError(c, 400, "Post Title is required");
    }

    try {
        const prisma: any = await dbConnect(c);

        const post = await prisma.post.findMany({
            where: {
                title: {
                    search: postTitle,
                },
            },
            select: {
                title: true,
                shortCaption: true,
            }
        });

        if (!post) {
            return apiError(c, 404, "Post Not Found");
        }

        return apiResponse(c, 200, post, "Post fetched successfully");

    } catch (error: any) {
        console.log("Get Post By Title Error: ", error.message);
        return apiError(c, 500, "Internal Server Error", { code: "CE" });
    }
}

export async function getPublishedPost(c: Context) {
    const user = c.get("user");

    try {
        const prisma: any = await dbConnect(c);

        const posts = await prisma.post.findMany({
            where: { status: PostStatus.PUBLISHED },
            select: {
                title: true,
                status: true
            }
        });

        if (!posts) {
            return apiError(c, 404, "No Post Found");
        }

        if (posts.length === 0) {
            return apiError(c, 404, "0 Post Found");
        }

        return apiResponse(c, 200, posts, "Posts fetched successfully");

    } catch (error: any) {
        console.log("Get All Posts Error: ", error.message);
        return apiError(c, 500, "Internal Server Error", { code: "CE" });
    }

}

export async function getArchivedPost(c: Context) {
    const user = c.get("user");

    try {
        const prisma: any = await dbConnect(c);

        const posts = await prisma.post.findMany({
            where: { status: PostStatus.ARCHIVED },
            select: {
                id: true,
                status: true
            }
        });

        if (!posts) {
            return apiError(c, 404, "No Post Found");
        }

        if (posts.length === 0) {
            return apiError(c, 404, "0 Post Found");
        }

        return apiResponse(c, 200, posts, "Posts fetched successfully");

    } catch (error: any) {
        console.log("Get All Posts Error: ", error.message);
        return apiError(c, 500, "Internal Server Error", { code: "CE" });
    }

}

export async function getAllPosts(c: Context) {
    const user = c.get("user");

    try {
        const prisma: any = await dbConnect(c);

        const posts = await prisma.post.findMany({
            select: {
                id: true,
                author: {
                    select: {
                        username: true
                    }
                },
                title: true,
                allowComments: true,
                categories: {
                    select: {
                        name: true
                    }
                },
                tags: {
                    select: {
                        name: true
                    }
                },
                multiMedias: {
                    select: {
                        url: true
                    }
                },
                likes: {
                    select: {
                        user: {
                            select: {
                                username: true
                            }
                        }
                    }
                },
                status: true
            }
        });

        if (!posts) {
            return apiError(c, 404, "No Post Found");
        }

        if (posts.length === 0) {
            return apiError(c, 404, "0 Post Found");
        }

        return apiResponse(c, 200, posts, "Posts fetched successfully");

    } catch (error: any) {
        console.log("Get All Posts Error: ", error.message);
        return apiError(c, 500, "Internal Server Error", { code: "CE" });
    }

}

export async function getUserPosts(c: Context) {
    const userId = c.get("user").id;

    try {
        const prisma: any = await dbConnect(c);

        const post = await prisma.post.findMany({
            where: { authorId: userId },
            select: {
                id: true,
                title: true,
                status: true
            }
        });

        if (!post) {
            return apiError(c, 404, "Post Not Found");
        }

        return apiResponse(c, 200, post, "Post fetched successfully");

    } catch (error: any) {
        console.log("Get User Posts Error: ", error.message);
        return apiError(c, 500, "Internal Server Error", { code: "CE" });

    }
}