import React from "react";
import { graphql } from "gatsby";
import { useTranslationWithVariables } from "../helpers/hooks/use-translation-with-vars";
import "../assets/styles/index.scss";
import Seo from "../components/shared/seo";
import VideoBanner from "../components/video-banner";
import SplitTextPromotion from "../components/split-text-promotion";
import HighlightedLocalizationText from "../components/shared/highlighted-localization-text";
import CompanyAdvantages from "../components/company-advantages";
import video from "../assets/video/about.mp4";

const CompanyPage = () => {
  const { t } = useTranslationWithVariables();

  return (
    <>
      <Seo
        title={t("page-company-title")}
        description={t("page-company-description")}
      />
      <VideoBanner
        title={t("company_banner-with-title-title")}
        subtitle={t("company_banner-with-title-subtitle")}
        video={video}
      />
      <SplitTextPromotion
        title={t("company_split-text-promotion-title")}
        subtitle={t("company_split-text-promotion-subtitle")}
      >
        <HighlightedLocalizationText
          localizationText="company_split-text-promotion-text1"
          wordsToHighlight="company-split-text-promotion-text1-accent"
          primaryClassName="highlighted-in-black"
          accentClassName="highlighted-in-red"
        />
        {/* <br />
        <br />
        <HighlightedLocalizationText
          localizationText="company_split-text-promotion-text2"
          wordsToHighlight="company-split-text-promotion-text2-accent"
          primaryClassName="highlighted-in-black"
          accentClassName="highlighted-in-red"
        /> */}
      </SplitTextPromotion>
      <CompanyAdvantages />
    </>
  );
};

export default CompanyPage;

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
