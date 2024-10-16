import { memo } from "react";
import { Fragment } from "react/jsx-runtime";

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
