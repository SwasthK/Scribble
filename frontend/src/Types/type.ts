import { ChangeEvent } from "react";

export interface MenuItemType {
    icon?: any
    path?: string;
    className?: string;
    label?: string;
}

export interface InputBoxProps {
    label: string;
    type?: string;
    placeholder: string;
    onChange: (
        e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>
    ) => void;
}

export interface FormProps {
    FormType: string;
}

export interface RightBarType {
    title: string;
    author: string;
    shortNote?: string;
    url?: string
}

export enum mimeTypeSignup {
    JPEG = 'image/jpeg',
    PNG = 'image/png',
    WEBP = 'image/webp',
}

export interface FormErrors {
    [key: string]: string | undefined | null;
}

export type SvgIconType = {
    size?: number
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