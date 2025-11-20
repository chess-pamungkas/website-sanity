import React from "react";
import PropTypes from "prop-types";
import cn from "classnames";
import { useTranslationWithVariables } from "../../../helpers/hooks/use-translation-with-vars";
import { useRtlDirection } from "../../../helpers/hooks/use-rtl-direction";
import LegalRegulators from "../../legal/components/legal-regulators";
import { LEGAL_REGULATORS } from "../../../helpers/legal.config";
import LegalRegulatedContent from "../legal-regulated-content";
import Documents from "../../documents";
import { getLegalDocs } from "../../../helpers/documents";
import Hero from "../../shared/hero";
import ContainerWrapper from "../../shared/container-wrapper";
import OurCommunityContent from "../../shared/our-community";
import { useWindowSize } from "../../../helpers/hooks/use-window-size";

const LegalContentGlobal = ({ className, isShowHero = true }) => {
  const { t } = useTranslationWithVariables();
  const isRTL = useRtlDirection();
  const { isMobile } = useWindowSize();

  return (
    <>
      <Hero
        className={className}
        isShowHero={isShowHero}
        heroType="legal"
        showWarning={false}
        showHandImage={false}
        showHeroImage={false}
        desktopBackground="url(../../assets/images/bg/hero/legal/legal-desktop.svg)"
        mobileBackground="url(../../assets/images/bg/hero/legal/legal-mobile.svg)"
      />
      <ContainerWrapper>
        <LegalRegulators regulators={LEGAL_REGULATORS} />
      </ContainerWrapper>
      <LegalRegulatedContent />
      <Documents
        title={t("legal_documents-title-fsa")}
        text={{
          regular: t("legal_documents-text-fsa"),
        }}
        documents={getLegalDocs()}
      />

      {isMobile ? (
        <OurCommunityContent />
      ) : (
        <ContainerWrapper>
          <OurCommunityContent />
        </ContainerWrapper>
      )}
    </>
  );
};

LegalContentGlobal.propTypes = {
  className: PropTypes.string,
  isShowHero: PropTypes.bool,
};

export default LegalContentGlobal;
