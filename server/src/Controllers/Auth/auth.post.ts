import { Context } from "hono";
import { apiError } from "../../utils/apiError";
import { apiResponse } from "../../utils/apiResponse";
import { accessToken, generateAccessAndRefreshToken, verifyTokens } from "../../utils/jwt";
import { fileUploadMessage, ServerSignin } from "../../Zod/zod";

export async function signup(c: Context) {

    try {

        const message = c.get('fileUploadMessage');
        const fileHandle: Record<string, any> = {};

        switch (message) {
            case fileUploadMessage.TYPEERROR:
                return apiError(c, 400, "Invalid file type");

            case fileUploadMessage.NOFILE:
                fileHandle.noFile = true;
                break;

            case fileUploadMessage.SUCCESS:
                fileHandle.success = true;
                break;

            default:
                fileHandle.error = true;
                break;
        }

        const { username, email, password, role } = c.get('signupData')

        const prisma: any = await c.get('prisma');

        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [
                    { email },
                    { username }
                ]
            }
        })

        if (existingUser) {
            return apiError(c, 400, "Username or Email already exists")
        }

        const avatarUrl = fileHandle.success ?
            c.get('fileUploadResponse').secure_url || `https://ui-avatars.com/api/?name=${username}&background=random&bold=true`
            :
            `https://ui-avatars.com/api/?name=${username}&background=random&bold=true`;

        const avatarPublicId = fileHandle.success ? c.get('fileUploadResponse').public_id : null;

        const InsertData = await prisma.user.create({
            data: {
                username,
                email,
                password,
                avatarUrl,
                avatarPublicId,
                role: role ?? 'USER'
            }
        })

        if (!InsertData) {
            return apiError(c, 400, "Failed to create an account")
        }

        const Token = await generateAccessAndRefreshToken(c, prisma, InsertData.id);
        if (!Token.success) {
            return apiError(c, 400, "Failed to create an account")
        }
        return apiResponse(c, 200, {
            accessToken: Token.aToken, refreshToken: Token.rToken,
            user: {
                id: InsertData.id,
                username: InsertData.username,
                email: InsertData.email,
                avatarUrl: InsertData.avatarUrl,
                bio: InsertData.bio,
                createdAt: InsertData.createdAt,
                socials: InsertData.socials,
            }
        }, "Account Created Successully")

    } catch (error: any) {
        console.log('Signup Controller', `ERROR:${error.message}`)
        return apiError(c, 400, "Something went wrong")
    }
}

export async function signin(c: Context) {

    try {
        const response = ServerSignin.safeParse(await c.req.json());
        if (!response.success) {
            return apiError(c, 400, response.error.errors[0].message)
        }

        const { identifier, password } = response.data;

        const prisma: any = await c.get('prisma');

        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [
                    { email: identifier },
                    { username: identifier }
                ]
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
            return apiError(c, 400, "User not found")
        }

        const isPasswordMatched = existingUser.password === password;

        if (!isPasswordMatched) {
            return apiError(c, 401, "Invalid Password")
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
        console.log('Signin Controller', `ERROR:${error.message}`)
        return apiError(c, 500, "Internal Server Error")
    }
}

export async function logout(c: Context) {
    try {
        const user = c.get('user');

        const prisma: any = await c.get('prisma');

        const updateUser = await prisma.user.update({
            where: { id: user.id },
            data: {
                refreshToken: null
            },
        });

        if (!updateUser) {
            return apiError(c, 400, "Failed to logout")
        }

        return apiResponse(c, 200, {}, "Logout Successfull")

    } catch (error) {
        console.log("Error while logging out : ", error);
        return apiError(c, 500, "Internal Server Error")
    }
}

export async function refreshAccessToken(c: Context) {
    try {
        const recievedRefreshToken = c.req.header('refreshToken')?.split(' ')[1];

        if (!recievedRefreshToken) return apiError(c, 401, "Failed to Authorize User")

        const verifiedToken = await verifyTokens(c, recievedRefreshToken, c.env.REFRESH_TOKEN_SECRET)
        if (!verifiedToken) return apiError(c, 401, "Failed to Authorize User")

        const prisma = c.get('prisma')

        const dbUser = await prisma.user.findUnique({
            where: { id: verifiedToken.id },
            select: {
                id: true,
                username: true,
                email: true,
                avatarUrl: true,
                bio: true,
                createdAt: true,
                socials: {
                    select: {
                        platform: true,
                        url: true
                    }
                },
                refreshToken: true,
                followers: {
                    where: {
                        followerId: verifiedToken.id
                    },
                    select: {
                        followingId: true
                    }
                }
            },
        });

        if (!dbUser) return apiError(c, 401, "Failed to Authorize User")

        if (dbUser.refreshToken !== recievedRefreshToken) return apiError(c, 401, "Failed to Authorize User")

        const newAccessToken = await accessToken(c, dbUser.id)
        if (!newAccessToken) return apiError(c, 401, "Failed to Authorize User")

        return apiResponse(c, 200, {
            accessToken: newAccessToken,
            user: {
                id: dbUser.id,
                username: dbUser.username,
                email: dbUser.email,
                avatarUrl: dbUser.avatarUrl,
                bio: dbUser.bio,
                createdAt: dbUser.createdAt,
                socials: dbUser.socials,
            },
            following: dbUser.followers.map((follower: { followingId: string }) => follower.followingId),
        }, "Access Token Refreshed")
    } catch (error: any) {
        console.log("Error while refreshing token : ", error);
        return apiError(c, 500, "Internal Server Error")
    }
}