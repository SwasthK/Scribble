import { memo } from "react";

export const Category_Skeleton = memo(() => {
  return (
    <>
      <div className="h-[350px] px-4" role="status">
        <div className="p-8">
          <div className="h-6 w-48 rounded-md skeleton-parent">
            <div className="h-6 w-48 rounded-md skeleton-child"></div>
          </div>
        </div>
        <div className="mb-8 h-24 rounded-md skeleton-parent">
          <div className="  h-24 rounded-md skeleton-child"></div>
        </div>
        <div className="mb-8 h-24 rounded-md skeleton-parent">
          <div className="  h-24 rounded-md skeleton-child"></div>
        </div>
      </div>
    </>
  );
});
