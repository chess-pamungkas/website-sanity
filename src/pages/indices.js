import React from "react";
import { graphql } from "gatsby";
import { Helmet } from "react-helmet";
import { useTranslationWithVariables } from "../helpers/hooks/use-translation-with-vars";
import "../assets/styles/index.scss";
import Seo from "../components/shared/seo";
import IndicesContent from "../components/pages-content/indices-page-content";
import PageBackground from "../components/shared/page-background";
import {
  HERO_ASSET_DESKTOP_MQ,
  HERO_ASSET_MOBILE_MQ,
} from "../helpers/viewport-media";

const INDICES_LCP_DESKTOP = "/images/bg/hero/indices/indices-desktop.webp";
const INDICES_LCP_MOBILE = "/images/bg/hero/indices/indices-mobile.webp";

const IndicesPage = () => {
  const { t } = useTranslationWithVariables();

  return (
    <>
      <PageBackground backgroundType="homepage-bg-1">
        <Helmet>
          <link
            rel="preload"
            as="image"
            type="image/webp"
            href={INDICES_LCP_DESKTOP}
            media={HERO_ASSET_DESKTOP_MQ}
          />
          <link
            rel="preload"
            as="image"
            type="image/webp"
            href={INDICES_LCP_MOBILE}
            media={HERO_ASSET_MOBILE_MQ}
          />
        </Helmet>
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
