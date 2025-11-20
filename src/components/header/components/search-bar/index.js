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
  const [inputValue, setInputValue] = useState(""); // Local state for input value

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

  const handleSearch = (e) => {
    const query = e.target.value;

    // Update local input value
    setInputValue(query);

    // Ensure search bar stays active while typing
    if (isExpandable) {
      setIsActive(true);
    }

    if (query.length >= SEARCH_MIN_QUERY_LENGTH) {
      const results = getSearchResults(query);
      setSearchState({
        query,
        results,
        noResultsFound: !results.length,
      });
    } else {
      setSearchState({
        query,
        results: [],
        noResultsFound: false,
      });
    }
  };

  const handleResultClick = (e, url) => {
    e.preventDefault();

    // Prepend the current language prefix to the URL
    const languagePrefix = selectedLanguage.URIPart;
    const fullUrl = `${languagePrefix}${url}`;

    if (onSubmit) onSubmit(e);
    navigate(fullUrl);
    setInputValue(""); // Clear input value
    setSearchState(INITIAL_SEARCH_STATE); // Clear search state
    setIsActive(false);
  };

  const handleMoreResultsClick = (e) => {
    if (!isNavbarOpen) return;

    onSubmit(e);

    // Clear input value and search state after clicking "More Results"
    setTimeout(() => {
      setInputValue(""); // Clear input value
      setSearchState(INITIAL_SEARCH_STATE); // Clear search state
    }, 300); // Small delay to ensure navigation happens first
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation(); // Prevent event bubbling

    const form = e.currentTarget;
    let currentQuery = inputValue; // Use local state instead of DOM access

    // Update search state if needed
    if (currentQuery !== searchState.query) {
      if (currentQuery.length >= SEARCH_MIN_QUERY_LENGTH) {
        const results = getSearchResults(currentQuery);
        await new Promise((resolve) => {
          setSearchState({
            query: currentQuery,
            results,
            noResultsFound: !results.length,
          });
          resolve();
        });
      } else {
        await new Promise((resolve) => {
          setSearchState({
            query: currentQuery,
            results: [],
            noResultsFound: false,
          });
          resolve();
        });
      }
    }

    if (!currentQuery) {
      return;
    }

    // Mark form as submitting to prevent state reset
    form.dataset.submitting = "true";

    if (onSubmit) onSubmit(e);

    // Store the current query for navigation
    const queryForNavigation = currentQuery;

    // Navigate to search page with the query
    navigate(
      `${
        selectedLanguage.URIPart
      }${SEARCH_PAGE_LINK}/?${SEARCH_PARAM_NAME}=${encodeURI(
        queryForNavigation
      )}`
    );

    // Clear input and reset state after navigation has been triggered
    // Use a longer delay to ensure the search page has time to initialize
    setTimeout(() => {
      setInputValue(""); // Clear local input value

      // Clear the search results by resetting the search state
      setSearchState({
        query: "", // Clear the query
        results: [], // Clear the results
        noResultsFound: false,
      });

      if (isExpandable) {
        setIsActive(false);
      }

      // Clear submitting flag
      form.dataset.submitting = "false";
    }, 300); // Longer delay to ensure navigation happens first
  };

  useOnClickOutside(searchBarRef, (event) => {
    // Ignore if form is being submitted
    if (searchBarRef.current?.dataset.submitting === "true") {
      return;
    }

    // Don't reset if clicking any part of the search bar components
    if (
      event.target.closest(".search-bar__submit") ||
      event.target.closest(".search-bar__input") ||
      event.target.closest(".search-bar__expand") ||
      event.target.closest(".burger-menu") // Ignore burger menu clicks
    ) {
      return;
    }

    if (event.target.closest(".search-bar__results")) {
      return;
    }

    // Only reset if clicking completely outside the search area
    if (!isExpandable && !isNavbarOpen) return;

    // Don't reset if the input is focused
    if (document.activeElement === searchInput.current) {
      return;
    }

    setInputValue(""); // Clear input value
    setSearchState(INITIAL_SEARCH_STATE); // Clear search state
    if (!isExpandable) return;

    setIsActive(false);
  });

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
        onClick={() => {
          onBarExpand();
        }}
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
        />
        <button className="search-bar__submit" type="submit">
          {t("search-submit-btn")}
        </button>
      </div>

      {/* Only show search results when both searchState.query and inputValue are not empty */}
      {searchState.query && inputValue && (
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
                      to={page.url}
                      className="search-bar__results-link"
                      onClick={(e) => handleResultClick(e, page.url)}
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
                    to={`${
                      selectedLanguage.URIPart
                    }${SEARCH_PAGE_LINK}/?${SEARCH_PARAM_NAME}=${encodeURI(
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
