import { Context } from "hono"
import { sign } from "hono/jwt";
import { verify } from "hono/jwt";
import { generateAccessAndRefreshTokenData } from "./responseData";

export const generateAccessAndRefreshToken = async (c: Context, prisma: any, userId: number | string) => {
    try {

        const aToken = await accessToken(c, userId)
        const rToken = await refreshToken(c, userId)

        const updatedData = await prisma.user.update({
            where: { id: userId },
            data: {
                refreshToken: rToken
            },
            select: generateAccessAndRefreshTokenData
        })

        return {
            success: true,
            aToken,
            rToken,
            data: updatedData
        }

    } catch (error: any) {
        console.log('Error while generating tokens', error);
        return {
            success: false,
        };
    }
}

export async function accessToken(c: Context, id: number | string) {
    try {
        const payload = {
            id: id,
            exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 // 1 Day
            // exp: Math.floor(Date.now() / 1000) + 60 * 5  // 5 Minutes
        }
        const secret = c.env.ACCESS_TOKEN_SECRET;
        const token = await sign(payload, secret)
        return token;
    } catch (error: any) {
        return false;
    }
}

export async function refreshToken(c: Context, id: number | string) {
    try {
        const payload = {
            id: id,
            exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 // 1 Day
        }
        const secret = c.env.REFRESH_TOKEN_SECRET;
        const token = await sign(payload, secret)
        return token;
    } catch (error: any) {
        return false;
    }
}

export async function verifyTokens(c: Context, token: string, secret: string) {
    try {
        const decoded = await verify(token, secret);
        return decoded;
    } catch (error: any) {
        if (error.name === "JwtTokenExpired") {
            console.error('JWT Token Expire :', error);
            return null;
        }
        else {
            console.error('JWT verification error:', error);
        }
        return null;
    }
}