import axios from 'axios';
import { updateUserProfileMetaData } from '../Types/type';

export const getAllPosts = async (
    { pageParam }: { pageParam: number }
) => {
    try {
        const response = await axios.get<any>(`/posts/getall?page=${pageParam}&&limit=10`, {
            headers: {
                accessToken: `Bearer ${localStorage.getItem("accessToken")}`
            }
        });

        if (response.data) {
            return response.data.data;
        }

    } catch (error: any) {
        if (error.response && error.response.data) {
            throw new Error(error.response.data.message || 'An unexpected error occurred');
        }
        throw new Error('Something went wrong. Please try again later.');
    }
};

export const getUserPosts = async (
    { pageParam }: { pageParam: number }
) => {
    try {
        const response = await axios.get<any>(`/posts/user?page=${pageParam}`, {
            headers: {
                accessToken: `Bearer ${localStorage.getItem("accessToken")}`
            }
        });

        if (response.data) {
            return response.data.data;
        }

    } catch (error: any) {
        if (error.response && error.response.data) {
            throw new Error(error.response.data.message || 'An unexpected error occurred');
        } else {
            throw new Error('Something went wrong. Please try again later.');
        }
    }
};

export const getPostBySlug = async (slug: string | undefined) => {
    try {
        const response = await axios.get<any>(`/posts/getBy/slug/${slug}`, {
            headers: {
                accessToken: `Bearer ${localStorage.getItem("accessToken")}`
            }
        });

        if (response.data) {
            return response.data.data;
        }

    } catch (error: any) {
        if (error.response && error.response.data) {
            throw new Error(error.response.data.message || 'An unexpected error occurred');
        } else {
            throw new Error('Something went wrong. Please try again later.');
        }
    }
}

export const getPostByAuthorId = async (authorId: string, slug: string) => {
    try {
        const response = await axios.get<any>(`/posts/getBy/authorId/${authorId}`, {
            headers: {
                accessToken: `Bearer ${localStorage.getItem("accessToken")}`
            },
            params: {
                slug
            }
        });

        if (response.data) {
            return response.data.data;
        }

    } catch (error: any) {
        if (error.response && error.response.data) {
            throw new Error(error.response.data.message || 'An unexpected error occurred');
        } else {
            throw new Error('Something went wrong. Please try again later.');
        }
    }
}

export const handleUpdateUserProfileMetadata = async (formData: updateUserProfileMetaData) => {
    try {
        const response = await axios.put<any>(
            `/updateUserProfile`,
            {
                username: formData.username,
                email: formData.email,
                bio: formData.bio
            },
            {
                headers: {
                    accessToken: `Bearer ${localStorage.getItem("accessToken")}`
                }
            }
        );

        if (response.data) {
            return response.data.data;
        }

    } catch (error: any) {
        if (error.response && error.response.data) {
            throw new Error(error.response.data.message || 'An unexpected error occurred');
        } else {
            throw new Error('Something went wrong. Please try again later.');
        }
    }
}

export const getDraftPost = async () => {
    try {
        const response = await axios.get<any>(`/posts/drafts/shortened`, {
            headers: {
                accessToken: `Bearer ${localStorage.getItem("accessToken")}`
            }
        });

        if (response.data) {
            return response.data.data;
        }

    } catch (error: any) {
        if (error.response && error.response.data) {
            throw new Error(error.response.data.message || 'An unexpected error occurred');
        } else {
            throw new Error('Something went wrong. Please try again later.');
        }
    }
}

export const getDraftPostFullContentByPostId = async ({ postId }: { postId: string | null }) => {
    try {
        if (!postId) {
            throw new Error("Post Id is required");
        }
        const response = await axios.get<any>(`/posts/drafts/fullContent/${postId || ''}`, {
            headers: {
                accessToken: `Bearer ${localStorage.getItem("accessToken")}`
            }
        });

        if (response.data) {
            return response.data.data;
        }

    } catch (error: any) {
        if (error.response && error.response.data) {
            throw new Error(error.response.data.message || 'An unexpected error occurred');
        } else {
            throw new Error('Something went wrong. Please try again later.');
        }
    }
}

export const getAllUserSavedPosts = async () => {
    try {
        const response = await axios.get<any>(`/posts/saved/getAll`, {
            headers: {
                accessToken: `Bearer ${localStorage.getItem("accessToken")}`
            }
        });
        if (response.data) {
            return response.data.data;
        }
    } catch (error: any) {
        if (error.response && error.response.data) {
            throw new Error(error.response.data.message || 'An unexpected error occurred');
        } else {
            throw new Error('Something went wrong. Please try again later.');
        }
    }
}

export const getAllUserArchivedPosts = async () => {
    try {
        const response = await axios.get<any>(`/posts/archived/getAll`, {
            headers: {
                accessToken: `Bearer ${localStorage.getItem("accessToken")}`
            }
        });
        if (response.data) {
            return response.data.data;
        }
    } catch (error: any) {
        if (error.response && error.response.data) {
            throw new Error(error.response.data.message || 'An unexpected error occurred');
        } else {
            throw new Error('Something went wrong. Please try again later.');
        }
    }
}

