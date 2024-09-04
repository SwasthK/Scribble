import { Context, Next } from "hono";
import { apiError } from "../utils/apiError";
import { verifyTokens } from "../utils/jwt";
import { apiResponse } from "../utils/apiResponse";

export async function authMiddleware(c: Context, next: Next) {
    try {


        const accessToken = c.req.header('accessToken')?.split(' ')[1]

        if (!accessToken) return apiError(c, 401, "Failed to Authorize User");
        
        const decodeAccessToken = await verifyTokens(c, accessToken, c.env.ACCESS_TOKEN_SECRET);

        if (!decodeAccessToken) {
            return apiError(c, 401, "Failed to Authorize User")
        }

        console.log("Decode Access Token: ", decodeAccessToken);
        c.set('id', decodeAccessToken.id);

        await next();
    } catch (error) {
        return c.json({ message: "Something went wrong" }, 400)
    }
}