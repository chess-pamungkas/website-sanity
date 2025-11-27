import React, { useState } from "react";
import PropTypes from "prop-types";
import cn from "classnames";
import { useTranslationWithVariables } from "../../helpers/hooks/use-translation-with-vars";
import { DIR_LTR, DIR_RTL, FAQ_PAGE_LINK } from "../../helpers/constants";
import { useRtlDirection } from "../../helpers/hooks/use-rtl-direction";
import ButtonLink from "../shared/button-link";
import minusCircleIcon from "../../assets/images/icons/faq/minus-circle.svg";
import plusCircleIcon from "../../assets/images/icons/faq/plus-circle.svg";

const Faq = ({ className, title, faq, isFaqBtnHidden, subTitleTemplate }) => {
  const { t } = useTranslationWithVariables();
  const isRTL = useRtlDirection();
  const [expandedItems, setExpandedItems] = useState(new Set());

  const toggleItem = (index) => {
    const newExpandedItems = new Set(expandedItems);
    if (newExpandedItems.has(index)) {
      newExpandedItems.delete(index);
    } else {
      newExpandedItems.add(index);
    }
    setExpandedItems(newExpandedItems);
  };

  return (
    <section
      className={cn("faq", className, {
        "faq--rtl": isRTL,
      })}
      dir={isRTL ? DIR_RTL : DIR_LTR}
    >
      <div className="faq__wrapper">
        {subTitleTemplate && subTitleTemplate}
        <div className="faq__content">
          {faq.length > 0 &&
            faq.map((item, i) => (
              <div
                key={`faq-item-${i}`}
                className={cn("faq__item", {
                  "faq__item--expanded": expandedItems.has(i),
                })}
              >
                <div className="faq__title">
                  <span className="faq__title-text">{t(item.question)}</span>
                  <button
                    className="faq__expand-btn"
                    onClick={() => toggleItem(i)}
                    aria-label={expandedItems.has(i) ? "Collapse" : "Expand"}
                  >
                    {expandedItems.has(i) ? (
                      <img
                        src={minusCircleIcon}
                        alt="Collapse"
                        className="faq__expand-btn-icon"
                      />
                    ) : (
                      <img
                        src={plusCircleIcon}
                        alt="Expand"
                        className="faq__expand-btn-icon"
                      />
                    )}
                  </button>
                </div>
                {expandedItems.has(i) && (
                  <div className="faq__expandable">
                    {item.answer.map((content, j) => (
                      <span
                        key={`faq-answer-${j}`}
                        className={cn("faq__text", {
                          "faq__text--bold": item.bold?.includes(j),
                        })}
                      >
                        {t(content)}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
        </div>
        {!isFaqBtnHidden && (
          <ButtonLink
            link={FAQ_PAGE_LINK}
            className="button-link--with-red-border"
          >
            {t("faq-btn-text")}
          </ButtonLink>
        )}
      </div>
    </section>
  );
};

Faq.propTypes = {
  className: PropTypes.string,
  title: PropTypes.object,
  faq: PropTypes.arrayOf(
    PropTypes.shape({
      question: PropTypes.string.isRequired,
      answer: PropTypes.arrayOf(PropTypes.string).isRequired,
      bold: PropTypes.arrayOf(PropTypes.number),
    })
  ).isRequired,
  isFaqBtnHidden: PropTypes.bool,
  subTitleTemplate: PropTypes.node,
};
export default Faq;
