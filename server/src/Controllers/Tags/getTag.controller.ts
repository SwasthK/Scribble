import { Context } from "hono";
import { apiError } from "../../utils/apiError";
import { dbConnect } from "../../Connection/db.connect";
import { apiResponse } from "../../utils/apiResponse";

import z from 'zod';
import { createSlug } from "../../utils/createSlug";

const getTagSchema = z.object({
    name: z.string({
        required_error: "Tag name is required",
        invalid_type_error: "Tag name must be a string"
    })
        .min(4, { message: "Tag name must be at least 4 characters long" })
        .max(30, { message: "Tag name must be at most 30 characters long" }),
});

export async function getTag(c: Context) {
    try {

        const requestBody = await c.req.json()
            .catch(() => {
                return apiError(c, 400, "Invalid input");
            });

        const validationResult = getTagSchema.safeParse(requestBody);

        if (!validationResult.success) {
            return apiError(c, 400, validationResult.error.errors[0].message);
        }

        const { name } = validationResult.data

        const slug = createSlug(name, 25);

        const prisma: any = await dbConnect(c);

        const tag = await prisma.tag.findFirst({
            where: { slug }
        });

        if (!tag) {
            return apiError(c, 404, `Tag '${name}' not found`);
        }

        return apiResponse(c, 200, tag, "Tag retrieved successfully");
    } catch (error: any) {
        console.error("Get Tag Route: ", error.message);
        return apiError(c, 500, "Internal Server Error");
    }
}

export async function getAllTag(c: Context) {

    try {
        const prisma: any = await dbConnect(c);

        const tag = await prisma.tag.findMany({})

        if (!tag) {
            return apiError(c, 400, "Could'nt fetch tags")
        }

        return apiResponse(c, 200, tag, "tags fetched successfully")

    } catch (error: any) {
        console.log("Get all Tag Route :", error.message);
        return apiError(c, 400, "Internal Server Error")
    }

}