import { Context } from "hono";
import { Role as userRole } from "@prisma/client";
import z from 'zod';
import { apiError } from "../../utils/apiError";
import { dbConnect } from "../../Connection/db.connect";
import { createSlug } from "../../utils/createSlug";
import { apiResponse } from "../../utils/apiResponse";

const tagUpdateSchema = z.object({
    name:   z.string({
        required_error: "Tag name is required",
        invalid_type_error: "Tag name must be a string"
    })
        .min(2, { message: "Tag name must be at least 2 characters long" })
        .max(20, { message: "Tag name must be at most 20 characters long" })
        .regex(/^[a-zA-Z0-9]+$/, { message: "Tag name can only contain letters and numbers" }),
    update: z.string({
        required_error: "New tag name is required",
        invalid_type_error: "New tag name must be a string"
    })
    .min(2, { message: "New tag name must be at least 2 characters long" })
    .max(20, { message: "New tag name must be at most 20 characters long" })
    .regex(/^[a-zA-Z0-9]+$/, { message: "Tag name can only contain letters and numbers" }),
});

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

        const prisma: any = await dbConnect(c);

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
