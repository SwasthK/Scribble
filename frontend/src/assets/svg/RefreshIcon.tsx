import { memo } from "react";

interface RefreshIconProps {
  onClick: any;
  size?: number;
  disabled?: boolean;
  className?: string;
}

export const RefreshIcon = memo(
  ({ onClick, size, disabled, className }: RefreshIconProps) => {
    console.log(onClick);
    return (
      <>
        <button onClick={onClick} disabled={disabled}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width={size || 24}
            height={size || 24}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`${className} feather feather-refresh-ccw transform transition-transform duration-300 hover:rotate-[-180deg]`}
          >
            <polyline points="1 4 1 10 7 10"></polyline>
            <polyline points="23 20 23 14 17 14"></polyline>
            <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"></path>
          </svg>
        </button>
      </>
    );
  }
);
