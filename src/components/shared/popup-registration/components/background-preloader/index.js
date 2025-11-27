import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import popupRegistrationBg from "../../../../../assets/images/bg/popup-registration/bg-popup-registration.svg";

const BackgroundPreloader = ({ onBackgroundLoaded, children }) => {
  const [isBackgroundLoaded, setIsBackgroundLoaded] = useState(false);

  useEffect(() => {
    // Preload the background image
    const img = new Image();
    img.onload = () => {
      setIsBackgroundLoaded(true);
      if (onBackgroundLoaded) {
        onBackgroundLoaded();
      }
    };
    img.onerror = () => {
      // Even if image fails to load, mark as loaded to prevent infinite waiting
      setIsBackgroundLoaded(true);
      if (onBackgroundLoaded) {
        onBackgroundLoaded();
      }
    };

    // Set the image source to preload via webpack-managed asset
    img.src = popupRegistrationBg;

    // Fallback timeout in case image takes too long
    const timeout = setTimeout(() => {
      setIsBackgroundLoaded(true);
      if (onBackgroundLoaded) {
        onBackgroundLoaded();
      }
    }, 2000); // 2 second timeout

    return () => {
      clearTimeout(timeout);
    };
  }, [onBackgroundLoaded]);

  return (
    <div className={isBackgroundLoaded ? "background-loaded" : ""}>
      {children}
    </div>
  );
};

BackgroundPreloader.propTypes = {
  onBackgroundLoaded: PropTypes.func,
  children: PropTypes.node.isRequired,
};

export default BackgroundPreloader;
