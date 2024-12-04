export enum mimeTypeSignup {
    JPEG = 'image/jpeg',
    PNG = 'image/png',
    WEBP = 'image/webp',
}

export interface FormErrors {
    [key: string]: string | undefined | null;
}

export type SvgIconType = {
    url?: string;
    size?: number,
    className?: string,
    onClick?: any,
    color?: string,
    fill?: string,
    stroke?: string,
    strokeWidth?: string;
    target?: string;
    disabled?: boolean;
}

export interface updateUserProfileMetaData {
    username: string;
    email: string;
    bio: string;
}

export interface createPostFormData {
    title: string;
    shortCaption: string;
    coverImage: File | null;
    body: string;
    summary: string;
    allowComments: boolean;
}

export enum statusType {
    DRAFT = "DRAFT",
    PUBLISHED = "PUBLISHED",
    ARCHIEVED = "ARCHIEVED",
    NEW = "NEW",
}

export enum pageSection {
    ABOUT = "about",
    BLOGS = "blogs",
    SOCIALS = "socials",
}

export enum socialPlatforms {
    GITHUB = "github",
    X = "x",
    INSTAGRAM = "instagram",
}

export enum pageSection {
    Followers = "Followers",
    Followings = "Followings",
  }