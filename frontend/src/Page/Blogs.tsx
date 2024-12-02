import { Blog_Card } from "../components/Blogs/Blog_Card";
import { AppBar } from "../components/AppBar/AppBar";
import { useInView } from "react-intersection-observer";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import {
  Blogs_Fetching_Skeleton,
  Blogs_Skeleton,
} from "../Skeleton/Blogs_Skeleton";
import { useEffect, memo } from "react";
import { Link } from "react-router-dom";
import {
  useGetAllCategoriesAndMostLikedPost,
  useGetAllPosts,
} from "../services/queries";

import { ScrollArea } from "../components/ui/scroll-area";

export const Blogs = () => {
  const { ref, inView } = useInView();

  const postsQuery = useGetAllPosts();
  const {
    data,
    isPending,
    isError,
    error,
    fetchNextPage,
    isFetchedAfterMount,
    hasNextPage,
    isFetchingNextPage,
  } = postsQuery;

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
      <AppBar />

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
                <Blogs_Fetching_Skeleton />
                <Blogs_Fetching_Skeleton />
                <Blogs_Fetching_Skeleton />
              </>
            )}
          </div>

          <div className="hidden  lg:flex lg:sticky top-0 lg:right-0 p-6  space-y-16 flex-col  h-screen overflow-y-scroll">
            <div className="w-72  xl:w-80 overflow-x-hidden flex flex-col gap-[1.8rem] text-white font-semibold">
              <TopPicks mostLiked={categoryAndLikedpost} />

              <SideBarBanner
                title="Understanding the Power of React"
                caption=" React simplifies building user interfaces with its component-based approach. Learn how to create dynamic web applications effortlessly."
                path=""
              />
              <TopicGrid categoryFetch={categoryAndLikedpost} />

              {/* {data.pages?.map((page: any, index) => (
              <FollowRecommendation key={index} blogs={page.posts} />
            ))} */}

              <div className="bg-[#333331] text-white p-4 rounded-lg mt-3 text-sm font-giest font-normal">
                <p>
                  This is a blog application where you can read and share
                  articles on various topics.
                </p>
                <p className="mt-5">
                  Built by
                  <Link
                    to={"https://github.com/swasthK"}
                    target="_blank"
                    className="ml-1 font-semibold text-cyan-200 hover:underline"
                  >
                  Swasthik
                  </Link>
                  .
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* {isFetchingNextPage && (
        <div className="h-screen w-3/4 pt-20">
          <Blogs_Skeleton />
          <Blogs_Skeleton />
          <Blogs_Skeleton />
        </div>
      )} */}
    </div>
  );
};

const TopPicks = memo(({ mostLiked }: { mostLiked: any }) => {
  let data = mostLiked.data?.mostLikedPost?.mostLikedPosts;

  return (
    <>
      <div className="pt-2">
        <h1 className=" font-bold  mb-4 ml-2 font-giest text-giest-200">
          Top Picks
        </h1>

        <div
          className={`flex gap-6 flex-col px-4  py-4 rounded-xl ${
            !mostLiked.isLoading && !mostLiked.isError
              ? "bg-cdark-200 border-b-dark-100 border"
              : ""
          }   `}
        >
          {mostLiked.isLoading ? (
            <>
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index}>
                  <div className=" gap-3 flex items-center">
                    <div className="h-5 w-5 rounded-full skeleton-parent">
                      <div className="h-5 w-5  skeleton-child"></div>
                    </div>
                    <div className="h-3 w-28 rounded-full skeleton-parent">
                      <div className="h-3 w-28  skeleton-child"></div>
                    </div>
                  </div>
                  <div className="skeleton-parent ml-8 w-44 rounded-md h-3 mt-1">
                    <div className="skeleton-child w-44 rounded-md h-3"></div>
                  </div>
                </div>
              ))}
            </>
          ) : mostLiked.isError ? (
            <p className="text-sm text-giest-300 pl-4 font-normal">
              Could'nt fetch the most liked posts
            </p>
          ) : (
            <>
              {data?.map((blog: any, index: number) => (
                <Link
                  to={`/blog/${blog.slug}`}
                  key={index}
                  className="flex flex-col gap-2 justify-center cursor-pointer "
                >
                  <div className="flex gap-4  w-fit pr-4">
                    <Avatar className="h-5 w-5">
                      <AvatarImage src={blog.author.avatarUrl} />
                      <AvatarFallback>
                        {blog.author?.username.slice(0, 3)}
                      </AvatarFallback>
                    </Avatar>
                    <h1 className="capitalize text-[0.850rem] text-giest-200 font-semibold">
                      {blog.author?.username || "Unknown Author"}
                    </h1>
                  </div>
                  <h1 className="font-light text-lg text-wrap break-words lg:text-base xl:text-md">
                    {blog.title.length > 55
                      ? blog.title.substring(0, 45) + " ..."
                      : blog.title}
                  </h1>
                </Link>
              ))}
            </>
          )}
        </div>
      </div>
    </>
  );
});

