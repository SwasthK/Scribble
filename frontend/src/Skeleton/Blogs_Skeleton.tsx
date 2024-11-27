import { memo } from "react";

export const Blogs_Skeleton = memo(() => {
  return (
    <div
      className=" px-8 sm:pr-6 sm:px-20 lg:pr-24 md:pl-24 lg:pl-36 xl:pl-52 flex w-screen xl:w-[100%] gap-12 lg:gap-18"
      role="status"
    >
      <div className="py-10 border-b-[1px] border-[#3B3B3B] w-[57%] sm:w-[70%]  cursor-pointer">
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
        <div className="w-full h-full max-h-[90%] rounded-lg bg-[#3B3B3B] relative overflow-hidden md:min-w-[70%] md:max-w-[70%]">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-[#555151] to-transparent animate-shimmer"></div>
        </div>
      </div>
    </div>
  );
});

export const Blogs_Fetching_Skeleton = memo(() => {
  return (
    <div className="text-white py-10 w-full border-b-[0.01rem] border-[#9ca3af2b] cursor-pointer flex items-center gap-6 md:gap-12 lg:gap-8 ">
      <div className="w-[75%] sm:w-[73%] md:w-[70%] lg:w-[78%] xl:w-[70%]">
        <div className="flex gap-2 items-center mb-3">
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
          <div className="skeleton-parent rounded-full md:max-w-[300px] mt-5 w-[180px]">
            <div className="h-4 skeleton-child rounded-full md:max-w-[300px] w-[180px]"></div>
          </div>

          <div className="skeleton-parent rounded-full mt-4 md:w-[330px] w-[240px]">
            <div className="h-3 skeleton-child  md:w-[330px] w-[240px]"></div>
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

      <div className="rounded-lg h-20 sm:h-24 md:h-28 lg:h-32 w-[25%] md:w-[12em] sm:max-w-[20%] lg:max-w-[100%] skeleton-parent animate-pulse">
        <div className="h-20 sm:h-24 md:h-28 lg:h-32  w-full skeleton-child"></div>
      </div>
    </div>
  );
});
