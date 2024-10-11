export interface blogType {
    author: string;
    title: string;
    content: string;
    createdAt: string;
    id: string;
    slug: string;
    tags: string[];
}

export interface UserStateType {
    id: string;
    avatarUrl: string;
    bio: string;
    username: string;
    email: string;
    token: string | null;
    isAuthenticated: boolean;
    createdAt: string;
}


export interface authAtomType {
    user: {
        [key: string]: any;
    };
    isAuthenticated: boolean;
    accessToken: string | null;
    refreshToken: string | null;
}