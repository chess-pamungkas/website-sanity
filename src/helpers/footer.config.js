import React from "react";
import { LEGAL_PAGE_LINK } from "./constants";
import { useTranslationWithVariables } from "./hooks/use-translation-with-vars";
import InternalLink from "../components/shared/internal-link";

const FOOTER_TEXT_FSA = "footer-text-fsa";

export const getFooterText = () => FOOTER_TEXT_FSA;

const FOOTER_COPYRIGHT_FSA = {
  p1: "footer-copyright-paragraph1-fsa",
  p1_2: "footer-copyright-paragraph1_2-fsa",
  // p1_3: "footer-copyright-paragraph1_3-fsa",
  p2_label: "footer-copyright-paragraph2-fsa-label",
  p2: "footer-copyright-paragraph2-fsa",
  p3_1: "footer-copyright-paragraph3-part1-fsa",
  p3_2: "footer-copyright-paragraph3-part2-fsa",
  p4: "footer-copyright-paragraph4-fsa",
  p3_a1: "footer-copyright-paragraph3-link-fsa",
  p3_link1: LEGAL_PAGE_LINK,
  p5: "footer-copyright-paragraph5-fsa",
};

const FOOTER_COMPANY = { p1: "footer-company-name-text" };

// Function to get current year
const getCurrentYear = () => new Date().getFullYear();

export const getFooterCopyright = () => {
  const { t } = useTranslationWithVariables();

  return (
    <>
      <p>{t(FOOTER_COPYRIGHT_FSA.p1)}</p>
      <p>{t(FOOTER_COPYRIGHT_FSA.p1_2)}</p>
      <p>{t(FOOTER_COPYRIGHT_FSA.p1_3)}</p>
      <p>
        <span className="copy-right-block__risk-warning-label">
          {t(FOOTER_COPYRIGHT_FSA.p2_label)}
        </span>{" "}
        {t(FOOTER_COPYRIGHT_FSA.p2)}
      </p>
      <p>
        {t(FOOTER_COPYRIGHT_FSA.p3_1)}&nbsp;
        <InternalLink to={FOOTER_COPYRIGHT_FSA.p3_link1}>
          {t(FOOTER_COPYRIGHT_FSA.p3_a1)}
        </InternalLink>
        &nbsp;
        {t(FOOTER_COPYRIGHT_FSA.p3_2)}
      </p>
      <p>{t(FOOTER_COPYRIGHT_FSA.p4)}</p>
      <p>{t(FOOTER_COPYRIGHT_FSA.p5)}</p>
    </>
  );
};

export const getFooterCompanyName = () => {
  const { t } = useTranslationWithVariables();
  const currentYear = getCurrentYear();
  return (
    <p>
      © {currentYear} {t(FOOTER_COMPANY.p1)} | {t("footer-all-rights-reserved")}
    </p>
  );
};
