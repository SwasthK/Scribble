import { Fragment, memo, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../components/ui/avatar";
import { trimTitle } from "../../utils/trimTitle";

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

const getRandomColor = () => colors[Math.floor(Math.random() * colors.length)];

const getRandomCategories = (categories: any[], count: number) => {
  return [...categories].sort(() => Math.random() - 0.5).slice(0, count);
};

const TopPicks = memo(
  ({ mostLiked, skeleton }: { mostLiked: any; skeleton: any }) => {
    let data = mostLiked.data?.mostLikedPost?.mostLikedPosts;

    const renderSkeleton = useCallback(() => {
      return Array.from({ length: 3 }).map((_, index) => (
        <Fragment key={index}>{skeleton}</Fragment>
      ));
    }, [skeleton]);

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
              renderSkeleton()
            ) : mostLiked.isError ? (
              <p className="text-sm text-giest-300 pl-4 font-normal">
                Could'nt fetch the most liked posts
              </p>
            ) : (
              <>
                {data?.map((blog: any) => (
                  <Link
                    to={`/blog/${blog.slug}`}
                    key={blog.slug}
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
                      {trimTitle(blog.title, 45)}
                    </h1>
                  </Link>
                ))}
              </>
            )}
          </div>
        </div>
      </>
    );
  }
);

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

const TopicGrid = memo(
  ({ categoryFetch, skeleton }: { categoryFetch: any; skeleton: any }) => {
    return (
      <div className="space-y-4">
        <h1 className=" font-semibold font-giest text-giest-200 mb-4 ml-2">
          Recommended Topics
        </h1>
        <div className="space-y-5">
          {categoryFetch.isLoading ? (
            skeleton
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
  }
);

export { TopPicks, SideBarBanner, TopicGrid };
