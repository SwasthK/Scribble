import { memo } from "react";

export const Comment_Skeleton = memo(() => {
  return (
    <div role="status">
      <div className="mb-4 h-4 w-16 ml-3 rounded-md skeleton-parent">
        <div className=" h-4 w-16 skeleton-child"></div>
      </div>
      {Array.from({ length: 3 }).map((_, i) => (
        <div className="space-y-7 pl-6">
          <div key={i} className="flex gap-5 mb-4">
            <div className="h-6 w-6 rounded-full skeleton-parent">
              <div className="h-6 w-6 rounded-full skeleton-child"></div>
            </div>
            <div className="flex flex-col gap-3 w-full">
              <div className="flex flex-col gap-2 w-full">
                <div className="h-3 skeleton-parent w-1/5 rounded-md">
                  <div className="h-3 skeleton-child w-1/5 rounded-md"></div>
                </div>
                <div className="h-4 skeleton-parent w-3/6 rounded-md">
                  <div className="h-4 skeleton-child w-3/6 rounded-md"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
});
