import { memo } from "react";
import { cn } from "../../lib/utils";

export const CtaButton = memo(
  ({
    label1,
    label2,
    onClick1,
    onClick2,
    className1,
    className2,
    disabled
  }: {
    label1: string;
    label2: string;
    onClick1?: any;
    onClick2?: any;
    className1?: string;
    className2?: string;
    disabled?: boolean;
  }) => {
 
    return (
      <>
        <button
          disabled={disabled}
          onClick={onClick1}
          className={cn(
            `text-sm sm:text-base px-3 py-2 sm:px-10 sm:py-5 rounded-full border text-black bg-white disabled:cursor-not-allowed`,
            className1
          )}
        >
          {label1}
        </button>
        <button
          disabled={disabled}
          onClick={onClick2}
          className={cn(
            "text-sm sm:text-base font-scribble2 px-4 py-2 sm:px-10 sm:py-5 rounded-full border text-white bg-cdark-300 disabled:cursor-not-allowed",
            className2
          )}
        >
          {label2}
        </button>
      </>
    );
  }
);
