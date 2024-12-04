import { memo } from "react";
import { useNavigate } from "react-router-dom";
import { cn } from "../../lib/utils";

export const CtaButton = memo(
  ({
    label1,
    label2,
    url1,
    url2,
    className1,
    className2,
  }: {
    label1: string;
    label2: string;
    url1: string;
    url2: string;
    className1?: string;
    className2?: string;
  }) => {
    const navigate = useNavigate();
    return (
      <>
        <button
          onClick={() => navigate(url1)}
          className={cn(
            `px-3 py-3.5 sm:px-10 sm:py-5 rounded-full border text-black bg-white `,
            className1
          )}
        >
          {label1}
        </button>
        <button
          onClick={() => navigate(url2)}
          className={cn(
            "font-scribble2 px-6 py-2 sm:px-10 sm:py-5 rounded-full border text-white bg-cdark-300",
            className2
          )}
        >
          {label2}
        </button>
      </>
    );
  }
);
