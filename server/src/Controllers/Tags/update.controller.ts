import { Context } from "hono";
import { Role as userRole } from "@prisma/client";
import { apiError } from "../../utils/apiError";
import { createSlug } from "../../utils/createSlug";
import { apiResponse } from "../../utils/apiResponse";
import { tagUpdateSchema } from "Zod/zod";

export async function updateTag(c: Context) {
    const user = c.get('user');

    if (user.role !== userRole.ADMIN) {
        return apiError(c, 403, "Unauthorized - Only admins can update categories");
    }

    try {

        const requestBody = await c.req.json()
        .catch(() => {
            return apiError(c, 400, "Invalid input");
        });
        console.log(requestBody);

        const validationResult = tagUpdateSchema.safeParse(requestBody);

        if (!validationResult.success) {
            return apiError(c, 400, validationResult.error.errors[0].message);
        }

        const { name, update } = validationResult.data;
        const slug = createSlug(name, 25);

        const prisma: any = await c.get('prisma');

        const existingTag = await prisma.tag.findFirst({
            where: { slug }
        });

        if (!existingTag) {
            return apiError(c, 404, `Tag '${name}' not found`);
        }

        const newSlug = createSlug(update, 25);

        const updatedTag = await prisma.tag.update({
            where: { id: existingTag.id },
            data: {
                name: update,
                slug: newSlug
            }
        });

        return apiResponse(c, 200, { id: updatedTag.id, name: updatedTag.name, slug: updatedTag.slug }, "Tag updated successfully");
    } catch (error: any) {
        console.error("Tag Update Route: ", error.message);
        return apiError(c, 500, "Internal Server Error");
    }
}
