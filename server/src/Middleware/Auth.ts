import { Context, Next } from "hono";
import { apiError } from "../utils/apiError";
import { verifyTokens } from "../utils/jwt";

export async function authMiddleware(c: Context, next: Next) {
    try {
        console.log("authMiddleware");
        const accessToken = c.req.header('accessToken')?.split(' ')[1]

        if (!accessToken) return apiError(c, 401, "Failed to Authorize User");

        const decodeAccessToken = await verifyTokens(c, accessToken, c.env.ACCESS_TOKEN_SECRET);

        if (!decodeAccessToken) {
            return apiError(c, 401, "Failed to Authorize User")
        }

        c.set('id', decodeAccessToken.id);

        await next();

    } catch (error: any) {
        console.log(error.message);
        return c.json({ message: "Something went wrong" }, 400)
    }
}