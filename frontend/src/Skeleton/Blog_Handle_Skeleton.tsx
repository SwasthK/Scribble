export const Blog_Handle_Skeleton = () => {
  return (
    <div
      role="status"
      className="flex justify-center items-center px-8 py-8 sm:px-16 flex-col gap-8"
    >
      <div className="skeleton-parent w-[95%] h-12  max-w-[800px] flex items-center justify-between  rounded-full">
        <div className="skeleton-child  w-[95%] h-12  max-w-[800px] "></div>
      </div>
      <div className="skeleton-parent w-[90%] max-w-[800px] h-[60vh]  rounded-lg">
        <div className="skeleton-child h-[60vh] "></div>
      </div>
    </div>
  );
};
