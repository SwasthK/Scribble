import { Context } from "hono";
import { dbConnect } from "../../Connection/db.connect";
import { apiResponse } from "../../utils/apiResponse";

export async function getFollowersDetails(c: Context) {
    const userId = c.get('user').id;
    const prisma: any = await dbConnect(c);

    const followers = await prisma.follower.findMany({
        where: { followingId: userId },
        select: {
            follower: {
                select: {
                    id: true,
                    username: true
                }
            }
        }
    })

    return apiResponse(c, 200, { followers: followers.map((f: any) => f.follower), count: followers.length });
}

export async function getFollowingsDetails(c: Context) {
    const userId = c.get('user').id;
    const prisma: any = await dbConnect(c);

    const followers = await prisma.follower.findMany({
        where: { followerId: userId },
        select: {
            following: {
                select: {
                    id: true,
                    username: true
                }
            }
        }
    })

    return apiResponse(c, 200, { following: followers.map((f: any) => f.following), count: followers.length });
}