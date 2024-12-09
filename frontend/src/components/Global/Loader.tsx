import { memo } from "react";

export const Loader = memo(({ progress }: { progress?: number }) => {
  return (
    <div
      className="flex w-screen h-screen justify-center items-center bg-black flex-col gap-4 z-[500]"
    >
      <div className="loader-container gap-2 ">
        <p className="text-white font-bold text-xl sm:text-2xl text-center blur-fade font-scribble2">
          Sribble
        </p>
        {progress && (
          <>
            <div
              className="progress-bar blur-fade"
              style={{ width: `${progress}%` }}
            ></div>
            <p className="text-[0.8rem] blur-fade">{progress}%</p>
          </>
        )}
      </div>
    </div>
  );
});
