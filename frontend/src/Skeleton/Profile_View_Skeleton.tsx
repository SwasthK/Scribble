import { memo } from "react";

export const Profile_View_About_Skeleton = memo(() => {
  return (
    <div className="w-full rounded-md  p-4 py-2 h-[430px]">
      <div className=" py-3 flex items-center gap-6">
        <div className="h-10 w-10 rounded-full skeleton-parent">
          <div className="h-10 w-10 rounded-full skeleton-child"></div>
        </div>
        <div>
          <h1 className="  mb-1 h-5 w-28 skeleton-parent rounded-md">
            <h1 className="  mb-1 h-7 w-28 skeleton-child"></h1>
          </h1>
          <h6 className=" h-3 w-12 skeleton-parent mt-2 rounded-md">
            <h6 className=" h-3 w-12 skeleton-child"></h6>
          </h6>
        </div>
      </div>
      <div className="py-2 flex flex-col gap-6 max-w-[400px] ml-2">
        <h1 className="h-2 w-7 skeleton-parent rounded-md">
          <h1 className=" h-2 w-7 skeleton-child"></h1>
        </h1>

        <h1 className="h-32 w-72 skeleton-parent rounded-md">
          <h1 className="h-32 w-72 skeleton-child"></h1>
        </h1>
      </div>
      <div className="py-2 flex flex-col gap-6 max-w-[400px] ml-2">
        <h1 className="ml-2 h-2 w-7 skeleton-parent rounded-md">
          <h1 className=" h-2 w-5 skeleton-child"></h1>
        </h1>
        <div className="flex justify-evenly">
          <div className="h-8 w-8 rounded-full skeleton-parent">
            <div className="h-8 w-8 rounded-full skeleton-child"></div>
          </div>
          <div className="h-8 w-8 rounded-full skeleton-parent">
            <div className="h-8 w-8 rounded-full skeleton-child"></div>
          </div>
          <div className="h-8 w-8 rounded-full skeleton-parent">
            <div className="h-8 w-8 rounded-full skeleton-child"></div>
          </div>
        </div>
      </div>
    </div>
  );
});

export const Profile_View_Posts_Skeleton = memo(() => {
  return (
    <div className="h-[430px] w-full rounded-md  p-4 py-2">
      <h1 className=" mt-4  mb-1 w-[6rem] h-6 rounded-md skeleton-parent">
        <h1 className="  w-[6rem] h-6 rounded-md skeleton-child"></h1>
      </h1>
      <h6 className="w-[7rem] mt-3 h-3 rounded-md   skeleton-parent">
        <h6 className="w-[7rem] h-3 rounded-md   skeleton-child"></h6>
      </h6>

      <h1 className="rounded-md skeleton-parent h-2 w-7 ml-2 mt-2 ">
        <h1 className="rounded-md skeleton-child h-2 w-7 "></h1>
      </h1>

      <div className="w-full flex  gap-4 flex-col">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            className="mt-4 flex gap-4 sm:h-20 overflow-hidden py-1 "
            key={i}
          >
            <div className="h-full rounded-md w-36 hidden sm:block skeleton-parent">
              <div className="h-full rounded-md w-36  hidden sm:block skeleton-child"></div>
            </div>
            <div className="flex p-3  flex-col gap-1 w-full overflow-hidden">
              <h1 className="w-80 rounded-md h-4 skeleton-parent">
                <h1 className="w-80 rounded-md h-4 skeleton-child"></h1>
              </h1>
              <h6 className="w-12 h-2 rounded-md skeleton-parent mt-2">
                <h6 className="w-12 h-2 rounded-md skeleton-child"></h6>
              </h6>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});
