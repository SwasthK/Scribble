import { memo } from "react";

export const FollowerCard_Skeleton = memo(() => {
  return (
    <div className=" px-4 p-2 flex  gap-3 items-center w-72">
      <div className="h-8 w-8 rounded-full skeleton-parent">
        <div className="h-8 w-8 rounded-full skeleton-child"></div>
      </div>
      <div className="w-32 h-4 skeleton-parent rounded-md">
        <div className="w-32 h-4 skeleton-child"></div>
      </div>
    </div>
  );
});
