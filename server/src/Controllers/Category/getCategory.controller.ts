import { Context } from "hono";
import { apiError } from "../../utils/apiError";
import { apiResponse } from "../../utils/apiResponse";
import { createSlug } from "../../utils/createSlug";
import { getCategorySchema } from "Zod/zod";

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

        const prisma: any = await c.get("prisma");

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
        const prisma: any = await c.get("prisma");

        const category = await prisma.category.findMany({
            select: { id: true, head: true, name: true,slug:true }
        })

        if (!category) { return apiError(c, 400, "Could'nt fetch categories") }

        return apiResponse(c, 200, category, "Catgeories fetched successfully")

    } catch (error: any) {
        console.log("Get all Category Route :", error.message);
        return apiError(c, 400, "Internal Server Error")
    }

}