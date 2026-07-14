import React from "react";
import PropTypes from "prop-types";

/**
 * Visible banner when Trading Hub SSR is in Sanity draft preview mode.
 */
const SanityPreviewBanner = ({ enabled }) => {
  if (!enabled) return null;

  return (
    <div
      role="status"
      style={{
        position: "sticky",
        top: 0,
        zIndex: 9999,
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
      }}
    >
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
  );
};

SanityPreviewBanner.propTypes = {
  enabled: PropTypes.bool,
};

SanityPreviewBanner.defaultProps = {
  enabled: false,
};

export default SanityPreviewBanner;
