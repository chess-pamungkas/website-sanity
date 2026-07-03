import { useContext } from "react";
import LanguageContext from "../context/language-context";

// FSA docs
const FSA_DOCS_FOLDER = "https://docs.oqtima.com/legal";

const bestExecutionPolicyFSA = {
  filename: "Best_Execution_Policy.pdf",
  languages: ["en"],
};
const complaintHandlingPolicyFSA = {
  filename: "Complaint_Handling_Policy.pdf",
  languages: ["en"],
};
const riskDisclosureNoticeFSA = {
  filename: "Risk_Disclosure_Notice.pdf",
  languages: ["en"],
};
const cookiePolicyFSA = {
  filename: "Cookie_Policy.pdf",
  languages: ["en"],
};
export const privacyPolicyFSA = {
  filename: "Privacy_Policy.pdf",
  languages: ["en"],
};
export const clientAgreementFSA = {
  filename: "Client_Agreement.pdf",
  languages: ["en"],
};

const generateFileLinkWithLang = (fileObj, langObj) => {
  const languagePart = fileObj.languages.includes(langObj.id)
    ? langObj.URIPart
    : "";
  return `${FSA_DOCS_FOLDER}${languagePart}/${fileObj.filename}`;
};

const LEGAL_DOCS_FSA = () => {
  const { selectedLanguage } = useContext(LanguageContext);

  return [
    {
      name: "document-best-execution-policy-fsa",
      file: generateFileLinkWithLang(bestExecutionPolicyFSA, selectedLanguage),
    },
    {
      name: "document-complaint-handling-policy-fsa",
      file: generateFileLinkWithLang(
        complaintHandlingPolicyFSA,
        selectedLanguage
      ),
    },
    {
      name: "document-privacy-policy-fsa",
      file: generateFileLinkWithLang(privacyPolicyFSA, selectedLanguage),
    },
    {
      name: "document-risk-disclosure-notice-fsa",
      file: generateFileLinkWithLang(riskDisclosureNoticeFSA, selectedLanguage),
    },
    {
      name: "document-cookie-policy-fsa",
      file: generateFileLinkWithLang(cookiePolicyFSA, selectedLanguage),
    },
    {
      name: "document-client-agreement-fsa",
      file: generateFileLinkWithLang(clientAgreementFSA, selectedLanguage),
    },
  ];
};

const RISK_DISCLOSURE_DOC_FSA = generateFileLinkWithLang(
  riskDisclosureNoticeFSA,
  { id: "en", URIPart: "/en" }
);

export const getRiskDisclosureDocForLanguage = (selectedLanguage) =>
  generateFileLinkWithLang(riskDisclosureNoticeFSA, selectedLanguage);

export const RISK_DISCLOSURE_DOC = RISK_DISCLOSURE_DOC_FSA;
export const TRADING_VIEW_DOC = RISK_DISCLOSURE_DOC_FSA;

export const getLegalDocs = LEGAL_DOCS_FSA;
export const getRiskDisclosureDoc = () => RISK_DISCLOSURE_DOC_FSA;
