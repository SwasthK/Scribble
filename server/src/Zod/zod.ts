import { MediaType, PostReportType } from '@prisma/client';
import { z } from 'zod'

const allowedDomains = [
    '@gmail.com', '@yahoo.com', '@hotmail.com', '@outlook.com', '@live.com',
    '@msn.com', '@icloud.com', '@me.com', '@aol.com', '@protonmail.com',
    '@zoho.com', '@yandex.com', '@mail.com', '@gmx.com'
];

const emailSchema = z.string({
    required_error: "Email is required",
    invalid_type_error: "Invalid email address",
})
    .email({ message: "Invalid email address" })
    .transform(value => value.toLowerCase())
    .refine(value => allowedDomains.some(domain => value.endsWith(domain)), {
        message: "Invalid email domain"
    })

const passwordSchema = z.string({
    required_error: "Password is required",
    invalid_type_error: "Invalid password",
})
    .min(8, { message: "Password must be at least 8 characters long" })
    .refine(value => /[a-z]/.test(value), { message: "Password must contain at least one lowercase letter" })
    .refine(value => /[A-Z]/.test(value), { message: 'Password must contain at least one uppercase letter' })
    .refine(value => /\d/.test(value), { message: 'Password must contain at least one number' })
    .refine(value => /[@$!%*?&]/.test(value), { message: 'Password must contain at least one special character' });

export const usernameSchema = z.string({
    required_error: "Username is required",
    invalid_type_error: "Invalid username",
})
    .min(3, { message: "Username must be at least 3 characters long" })
    .max(20, { message: "Username must be at most 20 characters long" })
    .refine(value => !/\s/.test(value), {
        message: 'Username must not contain spaces',
    })
    .refine(value => /^[a-zA-Z_]+$/.test(value), {
        message: 'Username must only contain letters (a-z, A-Z) and underscores',
    });

const bioSchema = z.string({
    required_error: "Bio is required",
    invalid_type_error: "Invalid Bio",
})
    .min(3, { message: "Bio must be at least 10 characters long" })
    .max(300, { message: "Bio must be at most 300 characters long" })
    .optional()
    .refine((val) => val === undefined || val.trim().length > 0, {
        message: "Bio should not be empty or only whitespace",
    });

export const ServerSignup = z.object({
    username: usernameSchema,
    email: emailSchema,
    password: passwordSchema,
}, { message: "Data provided is invalid" })

export const ServerSignin = z.object({
    identifier: z.string().refine((value) => {
        return emailSchema.safeParse(value).success || usernameSchema.safeParse(value).success;
    }, {
        message: "please enter a valid email or username",
    }),
    password: passwordSchema,
})

export const updateUserProfileSchema = z.object({
    username: usernameSchema.optional(),
    email: emailSchema.optional(),
    bio: bioSchema,
}, {
    required_error: "No update field found",
    invalid_type_error: "Invalid update field",
}).refine(value => value.username || value.email || value.bio, { message: "No update field found" })

export const updateUserPasswordSchema = z.object({
    oldPassword: passwordSchema.optional(),
    newPassword: passwordSchema.optional(),
}, {
    required_error: "No update field found",
    invalid_type_error: "Invalid update field",
})
    .refine(value => value.oldPassword, { message: "Old Password Not found" })
    .refine(value => value.newPassword, { message: "New Password Not found" })
    .refine(value => value.oldPassword !== value.newPassword, {
        message: "Old password and new password cannot be same"
    })

export const postReportSchema = z.object({
    type: z.enum(
        Object.values(PostReportType) as [string, ...string[]]
        , {
            required_error: "Report type is required",
            invalid_type_error: "Invalid report type",
            message: "Report type is required"
        }),
    reason: z.string(
        {
            invalid_type_error: "Invalid reason",
            required_error: "Reason is required",
            message: "Reason is required"
        }
    )
});

