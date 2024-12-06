import { Context } from "hono";
import { apiError } from "utils/apiError";
import { apiResponse } from "utils/apiResponse";
import { updateUserSocialsSchema } from "Zod/zod";

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