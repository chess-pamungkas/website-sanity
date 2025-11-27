import React from "react";
import { graphql } from "gatsby";
import { useTranslationWithVariables } from "../helpers/hooks/use-translation-with-vars";
import "../assets/styles/index.scss";
import Seo from "../components/shared/seo";
import AllMarkets from "../components/all-markets";
import PageBackground from "../components/shared/page-background";

const AllMarketsPage = () => {
  const { t } = useTranslationWithVariables();

  return (
    <PageBackground backgroundType="homepage-bg-1">
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