export const registerAdminSchema = z.object({
    id: z.string({
        required_error: "User ID is required",
        invalid_type_error: "Invalid User ID",
        message: "Invalid User ID"
    }).uuid({ message: "Invalid User ID" }),
    Role: z.string({
        required_error: "Invalid Request",
        invalid_type_error: "Invalid Request",
        message: "Invalid Request"
    }).includes('ADMIN', { message: "Invalid Request" }),
    PASSKEY: z.string({
        required_error: "Invalid Request",
        invalid_type_error: "Invalid Request",
        message: "Invalid Request"
    })
})

export const categoryNamesSchema = z.object({
    head: z.enum([
        "technology",
        "lifestyle",
        "business",
        "health & wellness",
        "food & recipes",
        "travel",
        "education",
        "personal development",
        "finance",
        "entertainment"
    ], {
        required_error: "Category head is required", invalid_type_error: "Category head must be a string",
        message: "Category head is Required"
    }),
    categories: z.array(
        z.string({
            required_error: "Category name is required",
            invalid_type_error: "Category name must be a string"
        })
            .min(4, { message: "Category name must be at least 4 characters long" })
            .max(30, { message: "Category name must be at most 30 characters long" }),
        { message: "Category is Required" }
    ).nonempty({ message: "At least one category name is required" })
})

export const categoryDeleteSchema = z.object({
    name: z.string({
        required_error: "Category name is required",
        invalid_type_error: "Category name must be a string"
    })
        .min(4, { message: "Category name must be at least 4 characters long" })
        .max(30, { message: "Category name must be at most 30 characters long" }),
});

export const getCategorySchema = z.object({
    name: z.string({
        required_error: "Category name is required",
        invalid_type_error: "Category name must be a string"
    })
        .min(4, { message: "Category name must be at least 4 characters long" })
        .max(30, { message: "Category name must be at most 30 characters long" }),
});

export const categoryUpdateSchema = z.object({
    name: z.string({
        required_error: "Category name is required",
        invalid_type_error: "Category name must be a string"
    })
        .min(4, { message: "Category name must be at least 4 characters long" })
        .max(30, { message: "Category name must be at most 30 characters long" }),
    update: z.string({
        required_error: "New category name is required",
        invalid_type_error: "New category name must be a string"
    })
        .min(4, { message: "New category name must be at least 4 characters long" })
        .max(30, { message: "New category name must be at most 30 characters long" }),
});

export const addCommentSchema = z.object({
    content: z.string({ required_error: "Comment cannnot be empty" }).min(1, "Comment content cannot be empty"),
    postId: z.string({ required_error: "Post ID required" }).uuid("Invalid post ID"),
    parentId: z.string({ required_error: "Invalid" }).uuid().optional()
}, {
    required_error: "Comment is required",
    message: "Invalid data"
});

export const removeCommentSchema = z.object({
    postId: z.string({
        required_error: "Post Id Required",
        invalid_type_error: "Invalid post ID",
        message: "Invalid post ID",
    }).uuid("Invalid post ID"),
    commentId: z.string({
        required_error: "Comment Id Required",
        invalid_type_error: "Invalid comment ID",
        message: "Invalid comment ID",
    }).uuid("Invalid comment ID"),
});

export enum saveAction {
    SAVE = "save",
    UNSAVE = "unsave"
}

export const createNewDraftPostSchema = z.object({
    title: z.string({
        required_error: "Title is required",
        invalid_type_error: "Title must be a string"
    }),
    shortCaption: z.string({
        required_error: "Short Caption is required",
        invalid_type_error: "Short Caption be a string"
    }),
    body: z.string({
        required_error: "Body is required",
        invalid_type_error: "Body must be a string"
    }),
    summary: z.string({
        required_error: "Summary is required",
        invalid_type_error: "Summary must be a string"
    }),
    allowComments: z.boolean({
        required_error: "Allowed Comments is required",
        invalid_type_error: "Allowed Comments must be a boolean"
    })
})

export const deletePostSchema = z.object({
    postId: z.string({ required_error: "Post ID required", invalid_type_error: "Invalid Post ID" })
        .uuid({ message: "Invalid Post ID" }),
})

