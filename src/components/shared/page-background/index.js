import React, { useEffect } from "react";

const PageBackground = ({ backgroundType = "homepage-bg-1", children }) => {
  useEffect(() => {
    // Add background class to body
    document.body.classList.add(backgroundType);

    // Cleanup function to remove background class when component unmounts
    return () => {
      document.body.classList.remove(backgroundType);
    };
  }, [backgroundType]);

  return <>{children}</>;
};

export default PageBackground;
