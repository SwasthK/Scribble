import { keepPreviousData, useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { getAllPosts, getAllUserArchivedPosts, getAllUserSavedPosts, getDraftPost, getDraftPostFullContentByPostId, getPostByAuthorId, getPostBySlug, getUserPosts, handleGetAllCategories, handleGetAllFollowers, handleGetAllFollowings, handleGetUserPostsDetailsByUsername, handleGetUserProfileDetailsByUsername } from "./api";

export function useGetAllPosts() {
    return useInfiniteQuery(
        {
            queryKey: ["getAllPosts"],
            queryFn: getAllPosts,
            staleTime: Infinity,
            initialPageParam: 1,
            retry: false,
            getNextPageParam: (lastPage, allPages) => {
                if (lastPage.posts.length < 1) {
                    return undefined;
                }
                return allPages.length + 1;
            },
        }
    )
}

export function useGetUserPosts(currentPage: number) {
    return useQuery({
        queryKey: ["getUserPosts", currentPage],
        queryFn: () => getUserPosts({ pageParam: currentPage }),
        retry: false,
        placeholderData: keepPreviousData,
        staleTime: Infinity,
    });
}

export function useGetPostBySlug(slug: string | undefined) {
    return useQuery({
        queryKey: ["getPostBySlug", slug],
        queryFn: () => getPostBySlug(slug),
        retry: false,
        staleTime: 0,
    });
}

export function useGetPostByAuthorId(authorId: string, slug: string) {
    return useQuery({
        queryKey: ["getPostByAuthorId", authorId],
        queryFn: () => getPostByAuthorId(authorId, slug),
        enabled: false,
        staleTime: Infinity,
    });
}

export function useGetDraftedPost() {
    return useQuery({
        queryKey: ["draftedPosts"],
        queryFn: () => getDraftPost(),
        staleTime: 0,
        refetchOnWindowFocus: false,
        retry: false,
    })
}

export function useGetDraftedPostFullContentByPostId({ postId }: { postId: string | null }) {
    return useQuery({
        queryKey: ["draftedPostsFullContent"],
        queryFn: () => getDraftPostFullContentByPostId({ postId }),
        // enabled: !!postId,
        retry: false,
        staleTime: 0,
        refetchOnWindowFocus: false,
    })
}

export function useGetAllUserSavedPosts() {
    return useQuery({
        queryKey: ["getAllUserSavedPosts"],
        queryFn: () => getAllUserSavedPosts(),
        staleTime: Infinity,
        retry: false,
        refetchOnWindowFocus: false,
    });
}

export function useGetAlluserArchivedPosts() {
    return useQuery({
        queryKey: ["getAllUserArchivedPosts"],
        queryFn: () => getAllUserArchivedPosts(),
        // staleTime: Infinity,
        retry: false,
        // refetchOnWindowFocus: false,
        // refetchOnMount: false,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        refetchOnReconnect: false,
    })
}

export function useGetAllFollowers() {
    return useQuery({
        queryKey: ["getAllFollowers"],
        queryFn: async () => {
            const [followers, followings] = await Promise.all([
                handleGetAllFollowers(),
                handleGetAllFollowings(),
            ]);
            return { followers, followings };
        },
        staleTime: 10000,
        retry: false,
        refetchOnWindowFocus: false,
    });
}

export function useGetUserProfileDetailsAndPostsDetails(username: string) {
    return useQuery({
        queryKey: ["getUserDetailsAndPosts"],
        queryFn: async () => {
            const [userProfileDetails, userPostDetails] = await Promise.all([
                handleGetUserProfileDetailsByUsername({ username }),
                handleGetUserPostsDetailsByUsername({ username }),
            ]);
            return { userProfileDetails, userPostDetails };
        },
        retry: false,
        staleTime: 0,
        refetchOnWindowFocus: false,
    })
}

export function useGetAllCategories() {
    return useQuery({
        queryKey: ["getAllCategories"],
        queryFn: () => handleGetAllCategories(),
        retry: false,
        staleTime: Infinity,
        refetchOnWindowFocus: false,
    })
}