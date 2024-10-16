import { Context } from "hono";
import { Role as userRole } from "@prisma/client";
import z from 'zod';
import { apiError } from "../../utils/apiError";
import { dbConnect } from "../../Connection/db.connect";
import { createSlug } from "../../utils/createSlug";
import { apiResponse } from "../../utils/apiResponse";

const tagDeleteSchema = z.object({
    name: z.string({
        required_error: "tag name is required",
        invalid_type_error: "tag name must be a string"
    })
        .min(2, { message: "tag name must be at least 4 characters long" })
        .max(20, { message: "tag name must be at most 30 characters long" }),
});

export async function deleteTag(c: Context) {
    const user = c.get('user');

    if (user.role !== userRole.ADMIN) {
        return apiError(c, 403, "Unauthorized - Only admins can delete tags");
    }

    try {

        const requestBody = await c.req.json().catch(() => {
            return apiError(c, 400, "Invalid JSON input");
        });

        const validationResult = tagDeleteSchema.safeParse(requestBody);

        if (!validationResult.success) {
            return apiError(c, 400, validationResult.error.errors[0].message);
        }

        const { name } = validationResult.data;
        const slug = createSlug(name, 25);

        const prisma: any = await dbConnect(c);

        const existingTag = await prisma.tag.findFirst({
            where: { slug }
        });

        if (!existingTag) {
            return apiError(c, 404, `Tag '${name}' not found`);
        }

        const deletedTag = await prisma.tag.delete({
            where: { id: existingTag.id }
        });

        return apiResponse(c, 200, deletedTag, "Tag deleted successfully");
    } catch (error: any) {
        console.error("Tag Delete Route: ", error.message);
        return apiError(c, 500, "Internal Server Error");
    }
}
