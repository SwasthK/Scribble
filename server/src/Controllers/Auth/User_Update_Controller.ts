import { Context } from "hono";
import { apiResponse } from "../../utils/apiResponse";
import { updateUserProfileSchema } from "../../Zod/zod";
import { dbConnect } from "../../Connection/db.connect";
import { apiError } from "../../utils/apiError";
import { cloudinaryUploader, fileUploadMessage, generateSignature, generateSignatureForReplace, generateUniqueFilename, getCloudinaryHelpers } from "../../Middleware/cloudinary";

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
        const image = c.get('avatarUpdateImage')
        const userId = c.get('user').id
        const prisma: any = c.get('prisma');

        const user = await prisma.user.findUnique({ where: { id: userId } })
        if (!user) { return apiError(c, 404, "User not found!") }

        let cloudinaryHelpers = getCloudinaryHelpers(c);
        const timestamp = Math.round((new Date).getTime() / 1000);
        const uniqueFilename = generateUniqueFilename(image.name);
        const cloudinaryFormData = new FormData();
        cloudinaryFormData.append('file', image);
        cloudinaryFormData.append('timestamp', timestamp.toString());
        cloudinaryFormData.append('api_key', cloudinaryHelpers.CLOUDINARY_API_KEY);

        if (user.avatarPublicId && user.avatarUrl) {
            const signature = await generateSignatureForReplace(
                timestamp,
                user.avatarPublicId,
                cloudinaryHelpers.CLOUDINARY_API_SECRET,
                true,
                true
            );
            cloudinaryFormData.append('public_id', user.avatarPublicId);
            cloudinaryFormData.append('overwrite', 'true');
            cloudinaryFormData.append('invalidate', 'true');
            cloudinaryFormData.append('signature', signature);
        } else {
            const signature = await generateSignature(timestamp, uniqueFilename, cloudinaryHelpers.CLOUDINARY_API_SECRET);
            cloudinaryFormData.append('public_id', uniqueFilename);
            cloudinaryFormData.append('signature', signature);
        }

        const uploadResponse = await cloudinaryUploader(cloudinaryFormData, cloudinaryHelpers);

        if (!uploadResponse.ok) {
            console.log('Upload File Middleware Error: ', uploadResponse);
            return apiError(c, 400, "Failed to upload an image");
        }

        const uploadResult: any = await uploadResponse.json();

        const updateUser = await prisma.user.update({
            where: { id: userId },
            data: {
                avatarPublicId: uploadResult.public_id,
                avatarUrl: uploadResult.secure_url
            },
            select: {
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