import { Context } from "hono";
import { dbConnect } from "../../Connection/db.connect";
import { apiError } from "../../utils/apiError";
import { apiResponse } from "../../utils/apiResponse";

export const deleteUserProfile = async (c: Context) => {
    try {
        const user = c.get('user');
        await deleteUser(c, user.id);
        return apiResponse(c, 200, {}, "User deleted successfully");
    } catch (error) {
        console.log("Error while deleting user profile : ", error);
        return apiError(c, 500, "Internal Server Error", { code: "CE" });
    }
};

const deleteUser = async (c: Context, userId: string | number) => {
    const prisma: any = await dbConnect(c);
    await prisma.$transaction(async (prisma: any) => {
        await prisma.user.delete({ where: { id: userId } });
    });
};

