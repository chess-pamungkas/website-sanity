import React, { useContext } from "react";
import PropTypes from "prop-types";
import CommonContext from "../../../context/common-context";
import { useWindowSize } from "../../../helpers/hooks/use-window-size";

const ContainerWrapper = ({ children }) => {
  const { heightOffset } = useContext(CommonContext);
  const { isDesktop } = useWindowSize();

  return (
    <main id="main-container">
      <div
        style={{
          height: `${isDesktop ? heightOffset : 0}px`,
        }}
        className="header-offset-placeholder"
      />
      <div className="container">{children}</div>
    </main>
  );
};

ContainerWrapper.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ContainerWrapper;
