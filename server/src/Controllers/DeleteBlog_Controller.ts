import { Context } from "hono";

export function deleteBlog(c: Context) {
    const { id } = c.req.param();
    return c.text(`Delete blog with id: ${id}`);
}