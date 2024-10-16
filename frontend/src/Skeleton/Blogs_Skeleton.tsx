import { memo } from "react";

export const Blogs_Skeleton = memo(() => {
  return (
    <div
      className=" px-8 sm:pr-6 sm:px-20 lg:pr-24 md:pl-24 lg:pl-36 xl:pl-56  flex w-screen  xl:w-[100%] gap-12 lg:gap-18"
      role="status"
    >
      <div className="py-10 border-b-[1px] border-[#3B3B3B] w-[57%] sm:w-[70%]  cursor-pointer ">
        <div className="flex gap-2 items-center mb-5">
          <div className="flex gap-2 items-center">
            <div className="skeleton-parent rounded-full h-8 w-8 ">
              <div className="h-8 w-8 skeleton-child mb-4"></div>
            </div>

            <div className="skeleton-parent rounded-full">
              <div className="h-[.7rem] skeleton-child  w-32"></div>
            </div>
          </div>
        </div>
        <div className="mb-6">
          <div className="skeleton-parent rounded-full max-w-[300px] mt-5">
            <div className="h-4 skeleton-child rounded-full max-w-[300px]"></div>
          </div>

          <div className="skeleton-parent rounded-full mt-4 max-w-[330px]">
            <div className="h-3 skeleton-child max-w-[330px]"></div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="skeleton-parent rounded-md">
            <div className="h-4 w-4 skeleton-child rounded-full max-w-8"></div>
          </div>

          <div className="skeleton-parent rounded-md">
            <div className="h-4 w-8 skeleton-child"></div>
          </div>

          <div className="skeleton-parent rounded-full">
            <div className="h-4 w-16 skeleton-child"></div>
          </div>
        </div>
      </div>
      <div className=" w-[40%] py-12 md:py-8">
        <div className="w-full h-full rounded-lg bg-[#3B3B3B] relative overflow-hidden md:min-w-[70%] md:max-w-[90%]">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-[#555151] to-transparent animate-shimmer"></div>
        </div>
      </div>
    </div>
  );
});
