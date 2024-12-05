import { Context } from "hono";
import { apiError } from "../../utils/apiError";
import { apiResponse } from "../../utils/apiResponse";
import { PostStatus } from "@prisma/client";
import { usernameSchema } from "Zod/zod";
import { createSlug } from "utils/createSlug";


export async function getPostById(c: Context) {

    const postId = c.req.param('postId');
    if (!postId) {
        return apiError(c, 400, "Post Id is required");
    }

    try {
        const prisma = c.get('prisma');

        const post = await prisma.post.findUnique({
            where: { id: postId },
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
        const prisma = c.get('prisma');

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

export async function getPostByAuthorId(c: Context) {
    //Used

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
        console.log("Get Post By UserId Error: ", error.message);
        return apiError(c, 500, "Internal Server Error", { code: "CE" });
    }
}

export async function getPostByUsername(c: Context) {
    //Used

    try {
        const currentUser = c.get("user");
        const username = c.req.param('username');

        const parseUsername = usernameSchema.safeParse(username);
        if (!parseUsername.success) {
            return apiError(c, 400, parseUsername.error.errors[0].message);
        }

        // if (currentUser.username === username) {
        //     return apiError(c, 400, "You can't view your own posts");
        // }

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
        console.log("Get Post By UserId Error: ", error.message);
        return apiError(c, 500, "Internal Server Error", { code: "CE" });
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

export async function getPublishedPost(c: Context) {
    const user = c.get("user");

    try {
        const prisma = c.get('prisma');

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

export async function getDraftedPostShortned(c: Context) {
    const user = c.get("user");

    try {
        const prisma = c.get('prisma');

        const posts = await prisma.post.findMany({
            where: {
                authorId: user.id,
                status: PostStatus.DRAFT
            },
            orderBy: {
                updatedAt: 'desc'
            },
            select: {
                id: true,
                authorId: true,
                title: true,
                status: true,
                updatedAt: true
            }
        });

        if (!posts) {
            return apiError(c, 404, "No Post Found");
        }

        return apiResponse(c, 200, posts, "Posts fetched successfully");

    } catch (error: any) {
        console.log("Get All Posts Error: ", error.message);
        return apiError(c, 500, "Internal Server Error", { code: "CE" });
    }

}

export async function getDraftedPostFullContentById(c: Context) {
    const user = c.get("user");

    const postId = c.req.param('postId');

    if (!postId) {
        return apiError(c, 400, "Post Id is required");
    }

    try {
        const prisma = c.get('prisma');

        const post = await prisma.post.findFirst({
            where: {
                AND: [{
                    id: postId,
                    authorId: user.id,
                }]
            },
            select: {
                title: true,
                shortCaption: true,
                body: true,
                coverImage: true,
                summary: true,
                allowComments: true,
            }
        });

        if (!post) {
            return apiError(c, 404, "No Post Found");
        }

        return apiResponse(c, 200, post, "Posts fetched successfully");

    } catch (error: any) {
        console.log("Get All Posts Error: ", error.message);
        return apiError(c, 500, "Internal Server Error", { code: "CE" });
    }

}

export async function getAllPosts(c: Context) {
    //Used

    const user = c.get("user");
    const page = Number(c.req.query("page") || 1);
    if (page < 1) { return apiError(c, 400, "Invalid page number"); }
    const limit = Number(c.req.query("limit") || 10);
    if (limit < 1) { return apiError(c, 400, "Invalid limit number"); }

    const skip = (page - 1) * limit;

    try {
        const prisma = c.get('prisma');

        // Get total number of posts
        const totalPosts = await prisma.post.count(
            {
                where: {
                    status: PostStatus.PUBLISHED
                }
            }
        );

        const totalPages = Math.ceil(totalPosts / limit);

        // const posts = await prisma.post.findMany({
        //     skip: skip,
        //     take: limit,
        //     orderBy: {
        //         createdAt: 'desc',
        //     },
        //     select: {
        //         id: true,
        //         author: {
        //             select: {
        //                 username: true,
        //                 avatarUrl: true
        //             }
        //         },
        //         coverImage: true,
        //         title: true,
        //         shortCaption: true,
        //         slug: true,
        //         createdAt: true,

        //         // categories: {
        //         //     select: {
        //         //         name: true
        //         //     }
        //         // },
        //         // tags: {
        //         //     select: {
        //         //         name: true
        //         //     }
        //         // },
        //         // multiMedias: {
        //         //     select: {
        //         //         url: true
        //         //     }
        //         // },
        //         likes: {
        //             select: {
        //                 user: {
        //                     select: {
        //                         username: true
        //                     }
        //                 }
        //             }
        //         },
        //     }
        // });


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