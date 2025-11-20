import React from "react";
import cn from "classnames";
import PropTypes from "prop-types";
import { useRtlDirection } from "../../../../helpers/hooks/use-rtl-direction";
import LegalRegulatorItem from "../legal-regulator-item";

const LegalRegulators = ({ className, regulators }) => {
  const isRTL = useRtlDirection();

  return (
    <section
      className={cn("legal-regulators", className, {
        "legal-regulators--rtl": isRTL,
      })}
    >
      <div className="legal-regulators__wrapper">
        <div className="legal-regulators__items">
          {regulators.length > 0 &&
            regulators.map((item, index) => (
              <LegalRegulatorItem
                key={`regulator-${item.title}-${index}`}
                icon={item.icon}
                title={item.title}
                titleAccent={item.titleAccent}
                text={item.text}
                anchorLink={item.anchorLink}
                index={index}
              />
            ))}
        </div>
      </div>
    </section>
  );
};

LegalRegulators.propTypes = {
  className: PropTypes.string,
  regulators: PropTypes.arrayOf(
    PropTypes.shape({
      icon: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      titleAccent: PropTypes.string.isRequired,
      text: PropTypes.string.isRequired,
      anchorLink: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default LegalRegulators;
