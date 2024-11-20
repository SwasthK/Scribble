import { Context } from "hono";
import { apiError } from "utils/apiError";
import { apiResponse } from "utils/apiResponse";

import z from "zod";

const updateUserSocialsSchema = z.array(
    z.object({
        platform: z.enum(['github', 'x', 'instagram'],
            {
                required_error: "Platform is required",
                invalid_type_error: "Platform must be one of: github, x, instagram",
                message: "Invalid Platform"
            }),
        url: z.string({
            required_error: "URL is required",
            invalid_type_error: "Invalid URL",
        }).url().nullable()
    })
).min(1, "At least one social link must be provided")
    .refine(value => value.length <= 3, { message: "Maximum 3 social links allowed" })
    .refine(
        (socials) => socials.some((social) => social.url && social.url.trim() !== ""),
        {
            message: "At least one platform must have a valid URL",
        }
    )
    .refine(
        (socials) =>
            new Set(socials.map((social) => social.platform)).size === socials.length,
        {
            message: "Duplicate platforms are not allowed",
        }
    )
    .refine(
        (socials) => {
            const urls = socials.map((social) => social.url).filter(Boolean);
            return new Set(urls).size === urls.length;
        },
        {
            message: "Duplicate URLs are not allowed",
        }
    );


export const updateUserSocials = async (c: Context) => {
    try {
        const userId = c.get("user").id;
        const body = await c.req.json().catch((err) => { return null });
        if (!body) { return apiError(c, 400, "Bad Request") }

        const response = updateUserSocialsSchema.safeParse(body);
        if (!response.success) {
            return apiError(c, 400, response.error.errors[0].message);
        }

        const data = response.data.filter((social: any) => social.url !== null);

        const prisma: any = c.get("prisma");

        const updatedSocials = await prisma.$transaction(
            (data).map((social: any) =>
                prisma.social.upsert({
                    where: { platform_userId: { platform: social.platform, userId } },
                    update: { url: social.url },
                    create: { userId, platform: social.platform, url: social.url },
                    select: { platform: true, url: true }
                })
            )
        );

        if (!updatedSocials) {
            return apiError(c, 400, "Failed to update socials")
        }

        return apiResponse(c, 200, updatedSocials, "Socials Updated Successfully");
    } catch (error: any) {
        console.log("Error while Updating user socials : ", error);
        return apiError(c, 500, "Internal Server Error", { code: "CE" })
    }
}