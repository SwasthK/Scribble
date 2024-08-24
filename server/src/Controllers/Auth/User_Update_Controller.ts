import { Context } from "hono";
import { apiResponse } from "../../utils/apiResponse";
import { updateUserProfileSchema } from "../../Zod/zod";
import { dbConnect } from "../../Connection/db.connect";
import { apiError } from "../../utils/apiError";

export async function UpdateUserProfile(c: Context) {
    try {
        const user = c.get('user');

        const response = updateUserProfileSchema.safeParse(await c.req.json());
        if (!response.success) {
            return apiError(c, 400, response.error.errors[0].message);
        }

        const updateData = {
            ...(response.data.username && { username: response.data.username }),
            ...(response.data.email && { email: response.data.email }),
            ...(response.data.bio && { bio: response.data.bio }),
        };

        const prisma: any = await dbConnect(c);

        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [
                    { email: updateData.email },
                    { username: updateData.username }
                ]
            }
        })

        if (existingUser) {
            return apiError(c, 400, "Username or Email already exists")
        }

        const updateUser = await prisma.user.update({
            where: { id: user.id },
            data: updateData,
            select: {
                id: true,
                username: true,
                email: true,
                bio: true
            }
        });

        if (!updateUser) {
            return apiError(c, 400, "Failed to update user profile");
        }

        return apiResponse(c, 200, updateUser, "User Profile Updated");
    } catch (error: any) {
        console.log('UpdateUserProfile Controller', `ERROR:${error.message}`);
        return apiError(c, 500, "Internal Server Error", { code: "CE" });
    }
}