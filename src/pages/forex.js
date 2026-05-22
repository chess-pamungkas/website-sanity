import React from "react";
import { graphql } from "gatsby";
import { Helmet } from "react-helmet";
import { useTranslationWithVariables } from "../helpers/hooks/use-translation-with-vars";
import "../assets/styles/index.scss";
import Seo from "../components/shared/seo";
import ForexContent from "../components/pages-content/forex-page-content";
import PageBackground from "../components/shared/page-background";
import {
  HERO_ASSET_DESKTOP_MQ,
  HERO_ASSET_MOBILE_MQ,
} from "../helpers/viewport-media";

const FOREX_LCP_DESKTOP = "/images/bg/hero/forex/forex-desktop.webp";
const FOREX_LCP_MOBILE = "/images/bg/hero/forex/forex-mobile.webp";

const ForexPage = () => {
  const { t } = useTranslationWithVariables();

  return (
    <PageBackground backgroundType="homepage-bg-1">
      <Helmet>
        <link
          rel="preload"
          as="image"
          type="image/webp"
          href={FOREX_LCP_DESKTOP}
          media={HERO_ASSET_DESKTOP_MQ}
        />
        <link
          rel="preload"
          as="image"
          type="image/webp"
          href={FOREX_LCP_MOBILE}
          media={HERO_ASSET_MOBILE_MQ}
        />
      </Helmet>
      <Seo
        title={t("page-forex-title")}
        description={t("page-forex-description")}
      />
      <ForexContent />
    </PageBackground>
  );
};

export default ForexPage;

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