export const publishPostSchema = z.object({
    title: z.string()
        .min(6, { message: "Title must be atleast 6 Characters" })
        .max(25, { message: "Title must be atmost 25 Characters" }),
    shortCaption: z.string()
        .min(10, { message: "Short Caption must be atleast 10 Characters" })
        .max(100, { message: "Short Caption must be atmost 100 Characters" }),
    body: z.string()
        .min(250, { message: "Your Content Seems to be Small, Write More !" })
        .max(10000, { message: "You have Reached Your Content Limit" }),
    summary: z.string()
        .min(10, { message: "Summary must be atleast 10 Characters" })
        .max(200, { message: "Summary must be atmost 200 Characters" })
        .optional().nullable().or(z.literal('')),
    allowComments: z.boolean({ message: "Invalid Comment type" }),
})

export const updatePostSchema =
    z.object({
        coverImage: z.string().url({ message: "Invalid Cover Image URL" }).optional(),
        title: z.string()
            .min(10, { message: "Title must be atleast 6 Characters" })
            .max(100, { message: "Title must be atmost 25 Characters" })
            .optional(),
        shortCaption: z.string()
            .min(10, { message: "Short Caption must be atleast 10 Characters" })
            .max(100, { message: "Short Caption must be atmost 100 Characters" })
            .optional(),
        body: z.string()
            .min(100, { message: "Your Content Seems to be Small, Write More !" })
            .max(10000, { message: "You have Reached Your Content Limit" })
            .optional(),
        summary: z.string()
            .min(10, { message: "Summary must be atleast 10 Characters" })
            .max(200, { message: "Summary must be atmost 200 Characters" })
            .optional(),
        allowComments: z.boolean({ message: "Invalid Comment type" }).optional(),
        multiMedias: z.array(z.object({
            caption: z.string()
                .min(10, { message: "Caption must be atleast 10 Characters" })
                .max(50, { message: "Caption must be atmost 50 Characters" })
                .optional(),
            altText: z.string()
                .min(10, { message: "Alt Text must be atleast 10 Characters" }),
            url: z.string().url({ message: "Invalid Media URL" }),
            type: z.enum([MediaType.IMAGE, MediaType.AUDIO, MediaType.DOCUMENT, MediaType.VIDEO], { message: "Invalid Media type" }),
        }), { message: "Invalid Multimedia Type" }).optional(),
        categories: z.array(z.string().uuid({ message: "Invalid Category ID" }), { message: "Invalid Category ID" })
            .min(1, { message: "You must add atleast 1 Category" })
            .max(5, { message: "You can add atmost 5 Categories" })
            .optional(),
    }).refine((data) => Object.values(data).some(value => value !== undefined), {
        message: "No update field provided",
    });

export const updateUserSocialsSchema = z.array(
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

export const tagNamesSchema = z.array(
    z.string({
        required_error: "Tag name is required",
        invalid_type_error: "Tag name must be a string"
    })
        .min(2, { message: "Tag name must be at least 2 characters long" })
        .max(20, { message: "Tag name must be at most 20 characters long" })
        .regex(/^[a-zA-Z0-9]+$/, { message: "Tag name can only contain letters and numbers" }),
    { message: "Tag is Required" }
).nonempty({ message: "At least one tag name is required" });

export const tagDeleteSchema = z.object({
    name: z.string({
        required_error: "tag name is required",
        invalid_type_error: "tag name must be a string"
    })
        .min(2, { message: "tag name must be at least 4 characters long" })
        .max(20, { message: "tag name must be at most 30 characters long" }),
});

export const getTagSchema = z.object({
    name: z.string({
        required_error: "Tag name is required",
        invalid_type_error: "Tag name must be a string"
    })
        .min(4, { message: "Tag name must be at least 4 characters long" })
        .max(30, { message: "Tag name must be at most 30 characters long" }),
});

export enum fileUploadMessage {
    NOFILE = 'No file provided',
    SUCCESS = 'File uploaded successfully',
    ERROR = 'Failed to upload file',
    TYPEERROR = 'File type not allowed',
}

export enum mimeTypeSignup {
    JPEG = 'image/jpeg',
    PNG = 'image/png',
    WEBP = 'image/webp',
}

export const tagUpdateSchema = z.object({
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

