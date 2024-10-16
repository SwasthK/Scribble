import { Context } from "hono";
import { apiError } from "../../utils/apiError";
import { dbConnect } from "../../Connection/db.connect";
import { apiResponse } from "../../utils/apiResponse";

import z from 'zod';
import { createSlug } from "../../utils/createSlug";

const getCategorySchema = z.object({
    name: z.string({
        required_error: "Category name is required",
        invalid_type_error: "Category name must be a string"
    })
        .min(4, { message: "Category name must be at least 4 characters long" })
        .max(30, { message: "Category name must be at most 30 characters long" }),
});

export async function getCategory(c: Context) {
    try {

        const requestBody = await c.req.json()
            .catch(() => {
                return apiError(c, 400, "Invalid input");
            });

        const validationResult = getCategorySchema.safeParse(requestBody);

        if (!validationResult.success) {
            return apiError(c, 400, validationResult.error.errors[0].message);
        }

        const { name } = validationResult.data

        const slug = createSlug(name, 25);

        const prisma: any = await dbConnect(c);

        const category = await prisma.category.findFirst({
            where: { slug }
        });

        if (!category) {
            return apiError(c, 404, `Category '${name}' not found`);
        }

        return apiResponse(c, 200, category, "Category retrieved successfully");
    } catch (error: any) {
        console.error("Get Category Route: ", error.message);
        return apiError(c, 500, "Internal Server Error");
    }
}

export async function getAllCategory(c: Context) {

    try {
        const prisma: any = await dbConnect(c);

        const category = await prisma.category.findMany({})

        if (!category) {
            return apiError(c, 400, "Could'nt fetch categories")
        }

        return apiResponse(c, 200, category, "Catgeories fetched successfully")

    } catch (error: any) {
        console.log("Get all Category Route :", error.message);
        return apiError(c, 400, "Internal Server Error")
    }

}