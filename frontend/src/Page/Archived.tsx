import { memo, useEffect, useState } from "react";
import { ArchiveIcon } from "../assets/svg/ArchiveIcon";
import { UnArchiveIcon } from "../assets/svg/UnArchiveIcon";
import { AppBar } from "../components/AppBar/AppBar";
import { useGetAlluserArchivedPosts } from "../services/queries";
import { trimTitle } from "../utils/trimTitle";
import { RefreshIcon } from "../assets/svg/RefreshIcon";
import { Archived_Post_Skeleton } from "../Skeleton/Archived_Post_Skeleton";
import toast from "react-hot-toast";
import axios from "axios";
import { Link } from "react-router-dom";

export const Archived = () => {
  const { data, isLoading, isError, error, refetch, isRefetching } =
    useGetAlluserArchivedPosts();

  const [posts, setPosts] = useState<any>([]);

  useEffect(() => {
    if (data) {
      setPosts(data);
    }
  }, [data]);

  const hadleReftechArchivedPosts = async () => {
    const { data: NewData } = await refetch();
    if (NewData) {
      setPosts(NewData);
    }
  };

  const handleUnArchive = async (id: string) => {
    setPosts((prev: any) => prev.filter((post: any) => post.id !== id));
  };

  return (
    <>
      <AppBar />
      <div className="flex justify-center items-center w-screen sm:px-8 flex-col gap-4 pt-6">
        <div className=" flex justify-between gap-16 items-center sticky top-0  rounded-md">
          <div className="flex justify-center gap-3 items-center px-6 py-1 bg-cgray-100 border border-b-dark-200 rounded-md">
            <h1 className="font-semibold">Archived Posts</h1>
            <ArchiveIcon size={18} />
          </div>
          {!isLoading && !isError && (
            <div
              onClick={hadleReftechArchivedPosts}
              className="px-6 py-1 gap-2 cursor-pointer bg-cgray-100 border border-b-dark-200 flex justify-center items-center rounded-md"
            >
              <h1> Refresh</h1>
              <RefreshIcon size={18} />
            </div>
          )}
        </div>
        {isLoading && (
          <>
            <div
              className={`max-w-[100rem] p-2 gap-16 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 `}
            >
              {Array.from({ length: 9 }).map((_, index) => (
                <Archived_Post_Skeleton key={index} />
              ))}
            </div>
          </>
        )}
        {isRefetching && (
          <div className="relative skeleton-parent flex justify-center items-center rounded-md">
            <h1 className="px-2 py-1 skeleton-child rounded-md h-9 w-[20rem]"></h1>
            <h1 className="absolute text-giest-100 font-light">
              Plase wait while we are fetching data
            </h1>
          </div>
        )}

        {isError || (!isLoading && posts.length <= 0) ? (
          <div className="font-semibold max-w-[20rem] px-8 py-2 mt-16 rounded-md bg-red-500">
            <h1>{error?.message || "No posts found"}</h1>
          </div>
        ) : (
          <div
            className={`max-w-[100rem]  p-2 gap-16 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 `}
          >
            {posts?.map((post: any) => (
              <ArchivedCard
                key={post.id}
                id={post.id}
                slug={post.slug}
                coverImage={post.coverImage}
                title={post.title}
                onUnArchive={handleUnArchive}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
};

const ArchivedCard = memo(
  ({
    id,
    slug,
    coverImage,
    title,
    onUnArchive,
  }: {
    id: string;
    slug: string;
    coverImage: string;
    title: string;
    onUnArchive: (id: string) => void;
  }) => {
    const handleOnUnArchive = async () => {
      onUnArchive(id);
      try {
        axios.post(
          `/post/unarchive/${id}`,
          {},
          {
            headers: {
              accessToken: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }
        );
      } catch (error) {
        toast.error("Failed to UnArchive the post");
      }
    };

    return (
      <>
        <div className="w-full flex gap-4 justify-start items-center rounded-md pr-2 bg-[#27272A]">
          <img
            src={coverImage || ""}
            className="h-16 w-16 bg-gray-300 rounded-l-md object-cover"
          ></img>
          <div className="flex justify-between items-center gap-2">
            <Link to={`/blog/${slug}`} className="min-w-52 font-semibold">
              <h1> {trimTitle(title, 30)}</h1>
            </Link>
            <UnArchiveIcon size={26} onclick={handleOnUnArchive} />
          </div>
        </div>
      </>
    );
  }
);
