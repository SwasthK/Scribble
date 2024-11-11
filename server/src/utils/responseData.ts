export const generateAccessAndRefreshTokenData = {
    id: true,
    email: true,
    username: true,
    password: false,
    bio: true,
    avatarUrl: true,
    role: false,
    isActive: true,
    createdAt: true,
    updatedAt: true,
    refreshToken: false,
    refreshTokenExpiresAt: false,
}

export enum LikesResponse {
    PostIdRequired = "Post ID is required",
    Liked = "You have liked the post",
    Unliked = "You have unliked the post",
    LikesError = "Unable to like the post",
    ConsoleError = "Like Post Error : "
}