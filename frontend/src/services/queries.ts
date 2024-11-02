import { keepPreviousData, useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { getAllPosts, getDraftPost, getDraftPostFullContentByPostId, getPostByAuthorId, getPostBySlug, getUserPosts } from "./api";

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
