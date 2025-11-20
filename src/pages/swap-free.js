import React from "react";
import { graphql } from "gatsby";
import { useTranslationWithVariables } from "../helpers/hooks/use-translation-with-vars";
import "../assets/styles/index.scss";
import Seo from "../components/shared/seo";
import SwapFreeContent from "../components/pages-content/swap-free-page-content";
import PageBackground from "../components/shared/page-background";

const SwapFreePage = () => {
  const { t } = useTranslationWithVariables();

  return (
    <PageBackground backgroundType="homepage-bg-2">
      <Seo
        fsaTitle={t("page-swap-free-title")}
        fsaDescription={t("page-swap-free-description")}
      />
      <SwapFreeContent />
    </PageBackground>
  );
};

export default SwapFreePage;

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
