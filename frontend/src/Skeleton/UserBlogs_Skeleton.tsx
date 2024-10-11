import { memo } from "react";

export const UserBlogs_Skeleton = memo(() => {
  return (
    <div className="" role="status">
      <div className="w-96 cursor-pointer transition-colors duration-300 ease-in max-w-72 pb-6 rounded-2xl flex flex-col gap-6 justify-center items-center md:max-w-60">
        <div className=" skeleton-parent  w-full sm:max-w-full  rounded-2xl  ">
          <div className="aspect-video  skeleton-child"></div>
        </div>
        <div className="w-full sm:max-w-full flex flex-col gap-3 justify-center items-center ">
          <div className="h-6  w-full skeleton-parent rounded-md">
            <h1 className="skeleton-child h-6  w-full"></h1>
          </div>

          <div className="h-3 w-full skeleton-parent rounded-md">
            <h6 className="h-3 skeleton-child"></h6>
          </div>
          <div className="h-3 w-full">
            <div className="h-3 w-16 flex items-start skeleton-parent rounded-md">
              <div className=" w-16 h-3 skeleton-child"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});
