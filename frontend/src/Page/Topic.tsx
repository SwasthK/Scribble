import { Link, useParams } from "react-router-dom";
import { ScrollArea } from "../components/ui/scroll-area";
import { useGetPostsByCategoryName } from "../services/queries";
import { useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";

 const Topic = () => {
  const { categoryName } = useParams();

  const { data, isLoading, isError } = useGetPostsByCategoryName(
    categoryName || ""
  );

  useEffect(() => {
    console.log("DATA : ", data);
  }, [data]);

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
                {Array.from({ length: 3 }).map((_, index) => (
                  <div
                    key={index}
                    className="flex flex-col gap-2 mb-3  p-4 m-1 pb-6 "
                  >
                    <div className="flex gap-6">
                      <div className="h-8 w-8 rounded-full mt-1 skeleton-parent">
                        <div className="h-8 w-8  skeleton-child"></div>
                      </div>
                      <div>
                        <div className="font-semibold text-sm w-12 rounded-md h-3 mt-1 skeleton-parent">
                          <div className="font-semibold text-sm w-18 rounded-md h-3 skeleton-child"></div>
                        </div>
                        <div className="h-2 w-20 rounded-md skeleton-parent mt-2">
                          <div className="h-2 w-20 rounded-md skeleton-child "></div>
                        </div>
                      </div>
                    </div>

                    <div className=" mt-3 h-3 w-72 skeleton-parent rounded-md">
                      <div className="h-3 w-96 skeleton-child"></div>
                    </div>
                  </div>
                ))}
              </>
            ) : isError || data?.length === 0 ? (
              <div className="flex justify-center items-center  h-[400px]  ">
                <h1 className="text-gray-300 font-medium lg:text-xl text-base">
                  No Posts Matched
                </h1>
              </div>
            ) : (
              <>
                {data?.map((post: any) => (
                  <Link
                    to={`/blog/${post.slug}`}
                    key={post.slug}
                    className="flex flex-col gap-2 mb-3  p-4 m-1 pb-6 bordern input-style"
                  >
                    <div className="flex gap-6">
                      <Avatar className="mt-1 h-8 w-8">
                        <AvatarImage src={post.author.avatarUrl} />
                        <AvatarFallback>
                          {post.author.username.slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h1 className="font-semibold text-sm">
                          {post.author.username}
                        </h1>
                        <h1 className="font-normal text-sm text-gray-300">
                          meta info
                        </h1>
                      </div>
                    </div>

                    <h1 className="font-semibold xl:text-2xl mt-3 lg:text-xl">
                      {post.title.slice(0, 20)}
                    </h1>
                  </Link>
                ))}
              </>
            )}
          </ScrollArea>
        </div>
      </div>
    </>
  );
};

export default Topic;