import { memo } from "react"


export const Saved_Post_Skeleton = memo(() => {
  return (
    <div role="status" className="skeleton-parent aspect-square rounded-lg">
        <div className="skeleton-child aspect-square rounded-lg">
        </div>
    </div>
  )
});
