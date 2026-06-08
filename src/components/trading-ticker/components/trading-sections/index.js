import React, { useEffect, useState } from "react";
import cn from "classnames";
import PropTypes from "prop-types";
import TradingSectionTitle from "../trading-section-title";
import TradingSectionsMobileDropdown from "../trading-sections-mobile-dropdown";
import {
  MOBILE_VIEWPORT_MQ,
  isMobileViewportMedia,
} from "../../../../helpers/viewport-media";

const TradingSections = ({
  className,
  title,
  selectedSection,
  setSelectedSection,
  tradingSection,
}) => {
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== "undefined" ? isMobileViewportMedia() : false
  );

  useEffect(() => {
    const mq = window.matchMedia(MOBILE_VIEWPORT_MQ);
    const sync = () => setIsMobile(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  return (
    <div className={cn("trading-sections-wrapper container", className)}>
      {title ? (
        <div className="trading-sections">
          <h4 className="trading-sections__header">{title}</h4>
        </div>
      ) : (
        <div className="trading-sections">
          {isMobile ? (
            <TradingSectionsMobileDropdown
              selectedSection={selectedSection}
              setSelectedSection={setSelectedSection}
              tradingSection={tradingSection}
            />
          ) : (
            tradingSection.map((section) => (
              <TradingSectionTitle
                key={`tradingSection${section.id}`}
                section={section}
                selectedSection={selectedSection}
                setSelectedSection={setSelectedSection}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
};

TradingSections.propTypes = {
  className: PropTypes.string,
  title: PropTypes.string,
  selectedSection: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
  }).isRequired,
  setSelectedSection: PropTypes.func.isRequired,
  tradingSection: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default TradingSections;
