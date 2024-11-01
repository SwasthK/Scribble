import { memo } from "react";

type cancelSvgProps = {
  color?: string;
  size?: number;
  onClick?: any;
  className?: string;
};

export const Cancel = memo(
  ({ color, size, onClick, className }: cancelSvgProps) => {
    return (
      <svg
        onClick={onClick}
        xmlns="http://www.w3.org/2000/svg"
        width={size || 24}
        height={size || 24}
        viewBox="0 0 24 24"
        fill="none"
        stroke={color || "currentColor"}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`${className} feather feather-x-circle}`}
      >
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="15" y1="9" x2="9" y2="15"></line>
        <line x1="9" y1="9" x2="15" y2="15"></line>
      </svg>
    );
  }
);
