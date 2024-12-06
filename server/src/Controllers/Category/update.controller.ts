import { Context } from "hono";
import { Role as userRole } from "@prisma/client";
import { apiError } from "../../utils/apiError";
import { createSlug } from "../../utils/createSlug";
import { apiResponse } from "../../utils/apiResponse";
import { categoryUpdateSchema } from "Zod/zod";

export async function updateCategory(c: Context) {
    const user = c.get('user');

    if (user.role !== userRole.ADMIN) {
        return apiError(c, 403, "Unauthorized - Only admins can update categories");
    }

    try {

        const requestBody = await c.req.json()
        .catch(() => {
            return apiError(c, 400, "Invalid input");
        });

        const validationResult = categoryUpdateSchema.safeParse(requestBody);

        if (!validationResult.success) {
            return apiError(c, 400, validationResult.error.errors[0].message);
        }

        const { name, update } = validationResult.data;
        const slug = createSlug(name, 25);

        const prisma: any = await c.get("prisma");

        const existingCategory = await prisma.category.findFirst({
            where: { slug }
        });

        if (!existingCategory) {
            return apiError(c, 404, `Category '${name}' not found`);
        }

        const newSlug = createSlug(update, 25);

        const updatedCategory = await prisma.category.update({
            where: { id: existingCategory.id },
            data: {
                name: update,
                slug: newSlug
            }
        });

        return apiResponse(c, 200, { id: updatedCategory.id, name: updatedCategory.name, slug: updatedCategory.slug }, "Category updated successfully");
    } catch (error: any) {
        console.error("Category Update Route: ", error.message);
        return apiError(c, 500, "Internal Server Error");
    }
}
