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

const usernameSchema = z.string({
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
    .max(160, { message: "Bio must be at most 160 characters long" })
    .optional()
    .refine((val) => val === undefined || val.trim().length > 0, {
        message: "Bio should not be empty or only whitespace",
    });

export const ServerSignup = z.object({
    username: usernameSchema,
    email: emailSchema,
    password: passwordSchema,
},{message: "Data provided is invalid"})

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

export const createUserNotificationsSchema = z.object({
    type: z.enum(["INFO", "WARNING", "ERROR", "SUCCESS"], { message: "Invalid notification type" }),
    title: z.string({ required_error: "Title is required", invalid_type_error: "Title must be a string" })
        .min(5, { message: "Title must be at least 5 characters long" })
        .max(50, { message: "Title must be at most 50 characters long" }),
    body: z.string({ required_error: "Body is required", invalid_type_error: "Body must be a string" })
        .min(10, { message: "Body must be at least 5 characters long" })
        .max(200, {
            message: "Body must be at most 200 characters long"
        })
});

export const markNotificationAsReadSchema = z.string().uuid({ message: "Invalid notification ID" });