import React, { useLayoutEffect } from "react";

const PageBackground = ({ backgroundType = "homepage-bg-1", children }) => {
  // useLayoutEffect: apply before paint so first frame matches homepage layout rules
  // (useEffect runs after paint → extra style flush + forced reflow when JS reads geometry).
  useLayoutEffect(() => {
    document.body.classList.add(backgroundType);
    return () => {
      document.body.classList.remove(backgroundType);
    };
  }, [backgroundType]);

  return <>{children}</>;
};

export default PageBackground;
