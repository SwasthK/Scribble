import { Context } from "hono";
import { apiResponse } from "utils/apiResponse";
import { apiError } from "utils/apiError";
import { GlobalResponse } from "utils/responses";

export async function getFollowersDetails(c: Context) {
    try {
        const userId = c.get('user').id;
        const prisma: any = await c.get('prisma');

        const followers = await prisma.follower.findMany({
            where: { followingId: userId },
            select: {
                createdAt: true,
                follower: {
                    select: {
                        username: true,
                        avatarUrl: true
                    }
                }
            }
        })

        const normalizedFollowers = followers.map((follower: any) => ({
            username: follower.follower.username,
            avatarUrl: follower.follower.avatarUrl,
            createdAt: follower.createdAt,
        }));

        if (!followers) {
            return apiError(c, 400, "Failed to fetch the data")
        }

        return apiResponse(c, 200, { followers: normalizedFollowers, count: followers.length });
    } catch (error: any) {
        console.log("Get- followers - error ", error);
        return apiError(c, 500, GlobalResponse.INTERNALERROR)
    }
}

export async function getFollowingsDetails(c: Context) {
    try {
        const userId = c.get('user').id;
        const prisma: any = await c.get('prisma');

        const followings = await prisma.follower.findMany({
            where: { followerId: userId },
            select: {
                createdAt: true,
                following: {
                    select: {
                        username: true,
                        avatarUrl: true
                    }
                }
            }
        })

        if (!followings) {
            return apiError(c, 400, "Failed to fetch the data")
        }

        const normalizedFollowings = followings.map((value: any) => ({
            username: value.following.username,
            avatarUrl: value.following.avatarUrl,
            createdAt: value.createdAt,
        }));

        return apiResponse(c, 200, { followings: normalizedFollowings, count: followings.length });
    } catch (error: any) {
        console.log("Get - Following -Error ", error);
        return apiError(c, 500, GlobalResponse.INTERNALERROR)
    }

}