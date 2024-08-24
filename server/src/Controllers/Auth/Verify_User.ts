import { Context } from "hono";

export async function verifyUser(c: Context) {
    try {
        const user = c.get('user');
        return c.json({ message: "User Verified", data: user }, 200)
    } catch (error) {
        return c.json({ error: "Something went wrong" }, 400)
    }
}