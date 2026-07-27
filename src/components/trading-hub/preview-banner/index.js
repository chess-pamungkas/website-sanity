import React, { useEffect } from "react";
import PropTypes from "prop-types";

const BANNER_HEIGHT = "44px";
const BANNER_CSS_VAR = "--sanity-preview-banner-height";

const BANNER_STYLE = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  width: "100%",
  zIndex: 100000,
  background: "#1a1a1a",
  color: "#fff",
  padding: "10px 16px",
  display: "flex",
  gap: "12px",
  alignItems: "center",
  justifyContent: "center",
  flexWrap: "wrap",
  fontSize: "14px",
  lineHeight: 1.4,
  boxSizing: "border-box",
  minHeight: BANNER_HEIGHT,
};

const SPACER_STYLE = {
  height: BANNER_HEIGHT,
  width: "100%",
  flexShrink: 0,
};

/**
 * Visible banner when Trading Hub SSR is in Sanity draft preview mode.
 * Fixed to the viewport so Exit preview stays visible while scrolling.
 */
const SanityPreviewBanner = ({ enabled }) => {
  useEffect(() => {
    if (!enabled || typeof document === "undefined") return undefined;

    document.documentElement.style.setProperty(BANNER_CSS_VAR, BANNER_HEIGHT);
    document.body.classList.add("sanity-preview-active");

    return () => {
      document.documentElement.style.removeProperty(BANNER_CSS_VAR);
      document.body.classList.remove("sanity-preview-active");
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <>
      <div aria-hidden="true" style={SPACER_STYLE} />
      <div role="status" style={BANNER_STYLE}>
        <span>
          Draft preview — unpublished Sanity content. Not visible on public
          published view.
        </span>
        <a
          href="/api/exit-preview?slug=/trading-hub/"
          style={{ color: "#ffb74d", fontWeight: 600 }}
        >
          Exit preview
        </a>
      </div>
    </>
  );
};

SanityPreviewBanner.propTypes = {
  enabled: PropTypes.bool,
};

SanityPreviewBanner.defaultProps = {
  enabled: false,
};

export default SanityPreviewBanner;
