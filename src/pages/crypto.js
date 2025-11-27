import React from "react";
import { graphql } from "gatsby";
import { useTranslationWithVariables } from "../helpers/hooks/use-translation-with-vars";
import "../assets/styles/index.scss";
import Seo from "../components/shared/seo";
import CryptoContent from "../components/pages-content/crypto-page-content";
import PageBackground from "../components/shared/page-background";

const CryptoPage = () => {
  const { t } = useTranslationWithVariables();

  return (
    <>
      <PageBackground backgroundType="homepage-bg-1">
        <Seo
          fsaTitle={t("page-crypto-title-fsa")}
          fsaDescription={t("page-crypto-description-fsa")}
        />
        <CryptoContent />
      </PageBackground>
    </>
  );
};

export default CryptoPage;

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
