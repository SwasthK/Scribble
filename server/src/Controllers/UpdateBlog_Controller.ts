import { Context } from "hono";

export async function updateBlog(c: Context) {
    const res = await c.req.json();

    return c.text("From Update Blog Controller: " + res);
}