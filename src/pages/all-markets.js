import React from "react";
import { graphql } from "gatsby";
import { Helmet } from "react-helmet";
import { useTranslationWithVariables } from "../helpers/hooks/use-translation-with-vars";
import "../assets/styles/index.scss";
import Seo from "../components/shared/seo";
import AllMarkets from "../components/all-markets";
import PageBackground from "../components/shared/page-background";

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
          media="(min-width: 769px)"
        />
        <link
          rel="preload"
          as="image"
          type="image/webp"
          href={ALL_MARKETS_LCP_MOBILE}
          media="(max-width: 768px)"
        />
        {/* Hero fonts: <link rel="preload" as="font"> for Light/Regular/Medium/SemiBold — gatsby-ssr.js
            (all-markets path) so network dependency tree stays parallel with document (not chained off @font-face). */}
        {/* Trustpilot hints: gatsby-ssr adds dns-prefetch on non-home paths; avoid duplicate
            <link rel="preconnect"> here — Lighthouse flags it unused on /all-markets/ until widget loads. */}
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
