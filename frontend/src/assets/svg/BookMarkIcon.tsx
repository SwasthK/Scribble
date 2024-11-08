import { memo } from "react";

export const BookMarkIcon = memo(
  ({ size, fill, onClick }: { size?: number; fill?: string; onClick: any }) => {
    return (
      <>
        <svg
          onClick={onClick}
          xmlns="http://www.w3.org/2000/svg"
          width={size || 24}
          height={size || 24}
          viewBox="0 0 24 24"
          fill={fill || "none"}
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="feather feather-bookmark cursor-pointer"
        >
          <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
        </svg>
      </>
    );
  }
);
