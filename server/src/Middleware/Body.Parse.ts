import { Context, Next } from "hono";
import { ServerSignup } from "../Zod/zod";
import { apiError } from "../utils/apiError";
import { publishPostSchema } from "Controllers/Posts/publish.Post";
import { apiResponse } from "utils/apiResponse";

export async function signupBodyParse(c: Context, next: Next) {
    try {

        let formData;
        try {
            formData = await c.req.formData();
        } catch (error) {
            return apiError(c, 400, "Data is Invalid");
        }

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

export async function createNewPublishPostParse(c: Context, next: Next) {

    try {

        let formData;
        try {
            formData = await c.req.formData();
        } catch (error) {
            return apiError(c, 400, "Data is Invalid");
        }

        const title = formData.get('title') as string;
        const shortCaption = formData.get('shortCaption') as string;
        const body = formData.get('body') as string;
        const allowComments = formData.get('allowComments') === 'true';;
        const summary = formData.get('summary') as string;

        const response = publishPostSchema.safeParse({ title, shortCaption, body, allowComments, summary });

        if (!response.success) {
            return apiError(c, 400, response.error.errors[0].message)
        }
        c.set('publishData', { ...response.data });

        return await next();
    } catch (error) {
        console.error('createNewPublishPostParse Body Parse Middleware Error: ', error);
        return apiError(c, 500, "Internal Server Error", { code: "CE" });
    }
}