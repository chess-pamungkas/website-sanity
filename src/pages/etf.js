import React from "react";
import { graphql } from "gatsby";
import { useTranslationWithVariables } from "../helpers/hooks/use-translation-with-vars";
import "../assets/styles/index.scss";
import Seo from "../components/shared/seo";
import ETFContent from "../components/pages-content/etf-page-content";
import PageBackground from "../components/shared/page-background";

const ETFPage = () => {
  const { t } = useTranslationWithVariables();

  return (
    <>
      <PageBackground backgroundType="homepage-bg-1">
        <Seo
          title={t("page-etf-title")}
          description={t("page-etf-description")}
        />
        <ETFContent />
      </PageBackground>
    </>
  );
};

export default ETFPage;

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
