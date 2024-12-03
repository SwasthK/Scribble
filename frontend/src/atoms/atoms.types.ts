export interface authAtomType {
    user: {
        [key: string]: any;
    };
    isAuthenticated: boolean;
    accessToken: string | null;
    refreshToken: string | null;
}

export interface followAtomType {
    following: string[];
}
