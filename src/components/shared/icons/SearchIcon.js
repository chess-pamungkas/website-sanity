import React from "react";

export const SearchIcon = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="23.784"
    height="23.707"
    viewBox="0 0 23.784 23.707"
    className={className}
  >
    <g id="Group_684" data-name="Group 684" transform="translate(0 0)">
      <g
        id="Ellipse_7"
        data-name="Ellipse 7"
        transform="translate(0 0)"
        fill="none"
        stroke="#fff"
        strokeWidth="2"
      >
        <circle cx="10.5" cy="10.5" r="10.5" stroke="none" />
        <circle cx="10.5" cy="10.5" r="9.5" fill="none" />
      </g>
      <line
        id="Line_57"
        data-name="Line 57"
        x2="4.512"
        y2="4.512"
        transform="translate(18.565 18.488)"
        fill="none"
        stroke="#fff"
        strokeWidth="2"
      />
    </g>
  </svg>
);

// Keep AngleDownIcon for backward compatibility (uses ChevronDownIcon from critical)
import { ChevronDownIcon } from "./critical";
