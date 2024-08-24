import { Context } from "hono";
import { apiResponse } from "../../utils/apiResponse";
import { apiError } from "../../utils/apiError";
import { dbConnect } from "../../Connection/db.connect";

export async function FollowUser(c: Context) {
    try {
        const user = c.get('user');
        const userId = user.id;
        const userIdToFollow = c.req.param('id')

        if (!userIdToFollow) {
            return apiError(c, 400, "User Id is required");
        }

        if (userId === userIdToFollow) {
            return apiError(c, 400, "You can not follow yourself");
        }

        const prisma: any = await dbConnect(c);

        const userToFollow = await prisma.user.findFirst({
            where: { id: userIdToFollow }
        });

        if (!userToFollow) {
            return apiError(c, 400, "User not found");
        }

        const aleardyFollowing = await prisma.follower.findFirst({
            where: {
                AND: [
                    { followerId: userId },
                    { followingId: userIdToFollow }
                ]
            }
        });

        if (aleardyFollowing) {
            return apiError(c, 400, "You are already following this user");
        }

        await prisma.follower.create({
            data: {
                followerId: userId,
                followingId: userIdToFollow
            }
        });

        return apiResponse(c, 200, { follower: userId, following: userIdToFollow }, "User followed successfully");
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

        if (!userIdToUnFollow) {
            return apiError(c, 400, "User Id is required");
        }

        if (userId === userIdToUnFollow) {
            return apiError(c, 400, "You can not unfollow yourself");
        }

        const prisma: any = await dbConnect(c);

        const userToUnFollow = await prisma.user.findFirst({
            where: { id: userIdToUnFollow }
        })

        if (!userToUnFollow) {
            return apiError(c, 400, "User not found");
        }

        const aleardyFollowing = await prisma.follower.findFirst({
            where: {
                AND: [
                    { followerId: userId },
                    { followingId: userIdToUnFollow }
                ]
            }
        })

        if (!aleardyFollowing) {
            return apiError(c, 400, "You are not following this user");
        }

        await prisma.follower.delete({
            where: {
                id: aleardyFollowing.id
            }
        });

        return apiResponse(c, 200, { follower: userId, following: userIdToUnFollow }, "User unfollowed successfully");
    } catch (error: any) {
        console.log('UnFollowUser Controller', `ERROR:${error.message}`);
        return apiError(c, 500, "Internal Server Error", { code: "CE" });
    }
    
}