const TopicGrid = memo(({ categoryFetch }: { categoryFetch: any }) => {
  const colors = [
    "bg-gradient-to-r from-cyan-500 to-blue-500",
    "bg-gradient-to-r from-[#EC6F66] to-[#F3A183]",
    "bg-gradient-to-r from-white to-[#49a09d]",
    "bg-green-400",
    "bg-yellow-400",
    "bg-red-100",
    "bg-purple-400",
    "bg-indigo-400",
  ];

  const getRandomColor = () =>
    colors[Math.floor(Math.random() * colors.length)];

  const getRandomCategories = (categories: any[], count: number) => {
    return [...categories].sort(() => Math.random() - 0.5).slice(0, count);
  };

  return (
    <div className="space-y-4">
      <h1 className=" font-semibold font-giest text-giest-200 mb-4 ml-2">
        Recommended Topics
      </h1>
      <div className="space-y-5">
        {categoryFetch.isLoading ? (
          <div className="flex gap-2  ">
            <div className="w-28 h-8  rounded-full skeleton-parent">
              <div className="w-28 h-8  rounded-full skeleton-child"></div>
            </div>
            <div className=" flex-grow h-8 rounded-full skeleton-parent">
              <div className="flex-grow h-8  rounded-full skeleton-child"></div>
            </div>
          </div>
        ) : categoryFetch.error ? (
          <p className="text-sm text-gray-500 pl-4 font-normal">
            Could'nt fetch the topics
          </p>
        ) : (
          <div
            className={`grid grid-cols-2 gap-y-3 flex-col gap-3 ${
              categoryFetch.data?.categories.length == 1
                ? "justify-center"
                : "justify-center"
            }`}
          >
            {categoryFetch.data?.categories &&
              getRandomCategories(categoryFetch.data.categories, 6).map(
                (topic: any) => (
                  <Link
                    to={`/topic/${topic.name
                      .toLowerCase()
                      .replace(/\s+/g, "-")}`}
                    key={topic.name}
                    className={`${getRandomColor()} font-scribble2 text-center capitalize text-gray-900 font-bold text-[0.85rem] rounded-full px-2 py-2 flex justify-center items-center transition-all duration-300 hover:text-black cursor-pointer`}
                  >
                    <p>{topic.name}</p>
                  </Link>
                )
              )}
          </div>
        )}
      </div>
    </div>
  );
});

const SideBarBanner = memo(
  ({
    title,
    caption,
    path,
  }: {
    title: string;
    caption: string;
    path: string;
  }) => {
    return (
      <>
        <Link
          to={path}
          className="block max-w-sm px-5 py-7 rounded-lg  hover:bg-gray-100  card-gradient-1 "
        >
          <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900">
            {title}
          </h5>
          <p className="font-normal text-gray-900 ">{caption}</p>
        </Link>
      </>
    );
  }
);

// const FollowRecommendation = memo(({ blogs }: any) => {
//   return (
//     <>
//       {Array.isArray(blogs) && blogs.length > 0 ? (
//         <div className="space-y-8">
//           <h1 className="text-zinc-200  font-semibold text-base mb-4 ml-2">
//             Who to follow
//           </h1>
//           {blogs.slice(0, 3).map((blog: any, index: number) => (
//             <div
//               key={index}
//               className="flex gap-4 justify-between items-center cursor-pointer"
//             >
//               <Link
//                 to={`/view/profile/${blog.author.username}`}
//                 className="flex gap-4 items-center rounded-xl border border-b-dark-100 w-full bg-cdark-200 px-3 py-1"
//               >
//                 <Avatar className="h-7 w-7">
//                   <AvatarImage src={blog.author.avatarUrl} />
//                   <AvatarFallback>
//                     {blog.author.username.slice(0, 3)}
//                   </AvatarFallback>
//                 </Avatar>
//                 <h1 className="capitalize text-[0.9rem] ">
//                   {blog.author.username.length > 10
//                     ? blog.author.username.substring(0, 10) + "..."
//                     : blog.author.username}
//                 </h1>
//               </Link>
//               <button
//                 type="button"
//                 className="px-5 py-2 text-black bg-white font-bold   rounded-xl  text-sm cursor-pointer"
//               >
//                 Follow
//               </button>
//             </div>
//           ))}
//         </div>
//       ) : null}
//     </>
//   );
// });
