import React, { useEffect } from "react";
import cn from "classnames";
import { useTranslationWithVariables } from "../../../helpers/hooks/use-translation-with-vars";
import { useRtlDirection } from "../../../helpers/hooks/use-rtl-direction";

// FORCE ARROW FLIP COMPONENT - NUCLEAR JAVASCRIPT OPTION
const ForceArrowFlip = () => {
  const isRTL = useRtlDirection();

  useEffect(() => {
    const forceArrowFlip = () => {
      if (isRTL) {
        // Force all button arrows to flip
        const buttonArrows = document.querySelectorAll(".button-arrow svg");
        buttonArrows.forEach((arrow) => {
          arrow.style.setProperty("transform", "scaleX(-1)", "important");
          arrow.style.setProperty(
            "-webkit-transform",
            "scaleX(-1)",
            "important"
          );
          arrow.style.setProperty("-moz-transform", "scaleX(-1)", "important");
          arrow.style.setProperty("-ms-transform", "scaleX(-1)", "important");
        });

        // Force MT4 badge arrows to flip
        const mt4Arrows = document.querySelectorAll(
          ".mt4__badge-arrow svg, .mt4__badge-arrow"
        );
        mt4Arrows.forEach((arrow) => {
          arrow.style.setProperty("transform", "scaleX(-1)", "important");
          arrow.style.setProperty(
            "-webkit-transform",
            "scaleX(-1)",
            "important"
          );
          arrow.style.setProperty("-moz-transform", "scaleX(-1)", "important");
          arrow.style.setProperty("-ms-transform", "scaleX(-1)", "important");
        });

        // Force MT5 badge arrows to flip
        const mt5Arrows = document.querySelectorAll(
          ".mt5__badge-arrow svg, .mt5__badge-arrow"
        );
        mt5Arrows.forEach((arrow) => {
          arrow.style.setProperty("transform", "scaleX(-1)", "important");
          arrow.style.setProperty(
            "-webkit-transform",
            "scaleX(-1)",
            "important"
          );
          arrow.style.setProperty("-moz-transform", "scaleX(-1)", "important");
          arrow.style.setProperty("-ms-transform", "scaleX(-1)", "important");
        });

        // Force company badge arrows to flip
        const companyArrows = document.querySelectorAll(
          ".company__badge-arrow svg, .company__badge-arrow"
        );
        companyArrows.forEach((arrow) => {
          arrow.style.setProperty("transform", "scaleX(-1)", "important");
          arrow.style.setProperty(
            "-webkit-transform",
            "scaleX(-1)",
            "important"
          );
          arrow.style.setProperty("-moz-transform", "scaleX(-1)", "important");
          arrow.style.setProperty("-ms-transform", "scaleX(-1)", "important");
        });

        // Force contact us badge arrows to flip
        const contactUsArrows = document.querySelectorAll(
          ".contact-us__badge-arrow svg, .contact-us__badge-arrow"
        );
        contactUsArrows.forEach((arrow) => {
          arrow.style.setProperty("transform", "scaleX(-1)", "important");
          arrow.style.setProperty(
            "-webkit-transform",
            "scaleX(-1)",
            "important"
          );
          arrow.style.setProperty("-moz-transform", "scaleX(-1)", "important");
          arrow.style.setProperty("-ms-transform", "scaleX(-1)", "important");
        });

        // Force legal badge arrows to flip
        const legalArrows = document.querySelectorAll(
          ".legal__badge-arrow svg, .legal__badge-arrow"
        );
        legalArrows.forEach((arrow) => {
          arrow.style.setProperty("transform", "scaleX(-1)", "important");
          arrow.style.setProperty(
            "-webkit-transform",
            "scaleX(-1)",
            "important"
          );
          arrow.style.setProperty("-moz-transform", "scaleX(-1)", "important");
          arrow.style.setProperty("-ms-transform", "scaleX(-1)", "important");
        });

        // Force partners badge arrows to flip
        const partnersArrows = document.querySelectorAll(
          ".partners__badge-arrow svg, .partners__badge-arrow"
        );
        partnersArrows.forEach((arrow) => {
          arrow.style.setProperty("transform", "scaleX(-1)", "important");
          arrow.style.setProperty(
            "-webkit-transform",
            "scaleX(-1)",
            "important"
          );
          arrow.style.setProperty("-moz-transform", "scaleX(-1)", "important");
          arrow.style.setProperty("-ms-transform", "scaleX(-1)", "important");
        });

        // Force market sentiment button arrows to flip
        const marketSentimentArrows = document.querySelectorAll(
          ".market-sentiment__btn .button-arrow svg"
        );
        marketSentimentArrows.forEach((arrow) => {
          arrow.style.setProperty("transform", "scaleX(-1)", "important");
          arrow.style.setProperty(
            "-webkit-transform",
            "scaleX(-1)",
            "important"
          );
          arrow.style.setProperty("-moz-transform", "scaleX(-1)", "important");
          arrow.style.setProperty("-ms-transform", "scaleX(-1)", "important");
        });

        // Force all-markets badge arrows to flip
        const allMarketsArrows = document.querySelectorAll(
          ".all-markets__badge-arrow svg, .all-markets__badge-arrow"
        );
        allMarketsArrows.forEach((arrow) => {
          arrow.style.setProperty("transform", "scaleX(-1)", "important");
          arrow.style.setProperty(
            "-webkit-transform",
            "scaleX(-1)",
            "important"
          );
          arrow.style.setProperty("-moz-transform", "scaleX(-1)", "important");
          arrow.style.setProperty("-ms-transform", "scaleX(-1)", "important");
        });

        // Force crypto badge arrows to flip
        const cryptoArrows = document.querySelectorAll(
          ".crypto__badge-arrow svg, .crypto__badge-arrow"
        );
        cryptoArrows.forEach((arrow) => {
          arrow.style.setProperty("transform", "scaleX(-1)", "important");
          arrow.style.setProperty(
            "-webkit-transform",
            "scaleX(-1)",
            "important"
          );
          arrow.style.setProperty("-moz-transform", "scaleX(-1)", "important");
          arrow.style.setProperty("-ms-transform", "scaleX(-1)", "important");
        });

        // Force indices badge arrows to flip
        const indicesArrows = document.querySelectorAll(
          ".indices__badge-arrow svg, .indices__badge-arrow"
        );
        indicesArrows.forEach((arrow) => {
          arrow.style.setProperty("transform", "scaleX(-1)", "important");
          arrow.style.setProperty(
            "-webkit-transform",
            "scaleX(-1)",
            "important"
          );
          arrow.style.setProperty("-moz-transform", "scaleX(-1)", "important");
          arrow.style.setProperty("-ms-transform", "scaleX(-1)", "important");
        });

        // Force metals badge arrows to flip
        const metalsArrows = document.querySelectorAll(
          ".metals__badge-arrow svg, .metals__badge-arrow"
        );
        metalsArrows.forEach((arrow) => {
          arrow.style.setProperty("transform", "scaleX(-1)", "important");
          arrow.style.setProperty(
            "-webkit-transform",
            "scaleX(-1)",
            "important"
          );
          arrow.style.setProperty("-moz-transform", "scaleX(-1)", "important");
          arrow.style.setProperty("-ms-transform", "scaleX(-1)", "important");
        });

        // Force shares badge arrows to flip
        const sharesArrows = document.querySelectorAll(
          ".shares__badge-arrow svg, .shares__badge-arrow"
        );
        sharesArrows.forEach((arrow) => {
          arrow.style.setProperty("transform", "scaleX(-1)", "important");
          arrow.style.setProperty(
            "-webkit-transform",
            "scaleX(-1)",
            "important"
          );
          arrow.style.setProperty("-moz-transform", "scaleX(-1)", "important");
          arrow.style.setProperty("-ms-transform", "scaleX(-1)", "important");
        });

        // Force energies badge arrows to flip
        const energiesArrows = document.querySelectorAll(
          ".energies__badge-arrow svg, .energies__badge-arrow"
        );
        energiesArrows.forEach((arrow) => {
          arrow.style.setProperty("transform", "scaleX(-1)", "important");
          arrow.style.setProperty(
            "-webkit-transform",
            "scaleX(-1)",
            "important"
          );
          arrow.style.setProperty("-moz-transform", "scaleX(-1)", "important");
          arrow.style.setProperty("-ms-transform", "scaleX(-1)", "important");
        });

        // Force ETF badge arrows to flip
        const etfArrows = document.querySelectorAll(
          ".etf__badge-arrow svg, .etf__badge-arrow"
        );
        etfArrows.forEach((arrow) => {
          arrow.style.setProperty("transform", "scaleX(-1)", "important");
          arrow.style.setProperty(
            "-webkit-transform",
            "scaleX(-1)",
            "important"
          );
          arrow.style.setProperty("-moz-transform", "scaleX(-1)", "important");
          arrow.style.setProperty("-ms-transform", "scaleX(-1)", "important");
        });

        // Force account types badge arrows to flip
        const accountTypesArrows = document.querySelectorAll(
          ".account-types__badge-arrow svg, .account-types__badge-arrow"
        );
        accountTypesArrows.forEach((arrow) => {
          arrow.style.setProperty("transform", "scaleX(-1)", "important");
          arrow.style.setProperty(
            "-webkit-transform",
            "scaleX(-1)",
            "important"
          );
          arrow.style.setProperty("-moz-transform", "scaleX(-1)", "important");
          arrow.style.setProperty("-ms-transform", "scaleX(-1)", "important");
        });

        // Force funding-withdrawals badge arrows to flip
        const fundingWithdrawalsArrows = document.querySelectorAll(
          ".funding-withdrawals__badge-arrow svg, .funding-withdrawals__badge-arrow"
        );
        fundingWithdrawalsArrows.forEach((arrow) => {
          arrow.style.setProperty("transform", "scaleX(-1)", "important");
          arrow.style.setProperty(
            "-webkit-transform",
            "scaleX(-1)",
            "important"
          );
          arrow.style.setProperty("-moz-transform", "scaleX(-1)", "important");
          arrow.style.setProperty("-ms-transform", "scaleX(-1)", "important");
        });

        // Force spreads-fees badge arrows to flip
        const spreadsFeesArrows = document.querySelectorAll(
          ".spreads-fees__badge-arrow svg, .spreads-fees__badge-arrow"
        );
        spreadsFeesArrows.forEach((arrow) => {
          arrow.style.setProperty("transform", "scaleX(-1)", "important");
          arrow.style.setProperty(
            "-webkit-transform",
            "scaleX(-1)",
            "important"
          );
          arrow.style.setProperty("-moz-transform", "scaleX(-1)", "important");
          arrow.style.setProperty("-ms-transform", "scaleX(-1)", "important");
        });

        // Force trading-tools badge arrows to flip
        const tradingToolsArrows = document.querySelectorAll(
          ".trading-tools__badge-arrow svg, .trading-tools__badge-arrow"
        );
        tradingToolsArrows.forEach((arrow) => {
          arrow.style.setProperty("transform", "scaleX(-1)", "important");
          arrow.style.setProperty(
            "-webkit-transform",
            "scaleX(-1)",
            "important"
          );
          arrow.style.setProperty("-moz-transform", "scaleX(-1)", "important");
          arrow.style.setProperty("-ms-transform", "scaleX(-1)", "important");
        });

        // Force vps badge arrows to flip
        const vpsArrows = document.querySelectorAll(
          ".vps__badge-arrow svg, .vps__badge-arrow"
        );
        vpsArrows.forEach((arrow) => {
          arrow.style.setProperty("transform", "scaleX(-1)", "important");
          arrow.style.setProperty(
            "-webkit-transform",
            "scaleX(-1)",
            "important"
          );
          arrow.style.setProperty("-moz-transform", "scaleX(-1)", "important");
          arrow.style.setProperty("-ms-transform", "scaleX(-1)", "important");
        });

        // Force forex badge arrows to flip
        const forexArrows = document.querySelectorAll(
          ".forex__badge-arrow svg, .forex__badge-arrow"
        );
        forexArrows.forEach((arrow) => {
          arrow.style.setProperty("transform", "scaleX(-1)", "important");
          arrow.style.setProperty(
            "-webkit-transform",
            "scaleX(-1)",
            "important"
          );
          arrow.style.setProperty("-moz-transform", "scaleX(-1)", "important");
          arrow.style.setProperty("-ms-transform", "scaleX(-1)", "important");
        });

        // Force navbar dropdown arrows to flip
        const navbarArrows = document.querySelectorAll(
          ".navbar-dropdown-highlight__button-arrow svg"
        );
        navbarArrows.forEach((arrow) => {
          arrow.style.setProperty("transform", "scaleX(-1)", "important");
          arrow.style.setProperty(
            "-webkit-transform",
            "scaleX(-1)",
            "important"
          );
          arrow.style.setProperty("-moz-transform", "scaleX(-1)", "important");
          arrow.style.setProperty("-ms-transform", "scaleX(-1)", "important");
        });

        // Force navbar dropdown arrow containers to flip
        const navbarArrowContainers = document.querySelectorAll(
          ".navbar-dropdown-highlight__button-arrow"
        );
        navbarArrowContainers.forEach((container) => {
          container.style.setProperty("transform", "scaleX(-1)", "important");
          container.style.setProperty(
            "-webkit-transform",
            "scaleX(-1)",
            "important"
          );
          container.style.setProperty(
            "-moz-transform",
            "scaleX(-1)",
            "important"
          );
          container.style.setProperty(
            "-ms-transform",
            "scaleX(-1)",
            "important"
          );
        });

        // Force dropdown item arrows to flip
        const dropdownItemArrows = document.querySelectorAll(
          ".dropdown-item__link::after, .dropdown-item::after"
        );
        dropdownItemArrows.forEach((arrow) => {
          arrow.style.setProperty(
            "transform",
            "translateY(-50%) scaleX(-1)",
            "important"
          );
          arrow.style.setProperty(
            "-webkit-transform",
            "translateY(-50%) scaleX(-1)",
            "important"
          );
          arrow.style.setProperty(
            "-moz-transform",
            "translateY(-50%) scaleX(-1)",
            "important"
          );
          arrow.style.setProperty(
            "-ms-transform",
            "translateY(-50%) scaleX(-1)",
            "important"
          );
        });

        // Force main promotion badge arrows to flip
        const mainPromotionArrows = document.querySelectorAll(
          ".main-promotion__badge-arrow svg, .main-promotion__badge-arrow"
        );
        mainPromotionArrows.forEach((arrow) => {
          arrow.style.setProperty("transform", "scaleX(-1)", "important");
          arrow.style.setProperty(
            "-webkit-transform",
            "scaleX(-1)",
            "important"
          );
          arrow.style.setProperty("-moz-transform", "scaleX(-1)", "important");
          arrow.style.setProperty("-ms-transform", "scaleX(-1)", "important");
        });

        // Force swap-free badge arrows to flip
        const swapFreeArrows = document.querySelectorAll(
          ".swap-free__badge-arrow svg, .swap-free__badge-arrow"
        );
        swapFreeArrows.forEach((arrow) => {
          arrow.style.setProperty("transform", "scaleX(-1)", "important");
          arrow.style.setProperty(
            "-webkit-transform",
            "scaleX(-1)",
            "important"
          );
          arrow.style.setProperty("-moz-transform", "scaleX(-1)", "important");
          arrow.style.setProperty("-ms-transform", "scaleX(-1)", "important");
        });

        // Force navbar item partners icons to flip
        const partnersIcons = document.querySelectorAll(
          ".navbar-item__icon--partners svg, .navbar-item__icon--partners"
        );
        partnersIcons.forEach((icon) => {
          icon.style.setProperty("transform", "scaleX(-1)", "important");
          icon.style.setProperty(
            "-webkit-transform",
            "scaleX(-1)",
            "important"
          );
          icon.style.setProperty("-moz-transform", "scaleX(-1)", "important");
          icon.style.setProperty("-ms-transform", "scaleX(-1)", "important");
        });

        console.log(
          "FORCED ARROW FLIP: Found",
          buttonArrows.length,
          "button arrows,",
          navbarArrows.length,
          "navbar arrows,",
          navbarArrowContainers.length,
          "navbar arrow containers,",
          dropdownItemArrows.length,
          "dropdown item arrows,",
          mainPromotionArrows.length,
          "main promotion badge arrows, and",
          partnersIcons.length,
          "partners icons"
        );
      }
    };

    // Run immediately
    forceArrowFlip();

    // Run multiple times with different delays to catch all scenarios
    setTimeout(forceArrowFlip, 500);
    setTimeout(forceArrowFlip, 1000);
    setTimeout(forceArrowFlip, 2000);
    setTimeout(forceArrowFlip, 3000);

    // Use requestAnimationFrame for maximum priority
    const runWithRAF = () => {
      requestAnimationFrame(() => {
        forceArrowFlip();
        requestAnimationFrame(() => {
          forceArrowFlip();
        });
      });
    };

    runWithRAF();
    setTimeout(runWithRAF, 100);
    setTimeout(runWithRAF, 500);

    // Run on DOM changes
    const observer = new MutationObserver(forceArrowFlip);
    observer.observe(document.body, { childList: true, subtree: true });

    // Also run on window load
    window.addEventListener("load", forceArrowFlip);

    // Run on every scroll and resize
    window.addEventListener("scroll", forceArrowFlip);
    window.addEventListener("resize", forceArrowFlip);

    return () => {
      observer.disconnect();
      window.removeEventListener("load", forceArrowFlip);
      window.removeEventListener("scroll", forceArrowFlip);
      window.removeEventListener("resize", forceArrowFlip);
    };
  }, []);

  return null; // This component doesn't render anything
};

