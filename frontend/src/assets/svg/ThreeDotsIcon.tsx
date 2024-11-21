import { memo } from "react";
import { SvgIconType } from "../../Types/type";

export const ThreeDotsIcon = memo(({ size, className }: SvgIconType) => {
  return (
    <>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size || "16"}
        height={size || "16"}
        fill="currentColor"
        className={`${className} bi bi-three-dots-vertical`}
        viewBox="0 0 16 16"
      >
        <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0" />
      </svg>
    </>
  );
});
