import React from "react";
import { graphql } from "gatsby";
import { useTranslationWithVariables } from "../helpers/hooks/use-translation-with-vars";
import "../assets/styles/index.scss";
import Seo from "../components/shared/seo";
import VPSContent from "../components/pages-content/vps-page-content";
import PageBackground from "../components/shared/page-background";

const VPSPage = () => {
  const { t } = useTranslationWithVariables();

  return (
    <PageBackground backgroundType="homepage-bg-2">
      <Seo
        fsaTitle={t("page-vps-title")}
        fsaDescription={t("page-vps-description")}
      />
      <VPSContent />
    </PageBackground>
  );
};

export default VPSPage;

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
