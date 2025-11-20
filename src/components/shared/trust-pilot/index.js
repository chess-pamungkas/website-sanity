import React, { useEffect, useRef } from "react";
import PropTypes from "prop-types";

const TrustPilot = ({
  className = "",
  businessUnitId = "64ca3f86b3187fdf335b2740",
  templateId = "5419b732fbfb950b10de65e5",
  locale = "en-US",
  height = "24px",
  width = "100%",
  token = "5e065b16-d809-410f-ae86-bc22829c122d",
}) => {
  const widgetRef = useRef(null);

  // Load TrustPilot script exactly like the HTML implementation
  useEffect(() => {
    const loadTrustPilotScript = () => {
      // Check if script already exists
      const existingScript = document.querySelector(
        'script[src*="tp.widget.bootstrap.min.js"]'
      );
      if (existingScript) {
        return;
      }

      // Create script exactly like in HTML
      const script = document.createElement("script");
      script.type = "text/javascript";
      script.src =
        "//widget.trustpilot.com/bootstrap/v5/tp.widget.bootstrap.min.js";
      script.async = true;

      script.onload = () => {
        // Initialize TrustPilot widget after script loads
        if (window.Trustpilot && widgetRef.current) {
          window.Trustpilot.loadFromElement(widgetRef.current);
        }
      };

      script.onerror = (error) => {
        console.warn("Failed to load TrustPilot script:", error);
      };

      // Append to head like in HTML
      document.head.appendChild(script);
    };

    // Load script immediately
    loadTrustPilotScript();
  }, []);

  // Re-initialize widget when props change (e.g., language change)
  useEffect(() => {
    if (window.Trustpilot && widgetRef.current) {
      // Clear existing widget content
      widgetRef.current.innerHTML = "";

      // Re-initialize with new props
      window.Trustpilot.loadFromElement(widgetRef.current);
    }
  }, [locale, templateId, businessUnitId, token]);

  // Apply custom styling to iframe content
  useEffect(() => {
    const applyCustomStyling = () => {
      const iframe = widgetRef.current?.querySelector("iframe");
      if (iframe) {
        try {
          // Try to access iframe content (may fail due to CORS)
          const iframeDoc =
            iframe.contentDocument || iframe.contentWindow?.document;
          if (iframeDoc) {
            // Create style element for white text
            const style = iframeDoc.createElement("style");
            style.textContent = `
              * {
                color: #ffffff !important;
              }
              .tp-widget-wrapper * {
                color: #ffffff !important;
              }
              .tp-widget-wrapper {
                text-align: left !important;
              }
              #trust-score, .tp-widget-trustscore {
                color: #ffffff !important;
              }
              a#profile-link, #profile-link {
                color: #ffffff !important;
              }
            `;
            iframeDoc.head.appendChild(style);
          }
        } catch (e) {
          // CORS error - this is expected behavior for cross-origin iframes
          // CSS filter fallback is already applied via SCSS (trust-pilot.scss)
          // No need to log as this is normal and expected
        }
      }
    };

    // Apply styling after a short delay to ensure iframe is loaded
    const timer = setTimeout(applyCustomStyling, 1000);

    // Also try when iframe loads
    const iframe = widgetRef.current?.querySelector("iframe");
    if (iframe) {
      iframe.onload = applyCustomStyling;
    }

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`trust-pilot ${className}`}>
      {/* TrustBox widget - Micro Star - exactly like HTML */}
      <div
        ref={widgetRef}
        className="trustpilot-widget"
        data-locale={locale}
        data-template-id={templateId}
        data-businessunit-id={businessUnitId}
        data-style-height={height}
        data-style-width={width}
        data-token={token}
      >
        {/* No preload text - TrustPilot will render its own content */}
      </div>
      {/* End TrustBox widget */}
    </div>
  );
};

TrustPilot.propTypes = {
  className: PropTypes.string,
  businessUnitId: PropTypes.string,
  templateId: PropTypes.string,
  locale: PropTypes.string,
  height: PropTypes.string,
  width: PropTypes.string,
  token: PropTypes.string,
};

export default TrustPilot;
