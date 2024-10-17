export const DraftCardSkeleton = () => {
  return (
    <div role="status">
      <div className="skeleton-parent max-w-[28rem] w-full h-40 rounded-lg">
        <div className="skeleton-child max-w-[28rem] w-full h-40"></div>
      </div>
    </div>
  );
};
