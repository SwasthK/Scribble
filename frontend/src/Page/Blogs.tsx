import { Blog_Card } from "../components/Blogs/Blog_Card";
import { AppBar } from "../components/AppBar/AppBar";
import { useInView } from "react-intersection-observer";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Blogs_Skeleton } from "../Skeleton/Blogs_Skeleton";
import { useEffect, memo } from "react";
import { Link } from "react-router-dom";
import { useGetAllPosts } from "../services/queries";

export const Blogs = () => {
  const { ref, inView } = useInView();

  const postsQuery = useGetAllPosts();
  const {
    data,
    isPending,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = postsQuery;

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage]);

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
          </div>

          <div className="hidden  lg:flex lg:sticky top-0 lg:right-0 p-6  space-y-16 flex-col  h-screen overflow-y-scroll">
            <div className="w-72  xl:w-80 overflow-x-hidden flex flex-col gap-8 text-white font-semibold">
              {data.pages?.map((page: any, pageIndex) => (
                <TopPicks key={pageIndex} blogs={page.posts} />
              ))}

              <SideBarBanner
                title="Noteworthy technology acquisitions 2021"
                caption="Here are the biggest enterprise technology acquisitions of 2021 so far, in reverse chronological order."
                path=""
              />
              <TopicGrid />

              {data.pages?.map((page: any, index) => (
                <FollowRecommendation key={index} blogs={page.posts} />
              ))}

              <div className="bg-[#333331] text-white p-4 rounded-lg mt-3 text-sm">
                <p>
                  This is a blog application where you can read and share
                  articles on various topics.
                </p>
                <p className="mt-2">
                  Made with ❤️ by
                  <Link
                    to={"https://github.com/swasthK"}
                    target="_blank"
                    className="ml-2 font-semibold text-cyan-400"
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
      {isFetchingNextPage && (
        <div className="h-screen w-3/4 pt-20">
          <Blogs_Skeleton />
          <Blogs_Skeleton />
          <Blogs_Skeleton />
        </div>
      )}
    </div>
  );
};

const TopPicks = memo(({ blogs }: any) => {
  return (
    <>
      {Array.isArray(blogs) && blogs.length > 0 ? (
        <div>
          <h1 className="text-yellow-400 font-semibold text-lg mb-4">
            Top Picks
          </h1>

          <div className="flex gap-6 flex-col">
            {blogs.slice(0, 3).map((blog: any, index: number) => (
              <div
                key={index}
                className="flex flex-col gap-2 justify-center cursor-pointer"
              >
                <div className="flex gap-4">
                  <Avatar className="h-1">
                    <AvatarImage src={blog.author.avatarUrl} />
                    <AvatarFallback>
                      {blog.author.username.slice(0, 3)}
                    </AvatarFallback>
                  </Avatar>
                  <h1 className="capitalize text-[0.850rem]">
                    {blog.author?.username || "Unknown Author"}
                  </h1>
                </div>
                <h1 className="font-bold text-lg text-wrap break-words lg:text-base xl:text-base">
                  {blog.title.length > 55
                    ? blog.title.substring(0, 45) + " ..."
                    : blog.title}
                </h1>
              </div>
            ))}
          </div>

          <div className="mt-3">
            <Link to={""} className="underline">
              See more
            </Link>
          </div>
        </div>
      ) : null}
    </>
  );
});

const TopicGrid = memo(() => {
  const topics = [
    "Web Development",
    "Data Science",
    "AI/ML",
    "UI/UX",
    "AWS",
    "Flutter",
    "Cybersecurity",
  ];

  const colors = [
    "bg-blue-400",
    "bg-green-400",
    "bg-yellow-400",
    "bg-red-400",
    "bg-purple-400",
    "bg-pink-400",
    "bg-indigo-400",
  ];

  const getRandomColor = () =>
    colors[Math.floor(Math.random() * colors.length)];

  const renderRow = (rowTopics: any) => (
    <div className="flex gap-2 justify-evenly">
      {rowTopics.map((topic: any, index: number) => (
        <Link
          to={`/topic/${topic}`}
          key={index}
          className={`${getRandomColor()} text-white font-semibold text-[0.85rem] rounded-full px-2 py-2 flex justify-center items-center transition-all duration-300 hover:text-black cursor-pointer`}
          style={{ width: topic.length > 5 ? "9rem" : "5rem" }}
        >
          <p>{topic}</p>
        </Link>
      ))}
    </div>
  );

  return (
    <div className="space-y-4">
      <h1 className="text-zinc-200 font-semibold text-lg">
        Recommended topics
      </h1>
      <div className="space-y-5">
        {renderRow(topics.slice(0, 2))}
        {renderRow(topics.slice(2, 5))}
        {renderRow(topics.slice(5, 7))}
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
          className="block max-w-sm p-8 rounded-lg shadow hover:bg-gray-100 gr"
        >
          <h5 className="mb-5 text-2xl font-bold tracking-tight text-gray-900 ">
            {title}
          </h5>
          <p className="font-normal text-gray-700 ">{caption}</p>
        </Link>
      </>
    );
  }
);

const FollowRecommendation = memo(({ blogs }: any) => {
  return (
    <>
      {Array.isArray(blogs) && blogs.length > 0 ? (
        <div className="space-y-8">
          <h1 className="text-zinc-200 font-semibold text-lg">Who to follow</h1>
          {blogs.slice(0, 3).map((blog: any, index: number) => (
            <div
              key={index}
              className="flex gap-2 justify-between items-center cursor-pointer"
            >
              <div className="flex gap-4 items-center ">
                <Avatar>
                  <AvatarImage src={blog.author.avatarUrl} />
                  <AvatarFallback>
                    {blog.author.username.slice(0, 3)}
                  </AvatarFallback>
                </Avatar>
                <h1 className="capitalize text-lg">
                  {blog.author.username.length > 10
                    ? blog.author.username.substring(0, 10) + "..."
                    : blog.author.username}
                </h1>
              </div>
              <button
                type="button"
                className="px-4 py-1 text-black bg-white font-semibold rounded-md text-sm cursor-pointer"
              >
                Follow
              </button>
            </div>
          ))}
        </div>
      ) : null}
    </>
  );
});
