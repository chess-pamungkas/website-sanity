import React from "react";
import "../../../assets/styles/flag-icons.scss";
import flagSrc from "../../../assets/images/icons/languages/my.svg";

export const MyFlagIcon = ({ className }) => (
  <span className={`flag-icon ${className || ""}`}>
    <img src={flagSrc} alt="my" width={20} height={20} loading="lazy" />
  </span>
);
