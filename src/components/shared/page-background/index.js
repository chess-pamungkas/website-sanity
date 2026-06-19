import React from "react";
import { useIsomorphicLayoutEffect } from "../../../helpers/hooks/use-isomorphic-layout-effect";

const PageBackground = ({ backgroundType = "homepage-bg-1", children }) => {
  // useLayoutEffect: apply before paint so first frame matches homepage layout rules
  // (useEffect runs after paint → extra style flush + forced reflow when JS reads geometry).
  useIsomorphicLayoutEffect(() => {
    document.body.classList.add(backgroundType);
    return () => {
      document.body.classList.remove(backgroundType);
    };
  }, [backgroundType]);

  return <>{children}</>;
};

export default PageBackground;
