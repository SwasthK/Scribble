import { memo } from "react";

export const Loader = memo(() => {
    return (
      <div
        role="status"
        className="flex w-screen h-screen justify-center items-center bg-black flex-col gap-4"
      >
        <div className="loader"></div>
        <h1 className="text-white font-bold text-xl text-center uppercase">
          Medium
        </h1>
      </div>
    );
  });
  