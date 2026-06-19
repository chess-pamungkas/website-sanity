import React from "react";
import cn from "classnames";
import PropTypes from "prop-types";
import { StaticImage } from "gatsby-plugin-image";
import Document from "../shared/document";
import { stringTransformToKebabCase } from "../../helpers/services/string-service";
import { useRtlDirection } from "../../helpers/hooks/use-rtl-direction";
import { DIR_LTR, DIR_RTL } from "../../helpers/constants";
import { useTranslationWithVariables } from "../../helpers/hooks/use-translation-with-vars";

const Documents = ({ className, title, text, documents }) => {
  const isRTL = useRtlDirection();
  const { t } = useTranslationWithVariables();

  return (
    <section
      className={cn("documents", className, {
        "documents--rtl": isRTL,
      })}
      id="legalDocuments"
      dir={isRTL ? DIR_RTL : DIR_LTR}
    >
      <div className="container">
        <div className="documents__wrapper">
          {/* Header Section */}
          <div className="documents__header">
            {/* Badge Group */}
            <div className="documents__badge-group">
              <div className="documents__badge">
                <div className="documents__badge-base">
                  <span className="documents__badge-text">
                    {t("legal_documents-badge-text")}
                  </span>
                </div>
              </div>
              <div className="documents__badge-content">
                <div className="documents__badge-icon">
                  <StaticImage
                    src="../../assets/images/icons/features.svg"
                    alt="Document Badge Icon"
                    className="documents__badge-icon-img"
                  />
                </div>
                <span className="documents__badge-message">
                  {t("legal_documents-badge-message")}
                </span>
              </div>
            </div>

            {/* Title */}
            <h2 className="documents__title">{title}</h2>

            {/* Text Content */}
            <div className="documents__text-content">
              <p className="documents__text">{text.regular}</p>
            </div>
          </div>

          {/* Documents Grid */}
          <div className="documents__files" id="documents__files">
            {documents.length > 0 &&
              documents.map((doc) => (
                <Document
                  key={stringTransformToKebabCase(doc.name)}
                  document={doc}
                />
              ))}
          </div>
        </div>
      </div>
    </section>
  );
};

Documents.propTypes = {
  className: PropTypes.string,
  title: PropTypes.string.isRequired,
  text: PropTypes.shape({
    regular: PropTypes.string.isRequired,
  }).isRequired,
  documents: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default Documents;
