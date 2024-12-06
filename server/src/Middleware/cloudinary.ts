import { Context, Next } from "hono";
import { mimeTypeBlog } from "Types";
import { fileUploadMessage, mimeTypeSignup } from "Zod/zod";

const routes = {
    signup: '/api/v1/signup',
    updateUserAvatar: '/api/v1/updateUserAvatar',
    blog: '/api/v1/blog',
    createNewPublishedPost: '/api/v1/posts/createNewPublishPost',
    createNewDraftPost: '/api/v1/post/createNewDraftPost',
}

const getAllowedMimeTypes = (url: string): Set<string> => {

    if (url === routes.signup ||
        url === routes.updateUserAvatar ||
        url === routes.createNewPublishedPost ||
        url === routes.createNewDraftPost) {
        return new Set(Object.values(mimeTypeSignup));
    }
    if (url === routes.blog) {
        return new Set(Object.values(mimeTypeBlog));
    }
    return new Set();
};

export async function getFileToUpload(c: Context, next: Next) {
    try {
        let cloudinaryHelpers = getCloudinaryHelpers(c);

        const path = c.req.path

        const formData = await c.req.formData();

        const files = formData.getAll('file') as File[];

        if (path === routes.signup ||
            path === routes.updateUserAvatar ||
            path === routes.createNewPublishedPost ||
            path === routes.createNewDraftPost
        ) {
            if (files.length !== 1) {
                c.set('fileUploadMessage', fileUploadMessage.NOFILE);
                return await next();
            }
        } else {
            if (files.length === 0) {
                c.set('fileUploadMessage', fileUploadMessage.NOFILE);
                return await next();
            }
        }

        const file = files[0];

        if (!file) {
            c.set('fileUploadMessage', fileUploadMessage.NOFILE)
            return await next();
        }

        const allowedMimeTypes = getAllowedMimeTypes(c.req.path);

        if (!allowedMimeTypes.has(file?.type)) {
            c.set('fileUploadMessage', fileUploadMessage.TYPEERROR);
            return await next();
        }

        const timestamp = Math.round((new Date).getTime() / 1000);
        const uniqueFilename = generateUniqueFilename(file.name);

        let uploadPreset = '';

        if (path === routes.createNewPublishedPost || path === routes.createNewDraftPost) {
            uploadPreset = 'Blog_Cover_Image';
        } else {
            uploadPreset = 'Profile_Image';
        }

        const signature = await generateSignature(timestamp, uniqueFilename, uploadPreset, cloudinaryHelpers.CLOUDINARY_API_SECRET);

        const cloudinaryFormData = new FormData();
        cloudinaryFormData.append('file', file);
        cloudinaryFormData.append('timestamp', timestamp.toString());
        cloudinaryFormData.append('api_key', cloudinaryHelpers.CLOUDINARY_API_KEY);
        cloudinaryFormData.append('signature', signature);
        cloudinaryFormData.append('public_id', uniqueFilename);
        cloudinaryFormData.append('upload_preset', uploadPreset);

        const uploadResponse = await cloudinaryUploader(cloudinaryFormData, cloudinaryHelpers);

        if (!uploadResponse.ok) {
            console.log('Upload File Middleware Error: ', uploadResponse);
            c.set('fileUploadMessage', fileUploadMessage.ERROR)
            return await next();
        }

        const result = await uploadResponse.json();

        c.set('fileUploadMessage', fileUploadMessage.SUCCESS)
        c.set('fileUploadResponse', result)

        return await next();

    } catch (error) {
        console.error('Upload File Middleware Error: ', error);
        c.set('fileUploadMessage', fileUploadMessage.ERROR)
        return await next();
    }
}

export function generateUniqueFilename(originalFilename: string): string {
    const timestamp = new Date().toISOString().replace(/[-:.]/g, '');
    const randomString = Math.random().toString(36).substring(2, 8);
    const extension = originalFilename.split('.').pop();
    return `image_${timestamp}_${randomString}.${extension}`;
}

