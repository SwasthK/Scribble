import { lazy, Suspense, useEffect, useState } from "react";

import { ArchiveIcon } from "../../assets/svg/ArchiveIcon";
import { RefreshIcon } from "../../assets/svg/RefreshIcon";

import { useGetAlluserArchivedPosts } from "../../services/queries";

import { Archived_Post_Skeleton } from "./skeleton";

const ArchivedCard = lazy(() => import("./archivedcard"));

const Archived = () => {
  const [posts, setPosts] = useState<any>([]);

  const { data, isLoading, isError, error, refetch, isRefetching } =
    useGetAlluserArchivedPosts();

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
              <h1>Refresh</h1>
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
          <Suspense
            fallback={
              <>
                {Array.from({ length: 9 }).map((_, index) => (
                  <Archived_Post_Skeleton key={index} />
                ))}
              </>
            }
          >
            <ArchivedCard posts={posts} onUnArchive={handleUnArchive} />
          </Suspense>
        )}
      </div>
    </>
  );
};

export default Archived;
