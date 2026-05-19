import React from "react";
import "../../../assets/styles/flag-icons.scss";
import flagSrc from "../../../assets/images/icons/languages/pt.svg";

export const PtFlagIcon = ({ className }) => (
  <span className={`flag-icon ${className || ""}`}>
    <img src={flagSrc} alt="pt" width={20} height={20} loading="lazy" />
  </span>
);
