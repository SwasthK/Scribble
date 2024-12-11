import { useEffect, lazy, Suspense } from "react";
import { useInView } from "react-intersection-observer";

const TopPicks = lazy(() =>
  import("./sidebar").then((module) => ({ default: module.TopPicks }))
);
const SideBarBanner = lazy(() =>
  import("./sidebar").then((module) => ({ default: module.SideBarBanner }))
);
const TopicGrid = lazy(() =>
  import("./sidebar").then((module) => ({ default: module.TopicGrid }))
);

const NoteSection = lazy(() => import("./notesection"));

import {
  Blogs_Fetching_Skeleton,
  Blogs_Skeleton,
  TopicGrid_Skeleton,
  TopPicks_Skeleton,
} from "./skeleton";

import { Blog_Card } from "./blogcard";

import {
  useGetAllCategoriesAndMostLikedPost,
  useGetAllPosts,
} from "../../services/queries";

const Blogs = () => {
  const { ref, inView } = useInView();

  const {
    data,
    isPending,
    isError,
    error,
    fetchNextPage,
    isFetchedAfterMount,
    hasNextPage,
    isFetchingNextPage,
  } = useGetAllPosts();
  const categoryAndLikedpost = useGetAllCategoriesAndMostLikedPost();

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage]);

  useEffect(() => {
    if (isFetchedAfterMount) {
      categoryAndLikedpost.refetch();
    }
  }, [isFetchedAfterMount]);

  return (
    <div className="bg-gradient-1 w-screen">
      {isPending ? (
        <div className="h-screen absolute top-0 w-3/4 pt-20">
          {Array.from({ length: 6 }).map((_, index) => (
            <Blogs_Skeleton key={index} />
          ))}
        </div>
      ) : isError ? (
        <div>{error.message}</div>
      ) : (
        <div className="flex w-screen">
          <div className="flex flex-col px-5 sm:px-7 md:px-16 lg:px-8 xl:pl-52 lg:w-[70%] xl:w-[65%] w-full">
            {data?.pages?.map((page: any, pageIndex) =>
              page.posts.map((blog: any) => (
                <Blog_Card
                  key={`${pageIndex}-${blog.id}`}
                  id={blog.id}
                  author={blog.author}
                  coverImage={blog.coverImage}
                  title={blog.title}
                  slug={blog.slug}
                  shortCaption={blog.shortCaption}
                  count={blog._count}
                  likes={blog.likes}
                  isSaved={blog.isSaved}
                  createdAt={blog.createdAt}
                />
              ))
            )}
            {hasNextPage && !isFetchingNextPage && <div ref={ref}></div>}
            {isFetchingNextPage && (
              <>
                {Array.from({ length: 3 }).map((_, index) => (
                  <Blogs_Fetching_Skeleton key={index} />
                ))}
              </>
            )}
          </div>

          <div className="hidden  lg:flex lg:sticky top-0 lg:right-0 p-6  space-y-16 flex-col  h-screen overflow-y-scroll">
            <div className="w-72  xl:w-80 overflow-x-hidden flex flex-col gap-[1.8rem] text-white font-semibold">
              <Suspense fallback={<></>}>
                <TopPicks
                  mostLiked={categoryAndLikedpost}
                  skeleton={<TopPicks_Skeleton />}
                />
              </Suspense>

              <Suspense fallback={<></>}>
                <SideBarBanner
                  title="Understanding the Power of React"
                  caption=" React simplifies building user interfaces with its component-based approach. Learn how to create dynamic web applications effortlessly."
                  path=""
                />
              </Suspense>

              <Suspense fallback={<TopicGrid_Skeleton />}>
                <TopicGrid
                  categoryFetch={categoryAndLikedpost}
                  skeleton={<TopicGrid_Skeleton />}
                />
              </Suspense>

              <Suspense fallback={<></>}>
                <NoteSection />
              </Suspense>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Blogs;
