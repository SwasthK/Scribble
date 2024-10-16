import { Context } from "hono";
import { apiResponse } from "../../utils/apiResponse";
import { updateUserProfileSchema } from "../../Zod/zod";
import { dbConnect } from "../../Connection/db.connect";
import { apiError } from "../../utils/apiError";
import { fileUploadMessage } from "../../Middleware/cloudinary";

export async function updateUserProfile(c: Context) {
    try {
        const user = c.get('user');

        const response = updateUserProfileSchema.safeParse(await c.req.json());
        if (!response.success) {
            return apiError(c, 400, response.error.errors[0].message);
        }

        const updateData = {
            ...(response.data.username && { username: response.data.username }),
            ...(response.data.email && { email: response.data.email }),
            ...(response.data.bio && { bio: response.data.bio }),
        };

        const prisma: any = await dbConnect(c);

        const existingUser = await prisma.user.findFirst({
            where: {
                id: user.id
            }
        })

        if (!existingUser) {
            return apiError(c, 400, "User not found")
        }

        const updateUser = await prisma.user.update({
            where: { id: user.id },
            data: updateData,
            select: {
                id: true,
                username: true,
                email: true,
                bio: true
            }
        });

        if (!updateUser) {
            return apiError(c, 400, "Failed to update user profile");
        }

        return apiResponse(c, 200, updateUser, "User Profile Updated");
    } catch (error: any) {
        console.log('UpdateUserProfile Controller', `ERROR:${error.message}`);
        return apiError(c, 500, "Internal Server Error", { code: "CE" });
    }
}

export async function updateUserAvatar(c: Context) {
    try {
        const userId = c.get('user').id
        const message = c.get('fileUploadMessage');

        const fileHandle: Record<string, any> = {};

        switch (message) {
            case fileUploadMessage.TYPEERROR:
                return apiError(c, 400, "Invalid file type");

            case fileUploadMessage.NOFILE:
                fileHandle.noFile = true;
                break;

            case fileUploadMessage.SUCCESS:
                fileHandle.success = true;
                break;

            default:
                fileHandle.error = true;
                break;
        }

        if (fileHandle.noFile) {
            return apiError(c, 400, "No file uploaded");
        }

        if (fileHandle.error) {
            return apiError(c, 400, "Failed to upload file");
        }

        const fileUploadResponse = c.get('fileUploadResponse')

        const prisma: any = await dbConnect(c);

        const updateUser = await prisma.user.update({
            where: { id: userId },
            data: {
                avatarPublicId: fileUploadResponse.public_id,
                avatarUrl: fileUploadResponse.secure_url
            },
            select: {
                id: true,
                username: true,
                avatarPublicId: true,
                avatarUrl: true
            }
        });

        if (!updateUser) {
            return apiError(c, 400, "Failed to update avatar");
        }

        return apiResponse(c, 200, updateUser, "Avatar Updated");
    } catch (error: any) {
        console.log("Update User Avatar Controller", `ERROR:${error.message}`);
        return apiError(c, 500, "Internal Server Error", { code: "CE" });
    }
}