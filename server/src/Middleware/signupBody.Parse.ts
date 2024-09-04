import { Context, Next } from "hono";
import { ServerSignup } from "../Zod/zod";
import { apiError } from "../utils/apiError";

export async function signupBodyParse(c: Context, next: Next) {
    try {
        const formData = await c.req.formData();

        const rawUsername = formData.get('username') as string;
        const rawEmail = formData.get('email') as string;
        const rawPassword = formData.get('password') as string;
        const role = formData.get('role') as string | undefined;

        const response = ServerSignup.safeParse({ username: rawUsername, email: rawEmail, password: rawPassword });

        if (!response.success) {
            return apiError(c, 400, response.error.errors[0].message)
        }
        c.set('signupData', { ...response.data, role });
        return await next();
    } catch (error) {
        console.error('Signup Body Parse Middleware Error: ', error);
        return apiError(c, 500, "Internal Server Error", { code: "CE" });
    }
}