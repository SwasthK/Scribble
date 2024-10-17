import { keepPreviousData, useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { getAllPosts, getDraftPost, getPostByAuthorId, getPostBySlug, getUserPosts } from "./api";

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
        staleTime: Infinity,
    });
}

export function useGetPostByAuthorId(authorId: string) {
    return useQuery({
        queryKey: ["getPostByAuthorId", authorId],
        queryFn: () => getPostByAuthorId(authorId),
        enabled: false,
        staleTime: Infinity,
    });
}

export function useGetDraftedPost() {
    return useQuery({
        queryKey: ["draftedPosts"],
        queryFn: () => getDraftPost(),
        enabled: true,
        retry: false,
    })
}
