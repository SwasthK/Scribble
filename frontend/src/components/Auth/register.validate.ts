import { mimeTypeSignup } from "../../Types/type";
const MAX_FILE_SIZE = 2 * 1024 * 1024;

const allowedDomains = [
    "@gmail.com",
    "@yahoo.com",
    "@hotmail.com",
    "@outlook.com",
    "@live.com",
    "@msn.com",
    "@icloud.com",
    "@me.com",
    "@aol.com",
    "@protonmail.com",
    "@zoho.com",
    "@yandex.com",
    "@mail.com",
    "@gmx.com",
];

export const validateUsername = (username: string) => {
    if (!username) return "Username is required";
    if (username.length < 3) return "Username must be at least 3 characters long";
    if (username.length > 20)
        return "Username must be at most 20 characters long";
    if (/\s/.test(username)) return "Username must not contain spaces";
    if (!/^[a-zA-Z_]+$/.test(username))
        return "Username must only contain letters (a-z, A-Z) and underscores";
    return "";
};

export const validateEmail = (email: string) => {
    if (!email) return "Email is required";
    const emailLower = email.toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailLower))
        return "Invalid email address";
    if (!allowedDomains.some((domain) => emailLower.endsWith(domain)))
        return "Invalid email domain";
    return "";
};

export const validatePassword = (password: string) => {
    if (!password) return "Password is required";
    if (password.length < 8) return "Password must be at least 8 characters long";
    if (!/[a-z]/.test(password))
        return "Include at least one lowercase letter";
    if (!/[A-Z]/.test(password))
        return "Include at least one uppercase letter";
    if (!/\d/.test(password)) return "Inlcude at least one number";
    if (!/[@$!%*?&]/.test(password))
        return "Include at least one special character";
    return "";
};

export const validateFileType = (fileType: string) => {
    if (Object.values(mimeTypeSignup).includes(fileType as mimeTypeSignup)) {
        return '';
    } else {
        return 'Please select a JPEG, PNG, or WEBP image.';
    }
};

export const validateFileSize = (fileSize: number) => {
    if (fileSize <= MAX_FILE_SIZE) {
        return null;
    } else {
        return "File size exceeds the 2 MB limit"
    }
};

export const validateBio = (bio: string | undefined) => {
    if (bio === undefined || bio.trim().length === 0) return "Bio is required";
    if (bio.length < 10) return "Bio must be at least 10 characters long";
    if (bio.length >= 300) return "Bio must be at most 300 characters long";
    return ""; 
};