// Arrow SVG component
export const ArrowIcon = ({ isRTL = false }) => {
  // Use the hook for consistent RTL detection
  const hookRTL = useRtlDirection();
  const shouldFlip = isRTL || hookRTL;

  // FORCE the transform with !important
  const transformStyle = shouldFlip ? "scaleX(-1) !important" : "none";

  // Define different paths for LTR and RTL
  const ltrPath =
    "M1 5.50004H10.3333M10.3333 5.50004L5.66667 0.833374M10.3333 5.50004L5.66667 10.1667";
  const rtlPath =
    "M10.3333 5.50004H1M1 5.50004L5.66667 0.833374M1 5.50004L5.66667 10.1667";

  return (
    <svg
      width="9.33"
      height="9.33"
      viewBox="0 0 11 11"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={shouldFlip ? "arrow-rtl" : ""}
      style={{
        transform: transformStyle,
        display: "inline-block",
        WebkitTransform: transformStyle,
        MozTransform: transformStyle,
        msTransform: transformStyle,
      }}
      ref={(el) => {
        if (el && shouldFlip) {
          // Force apply the transform directly to the element
          el.style.setProperty("transform", "scaleX(-1)", "important");
          el.style.setProperty("-webkit-transform", "scaleX(-1)", "important");
          el.style.setProperty("-moz-transform", "scaleX(-1)", "important");
          el.style.setProperty("-ms-transform", "scaleX(-1)", "important");
        }
      }}
    >
      <path
        d={shouldFlip ? rtlPath : ltrPath}
        stroke="currentColor"
        strokeWidth="1.3333"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

// Base Button Component
const BaseButton = ({
  className,
  children,
  onClick,
  disabled = false,
  type = "button",
  ...props
}) => {
  const isRTL = useRtlDirection();

  return (
    <>
      <button
        type={type}
        className={cn(className, isRTL && `${className}--rtl`)}
        onClick={onClick}
        disabled={disabled}
        {...props}
      >
        {React.Children.map(children, (child) => {
          if (React.isValidElement(child) && child.type === ArrowIcon) {
            return React.cloneElement(child, { isRTL });
          }
          return child;
        })}
      </button>
    </>
  );
};

// ========================================
// SCENARIO 1: Hero Section Buttons
// ========================================

export const ButtonPrimaryHero = ({
  text = "Start Trading",
  onClick,
  disabled = false,
  showArrow = true,
  className,
  ...props
}) => {
  const isRTL = useRtlDirection();
  const finalRTL = isRTL;

  return (
    <BaseButton
      className={cn("button-primary-hero", className)}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      <span className="button-text">{text}</span>
      {showArrow && (
        <span className="button-arrow">
          <ArrowIcon isRTL={finalRTL} />
        </span>
      )}
    </BaseButton>
  );
};

export const ButtonSecondaryHero = ({
  text = "Try a Demo Account",
  onClick,
  disabled = false,
  showArrow = true,
  ...props
}) => {
  const isRTL = useRtlDirection();
  const finalRTL = isRTL;

  return (
    <BaseButton
      className="button-secondary-hero"
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      <span className="button-text">{text}</span>
      {showArrow && (
        <span className="button-arrow">
          <ArrowIcon isRTL={finalRTL} />
        </span>
      )}
    </BaseButton>
  );
};

// ========================================
// SCENARIO 2: Standard Buttons (Red Background)
// ========================================

export const ButtonPrimaryStandard = ({
  text = "Start Trading",
  onClick,
  disabled = false,
  showArrow = true,
  ...props
}) => {
  const isRTL = useRtlDirection();

  return (
    <BaseButton
      className="button-primary-standard"
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

export const ButtonSecondaryStandard = ({
  text = "Try a Demo Account",
  onClick,
  disabled = false,
  showArrow = true,
  ...props
}) => {
  const isRTL = useRtlDirection();

  return (
    <BaseButton
      className="button-secondary-standard"
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

// ========================================
// SCENARIO 3: Our Community Buttons
// ========================================

export const ButtonPrimaryCommunity = ({
  text = "Open Demo Account",
  onClick,
  disabled = false,
  showArrow = true,
  ...props
}) => (
  <BaseButton
    className="button-primary-community"
    onClick={onClick}
    disabled={disabled}
    {...props}
  >
    <span className="button-text">{text}</span>
    {showArrow && (
      <span className="button-arrow">
        <ArrowIcon />
      </span>
    )}
  </BaseButton>
);

export const ButtonSecondaryCommunity = ({
  text = "Compare Account Types",
  onClick,
  disabled = false,
  showArrow = true,
  ...props
}) => (
  <BaseButton
    className="button-secondary-community"
    onClick={onClick}
    disabled={disabled}
    {...props}
  >
    <span className="button-text">{text}</span>
    {showArrow && (
      <span className="button-arrow">
        <ArrowIcon />
      </span>
    )}
  </BaseButton>
);

// ========================================
// SCENARIO 4: Account Comparison Buttons (Fixed Width)
// ========================================

export const ButtonPrimaryComparison = ({
  text = "Start ECN+",
  onClick,
  disabled = false,
  showArrow = true,
  ...props
}) => (
  <BaseButton
    className="button-primary-comparison"
    onClick={onClick}
    disabled={disabled}
    {...props}
  >
    <span className="button-text">{text}</span>
    {showArrow && (
      <span className="button-arrow">
        <ArrowIcon />
      </span>
    )}
  </BaseButton>
);

export const ButtonSecondaryComparison = ({
  text = "Try a Demo Account",
  onClick,
  disabled = false,
  showArrow = true,
  ...props
}) => (
  <BaseButton
    className="button-secondary-comparison"
    onClick={onClick}
    disabled={disabled}
    {...props}
  >
    <span className="button-text">{text}</span>
    {showArrow && (
      <span className="button-arrow">
        <ArrowIcon />
      </span>
    )}
  </BaseButton>
);

// OQtimaOne specific button (transparent background)
export const ButtonPrimaryComparisonZero = ({
  text = "Start OQtimaOne",
  onClick,
  disabled = false,
  showArrow = true,
  ...props
}) => (
  <BaseButton
    className="button-primary-comparison-zero"
    onClick={onClick}
    disabled={disabled}
    {...props}
  >
    <span className="button-text">{text}</span>
    {showArrow && (
      <span className="button-arrow">
        <ArrowIcon />
      </span>
    )}
  </BaseButton>
);

// ========================================
// SCENARIO 5: Learn More Button (Transparent to Red)
// ========================================

export const ButtonLearnMore = ({
  text = "Learn More",
  onClick,
  disabled = false,
  showArrow = false,
  ...props
}) => (
  <BaseButton
    className="button-learn-more"
    onClick={onClick}
    disabled={disabled}
    {...props}
  >
    <span className="button-text">{text}</span>
    <span className="button-arrow">
      <ArrowIcon />
    </span>
  </BaseButton>
);

// ========================================
// Button Container Components
// ========================================

export const ButtonContainer = ({ children, className = "", ...props }) => (
  <div className={`button-container ${className}`} {...props}>
    {children}
  </div>
);

export const ButtonContainerComparison = ({
  children,
  className = "",
  ...props
}) => (
  <div className={`button-container-comparison ${className}`} {...props}>
    {children}
  </div>
);

// ========================================
// Convenience Components for Common Use Cases
// ========================================

// Hero section button pair
export const HeroButtons = ({
  primaryText = "Start Trading",
  secondaryText = "Try a Demo Account",
  onPrimaryClick,
  onSecondaryClick,
  disabled = false,
}) => (
  <ButtonContainer>
    <ButtonPrimaryHero
      text={primaryText}
      onClick={onPrimaryClick}
      disabled={disabled}
    />
    <ButtonSecondaryHero
      text={secondaryText}
      onClick={onSecondaryClick}
      disabled={disabled}
    />
  </ButtonContainer>
);

// Standard section button pair
export const StandardButtons = ({
  primaryText = "Start Trading",
  secondaryText = "Try a Demo Account",
  onPrimaryClick,
  onSecondaryClick,
  disabled = false,
}) => (
  <ButtonContainer>
    <ButtonPrimaryStandard
      text={primaryText}
      onClick={onPrimaryClick}
      disabled={disabled}
    />
    <ButtonSecondaryStandard
      text={secondaryText}
      onClick={onSecondaryClick}
      disabled={disabled}
    />
  </ButtonContainer>
);

// Account comparison button pairs
export const AccountComparisonButtons = ({
  ecnOnClick,
  ecnDemoOnClick,
  zeroOnClick,
  zeroDemoOnClick,
  disabled = false,
}) => (
  <ButtonContainerComparison>
    {/* <ButtonContainer> */}
    <ButtonPrimaryComparison
      text="Start ECN+"
      onClick={ecnOnClick}
      disabled={disabled}
    />
    <ButtonSecondaryComparison
      text="Try a Demo Account"
      onClick={ecnDemoOnClick}
      disabled={disabled}
    />
    {/* </ButtonContainer>
    <ButtonContainer> */}
    <ButtonPrimaryComparisonZero
      text="Start OQtimaOne+"
      onClick={zeroOnClick}
      disabled={disabled}
    />
    <ButtonSecondaryComparison
      text="Try a Demo Account"
      onClick={zeroDemoOnClick}
      disabled={disabled}
    />
    {/* </ButtonContainer> */}
  </ButtonContainerComparison>
);

export default {
  // Individual buttons
  ButtonPrimaryHero,
  ButtonSecondaryHero,
  ButtonPrimaryStandard,
  ButtonSecondaryStandard,
  ButtonPrimaryCommunity,
  ButtonSecondaryCommunity,
  ButtonPrimaryComparison,
  ButtonSecondaryComparison,
  ButtonPrimaryComparisonZero,
  ButtonLearnMore,

  // Containers
  ButtonContainer,
  ButtonContainerComparison,

  // Convenience components
  HeroButtons,
  StandardButtons,
  AccountComparisonButtons,

  // Arrow icon
  ArrowIcon,
};
