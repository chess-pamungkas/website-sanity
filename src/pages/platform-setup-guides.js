import React from "react";
import { useTranslationWithVariables } from "../helpers/hooks/use-translation-with-vars";
import PageBackground from "../components/shared/page-background";

const PlatformSetupGuidesPage = () => {
  const { t } = useTranslationWithVariables();

  return (
    <PageBackground backgroundType="homepage-bg-1">
      <div style={{ padding: "40px 20px", textAlign: "center" }}>
        <h1 style={{ fontSize: "2.5rem", marginBottom: "20px" }}>
          {t("header-nav-tab-trading-hub-platform-setup-guides-title")}
        </h1>
        <p
          style={{
            fontSize: "1.2rem",
            color: "#666",
            maxWidth: "600px",
            margin: "0 auto",
          }}
        >
          {t("header-nav-tab-trading-hub-platform-setup-guides-desc")}
        </p>
        <div
          style={{
            marginTop: "40px",
            padding: "20px",
            backgroundColor: "#f5f5f5",
            borderRadius: "8px",
          }}
        >
          <p style={{ color: "#888" }}>
            This page is currently under development. Content will be added
            soon.
          </p>
        </div>
      </div>
    </PageBackground>
  );
};

export default PlatformSetupGuidesPage;
