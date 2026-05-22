import React from "react";
import PropTypes from "prop-types";
import ErrorMessage from "../error-message";

const Textarea = ({
  title,
  name,
  id,
  value,
  isError,
  errorMessage,
  ...props
}) => {
  const ROWS_COUNT = 4;
  const textareaId = id || (name ? `field-${name}` : undefined);

  return (
    <div className="input-wrapper">
      {title && textareaId && (
        <label className="input-title" htmlFor={textareaId}>
          {title}
        </label>
      )}
      <textarea
        className="input textarea"
        id={textareaId}
        name={name}
        value={value}
        rows={ROWS_COUNT}
        {...props}
      />
      {isError && <ErrorMessage text={errorMessage} />}
    </div>
  );
};

Textarea.propTypes = {
  title: PropTypes.string,
  id: PropTypes.string,
  name: PropTypes.string.isRequired,
  value: PropTypes.string,
  isError: PropTypes.bool,
  errorMessage: PropTypes.string,
};
export default Textarea;
