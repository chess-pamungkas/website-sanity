import React from "react";
import "../../../assets/styles/flag-icons.scss";
import flagSrc from "../../../assets/images/icons/languages/ar.svg";

export const ArFlagIcon = ({ className }) => (
  <span className={`flag-icon ${className || ""}`}>
    <img src={flagSrc} alt="ar" width={20} height={20} loading="lazy" />
  </span>
);
