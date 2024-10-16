import { Context } from "hono";
import { Role as userRole } from "@prisma/client";
import z from 'zod';
import { apiError } from "../../utils/apiError";
import { dbConnect } from "../../Connection/db.connect";
import { createSlug } from "../../utils/createSlug";
import { apiResponse } from "../../utils/apiResponse";

const categoryUpdateSchema = z.object({
    name: z.string({
        required_error: "Category name is required",
        invalid_type_error: "Category name must be a string"
    })
    .min(4, { message: "Category name must be at least 4 characters long" })
    .max(30, { message: "Category name must be at most 30 characters long" }),
    update: z.string({
        required_error: "New category name is required",
        invalid_type_error: "New category name must be a string"
    })
    .min(4, { message: "New category name must be at least 4 characters long" })
    .max(30, { message: "New category name must be at most 30 characters long" }),
});

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

        const prisma: any = await dbConnect(c);

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
