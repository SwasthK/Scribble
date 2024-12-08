import { Context } from "hono";
import { createSlug } from "../../utils/createSlug";
import { apiResponse } from "../../utils/apiResponse";
import { apiError } from "../../utils/apiError";
import { Role as userRole } from "@prisma/client";
import { categoryNamesSchema, categoryUpdateSchema } from "Zod/zod";
import { categoryDeleteSchema } from "Zod/zod";
import { getCategorySchema } from "Zod/zod";

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

        const prisma: any = await c.get("prisma");

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

export async function deleteAllCategory(c: Context) {

    try {
        const user = c.get('user');
        console.log(user);

        if (user.role !== userRole.ADMIN) {
            return apiError(c, 403, "Unauthorized - Only admins can delete categories");
        }

        const prisma: any = await c.get("prisma");
        const deletedCategory = await prisma.category.deleteMany({

        });

        return apiResponse(c, 200, deletedCategory, "Category deleted successfully");
    } catch (error: any) {
        console.error("Category Delete Route: ", error.message);
        return apiError(c, 500, "Internal Server Error");
    }
}

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

