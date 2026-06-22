import React from "react";
import { graphql } from "gatsby";
import { Helmet } from "react-helmet";
import { useTranslationWithVariables } from "../helpers/hooks/use-translation-with-vars";
import "../assets/styles/index.scss";
import Seo from "../components/shared/seo";
import AllMarkets from "../components/all-markets";
import PageBackground from "../components/shared/page-background";
import {
  HERO_ASSET_DESKTOP_MQ,
  HERO_ASSET_MOBILE_MQ,
} from "../helpers/viewport-media";

const ALL_MARKETS_LCP_DESKTOP =
  "/images/bg/hero/all-markets/all-markets-desktop.webp";
const ALL_MARKETS_LCP_MOBILE =
  "/images/bg/hero/all-markets/all-markets-mobile.webp";

const AllMarketsPage = () => {
  const { t } = useTranslationWithVariables();

  return (
    <PageBackground backgroundType="homepage-bg-1">
      <Helmet>
        <link
          rel="preload"
          as="image"
          type="image/webp"
          href={ALL_MARKETS_LCP_DESKTOP}
          media={HERO_ASSET_DESKTOP_MQ}
        />
        <link
          rel="preload"
          as="image"
          type="image/webp"
          href={ALL_MARKETS_LCP_MOBILE}
          media={HERO_ASSET_MOBILE_MQ}
        />
      </Helmet>
      <Seo
        title={t("page-allmarkets-title")}
        description={t("page-allmarkets-description")}
      />
      <AllMarkets />
    </PageBackground>
  );
};

export default AllMarketsPage;

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
