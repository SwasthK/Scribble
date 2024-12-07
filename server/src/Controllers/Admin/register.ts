import { Context } from "hono";
import { apiResponse } from "../../utils/apiResponse";
import { Role as UserRole } from "@prisma/client";
import { apiError } from "../../utils/apiError";
import { registerAdminSchema } from "Zod/zod";

export async function registerAdmin(c: Context) {
    try {
        const requestId = c.req.param('id')
        const { Role, PASSKEY } = await c.req.json()
        const userId = c.get('user').id

        if (userId !== requestId) {
            return apiError(c, 400, 'Unothorized!')
        }

        const resposne = registerAdminSchema.safeParse({ id: requestId, Role, PASSKEY })

        if (!resposne.success) {
            return apiError(c, 400, resposne.error.errors[0].message)
        }

        if (c.env.ADMIN_PASSKEY !== PASSKEY) {
            return apiError(c, 400, 'Unothorized')
        }

        const prisma: any = await c.get('prisma');

        const admin = await prisma.user.update({
            where: { id: userId },
            data: {
                role: UserRole.ADMIN
            }
        })

        if (!admin) {
            return apiError(c, 400, "Couldn't Register")
        }

        return apiResponse(c, 200, admin)
    } catch (error: any) {
        console.log("Admin Register Route :", error);
        return apiError(c, 400, "Internal Server Error")
    }

}