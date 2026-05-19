import React from "react";
import { graphql } from "gatsby";
import { Helmet } from "react-helmet";
import { useTranslationWithVariables } from "../helpers/hooks/use-translation-with-vars";
import "../assets/styles/index.scss";
import Seo from "../components/shared/seo";
import CryptoContent from "../components/pages-content/crypto-page-content";
import PageBackground from "../components/shared/page-background";

const CRYPTO_LCP_DESKTOP = "/images/bg/hero/crypto/crypto-desktop.webp";
const CRYPTO_LCP_MOBILE = "/images/bg/hero/crypto/crypto-mobile.webp";

const CryptoPage = () => {
  const { t } = useTranslationWithVariables();

  return (
    <>
      <PageBackground backgroundType="homepage-bg-1">
        <Helmet>
          <link
            rel="preload"
            as="image"
            type="image/webp"
            href={CRYPTO_LCP_DESKTOP}
            media="(min-width: 769px)"
          />
          <link
            rel="preload"
            as="image"
            type="image/webp"
            href={CRYPTO_LCP_MOBILE}
            media="(max-width: 768px)"
          />
        </Helmet>
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
