import React from "react";
import { graphql } from "gatsby";
import { useTranslationWithVariables } from "../helpers/hooks/use-translation-with-vars";
import "../assets/styles/index.scss";
import Seo from "../components/shared/seo";
import TradingToolsPageContent from "../components/pages-content/trading-tools-page-content";
import PageBackground from "../components/shared/page-background";

const TradingToolsPage = () => {
  const { t } = useTranslationWithVariables();

  return (
    <PageBackground backgroundType="homepage-bg-1">
      <Seo title={t("page-trading-tools-title")} />
      <TradingToolsPageContent />
    </PageBackground>
  );
};

export default TradingToolsPage;

export const query = graphql`
  query ($language: String!) {
    locales: allLocale(filter: { language: { eq: $language } }) {
      edges {
        node {
          ns
          data
          language
        }
      }
    }
  }
`;