export async function generateSignature(timestamp: number, publicId: string, uploadPreset: string, CLOUDINARY_API_SECRET: string): Promise<string> {
    const str = `public_id=${publicId}&timestamp=${timestamp}&upload_preset=${uploadPreset}${CLOUDINARY_API_SECRET}`;
    const msgUint8 = new TextEncoder().encode(str);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export async function generateSignatureForReplace(timestamp: number, publicId: string, uploadPreset: string, CLOUDINARY_API_SECRET: string, invalidate: boolean = true, overwrite: boolean = true) {
    const str = `invalidate=${invalidate}&overwrite=${overwrite}&public_id=${publicId}&timestamp=${timestamp}&upload_preset=${uploadPreset}${CLOUDINARY_API_SECRET}`;
    const msgUint8 = new TextEncoder().encode(str);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export async function cloudinaryUploader(cloudinaryFormData: FormData, cloudinaryHelpers: any) {
    return await fetch(
        `https://api.cloudinary.com/v1_1/${cloudinaryHelpers.CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
            method: 'POST',
            body: cloudinaryFormData,
        }
    );
}

export function getCloudinaryHelpers(c: Context) {
    return {
        CLOUDINARY_CLOUD_NAME: c.env.CLOUDINARY_CLOUD_NAME,
        CLOUDINARY_API_KEY: c.env.CLOUDINARY_API_KEY,
        CLOUDINARY_API_SECRET: c.env.CLOUDINARY_API_SECRET
    }
}

// app.post('/upload-image', async (c) => {
//   try {
//     const formData = await c.req.formData();
//     const file = formData.get('image') as File;

//     if (!file) {
//       return c.json({ error: 'No image file provided' }, 400);
//     }

//     // Generate a unique filename
//     const uniqueFilename = generateUniqueFilename(file.name);

//     // Prepare for Cloudinary upload
//     const timestamp = Math.round((new Date).getTime() / 1000);
//     const signature = await generateSignature(timestamp, uniqueFilename);

//     // Create a new FormData object for Cloudinary
//     const cloudinaryFormData = new FormData();
//     cloudinaryFormData.append('file', file);
//     cloudinaryFormData.append('timestamp', timestamp.toString());
//     cloudinaryFormData.append('api_key', CLOUDINARY_API_KEY);
//     cloudinaryFormData.append('signature', signature);
//     cloudinaryFormData.append('public_id', uniqueFilename);

//     // Upload to Cloudinary
//     const uploadResponse = await fetch(
//       `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
//       {
//         method: 'POST',
//         body: cloudinaryFormData,
//       }
//     );

//     if (!uploadResponse.ok) {
//       throw new Error('Failed to upload image to Cloudinary');
//     }

//     const result = await uploadResponse.json();

//     // Store the URL in the database
//     const newMultiMedia = await prisma.multiMedia.create({
//       data: {
//         url: result.secure_url,
//         type: 'IMAGE',
//         caption: uniqueFilename,
//         // You can add more fields here as needed
//       },
//     });

//     return c.json({ success: true, imageUrl: result.secure_url, mediaId: newMultiMedia.id }, 201);
//   } catch (error) {
//     console.error('Error uploading image:', error);
//     return c.json({ error: 'Failed to upload image' }, 500);
//   }
// });

// app.get('/get-image/:id', async (c) => {
//   try {
//     const id = c.req.param('id');

//     // Fetch the image details from the database
//     const multiMedia = await prisma.multiMedia.findUnique({
//       where: { id },
//     });

//     if (!multiMedia) {
//       return c.json({ error: 'Image not found' }, 404);
//     }

//     // Construct the Cloudinary URL
//     const imageUrl = `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload/${multiMedia.caption}`;

//     return c.json({ success: true, imageUrl, mediaDetails: multiMedia });
//   } catch (error) {
//     console.error('Error fetching image:', error);
//     return c.json({ error: 'Failed to fetch image' }, 500);
//   }
// });

// // Function to generate Cloudinary API signature


// // Function to generate a unique filename
// function generateUniqueFilename(originalFilename: string): string {
//   const timestamp = new Date().toISOString().replace(/[-:.]/g, '');
//   const randomString = Math.random().toString(36).substring(2, 8);
//   const extension = originalFilename.split('.').pop();
//   return `image_${timestamp}_${randomString}.${extension}`;
// }

// export default app;