export const handleUpdateUserSocials = async (socials: any) => {
    try {
        const response = await axios.put<any>(
            `/user/socials/update`,
            socials,
            {
                headers: {
                    accessToken: `Bearer ${localStorage.getItem("accessToken")}`
                }
            }
        );

        if (response.data) {
            return response.data.data;
        }

    } catch (error: any) {
        if (error.response && error.response.data) {
            throw new Error(error.response.data.message || 'An unexpected error occurred');
        } else {
            throw new Error('Something went wrong. Please try again later.');
        }
    }
}

export const handleGetAllFollowers = async () => {
    try {
        const response = await axios.get<any>(
            `/profile/getFollowersDetails`,
            {
                headers: {
                    accessToken: `Bearer ${localStorage.getItem("accessToken")}`
                }
            }
        );

        if (response.data) {
            return response.data.data;
        }

    } catch (error: any) {
        if (error.response && error.response.data) {
            throw new Error(error.response.data.message || 'An unexpected error occurred');
        } else {
            throw new Error('Something went wrong. Please try again later.');
        }
    }
}

export const handleGetAllFollowings = async () => {
    try {
        const response = await axios.get<any>(
            `/profile/getFollowingsDetails`,
            {
                headers: {
                    accessToken: `Bearer ${localStorage.getItem("accessToken")}`
                }
            }
        );

        if (response.data) {
            return response.data.data;
        }

    } catch (error: any) {
        if (error.response && error.response.data) {
            throw new Error(error.response.data.message || 'An unexpected error occurred');
        } else {
            throw new Error('Something went wrong. Please try again later.');
        }
    }
}

export const handleGetUserProfileDetailsByUsername = async ({ username }: { username: string }) => {
    try {
        if (!username || username.trim().length === 0) {
            throw new Error("Username is required");
        }
        const response = await axios.get<any>(
            `/user/getBy/username/${username}`,
            {
                headers: {
                    accessToken: `Bearer ${localStorage.getItem("accessToken")}`
                }
            }
        );

        if (response.data) {
            return response.data.data;
        }

    } catch (error: any) {
        if (error.response && error.response.data) {
            throw new Error(error.response.data.message || 'An unexpected error occurred');
        } else {
            throw new Error('Something went wrong. Please try again later.');
        }
    }
}

export const handleGetUserPostsDetailsByUsername = async ({ username }: { username: string }) => {
    try {
        if (!username || username.trim().length === 0) {
            throw new Error("Username is required");
        }
        const response = await axios.get<any>(
            `/posts/getBy/username/${username}`,
            {
                headers: {
                    accessToken: `Bearer ${localStorage.getItem("accessToken")}`
                }
            }
        );

        if (response.data) {
            return response.data.data;
        }

    } catch (error: any) {
        if (error.response && error.response.data) {
            throw new Error(error.response.data.message || 'An unexpected error occurred');
        } else {
            throw new Error('Something went wrong. Please try again later.');
        }
    }
}

export const handleGetAllCategories = async () => {
    try {

        const response = await axios.get<any>(
            `/category/getall`,
            {
                headers: {
                    accessToken: `Bearer ${localStorage.getItem("accessToken")}`
                }
            }
        );

        if (response.data) {
            return response.data.data;
        }

    } catch (error: any) {
        if (error.response && error.response.data) {
            throw new Error(error.response.data.message || 'An unexpected error occurred');
        } else {
            throw new Error('Something went wrong. Please try again later.');
        }
    }
}

export const handleGetMostLikedPosts = async () => {
    try {

        const response = await axios.get<any>(
            `/posts/mostliked`,
            {
                headers: {
                    accessToken: `Bearer ${localStorage.getItem("accessToken")}`
                }
            }
        );

        if (response.data) {
            return response.data.data;
        }

    } catch (error: any) {
        if (error.response && error.response.data) {
            throw new Error(error.response.data.message || 'An unexpected error occurred');
        } else {
            throw new Error('Something went wrong. Please try again later.');
        }
    }
}

export const handleGetPostsByCategoryName = async (categoryName: string) => {
    try {

        const response = await axios.get<any>(
            `/posts/getBy/Category/${categoryName}`,
            {
                headers: {
                    accessToken: `Bearer ${localStorage.getItem("accessToken")}`
                }
            }
        );

        if (response.data) {
            return response.data.data;
        }

    } catch (error: any) {
        if (error.response && error.response.data) {
            throw new Error(error.response.data.message || 'An unexpected error occurred');
        } else {
            throw new Error('Something went wrong. Please try again later.');
        }
    }
}

export const handleGetAllUsersName = async () => {
    try {

        const response = await axios.get<any>(
            `/user/getAllUsersName`,
            {
                headers: {
                    accessToken: `Bearer ${localStorage.getItem("accessToken")}`
                }
            }
        );

        if (response.data) {
            return response.data.data;
        }

    } catch (error: any) {
        if (error.response && error.response.data) {
            throw new Error(error.response.data.message || 'An unexpected error occurred');
        } else {
            throw new Error('Something went wrong. Please try again later.');
        }
    }
}

export const handleGetAllPostsName = async () => {
    try {

        const response = await axios.get<any>(
            `/posts/getAllPostsName`,
            {
                headers: {
                    accessToken: `Bearer ${localStorage.getItem("accessToken")}`
                }
            }
        );

        if (response.data) {
            return response.data.data;
        }

    } catch (error: any) {
        if (error.response && error.response.data) {
            throw new Error(error.response.data.message || 'An unexpected error occurred');
        } else {
            throw new Error('Something went wrong. Please try again later.');
        }
    }
}