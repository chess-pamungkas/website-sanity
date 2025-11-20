import React from "react";
import ReusableButtons from "../../../shared/reusable-buttons";
import { useRtlDirection } from "../../../../helpers/hooks/use-rtl-direction";

const { ArrowIcon } = ReusableButtons;
// import ArrowIcon from "../../../../../assets/images/icons/arrow-right.svg";

// Custom button components for accounts-type page to avoid CSS conflicts

// Base Button Component
const BaseButton = ({
  className,
  children,
  onClick,
  disabled = false,
  type = "button",
  ...props
}) => (
  <button
    type={type}
    className={className}
    onClick={onClick}
    disabled={disabled}
    {...props}
  >
    {children}
  </button>
);

// Using shared ArrowIcon component with RTL support

export const ButtonPrimaryComparisonAccountsType = ({
  text = "Start ECN+",
  onClick,
  disabled = false,
  showArrow = true,
  ...props
}) => {
  const isRTL = useRtlDirection();

  return (
    <BaseButton
      className="button-primary-comparison-accounts-type"
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      <span className="button-text">{text}</span>
      {showArrow && (
        <span className="button-arrow">
          <ArrowIcon isRTL={isRTL} />
        </span>
      )}
    </BaseButton>
  );
};

export const ButtonSecondaryComparisonAccountsType = ({
  text = "Try a Demo Account",
  onClick,
  disabled = false,
  showArrow = true,
  ...props
}) => {
  const isRTL = useRtlDirection();

  return (
    <BaseButton
      className="button-secondary-comparison-accounts-type"
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      <span className="button-text">{text}</span>
      {showArrow && (
        <span className="button-arrow">
          <ArrowIcon isRTL={isRTL} />
        </span>
      )}
    </BaseButton>
  );
};

export const ButtonPrimaryComparisonZeroAccountsType = ({
  text = "Start Zero+",
  onClick,
  disabled = false,
  showArrow = true,
  ...props
}) => {
  const isRTL = useRtlDirection();

  return (
    <BaseButton
      className="button-primary-comparison-zero-accounts-type"
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      <span className="button-text">{text}</span>
      {showArrow && (
        <span className="button-arrow">
          <ArrowIcon isRTL={isRTL} />
        </span>
      )}
    </BaseButton>
  );
};
