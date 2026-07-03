import React, { useContext } from "react";
import PropTypes from "prop-types";
import cn from "classnames";
import CommonContext from "../../../context/common-context";

const ContainerWrapper = ({ children, className }) => {
  const { heightOffset } = useContext(CommonContext);

  return (
    <div id="main-container" className={cn(className)}>
      <div
        className="header-offset-placeholder"
        style={{ "--header-offset-px": `${heightOffset}px` }}
        suppressHydrationWarning
      />
      <div className="container">{children}</div>
    </div>
  );
};

ContainerWrapper.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

export default ContainerWrapper;
