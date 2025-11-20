import React from "react";
import { Link } from "gatsby-plugin-react-i18next";
import cn from "classnames";
import PropTypes from "prop-types";
import { modifyInternalLinkForLP } from "../../../helpers/services/modify-internal-links";

const InternalLink = ({ children, className, to, onClick, ...rest }) => {
  to = modifyInternalLinkForLP(to);

  if (String(to).startsWith("http")) {
    return (
      <a href={to} className={cn(className)} onClick={onClick} {...rest}>
        {children}
      </a>
    );
  } else {
    return (
      <Link to={to} className={cn(className)} onClick={onClick} {...rest}>
        {children}
      </Link>
    );
  }
};

InternalLink.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  to: PropTypes.string.isRequired,
  onClick: PropTypes.func,
};
export default InternalLink;
