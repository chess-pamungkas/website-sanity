import React from "react";
import { graphql } from "gatsby";
import { useTranslationWithVariables } from "../helpers/hooks/use-translation-with-vars";
import "../assets/styles/index.scss";
import Seo from "../components/shared/seo";
import EnergiesContent from "../components/pages-content/energies-page-content";
import PageBackground from "../components/shared/page-background";

const EnergiesPage = () => {
  const { t } = useTranslationWithVariables();

  return (
    <>
      <PageBackground backgroundType="homepage-bg-1">
        <Seo
          title={t("page-energies-title")}
          description={t("page-energies-description")}
        />
        <EnergiesContent />
      </PageBackground>
    </>
  );
};

export default EnergiesPage;

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
