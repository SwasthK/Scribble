import { Context } from "hono";
import { apiError } from "utils/apiError";
import { apiResponse } from "utils/apiResponse";

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