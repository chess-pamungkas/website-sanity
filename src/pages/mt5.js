import React from "react";
import { graphql } from "gatsby";
import { useTranslationWithVariables } from "../helpers/hooks/use-translation-with-vars";
import "../assets/styles/index.scss";
import Seo from "../components/shared/seo";
import Mt5PageContent from "../components/pages-content/mt5-page-content";
import PageBackground from "../components/shared/page-background";

const MT5Page = () => {
  const { t } = useTranslationWithVariables();

  return (
    <PageBackground backgroundType="homepage-bg-1">
      <Seo
        fsaTitle={t("page-mt5-title")}
        fsaDescription={t("page-mt5-description")}
        cysecTitle={t("page-mt5-title")}
        cysecDescription={t("page-mt5-description")}
      />
      <Mt5PageContent />
    </PageBackground>
  );
};

export default MT5Page;

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
