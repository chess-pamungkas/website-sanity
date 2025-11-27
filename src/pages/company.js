import React from "react";
import { graphql } from "gatsby";
import { useTranslationWithVariables } from "../helpers/hooks/use-translation-with-vars";
import "../assets/styles/index.scss";
import Seo from "../components/shared/seo";
import CompanyPageContent from "../components/pages-content/company-page-content";
import PageBackground from "../components/shared/page-background";

const CompanyPage = () => {
  const { t } = useTranslationWithVariables();

  return (
    <PageBackground backgroundType="homepage-bg-1">
      <Seo
        title={t("page-company-title")}
        description={t("page-company-description")}
      />
      <CompanyPageContent />
    </PageBackground>
  );
};

export default CompanyPage;

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
