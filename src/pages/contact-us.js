import React from "react";
import PropTypes from "prop-types";
import { graphql } from "gatsby";
import { useTranslationWithVariables } from "../helpers/hooks/use-translation-with-vars";
import Seo from "../components/shared/seo";
import ContactUs from "../components/contact-us";
import Hero from "../components/shared/hero";
import PageBackground from "../components/shared/page-background";
import ContainerWrapper from "../components/shared/container-wrapper";
import OurCommunityContent from "../components/shared/our-community";
import { useWindowSize } from "../helpers/hooks/use-window-size";

const ContactUsPage = ({ className, isShowHero = true }) => {
  const { t } = useTranslationWithVariables();
  const { isMobile } = useWindowSize();

  return (
    <PageBackground backgroundType="homepage-bg-1">
      <Seo title={t("page-contact-title")} />
      <Hero
        className={className}
        isShowHero={isShowHero}
        heroType="contact-us"
        showWarning={false}
        showHandImage={false}
        showHeroImage={false}
        desktopBackground="url(../../assets/images/bg/hero/contact-us/contact-us-desktop.svg)"
        mobileBackground="url(../../assets/images/bg/hero/contact-us/contact-us-mobile.svg)"
      />
      <div className="contact-us-shell">
        <ContainerWrapper>
          <ContactUs />
        </ContainerWrapper>
      </div>

      {isMobile ? (
        <OurCommunityContent />
      ) : (
        <div className="contact-us-page-community">
          <ContainerWrapper>
            <OurCommunityContent />
          </ContainerWrapper>
        </div>
      )}
    </PageBackground>
  );
};

ContactUsPage.propTypes = {
  className: PropTypes.string,
  isShowHero: PropTypes.bool,
};

export default ContactUsPage;

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
