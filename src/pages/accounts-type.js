import React from "react";
import { graphql } from "gatsby";
import { useTranslationWithVariables } from "../helpers/hooks/use-translation-with-vars";
import "../assets/styles/index.scss";
import Seo from "../components/shared/seo";
import AccountsTypePageContent from "../components/pages-content/accounts-type-page-content";
import OurCommunityContent from "../components/shared/our-community";
import ContainerWrapper from "../components/shared/container-wrapper";
import { useWindowSize } from "../helpers/hooks/use-window-size";
import PageBackground from "../components/shared/page-background";

const AccountsTypePage = () => {
  const { t } = useTranslationWithVariables();
  const { isMobile } = useWindowSize();

  return (
    <PageBackground backgroundType="homepage-bg-2">
      <Seo
        title={t("page-accounts-type-title")}
        description={t("page-accounts-type-description")}
      />
      <AccountsTypePageContent />
    </PageBackground>
  );
};

export default AccountsTypePage;

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
