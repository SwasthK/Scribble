import { PostStatus } from "@prisma/client";
import { Context } from "hono";
import { apiError } from "utils/apiError";
import { apiResponse } from "utils/apiResponse";
import { usernameSchema } from "Zod/zod";

export async function getAllPosts(c: Context) {

    const user = c.get("user");
    console.log(user);
    const page = Number(c.req.query("page") || 1);
    if (page < 1) { return apiError(c, 400, "Invalid page number"); }
    const limit = Number(c.req.query("limit") || 10);
    if (limit < 1) { return apiError(c, 400, "Invalid limit number"); }

    const skip = (page - 1) * limit;

    try {
        const prisma = c.get('prisma');

        const totalPosts = await prisma.post.count(
            {
                where: {
                    status: PostStatus.PUBLISHED
                }
            }
        );

        const totalPages = Math.ceil(totalPosts / limit);

        let posts = await prisma.post.findMany({
            skip: skip,
            take: limit,
            where: {
                authorId: {
                    not: user.id
                },
                status: PostStatus.PUBLISHED
            },
            orderBy: {
                createdAt: 'desc',
            },
            select: {
                id: true,
                author: {
                    select: {
                        username: true,
                        avatarUrl: true
                    }
                },
                coverImage: true,
                title: true,
                shortCaption: true,
                slug: true,
                savedBy: {
                    where: { userId: user.id },
                    select: { postId: true }
                },
                likes: {
                    where: { userId: user.id },
                    select: { postId: true }
                },
                categories: true,
                createdAt: true,
                _count: {
                    select: {
                        likes: true,
                        comments: true
                    }
                },
            }
        });


        posts = posts.map((post: any) => {
            const { savedBy, ...rest } = post;
            return {
                ...rest,
                isSaved: savedBy.length > 0 ? true : false
            }
        })

        return apiResponse(c, 200, { posts, currentPage: page, totalPages, totalPosts, user }, "Posts fetched successfully");

    } catch (error: any) {
        console.log("Get All Posts Error: ", error.message);
        return apiError(c, 500, "Internal Server Error");
    }

}

export async function getPostByAuthorId(c: Context) {

    const currentUser = c.get("user");
    const currentSlug = c.req.query('slug');

    const author = c.req.param('authorId');
    const limitQuery = c.req.query("limit");
    const limit = limitQuery ? parseInt(limitQuery, 10) : 6;

    if (!author) {
        return apiError(c, 400, "Author Id is required");
    }

    if (currentUser.id === author) {
        return apiError(c, 400, "You can't view your own posts");
    }

    try {
        const prisma = c.get('prisma');

        const post = await prisma.post.findMany({
            take: limit,
            orderBy: {
                createdAt: 'desc',
            },
            where: {
                AND: [
                    {
                        authorId: {
                            equals: author
                        },
                    },
                    {
                        authorId: {
                            not: currentUser.id
                        },
                    },
                    {
                        slug: {
                            not: currentSlug,
                        },
                    },
                    {
                        status: PostStatus.PUBLISHED
                    }
                ]
            },
            select: {
                id: true,
                coverImage: true,
                title: true,
                shortCaption: true,
                slug: true,
            }
        });

        console.log(post);

        if (!post) {
            return apiError(c, 404, "Post Not Found");
        }

        return apiResponse(c, 200, post, "Post fetched successfully");

    } catch (error: any) {
        console.log("Get Post By AuthorId Error: ", error.message);
        return apiError(c, 500, "Internal Server Error");
    }
}

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
