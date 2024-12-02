import { memo } from "react";
import { SvgIconType } from "../../Types/type";

export const Next = memo(({ size }: SvgIconType) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height={`${size || 30}px`}
      viewBox="0 -960 960 960"
      width={`${size || 30}px`}
      fill="#e8eaed"
    >
      <path d="m320.23-107.69-42.54-42.54L607.46-480 277.69-809.77l42.54-42.54L692.54-480 320.23-107.69Z" />
    </svg>
  );
});
