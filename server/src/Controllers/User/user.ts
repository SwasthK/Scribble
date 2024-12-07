import { Context } from "hono";
import { apiError } from "utils/apiError";
import { apiResponse } from "utils/apiResponse";
import { usernameSchema } from "Zod/zod";

export async function getUserDetailsByUsername(c: Context) {
    //Used

    try {
        const username = c.req.param('username');

        const parseUsername = usernameSchema.safeParse(username);
        if (!parseUsername.success) {
            return apiError(c, 400, parseUsername.error.errors[0].message);
        }

        // if (currentUser.username === username) {
        //     return apiError(c, 400, "You can't view your own posts");
        // }

        const prisma: any = c.get('prisma');

        const user = await prisma.user.findUnique({
            where: {
                username
            },
            select: {
                avatarUrl: true,
                username: true,
                bio: true,
                email: true,
                socials: {
                    select: {
                        platform: true,
                        url: true
                    }
                },
                createdAt: true,
            }
        });

        if (!user) { return apiError(c, 404, "User not found"); }

        console.log(user);

        return apiResponse(c, 200, user, "Post fetched successfully");

    } catch (error: any) {
        console.log("Get UserDetails By Username Error: ", error.message);
        return apiError(c, 500, "Internal Server Error", { code: "CE" });
    }
}

export async function getAllUsersName(c: Context) {
    //Used

    try {
        const prisma: any = c.get('prisma');

        const users = await prisma.user.findMany({
            select: {
                username: true,
                avatarUrl: true,
            }
        });

        if (!users) { return apiError(c, 404, "Users Not Found"); }

        return apiResponse(c, 200, users, "users fetched successfully");

    } catch (error: any) {
        console.log("Get all Usersname Error: ", error.message);
        return apiError(c, 500, "Internal Server Error", { code: "CE" });
    }
}