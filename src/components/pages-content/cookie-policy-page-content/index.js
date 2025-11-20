import React from "react";
import cn from "classnames";
import PropTypes from "prop-types";
import { useWindowSize } from "../../../helpers/hooks/use-window-size";
import CookiePolicyItem from "./cookie-policy-item";
import CookieTableDesktop from "./cookie-table-desktop";
import CookieTableMobile from "./cookie-table-mobile";
import {
  DATA_COOKIES,
  COOKIES_POLICY_CONTENT,
} from "../../../helpers/cookie-policy.config";

const CookiePolicyContent = ({ className }) => {
  const { isMobile } = useWindowSize();

  return (
    <section className={cn("privacy-policy", className)}>
      <div className="privacy-policy__wrapper">
        <h2 className="privacy-policy__title">{"Cookie Policy"}</h2>
        {COOKIES_POLICY_CONTENT.map((item, index) => (
          <CookiePolicyItem key={index} {...item} />
        ))}
        {isMobile ? (
          <CookieTableMobile data={DATA_COOKIES} />
        ) : (
          <CookieTableDesktop data={DATA_COOKIES} />
        )}
      </div>
    </section>
  );
};

CookiePolicyContent.propTypes = {
  className: PropTypes.string,
};

export default CookiePolicyContent;
