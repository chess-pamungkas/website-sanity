import React from "react";
import { ButtonContainer, ArrowIcon } from "../reusable-buttons";
import { ButtonPrimaryCommunity } from "../reusable-buttons";
import InternalLink from "../internal-link";
import { useRtlDirection } from "../../../helpers/hooks/use-rtl-direction";
import { useI18next } from "gatsby-plugin-react-i18next";

// Community section button pair
export const CommunityButtons = ({
  onPrimaryClick,
  onSecondaryClick,
  disabled = false,
  customPrimaryButton,
  customSecondaryButton,
}) => {
  const isRTL = useRtlDirection();
  const { navigate } = useI18next();

  // Use custom text if provided, otherwise use default fallback
  // Note: OurCommunityContent already handles translation, so we just use the text provided
  const primaryText = customPrimaryButton || "Open Demo Account";

  // Hide secondary button if customSecondaryButton is null, undefined, or empty string
  // If customSecondaryButton is explicitly null or undefined, hide the button
  // If it's an empty string, also hide it
  const showSecondaryButton =
    customSecondaryButton !== null &&
    customSecondaryButton !== undefined &&
    customSecondaryButton.trim() !== "";

  const secondaryText = showSecondaryButton
    ? customSecondaryButton || "Compare Account Types"
    : "";

  // Handle secondary link click
  // Always use navigate from useI18next to preserve language prefix
  // navigate from useI18next automatically adds language prefix (e.g., /my/accounts-type)
  const handleSecondaryLinkClick = (e) => {
    e.preventDefault();
    if (onSecondaryClick) {
      // If custom handler is provided, it should handle navigation itself
      // But we still use navigate here to ensure language prefix is preserved
      onSecondaryClick();
    } else {
      // navigate from useI18next automatically preserves language prefix
      navigate("/accounts-type");
    }
  };

  return (
    <ButtonContainer>
      <ButtonPrimaryCommunity
        text={primaryText}
        onClick={onPrimaryClick}
        disabled={disabled}
      />
      {showSecondaryButton && (
        <InternalLink
          to="/accounts-type"
          className="community-buttons__secondary-link"
          onClick={handleSecondaryLinkClick}
        >
          <span className="community-buttons__secondary-link-text">
            {secondaryText}
          </span>
          <span className="community-buttons__secondary-link-arrow">
            <ArrowIcon isRTL={isRTL} />
          </span>
        </InternalLink>
      )}
    </ButtonContainer>
  );
};

export default CommunityButtons;
