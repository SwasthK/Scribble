import { memo } from "react";

const FollowersSearchBarErrors = memo(({ label }: { label: string }) => {
  return (
    <div className="px-10 rounded-md font-semibold">
      <h1>{label}</h1>
    </div>
  );
});

export default FollowersSearchBarErrors;
