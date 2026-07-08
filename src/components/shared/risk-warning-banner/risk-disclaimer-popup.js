import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import PropTypes from "prop-types";
import {
  RISK_DISCLAIMER_POPUP_DESCRIPTION,
  RISK_DISCLAIMER_POPUP_TITLE,
} from "./risk-disclaimer-content";
import {
  lockBodyScroll,
  notifyScrollPositionChange,
  unlockBodyScroll,
} from "../../../helpers/scroll-lock";

const CloseIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path
      d="M6.4 19L5 17.6L10.6 12L5 6.4L6.4 5L12 10.6L17.6 5L19 6.4L13.4 12L19 17.6L17.6 19L12 13.4L6.4 19Z"
      fill="white"
    />
  </svg>
);

const RiskDisclaimerPopup = ({ isOpen, onClose }) => {
  const [mounted, setMounted] = useState(false);
  const closeButtonRef = useRef(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const scrollY = window.scrollY;
    const appRoot = document.getElementById("gatsby-focus-wrapper");

    lockBodyScroll(scrollY);

    if (appRoot) {
      appRoot.setAttribute("inert", "");
      appRoot.setAttribute("aria-hidden", "true");
    }

    closeButtonRef.current?.focus();

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
      }

      if (event.key === "Tab") {
        event.preventDefault();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    notifyScrollPositionChange();

    return () => {
      if (appRoot) {
        appRoot.removeAttribute("inert");
        appRoot.removeAttribute("aria-hidden");
      }

      window.removeEventListener("keydown", handleKeyDown);
      unlockBodyScroll(scrollY);
      notifyScrollPositionChange();
    };
  }, [isOpen, onClose]);

  if (!mounted || !isOpen || typeof document === "undefined") {
    return null;
  }

  return createPortal(
    <div className="risk-disclaimer-popup">
      <div className="risk-disclaimer-popup__backdrop" aria-hidden="true" />
      <div
        className="risk-disclaimer-popup__dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="risk-disclaimer-popup-title"
      >
        <button
          ref={closeButtonRef}
          type="button"
          className="risk-disclaimer-popup__close"
          onClick={onClose}
          aria-label="Close"
        >
          <CloseIcon />
        </button>
        <h2
          id="risk-disclaimer-popup-title"
          className="risk-disclaimer-popup__title"
        >
          {RISK_DISCLAIMER_POPUP_TITLE}
        </h2>
        <p className="risk-disclaimer-popup__description">
          {RISK_DISCLAIMER_POPUP_DESCRIPTION}
        </p>
      </div>
    </div>,
    document.body
  );
};

RiskDisclaimerPopup.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default RiskDisclaimerPopup;
