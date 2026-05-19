import React from "react";
import "../../../assets/styles/flag-icons.scss";
import flagSrc from "../../../assets/images/icons/languages/de.svg";

export const DeFlagIcon = ({ className }) => (
  <span className={`flag-icon ${className || ""}`}>
    <img src={flagSrc} alt="de" width={20} height={20} loading="lazy" />
  </span>
);
