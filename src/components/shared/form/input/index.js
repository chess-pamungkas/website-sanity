import React from "react";
import cn from "classnames";
import PropTypes from "prop-types";
import ErrorMessage from "../error-message";

const Input = ({
  type,
  title,
  name,
  id,
  value,
  isError,
  errorMessage,
  isHalfWidth = false,
  ...props
}) => {
  const inputId = id || (name ? `field-${name}` : undefined);

  return (
    <div className={cn("input-wrapper")}>
      {title && inputId && (
        <label className="input-title" htmlFor={inputId}>
          {title}
        </label>
      )}
      <input
        className="input"
        id={inputId}
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
  id: PropTypes.string,
  name: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  isError: PropTypes.bool,
  errorMessage: PropTypes.string,
  isHalfWidth: PropTypes.bool,
};
export default Input;
