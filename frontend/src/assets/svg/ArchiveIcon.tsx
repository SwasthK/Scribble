import { memo } from "react";
import { SvgIconType } from "../../Types/type";

export const ArchiveIcon = memo(({ size, className }: SvgIconType) => {
  return (
    <div>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size || "24"}
        height={size || "24"}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`${className} feather feather-archive`}
      >
        <polyline points="21 8 21 21 3 21 3 8"></polyline>
        <rect x="1" y="3" width="22" height="5"></rect>
        <line x1="10" y1="12" x2="14" y2="12"></line>
      </svg>
    </div>
  );
});
