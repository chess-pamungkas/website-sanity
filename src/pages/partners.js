import React from "react";
import { graphql } from "gatsby";
import { useTranslationWithVariables } from "../helpers/hooks/use-translation-with-vars";
import "../assets/styles/index.scss";
import Seo from "../components/shared/seo";
import PartnersPageContent from "../components/pages-content/partners-page-content";
import PageBackground from "../components/shared/page-background";

const PartnersPage = () => {
  const { t } = useTranslationWithVariables();

  return (
    <PageBackground backgroundType="homepage-bg-1">
      <Seo
        fsaTitle={t("page-partners-title")}
        fsaDescription={t("page-partners-description")}
      />
      <PartnersPageContent />
    </PageBackground>
  );
};

export default PartnersPage;

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
