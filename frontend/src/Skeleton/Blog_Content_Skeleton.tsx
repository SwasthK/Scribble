import { memo } from "react";

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
