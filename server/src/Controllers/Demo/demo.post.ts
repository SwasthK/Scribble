import { apiError } from "utils/apiError";
import { generateAccessAndRefreshToken } from "../../utils/jwt";
import { apiResponse } from "utils/apiResponse";
import { Context } from "hono";
import { registerDemoUserSchema } from "Zod/zod";
import { Role as UserRole } from "@prisma/client";

export async function registerDemoUser(c: Context) {
    //Expected Body: { Role: "EDITOR" , PASSKEY: "YOUR_PASSKEY" } & Request Param: { id: "USER_ID" }

    try {
        const requestId = c.req.param('id')
        const { Role, PASSKEY } = await c.req.json()
        const userId = c.get('user').id

        if (userId !== requestId) {
            return apiError(c, 400, 'Unothorized!')
        }

        const resposne = registerDemoUserSchema.safeParse({ id: requestId, Role, PASSKEY })

        if (!resposne.success) {
            return apiError(c, 400, resposne.error.errors[0].message)
        }

        if (c.env.ADMIN_PASSKEY !== PASSKEY) {
            return apiError(c, 400, 'Unothorized')
        }

        const prisma: any = await c.get('prisma');

        const demo = await prisma.user.update({
            where: { id: userId },
            data: {
                role: UserRole.EDITOR
            },
        })

        if (!demo) {
            return apiError(c, 400, "Couldn't Register as Demo User")
        }

        return apiResponse(c, 200, demo)
    } catch (error: any) {
        console.log("Demo User Register Route :", error);
        return apiError(c, 400, "Internal Server Error")
    }
}

export async function signinDemoUser(c: Context) {

    try {

        const prisma: any = await c.get('prisma');

        const existingUser = await prisma.user.findFirst({
            where: {
                role: UserRole.EDITOR
            },
            select: {
                id: true,
                username: true,
                email: true,
                password: true,
                avatarUrl: true,
                bio: true,
                createdAt: true,
                socials: {
                    select: {
                        platform: true,
                        url: true
                    }
                },
            },
        })

        if (!existingUser) {
            return apiError(c, 400, "DEMO USER NOT FOUND")
        }

        const Token = await generateAccessAndRefreshToken(c, prisma, existingUser.id);
        if (!Token.success) {
            return apiError(c, 400, "Failed to login")
        }

        return apiResponse(c, 200, {
            accessToken: Token.aToken, refreshToken: Token.rToken,
            user: {
                id: existingUser.id,
                username: existingUser.username,
                email: existingUser.email,
                avatarUrl: existingUser.avatarUrl,
                bio: existingUser.bio,
                createdAt: existingUser.createdAt,
                socials: existingUser.socials,
            }
        }, "Login Successfull",)

    } catch (error: any) {
        console.log('Demo User Signin Controller', `ERROR:${error.message}`)
        return apiError(c, 500, "Internal Server Error")
    }
}