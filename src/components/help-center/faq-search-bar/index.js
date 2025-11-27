import React, { useState, useRef } from "react";
import cn from "classnames";
import PropTypes from "prop-types";
import { useTranslationWithVariables } from "../../../helpers/hooks/use-translation-with-vars";
import {
  FAQ_ALL,
  FAQ_BEGINNERS,
  FAQ_QUICK_ANSWER,
  getFAQMarket,
} from "../../../helpers/faq";
import SearchIcon from "../../../assets/images/icons/faq/search.svg";

// Simple debounce implementation to avoid importing entire lodash library
const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

const FaqSearchBar = ({ className, setSearchResults, setNoSearchResult }) => {
  const COUNT_OF_SEARCH_CHARS = 1;

  const { t } = useTranslationWithVariables();
  const [searchTerm, setSearchTerm] = useState("");

  const faqMarket = getFAQMarket();

  const searchContent = [
    ...FAQ_QUICK_ANSWER,
    ...FAQ_ALL,
    ...faqMarket,
    ...FAQ_BEGINNERS,
  ];

  const handleSearchValue = (value) => {
    if (value.length >= COUNT_OF_SEARCH_CHARS) {
      const _value = value.toLowerCase();
      const contentDeepCopy = JSON.parse(JSON.stringify(searchContent));
      const results = contentDeepCopy.filter((topic) => {
        // check if maps with faq content contain the search query
        let includeTopic = false;
        const content = [];
        for (const item of topic.content.values()) {
          if (
            t(item.question).toLowerCase().includes(_value) ||
            item.answer.some((el) => t(el).toLowerCase().includes(_value))
          ) {
            includeTopic = true;
            content.push(item);
          }
        }
        topic.content = content;
        return includeTopic;
      });
      if (results.length === 0) {
        setNoSearchResult(true);
      }
      setSearchResults(results);
    } else if (value.length === 0) {
      setNoSearchResult(false);
      setSearchResults([]);
    }
  };

  // Use useRef to persist debounced function across renders
  const debouncedHandleSearchValueRef = useRef(
    debounce(handleSearchValue, 500)
  );

  const handleSearchInputChange = (e) => {
    setNoSearchResult(false);
    setSearchTerm(e.target.value);
    debouncedHandleSearchValueRef.current(e.target.value);
  };

  return (
    <div className={cn("faq-search-bar", className)}>
      <div className="faq-search-bar__input-container">
        <div className="faq-search-bar__icon-container">
          <img
            src={SearchIcon}
            alt="Search"
            className="faq-search-bar__icon"
            width={26}
            height={26}
          />
        </div>
        <input
          className={cn("faq-search-bar__input")}
          placeholder={t("faq_quick-searchbar-placeholder")}
          value={searchTerm}
          onChange={handleSearchInputChange}
        />
      </div>
    </div>
  );
};

FaqSearchBar.propTypes = {
  className: PropTypes.string,
  setSearchResults: PropTypes.func.isRequired,
  setNoSearchResult: PropTypes.func.isRequired,
};

export default FaqSearchBar;
