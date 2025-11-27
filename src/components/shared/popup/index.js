import React from "react";
import ReactDOM from "react-dom";
import cn from "classnames";
import PropTypes from "prop-types";

const Popup = ({
  className,
  children,
  isPopupOpen = false,
  handlePopupClose = () => {},
}) => {
  const popupContent = (
    <div className={cn("popup", { "popup--active": isPopupOpen }, className)}>
      {/* Close the popup on outer wrapper click */}
      <div
        className={cn("popup__wrapper")}
        onClick={handlePopupClose}
        role="presentation"
      >
        {/* Prevent from closing the popup on content click */}
        <div
          className="popup__content"
          onClick={(e) => e.stopPropagation()}
          role="presentation"
        >
          <div className="popup__header"></div>
          <div className="popup__body">{children}</div>
        </div>
      </div>
    </div>
  );

  // Use portal to render at document body level
  return ReactDOM.createPortal(popupContent, document.body);
};

Popup.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
  isPopupOpen: PropTypes.bool,
  handlePopupClose: PropTypes.func,
};
export default Popup;
