import { Context } from "hono";
import { apiError } from "../../utils/apiError";
import { updateUserPasswordSchema } from "../../Zod/zod";
import { dbConnect } from "../../Connection/db.connect";
import { apiResponse } from "../../utils/apiResponse";

export async function updateUserPassword(c: Context) {
    try {
        const user = c.get('user');

        const response = updateUserPasswordSchema.safeParse(await c.req.json());
        if (!response.success) {
            return apiError(c, 400, response.error.errors[0].message);
        }

        if (user.password !== response.data.oldPassword) {
            return apiError(c, 400, "Old password is incorrect");
        }

        const prisma: any = await dbConnect(c);

        const updatePassword = await prisma.user.update({
            where: { id: user.id },
            data: {
                password: response.data.newPassword
            },
            select: {
                id: true,
                username: true,
                password: true
            }
        });

        if (!updatePassword) {
            return apiError(c, 400, "Failed to update password");
        }

        return apiResponse(c, 200, updatePassword, "Password Updated");
    }
    catch (error: any) {
        console.log('UpdateUserProfile Controller', `ERROR:${error.message}`);
        return apiError(c, 500, "Internal Server Error", { code: "CE" });
    }
}