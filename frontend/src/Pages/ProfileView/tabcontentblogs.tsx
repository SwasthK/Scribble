import { ActiveSince } from "../../utils/activeSince";
import { RefreshIcon } from "../../assets/svg/RefreshIcon";
import ErrorBar from "../../components/Error";
import { ScrollArea } from "../../components/ui/scroll-area";
import { TabsContent } from "../../components/ui/tabs";
import { PostCards } from "./postcards";
import { Suspense } from "react";

const TabContentBlogs = ({
  data,
  isLoading,
  errorMessage,
  isError,
  refetch,
  skeleton,
  isRefetching,
}: {
  data: any;
  isLoading: boolean;
  errorMessage: string | undefined;
  isError: boolean;
  refetch: any;
  skeleton: any;
  isRefetching: boolean;
}) => {
  return (
    <>
      <TabsContent value="blogs">
        {isLoading || isRefetching ? (
          skeleton
        ) : isError ? (
          <ErrorBar
            label={errorMessage}
            parentClass="w-full h-[430px] flex justify-center items-center"
            childClass="px-16 py-2 rounded-md bg-error font-semibold"
          />
        ) : data?.userPostDetails.length === 0 ? (
          <ErrorBar
            label={"No Blogs Found"}
            parentClass="w-full h-[430px] flex justify-center items-center"
            childClass="px-16 py-2 rounded-md bg-error font-semibold"
          />
        ) : (
          <ScrollArea className="h-[430px] w-full rounded-md  p-4 py-0 ">
            <h1 className="font-semibold text-2xl mb-1 py-3">
              {data?.userPostDetails.length}
              {data?.userPostDetails.length === 1 ? " Post" : " Posts"}
            </h1>
            <RefreshIcon
              className="absolute right-5 top-5"
              size={16}
              onClick={() => refetch()}
            ></RefreshIcon>

            <div className="flex items-center gap-2">
              <h1 className="h-1 w-1 bg-green-500 rounded-full"></h1>
              <h1 className="text-sm text-green-500 opacity-90  font-semibold">
                <ActiveSince date={data?.userProfileDetails.createdAt} />
              </h1>
            </div>

            <div className="py-2 flex flex-col gap-4 max-w-[500px] ">
              <span className="text-[0.800rem] pl-2 text-gray-400 font-semibold">
                Posts
              </span>
            </div>
            <div className="w-full flex  gap-4 flex-col">
              <Suspense fallback={<></>}>
                <PostCards data={data} />
              </Suspense>
            </div>
          </ScrollArea>
        )}
      </TabsContent>
    </>
  );
};

export default TabContentBlogs;
