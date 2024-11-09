import { memo } from "react";

export const Archived_Post_Skeleton = memo(() => {
  return (
    <>
      <div
        role="status"
        className="w-full flex gap-4 justify-start items-center pr-2"
      >
        <div className="skeleton-parent h-16 w-16 rounded-md">
          <div className="skeleton-child h-16 w-16"></div>
        </div>
        <div className="flex justify-between items-center gap-5 ">
          <div className="flex flex-col gap-2">
            <div className="min-w-[12.5rem] h-4 skeleton-parent rounded-md">
              <div className="min-w-[12.5rem] h-4 skeleton-child"></div>
            </div>
            <div className="w-16 h-4 font-semibold  skeleton-parent rounded-md">
              <div className="w-16 h-4 font-semibold  skeleton-child"></div>
            </div>
          </div>
          <div className="h-6 w-6 skeleton-parent rounded-md">
            <div className="h-6 w-6 skeleton-child"></div>
          </div>
        </div>
      </div>
    </>
  );
});
