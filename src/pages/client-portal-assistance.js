import React from "react";
import { graphql } from "gatsby";
import { useTranslationWithVariables } from "../helpers/hooks/use-translation-with-vars";
import "../assets/styles/index.scss";
import Seo from "../components/shared/seo";
import ClientPortalAssistanceContent from "../components/pages-content/client-portal-assistance-content";
import PageBackground from "../components/shared/page-background";

const ClientPortalAssistancePage = () => {
  const { t } = useTranslationWithVariables();

  return (
    <PageBackground backgroundType="homepage-bg-1">
      <Seo
        fsaTitle={t("page-swap-free-title")}
        fsaDescription={t("page-swap-free-description")}
      />
      <ClientPortalAssistanceContent />
    </PageBackground>
  );
};

export default ClientPortalAssistancePage;

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
