import axios from 'axios';
import { updateUserProfileMetaData } from '../Types/type';
const baseUrl = import.meta.env.VITE_AXIOS_BASE_URL;

export const getAllPosts = async (
    { pageParam }: { pageParam: number }
) => {
    try {
        const response = await axios.get<any>(`${baseUrl}/posts/getall?page=${pageParam}&&limit=10`, {
            headers: {
                accessToken: `Bearer ${localStorage.getItem("accessToken")}`
            }
        });

        if (response.data) {
            return response.data.data;
        }

    } catch (error: any) {
        if (error.response && error.response.data) {
            throw new Error(error.response.data.message || 'Unexpected error');
        }
        throw new Error('Something went wrong. Please try again later.');
    }
};

export const getUserPosts = async (
    { pageParam }: { pageParam: number }
) => {
    try {
        const response = await axios.get<any>(`${baseUrl}/posts/user?page=${pageParam}`, {
            headers: {
                accessToken: `Bearer ${localStorage.getItem("accessToken")}`
            }
        });

        if (response.data) {
            return response.data.data;
        }

    } catch (error: any) {
        if (error.response && error.response.data) {
            throw new Error(error.response.data.message || 'Unexpected error');
        } else {
            throw new Error('Something went wrong. Please try again later.');
        }
    }
};

export const getPostBySlug = async (slug: string | undefined) => {
    try {
        const response = await axios.get<any>(`${baseUrl}/posts/getBy/slug/${slug}`, {
            headers: {
                accessToken: `Bearer ${localStorage.getItem("accessToken")}`
            }
        });

        if (response.data) {
            return response.data.data;
        }

    } catch (error: any) {
        if (error.response && error.response.data) {
            throw new Error(error.response.data.message || 'Unexpected error');
        } else {
            throw new Error('Something went wrong. Please try again later.');
        }
    }
}

export const getPostByAuthorId = async (authorId: string, slug: string) => {
    try {
        const response = await axios.get<any>(`${baseUrl}/posts/getBy/authorId/${authorId}`, {
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
            throw new Error(error.response.data.message || 'Unexpected error');
        } else {
            throw new Error('Something went wrong. Please try again later.');
        }
    }
}

export const handleUpdateUserProfileMetadata = async (formData: updateUserProfileMetaData) => {
    try {
        const response = await axios.put<any>(
            `${baseUrl}/updateUserProfile`,
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
            throw new Error(error.response.data.message || 'Unexpected error');
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
            throw new Error(error.response.data.message || 'Unexpected error');
        } else {
            throw new Error('Something went wrong. Please try again later.');
        }
    }
}

export const getDraftPostFullContentByPostId = async ({ postId }: { postId: string | null }) => {
    try {
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
            throw new Error(error.response.data.message || 'Unexpected error');
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
            throw new Error(error.response.data.message || 'Unexpected error');
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
            throw new Error(error.response.data.message || 'Unexpected error');
        } else {
            throw new Error('Something went wrong. Please try again later.');
        }
    }
}

export const handleUpdateUserSocials = async (socials: any) => {
    try {
        const response = await axios.put<any>(
            `${baseUrl}/user/socials/update`,
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
            throw new Error(error.response.data.message || 'Unexpected error');
        } else {
            throw new Error('Something went wrong. Please try again later.');
        }
    }
}