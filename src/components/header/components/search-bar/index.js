import React, { useCallback, useContext, useRef, useState } from "react";
import PropTypes from "prop-types";
import cn from "classnames";
import { navigate } from "gatsby";
import { useTranslationWithVariables } from "../../../../helpers/hooks/use-translation-with-vars";
import SearchContext from "../../../../context/search-context";
import { useOnClickOutside } from "../../../../helpers/hooks/use-on-click-outside";
import {
  DROPDOWN_SEARCH_ITEMS_TO_SHOW,
  SEARCH_MIN_QUERY_LENGTH,
  INITIAL_SEARCH_STATE,
  SEARCH_PAGE_LINK,
  SEARCH_PARAM_NAME,
} from "../../../../helpers/constants";
import { SearchIcon } from "../../../shared/icons";
import { useSearchData } from "../../../../helpers/hooks/use-search-data";
import { useRtlDirection } from "../../../../helpers/hooks/use-rtl-direction";
import { ArabicNumbers } from "react-native-arabic-numbers";
import InternalLink from "../../../shared/internal-link";
import LanguageContext from "../../../../context/language-context";

const SearchBar = ({
  className,
  isExpandable = false,
  isNavbarOpen = false,
  onSubmit,
}) => {
  const { t } = useTranslationWithVariables();
  const { getSearchResults } = useSearchData();
  const { searchState, setSearchState } = useContext(SearchContext);
  const { selectedLanguage } = useContext(LanguageContext);
  const isRTL = useRtlDirection();

  const [isActive, setIsActive] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const searchInput = useRef();
  const searchBarRef = useRef();

  const onBarExpand = () => {
    setIsActive(true);
    searchInput.current.focus();
  };

  const getSearchMinQueryLocale = useCallback(() => {
    return isRTL
      ? ArabicNumbers(SEARCH_MIN_QUERY_LENGTH)
      : SEARCH_MIN_QUERY_LENGTH;
  }, [isRTL]);

  useOnClickOutside(searchBarRef, () => {
    if (!isExpandable && !isNavbarOpen) return;

    setSearchState(INITIAL_SEARCH_STATE);
    setInputValue("");
    if (!isExpandable) return;

    setIsActive(false);
  });

  const handleSearch = (e) => {
    const query = e.target.value || "";
    setInputValue(query);

    setSearchState({
      query,
      results:
        query.length >= SEARCH_MIN_QUERY_LENGTH ? getSearchResults(query) : [],
      noResultsFound:
        query.length >= SEARCH_MIN_QUERY_LENGTH &&
        !getSearchResults(query).length,
    });
  };

  const handleMoreResultsClick = (e) => {
    if (!isNavbarOpen) return;
    onSubmit(e);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (onSubmit) {
      onSubmit(e);
    }

    if (inputValue) {
      const url = `${
        selectedLanguage.URIPart
      }${SEARCH_PAGE_LINK}/?${SEARCH_PARAM_NAME}=${encodeURIComponent(
        inputValue
      )}`;
      navigate(url);

      // Clear input and search state after navigation
      setInputValue("");
      setSearchState(INITIAL_SEARCH_STATE);
    }
  };

  const handleGoClick = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (inputValue) {
      if (onSubmit) {
        onSubmit(e);
      }

      const url = `${
        selectedLanguage.URIPart
      }${SEARCH_PAGE_LINK}/?${SEARCH_PARAM_NAME}=${encodeURIComponent(
        inputValue
      )}`;

      try {
        navigate(url);
        // Clear input and search state after navigation
        setInputValue("");
        setSearchState(INITIAL_SEARCH_STATE);
      } catch (error) {
        console.error("Navigation failed:", error);
      }
    }
  };

  return (
    <form
      className={cn(
        "search-bar",
        { "search-bar--closed": isExpandable && !isActive },
        className
      )}
      ref={searchBarRef}
      onSubmit={handleSubmit}
    >
      <button
        className="search-bar__expand"
        type="button"
        onClick={onBarExpand}
      >
        <SearchIcon />
      </button>

      <div className="search-bar__controls">
        <input
          className={cn("search-bar__input", {
            "search-bar__input--expandable": isExpandable,
          })}
          placeholder={t("search-placeholder")}
          ref={searchInput}
          onChange={handleSearch}
          value={inputValue}
          autoComplete="off"
        />
        <button
          className="search-bar__submit"
          type="button"
          onClick={handleGoClick}
        >
          {t("search-submit-btn")}
        </button>
      </div>

      {searchState.query && (
        <ul className="search-bar__results">
          {searchState.results.length > 0 ? (
            <>
              {searchState.results
                .slice(0, DROPDOWN_SEARCH_ITEMS_TO_SHOW)
                .map((page, i) => (
                  <li
                    className="search-bar__results-item"
                    key={`search-bar-${i}`}
                  >
                    <InternalLink
                      to={`${page.url}`}
                      className="search-bar__results-link"
                    >
                      <SearchIcon className="search-bar__results-icon" />
                      <span className="search-bar__results-title">
                        {page.content}
                      </span>
                    </InternalLink>
                  </li>
                ))}

              {searchState.results.length > DROPDOWN_SEARCH_ITEMS_TO_SHOW && (
                <li className="search-bar__results-item">
                  <InternalLink
                    to={`${SEARCH_PAGE_LINK}/?${SEARCH_PARAM_NAME}=${encodeURI(
                      searchState.query
                    )}`}
                    className="search-bar__results-link"
                    onClick={handleMoreResultsClick}
                  >
                    <span className="search-bar__results-title search-bar__results-title--bold">
                      {t("search-more-results")}
                    </span>
                  </InternalLink>
                </li>
              )}
            </>
          ) : (
            <>
              {searchState.query.length >= SEARCH_MIN_QUERY_LENGTH ? (
                <li className="search-bar__results-item">
                  <span className="search-bar__results-title">
                    {t("search-no-results")}
                  </span>
                </li>
              ) : (
                <li className="search-bar__results-item">
                  <span className="search-bar__results-title">
                    {`${t(
                      "search-min-query-part1"
                    )} ${getSearchMinQueryLocale()} ${t(
                      "search-min-query-part2"
                    )}`}
                  </span>
                </li>
              )}
            </>
          )}
        </ul>
      )}
    </form>
  );
};

SearchBar.propTypes = {
  className: PropTypes.string,
  isExpandable: PropTypes.bool,
  isNavbarOpen: PropTypes.bool,
  onSubmit: PropTypes.func,
};

export default SearchBar;
