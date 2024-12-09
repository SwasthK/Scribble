import { Suspense } from "react";

const SuspendedComponent = (Component: React.FC) => {
  return (
    <Suspense fallback={<div className="overlay-loader"></div>}>
      <Component />
    </Suspense>
  );
};

export default SuspendedComponent;
