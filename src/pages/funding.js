import React from "react";
import { graphql } from "gatsby";
import { useTranslationWithVariables } from "../helpers/hooks/use-translation-with-vars";
import "../assets/styles/index.scss";
import Seo from "../components/shared/seo";
import FundingPageContent from "../components/pages-content/funding-page-content";
import PageBackground from "../components/shared/page-background";

const FundingPage = () => {
  const { t } = useTranslationWithVariables();

  return (
    <PageBackground backgroundType="homepage-bg-2">
      <Seo
        title={t("page-withdrawal-title")}
        description={t("page-withdrawal-description")}
      />
      <FundingPageContent />
    </PageBackground>
  );
};

export default FundingPage;

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
