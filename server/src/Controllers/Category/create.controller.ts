import { Context } from "hono";
import { createSlug } from "../../utils/createSlug";
import { apiResponse } from "../../utils/apiResponse";
import { apiError } from "../../utils/apiError";
import { Role as userRole } from "@prisma/client";

import z from "zod";

export const categoryNamesSchema = z.object({
    head: z.enum([
        "technology",
        "lifestyle",
        "business",
        "health & wellness",
        "food & recipes",
        "travel",
        "education",
        "personal development",
        "finance",
        "entertainment"
    ], {
        required_error: "Category head is required", invalid_type_error: "Category head must be a string",
        message: "Category head is Required"
    }),
    categories: z.array(
        z.string({
            required_error: "Category name is required",
            invalid_type_error: "Category name must be a string"
        })
            .min(4, { message: "Category name must be at least 4 characters long" })
            .max(30, { message: "Category name must be at most 30 characters long" }),
        { message: "Category is Required" }
    ).nonempty({ message: "At least one category name is required" })
})

export async function createCategory(c: Context) {

    const user = c.get('user')

    if (user.role !== userRole.ADMIN) {
        return apiError(c, 400, "You have no access to add category")
    }

    try {

        const response = categoryNamesSchema.safeParse(await c.req.json());

        if (!response.success) { return apiError(c, 400, response.error.errors[0].message); }

        const results = [];

        const prisma: any = await c.get('prisma');

        for (const name of response.data.categories) {
            const slug = createSlug(name, 25);

            const category = await prisma.category.upsert({
                where: { slug },
                update: { head: response.data.head, name, slug },
                create: { head: response.data.head, name, slug }
            })

            results.push({ head: category.head, id: category.id, name: category.name, slug: category.slug })

        }

        return apiResponse(c, 200, results, "Categories created successfully");

    } catch (error: any) {
        console.log("Create Catgeory Route : ", error.message);
        return apiError(c, 500, "Internal Server Error")
    }
}