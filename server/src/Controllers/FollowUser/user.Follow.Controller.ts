import { Context } from "hono";
import { apiResponse } from "../../utils/apiResponse";
import { apiError } from "../../utils/apiError";

export async function FollowUser(c: Context) {
    try {
        const userId = c.get('user').id;

        const userIdToFollow = c.req.param('id')

        if (!userIdToFollow) { return apiError(c, 400, "User Id is required"); }

        if (userId === userIdToFollow) { return apiError(c, 400, "You can not follow yourself"); }

        const prisma: any = await c.get('prisma');

        const userToFollow = await prisma.user.findFirst({
            where: { id: userIdToFollow },
            select: {
                id: true,
                following: {
                    where: {
                        followerId: userId
                    }
                }
            }
        });

        if (!userToFollow || !userToFollow.id) { return apiError(c, 400, "User not found"); }

        if (userToFollow.following.length > 0) { return apiError(c, 400, "You are already following this user"); }

        const response = await prisma.follower.create({
            data: {
                followerId: userId,
                followingId: userIdToFollow
            },
            select: {
                id: true
            }
            
        });

        return apiResponse(c, 200, { id: response.id }, "User followed successfully");
    }
    catch (error: any) {
        console.log('FollowUser Controller', `ERROR:${error.message}`);
        return apiError(c, 500, "Internal Server Error", { code: "CE" });
    }
}

export async function UnFollowUser(c: Context) {
    try {
        const userId = c.get('user').id;
        const userIdToUnFollow = c.req.param('id');

        if (!userIdToUnFollow) { return apiError(c, 400, "User Id is required"); }

        if (userId === userIdToUnFollow) { return apiError(c, 400, "You can not unfollow yourself"); }

        const prisma: any = await c.get('prisma');

        const userToUnFollow = await prisma.user.findFirst({
            where: { id: userIdToUnFollow },
            select: {
                id: true,
                following: {
                    where: {
                        followerId: userId
                    },
                    select: {
                        id: true
                    }
                }
            }
        })

        if (!userToUnFollow || !userToUnFollow.id) { return apiError(c, 400, "User not found"); }

        if (userToUnFollow.following.length === 0) { return apiError(c, 400, "You are not following this user"); }

        const response = await prisma.follower.delete({
            where: {
                id: userToUnFollow.following[0].id
            },
            select: {
                id: true
            }
        });

        return apiResponse(c, 200, { id: response.id }, "User unfollowed successfully");
    } catch (error: any) {
        console.log('UnFollowUser Controller', `ERROR:${error.message}`);
        return apiError(c, 500, "Internal Server Error", { code: "CE" });
    }

}