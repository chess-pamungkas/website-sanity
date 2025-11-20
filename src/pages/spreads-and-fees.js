import React from "react";
import { graphql } from "gatsby";
import { useTranslationWithVariables } from "../helpers/hooks/use-translation-with-vars";
import "../assets/styles/index.scss";
import Seo from "../components/shared/seo";
import SpreadsAndFeesPageContent from "../components/pages-content/spreads-and-fees-page-content";
import PageBackground from "../components/shared/page-background";

const SpreadsFeesPage = () => {
  const { t } = useTranslationWithVariables();

  return (
    <PageBackground backgroundType="homepage-bg-2">
      <Seo
        title={t("page-spreads-title")}
        description={t("page-spreads-description")}
      />
      <SpreadsAndFeesPageContent />
    </PageBackground>
  );
};

export default SpreadsFeesPage;

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
