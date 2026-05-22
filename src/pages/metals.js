import React from "react";
import { graphql } from "gatsby";
import { Helmet } from "react-helmet";
import { useTranslationWithVariables } from "../helpers/hooks/use-translation-with-vars";
import "../assets/styles/index.scss";
import Seo from "../components/shared/seo";
import MetalsContent from "../components/pages-content/metals-page-content";
import PageBackground from "../components/shared/page-background";
import {
  HERO_ASSET_DESKTOP_MQ,
  HERO_ASSET_MOBILE_MQ,
} from "../helpers/viewport-media";

const METALS_LCP_DESKTOP = "/images/bg/hero/metals/metals-desktop.webp";
const METALS_LCP_MOBILE = "/images/bg/hero/metals/metals-mobile.webp";

const MetalsPage = () => {
  const { t } = useTranslationWithVariables();

  return (
    <PageBackground backgroundType="homepage-bg-1">
      <Helmet>
        <link
          rel="preload"
          as="image"
          type="image/webp"
          href={METALS_LCP_DESKTOP}
          media={HERO_ASSET_DESKTOP_MQ}
        />
        <link
          rel="preload"
          as="image"
          type="image/webp"
          href={METALS_LCP_MOBILE}
          media={HERO_ASSET_MOBILE_MQ}
        />
      </Helmet>
      <Seo
        title={t("page-metals-title")}
        description={t("page-metals-description")}
      />
      <MetalsContent />
    </PageBackground>
  );
};

export default MetalsPage;

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
