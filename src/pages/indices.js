import React from "react";
import { graphql } from "gatsby";
import { useTranslationWithVariables } from "../helpers/hooks/use-translation-with-vars";
import "../assets/styles/index.scss";
import Seo from "../components/shared/seo";
import IndicesContent from "../components/pages-content/indices-page-content";
import PageBackground from "../components/shared/page-background";

const IndicesPage = () => {
  const { t } = useTranslationWithVariables();

  return (
    <>
      <PageBackground backgroundType="homepage-bg-1">
        <Seo
          title={t("page-indices-title")}
          description={t("page-indices-description")}
        />
        <IndicesContent />
      </PageBackground>
    </>
  );
};

export default IndicesPage;

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
