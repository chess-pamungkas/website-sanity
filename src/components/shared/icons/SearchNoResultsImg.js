import React from "react";
import { StaticImage } from "gatsby-plugin-image";

export const SearchNoResultsImg = ({ className }) => (
  <StaticImage
    className={className}
    src="../../../assets/images/search/search_no_results.svg"
    alt="no results"
  />
);
