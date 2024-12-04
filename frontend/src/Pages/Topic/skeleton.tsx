import { memo } from "react";

const Topic_Skeleton = memo(() => {
  return (
    <>
      {Array.from({ length: 3 }).map((_, index) => (
        <div key={index} className="flex flex-col gap-2 mb-3  p-4 m-1 pb-6 ">
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
  );
});

export default Topic_Skeleton;
