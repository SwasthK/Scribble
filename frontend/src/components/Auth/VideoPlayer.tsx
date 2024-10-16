import { useState } from "react";

export const VideoPlayer = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const videoUrl =
    "https://cdn.pixabay.com/video/2020/03/13/33628-397860881_large.mp4";

  const handleCanPlay = () => {
    setIsLoading(false);
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  return (
    <div className="relative w-2/4 h-screen">
      {isLoading && !hasError && (
        <div className="loading-placeholder">
          <p>Loading video...</p>
          <div className="spinner"></div>
        </div>
      )}

      {hasError && (
        <div className="error-placeholder">
          <p>Failed to load video. Please try again later.</p>
        </div>
      )}

      {!hasError && (
        <video
          src={videoUrl}
          autoPlay
          muted
          loop
          onCanPlay={handleCanPlay}
          onLoadStart={() => setIsLoading(true)}
          onError={handleError}
          className="w-full h-full object-cover "
        />
      )}
    </div>
  );
};
