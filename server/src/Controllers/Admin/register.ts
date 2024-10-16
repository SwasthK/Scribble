import { Context } from "hono";
import { apiResponse } from "../../utils/apiResponse";
import { Role as UserRole } from "@prisma/client";

import z from 'zod'
import { apiError } from "../../utils/apiError";
import { dbConnect } from "../../Connection/db.connect";

const registerAdminSchema = z.object({
    id: z.string({
        required_error: "User ID is required",
        invalid_type_error: "Invalid User ID",
        message: "Invalid User ID"
    }).uuid({ message: "Invalid User ID" }),
    Role: z.string({
        required_error: "Invalid Request",
        invalid_type_error: "Invalid Request",
        message: "Invalid Request"
    }).includes('ADMIN', { message: "Invalid Request" }),
    PASSKEY: z.string({
        required_error: "Invalid Request",
        invalid_type_error: "Invalid Request",
        message: "Invalid Request"
    })
})

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

        const prisma: any = await dbConnect(c);

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