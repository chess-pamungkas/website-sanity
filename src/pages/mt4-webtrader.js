import React, { useContext, useEffect, startTransition } from "react";
import { graphql } from "gatsby";
import "../assets/styles/index.scss";
import "../assets/styles/webtrader.scss";
import "../assets/styles/mt4.scss";
import Seo from "../components/shared/seo";
import Mt4WebTraderLink from "../components/mt4-webtrader";
import CommonContext from "../context/common-context";
import { useTranslationWithVariables } from "../helpers/hooks/use-translation-with-vars";

const MT4WebTraderPage = () => {
  const { setIsSearchBarAttached } = useContext(CommonContext);
  const { t } = useTranslationWithVariables();

  useEffect(() => {
    startTransition(() => setIsSearchBarAttached(false));

    return () => {
      startTransition(() => setIsSearchBarAttached(true));
    };
  }, [setIsSearchBarAttached]);

  return (
    <>
      <Seo
        fsaTitle={"MT4 Web Trader"}
        fsaDescription={t("page-mt4-web-trader-description")}
      />
      <Mt4WebTraderLink />
    </>
  );
};

export default MT4WebTraderPage;

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
