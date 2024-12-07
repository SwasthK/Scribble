import { useParams } from "react-router-dom";
import { lazy, Suspense } from "react";

import { useGetPostsByCategoryName } from "../../services/queries";

import { ScrollArea } from "../../components/ui/scroll-area";
import Topic_Skeleton from "./skeleton";

const TopicPostCards = lazy(() => import("./topicpostcards"));

const Topic = () => {
  const { categoryName } = useParams();

  const { data, isLoading, isError } = useGetPostsByCategoryName(
    categoryName || ""
  );

  return (
    <>
      <div className="grid lg:grid-cols-5 xl:gap-4 lg:gap-8 md:gap-12 gap-8 justify-center items-center xl:p-20 lg:h-screen p-6 pt-16 grid-cols-1">
        <div className=" col-span-2 lg:h-[500px] h-fit   flex justify-center items-center">
          <h1 className="lg:pb-12 xl:text-3xl lg:text-2xl text-xl">
            Search Result for "{" "}
            <span className="text-neutral-400 font-semibold italic">{`${categoryName}`}</span>{" "}
            "
          </h1>
        </div>

        <div className="col-span-3 border-2  rounded-md">
          <ScrollArea className="h-[500px]   p-8 xl:px-20 ">
            {isLoading ? (
              <>
                <Topic_Skeleton />
              </>
            ) : isError || data?.length === 0 ? (
              <div className="flex justify-center items-center  h-[400px]  ">
                <h1 className="text-gray-300 font-medium lg:text-xl text-base">
                  No Posts Matched
                </h1>
              </div>
            ) : (
              <>
                <Suspense fallback={<></>}>
                  {" "}
                  <TopicPostCards data={data} />
                </Suspense>
              </>
            )}
          </ScrollArea>
        </div>
      </div>
    </>
  );
};

export default Topic;
