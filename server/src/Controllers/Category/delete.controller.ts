import { Context } from "hono";
import { Role as userRole } from "@prisma/client";
import z from 'zod';
import { apiError } from "../../utils/apiError";
import { dbConnect } from "../../Connection/db.connect";
import { createSlug } from "../../utils/createSlug";
import { apiResponse } from "../../utils/apiResponse";

const categoryDeleteSchema = z.object({
    name: z.string({
        required_error: "Category name is required",
        invalid_type_error: "Category name must be a string"
    })
        .min(4, { message: "Category name must be at least 4 characters long" })
        .max(30, { message: "Category name must be at most 30 characters long" }),
});

export async function deleteCategory(c: Context) {
    const user = c.get('user');

    if (user.role !== userRole.ADMIN) {
        return apiError(c, 403, "Unauthorized - Only admins can delete categories");
    }

    try {

        const requestBody = await c.req.json().catch(() => {
            return apiError(c, 400, "Invalid JSON input");
        });

        const validationResult = categoryDeleteSchema.safeParse(requestBody);

        if (!validationResult.success) {
            return apiError(c, 400, validationResult.error.errors[0].message);
        }

        const { name } = validationResult.data;
        const slug = createSlug(name, 25);

        const prisma: any = await dbConnect(c);

        const existingCategory = await prisma.category.findFirst({
            where: { slug }
        });

        if (!existingCategory) {
            return apiError(c, 404, `Category '${name}' not found`);
        }

        const deletedCategory = await prisma.category.delete({
            where: { id: existingCategory.id }
        });

        return apiResponse(c, 200, deletedCategory, "Category deleted successfully");
    } catch (error: any) {
        console.error("Category Delete Route: ", error.message);
        return apiError(c, 500, "Internal Server Error");
    }
}
