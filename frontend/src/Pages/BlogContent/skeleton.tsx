import { memo } from "react";
import { Fragment } from "react/jsx-runtime";

export const Blog_Content_Skeleton = memo(() => {
  return (
    <div
      className="flex justify-center items-center px-8 py-16 sm:px-16"
      role="status"
    >
      <div className="w-full flex flex-col gap-8 max-w-[700px]">
        <div className="min-h-96 max-w-3/4 ">
          <div className="h-10 sm:h-12 skeleton-parent rounded-xl">
            <div className="skeleton-child h-10 sm:h-12 mx-2"></div>
          </div>
          <div className="mt-6 h-5 skeleton-parent rounded-xl">
            <div className="skeleton-child h-5"></div>
          </div>
          <div className="flex items-center gap-4 py-7">
            <div className="h-12 w-12 rounded-full skeleton-parent">
              <div className="h-12 w-12 skeleton-child"></div>
            </div>
            <div className="flex flex-col gap-2">
              <div className="w-32 h-4 skeleton-parent rounded-xl">
                <div className="w-32 h-4 skeleton-child"></div>
              </div>
              <div className="w-32 h-4 skeleton-parent rounded-xl">
                <div className="w-32 h-4 skeleton-child"></div>
              </div>
            </div>
          </div>

          <div className="aspect-video skeleton-parent rounded-xl">
            <div className="aspect-video skeleton-child"></div>
          </div>

          <div className="mt-8 h-[450px] skeleton-parent rounded-xl">
            <div className="h-[450px] skeleton-child"></div>
          </div>

          <div className="mt-8 h-8 skeleton-parent  rounded-xl">
            <div className="h-8 skeleton-child"></div>
          </div>
        </div>
      </div>
    </div>
  );
});

export const Blog_Recommendation_Skeleton = memo(() => {
  return (
    <div className="grid grid-cols-1 gap-10 sm:grid-cols-2">
      {[...Array(4)].map((_, index: number) => (
        <Fragment key={index}>
          <div className="flex flex-col gap-6">
            <div className="aspect-video skeleton-parent rounded-lg">
              <div className="aspect-video skeleton-child" />
            </div>
            <div className="flex flex-col ">
              <div className="flex gap-4 items-center">
                <div className="h-7 w-7 rounded-full skeleton-parent">
                  <div className="h-6 w-6 skeleton-child"></div>
                </div>
                <div className="rounded-xl w-24 h-4 skeleton-parent">
                  <div className="skeleton-child w-24 h-4"></div>
                </div>
              </div>
              <div className="skeleton-parent mt-4 mb-3 w-full h-6 rounded-lg">
                <div className="w-full h-8 skeleton-child"></div>
              </div>
              <div className="flex flex-col gap-2">
                <div className="w-full h-3 skeleton-parent rounded-lg">
                  <div className="w-full h-3 skeleton-child rounded-lg"></div>
                </div>
                <div className="w-52 h-3 skeleton-parent rounded-lg">
                  <div className="w-52 h-3 skeleton-child rounded-lg"></div>
                </div>
              </div>
            </div>
          </div>
        </Fragment>
      ))}
    </div>
  );
});

export const Comment_Skeleton = memo(() => {
  return (
    <div role="status">
      <div className="mb-4 h-4 w-16 ml-3 rounded-md skeleton-parent">
        <div className=" h-4 w-16 skeleton-child"></div>
      </div>
      {Array.from({ length: 3 }).map((_, i) => (
        <div className="space-y-7 pl-6">
          <div key={i} className="flex gap-5 mb-4">
            <div className="h-6 w-6 rounded-full skeleton-parent">
              <div className="h-6 w-6 rounded-full skeleton-child"></div>
            </div>
            <div className="flex flex-col gap-3 w-full">
              <div className="flex flex-col gap-2 w-full">
                <div className="h-3 skeleton-parent w-1/5 rounded-md">
                  <div className="h-3 skeleton-child w-1/5 rounded-md"></div>
                </div>
                <div className="h-4 skeleton-parent w-3/6 rounded-md">
                  <div className="h-4 skeleton-child w-3/6 rounded-md"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
});
