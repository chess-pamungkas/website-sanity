import React from "react";
import "../../../assets/styles/flag-icons.scss";
import flagSrc from "../../../assets/images/icons/languages/jp.svg";

export const JpFlagIcon = ({ className }) => (
  <span className={`flag-icon ${className || ""}`}>
    <img src={flagSrc} alt="jp" width={20} height={20} loading="lazy" />
  </span>
);
