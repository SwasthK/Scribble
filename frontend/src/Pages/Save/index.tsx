import { lazy, Suspense } from "react";
import { useGetAllUserSavedPosts } from "../../services/queries";
import ErrorBar from "../../components/Error";
import { Saved_Post_Skeleton } from "./skeleton";
import { GridIcon } from "../../assets/svg/GridIcon";
import { RefreshIcon } from "../../assets/svg/RefreshIcon";

const SaveCard = lazy(() => import("./savecard"));

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
          className={`${
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
              <ErrorBar
                label={error.message}
                parentClass="flex justify-center items-center"
                childClass="bg-red-500  px-16 mt-8 text-center py-3 rounded-lg font-semibold"
              />
            </>
          ) : (
            <Suspense fallback={<Saved_Post_Skeleton />}>
              <SaveCard data={data} />
            </Suspense>
          )}
        </div>
      </div>
    </>
  );
};

export default Save;
