import React from "react";
import cn from "classnames";
import PropTypes from "prop-types";
import ErrorMessage from "../error-message";

const Input = ({
  type,
  title,
  name,
  value,
  isError,
  errorMessage,
  isHalfWidth = false,
  ...props
}) => {
  return (
    <div className={cn("input-wrapper")}>
      {title && <span className="input-title">{title}</span>}
      <input
        className="input"
        type={type}
        name={name}
        value={value}
        {...props}
      />
      {isError && <ErrorMessage text={errorMessage} />}
    </div>
  );
};

Input.propTypes = {
  type: PropTypes.string.isRequired,
  title: PropTypes.string,
  name: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  isError: PropTypes.bool,
  errorMessage: PropTypes.string,
  isHalfWidth: PropTypes.bool,
};
export default Input;
