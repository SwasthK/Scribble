import { Suspense } from "react";

const SuspendedComponent = (Component: React.FC) => {
  const FallbackUI = () => (
    <div className="h-screen bg-black text-white">
      <p>Loading...</p>
    </div>
  );

  return (
    <Suspense fallback={<FallbackUI />}>
      <Component />
    </Suspense>
  );
};

export default SuspendedComponent;
