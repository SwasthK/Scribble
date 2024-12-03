import { memo } from "react";
import { GridIcon } from "../assets/svg/GridIcon";
import { useGetAllUserSavedPosts } from "../services/queries";
import { Link } from "react-router-dom";
import { RefreshIcon } from "../assets/svg/RefreshIcon";
import { Saved_Post_Skeleton } from "../Skeleton/Saved_Post_Skeleton";

const Save = () => {
  const { data, isLoading, isError, refetch, isRefetching, error } =
    useGetAllUserSavedPosts();

  return (
    <>
      <div className="flex justify-center items-center flex-row w-screen sm:p-4">
        <div className="flex items-center justify-between gap-4 py-6 sm:py-4  w-[50rem] px-8 bg-[#2F2F2F] sm:rounded-lg">
          <div className="flex items-center gap-4">
            <h1 className="md:text-base font-semibold">Saved Posts</h1>
            <GridIcon size={22} />
          </div>
          <div className="flex items-center">
            <RefreshIcon onClick={refetch} size={20} />
          </div>
        </div>
      </div>
      <div className="flex justify-center items-center flex-row w-screen sm:px-8">
        <div
          className={`  ${
            isError ? "" : "grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5"
          } w-[50rem] p-2 gap-2`}
        >
          {isLoading || isRefetching ? (
            <>
              {Array.from({ length: 15 }).map((_, index) => (
                <Saved_Post_Skeleton key={index} />
              ))}
            </>
          ) : isError ? (
            <>
              <div className="flex justify-center items-center">
                <h1 className="bg-red-500  px-16 mt-8 text-center py-3 rounded-lg font-semibold">
                  {error.message}
                </h1>
              </div>
            </>
          ) : (
            <>
              {data?.map((post: any) => (
                <SaveCard
                  key={post.id}
                  coverImage={post.coverImage}
                  slug={post.slug}
                />
              ))}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Save;

const SaveCard = memo(
  ({ coverImage, slug }: { coverImage: string | undefined; slug: string }) => {
    return (
      <>
        <div className="relative overflow-hidden rounded-lg group">
          <img
            src={coverImage}
            className="aspect-square object-cover group-hover:scale-[1.2] duration-500
            transofrm transition-all cursor-pointer ease-out"
          ></img>
          <div className="flex justify-center items-center absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out">
            <Link
              to={`/blog/${slug}`}
              className="font-semibold border px-2 py-1 text-sm bg-white text-black rounded-lg focus:bg-gray-300 focus:outline-none border-none"
            >
              View
            </Link>
          </div>
        </div>
      </>
    );
  }
);
