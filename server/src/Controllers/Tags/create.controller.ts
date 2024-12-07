import { Context } from "hono";
import { createSlug } from "../../utils/createSlug";
import { apiResponse } from "../../utils/apiResponse";
import { apiError } from "../../utils/apiError";
import { tagNamesSchema } from "Zod/zod";

export async function createTag(c: Context) {

    const user = c.get('user')

    try {
        const { tags } = await c.req.json().catch(() => {
            return apiError(c, 400, "Invalid JSON input");
        });

        if (!tags) {
            return apiError(c, 400, "tags are required")
        }

        const response = tagNamesSchema.safeParse(tags);

        if (!response.success) {
            return apiError(c, 400, response.error.errors[0].message);
        }

        const prisma: any = await c.get('prisma');

        const results = await prisma.$transaction(async (tx: any) => {
            const createdTags = [];

            for (const name of tags) {
                const slug = createSlug(name, 25);

                const existingTag = await tx.tag.findUnique({
                    where: { slug },
                });

                if (existingTag) {
                    throw new Error(`Tag "${name}" already exists`);
                }

                const newTag = await tx.tag.create({
                    data: {
                        name,
                        slug,
                    },
                });

                createdTags.push({ id: newTag.id, name: newTag.name, slug: newTag.slug });
            }

            return createdTags;
        });

        return apiResponse(c, 201, results, "Tags created successfully");

    } catch (error: any) {
        console.error("Create Tags Error: ", error.message);
        if (error.message.includes("already exists")) {
            return apiError(c, 400, error.message);
        }
        return apiError(c, 500, "Internal Server Error");
    }
}