import { Context } from "hono";
import { apiError } from "../../utils/apiError";
import { apiResponse } from "../../utils/apiResponse";
import { PostStatus } from "@prisma/client";
import { usernameSchema } from "Zod/zod";
import { createSlug } from "utils/createSlug";




export async function getPostByUsername(c: Context) {
    try {
   
        const username = c.req.param('username');

        const parseUsername = usernameSchema.safeParse(username);
        if (!parseUsername.success) {
            return apiError(c, 400, parseUsername.error.errors[0].message);
        }

        const prisma: any = c.get('prisma');

        const user = await prisma.post.findMany({
            where: {
                author: { username },
                status: PostStatus.PUBLISHED
            },
            select: {
                coverImage: true,
                title: true,
                slug: true,
                updatedAt: true,
            },
            orderBy: {
                updatedAt: 'desc'
            },
        });

        if (!user) { return apiError(c, 404, "User not found"); }

        console.log(user);

        return apiResponse(c, 200, user, "Post fetched successfully");

    } catch (error: any) {
        console.log("Get Post By UserName Error: ", error.message);
        return apiError(c, 500, "Internal Server Error");
    }
}

export async function getPostBySlug(c: Context) {
    //Used
    const userId = c.get("user").id;
    const slug = c.req.param('postSlug');

    if (!slug) {
        return apiError(c, 400, "Post Slug is required");
    }

    try {
        const prisma = c.get('prisma');

        const post = await prisma.post.findMany({
            where: {
                slug
            },
            select: {
                id: true,
                coverImage: true,
                title: true,
                shortCaption: true,
                slug: true,
                body: true,
                summary: true,
                authorId: true,
                allowComments: true,
                categories: true,
                savedBy: {
                    where: { userId },
                    select: { postId: true }
                },
                author: {
                    select: {
                        username: true,
                        avatarUrl: true
                    }
                },
                likes: {
                    where: { userId },
                    select: { postId: true }
                },
                _count: {
                    select: {
                        likes: true,
                        comments: true
                    }
                },
                createdAt: true,
            }
        }
        );

        if (!post || post.length === 0) {
            return apiError(c, 404, "Post Not Found");
        }

        return apiResponse(c, 200, post, "Post fetched successfully");

    } catch (error: any) {
        console.log("Get Post By Title Error: ", error.message);
        return apiError(c, 500, "Internal Server Error", { code: "CE" });
    }
}


export async function getUserPosts(c: Context) {
    //Used

    const user = c.get("user");

    const page = Number(c.req.query("page") || 1);
    if (page < 1) { return apiError(c, 400, "Invalid page number"); }
    const limit = Number(c.req.query("limit") || 6);
    if (limit < 1) { return apiError(c, 400, "Invalid limit number"); }

    const skip = (page - 1) * limit;

    try {
        const prisma = c.get('prisma');

        const totalPosts = await prisma.post.count(
            {
                where: {
                    authorId: user.id,
                    status: PostStatus.PUBLISHED
                }
            }
        );

        const totalPages = Math.ceil(totalPosts / limit);

        const posts = await prisma.post.findMany({
            skip: skip,
            take: limit,
            orderBy: {
                createdAt: 'desc',
            },
            where: {
                authorId: user.id,
                status: PostStatus.PUBLISHED
            },
            select: {
                id: true,
                title: true,
                slug: true,
                shortCaption: true,
                coverImage: true,
                createdAt: true,
                authorId: true,
                categories: true
            }
        });

        console.log(posts);

        return apiResponse(c, 200, {
            posts, currentPage: page, totalPages, totalPosts,
            // user: {
            //     id: user.id,
            //     username: user.username,
            //     email: user.email,
            //     avatarUrl: user.avatarUrl,
            //     bio: user.bio,
            //     createdAt: user.createdAt
            // }
        }, "Posts fetched successfully");

    } catch (error: any) {
        console.log("Get User Posts Error: ", error.message);
        return apiError(c, 500, "Internal Server Error", { code: "CE" });
    }
}

export async function getMostLikedPosts(c: Context) {
    //Used

    const user = c.get("user");

    let limit = 3;

    try {
        const prisma = c.get('prisma');

        const mostLikedPosts = await prisma.post.findMany({
            take: limit,
            orderBy: [
                { likes: { _count: 'desc' } },
                { createdAt: 'desc' },
            ],
            where: {
                status: PostStatus.PUBLISHED,
                authorId: {
                    not: user.id
                }
            },
            select: {
                slug: true,
                title: true,
                author: {
                    select: {
                        username: true,
                        avatarUrl: true
                    }
                }
            }
        });

        return apiResponse(c, 200, {
            mostLikedPosts
        }, "Posts fetched successfully");

    } catch (error: any) {
        console.log("Get Most Liked Posts Error: ", error.message);
        return apiError(c, 500, "Internal Server Error", { code: "CE" });
    }
}

export async function getPostByCategory(c: Context) {

    const categoryName = c.req.param('categoryName');

    if (!categoryName || categoryName == "") { return apiError(c, 400, "Bad request"); }

    const slug = createSlug(categoryName, 25);

    try {
        const prisma = c.get('prisma');

        const post = await prisma.post.findMany({
            where: {
                categories: {
                    some: {
                        slug: {
                            search: slug,
                        },

                    }
                },
            },
            select: {
                slug: true,
                title: true,
                author: {
                    select: {
                        username: true,
                        avatarUrl: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        if (!post) {
            return apiError(c, 404, "Post Not Found");
        }

        return apiResponse(c, 200, post, "Post fetched successfully");

    } catch (error: any) {
        console.log("Get Post By Category Error: ", error.message);
        return apiError(c, 500, "Internal Server Error", { code: "CE" });
    }
}

export async function getAllPostsName(c: Context) {

    try {
        const prisma = c.get('prisma');

        const posts = await prisma.post.findMany({
            where: {
                status: PostStatus.PUBLISHED
            },
            select: {
                slug: true,
            }
        });

        if (!posts) {
            return apiError(c, 404, "Posts Not Found");
        }

        return apiResponse(c, 200, posts, "Posts fetched successfully");

    } catch (error: any) {
        console.log("Get All Post Names Error: ", error.message);
        return apiError(c, 500, "Internal Server Error", { code: "CE" });
    }
}