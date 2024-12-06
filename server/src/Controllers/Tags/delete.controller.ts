import { Context } from "hono";
import { Role as userRole } from "@prisma/client";
import { apiError } from "../../utils/apiError";
import { createSlug } from "../../utils/createSlug";
import { apiResponse } from "../../utils/apiResponse";
import { tagDeleteSchema } from "Zod/zod";

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

        const prisma: any = await c.get('prisma');

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
