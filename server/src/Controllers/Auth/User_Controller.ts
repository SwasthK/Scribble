import { Context } from "hono";
import { Log } from "../../utils/log";
import { dbConnect } from "../../Connection/db.connect";
import { ServerSignupSchema } from "@swasthik/medium-common-types";
import { apiError } from "../../utils/apiError";
import { apiResponse } from "../../utils/apiResponse";
import { accessToken, verifyTokens, generateAccessAndRefreshToken } from "../../utils/jwt";
import { ServerSignin } from "../../Zod/zod";

export async function signup(c: Context) {

    const body = await c.req.json();
    try {
        const response = ServerSignupSchema.safeParse(body)

        if (!response.success) {
            return apiError(c, 400, response.error.errors[0].message)
        }

        const { username, email, password } = response.data;

        const prisma: any = await dbConnect(c);

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

        // // const hashedPassword = await bcrypt.hash(password, 10);

        const InsertData = await prisma.user.create({
            data: {
                username,
                email,
                password,
                avatarUrl: `https://ui-avatars.com/api/?name=${username}&background=random&bold=true` || 'N/A',
                role: body.role || 'USER'
            }
        })

        if (!InsertData) {
            return apiError(c, 400, "Failed to create an account")
        }

        const Token = await generateAccessAndRefreshToken(c, prisma, InsertData.id);
        if (!Token.success) {
            return apiError(c, 400, "Failed to create an account")
        }

        return apiResponse(c, 200, Token.data, "Account Created Successully", { accessToken: Token.aToken, refreshToken: Token.rToken },)

    } catch (error: any) {
        Log('Signup Controller', `ERROR:${error.message}`)
        return apiError(c, 400, "Something went wrong", { code: 'CE' })
    }
}

export async function signin(c: Context) {

    try {
        const response = ServerSignin.safeParse(await c.req.json());
        if (!response.success) {
            return apiError(c, 400, response.error.errors[0].message)
        }

        const { identifier, password } = response.data;

        const prisma: any = await dbConnect(c);

        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [
                    { email: identifier },
                    { username: identifier }
                ]
            }
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

        return apiResponse(c, 200, Token.data, "Login Successfull", { accessToken: Token.aToken, refreshToken: Token.rToken },)

    } catch (error: any) {
        Log('Signin Controller', `ERROR:${error.message}`)
        return apiError(c, 500, "Internal Server Error", { code: "CE" })
    }
}

export async function logout(c: Context) {
    try {
        const user = c.get('user');

        const prisma: any = await dbConnect(c);

        const updateUser = await prisma.user.update({
            where: { id: user.id },
            data: {
                refreshToken: null
            },
        });

        if (!updateUser) {
            return apiError(c, 400, "Failed to logout")
        }

        return apiResponse(c, 200, updateUser, "Logout Successfull")

    } catch (error) {
        console.log("Error while logging out : ", error);
        return apiError(c, 500, "Internal Server Error", { code: "CE" })
    }
}

export async function refreshAccessToken(c: Context) {
    try {
        const recievedRefreshToken = c.req.header('refreshToken')?.split(' ')[1];
        if (!recievedRefreshToken) return apiError(c, 401, "Failed to Authorize User")

        const verifiedToken = await verifyTokens(c, recievedRefreshToken, c.env.REFRESH_TOKEN_SECRET)
        if (!verifiedToken) return apiError(c, 401, "Failed to Authorize User")

        const prisma: any = await dbConnect(c);

        const dbUser = await prisma.user.findUnique({ where: { id: verifiedToken.id } })
        if (!dbUser) return apiError(c, 401, "Failed to Authorize User")

        if (dbUser.refreshToken !== recievedRefreshToken) return apiError(c, 401, "Failed to Authorize User")

        const newAccessToken = await accessToken(c, dbUser.id)
        if (!newAccessToken) return apiError(c, 401, "Failed to Authorize User")

        return apiResponse(c, 200, { accessToken: newAccessToken }, "Access Token Refreshed")
    } catch (error: any) {
        console.log("Error while refreshing token : ", error);
        return apiError(c, 500, "Internal Server Error", { code: "CE" })
    }
}