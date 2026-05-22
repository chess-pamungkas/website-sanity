import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useTranslationWithVariables } from "../../../helpers/hooks/use-translation-with-vars";
import { useSearchData } from "../../../helpers/hooks/use-search-data";
import SearchContext from "../../../context/search-context";
import {
  HOME_PAGE_LINK,
  SEARCH_PARAM_NAME,
  SEARCH_MIN_QUERY_LENGTH,
  SEARCH_RESULTS_FIRST_BUNDLE,
  SEARCH_RESULTS_BUNDLE_SIZE,
  DIR_RTL,
  DIR_LTR,
  INITIAL_SEARCH_STATE,
} from "../../../helpers/constants";
import { getUrlParamValue } from "../../../helpers/services/get-url-param-value";
import ButtonLink from "../../shared/button-link";
import { Logo } from "../../shared/icons/Logo";
import { SearchIcon } from "../../shared/icons/SearchIcon";
import { SearchNoResultsImg } from "../../shared/icons/SearchNoResultsImg";
import { ArabicNumbers } from "react-native-arabic-numbers";
import { useRtlDirection } from "../../../helpers/hooks/use-rtl-direction";
import cn from "classnames";
import InternalLink from "../../shared/internal-link";
import { navigate } from "gatsby";

const SearchPageContent = () => {
  const { t } = useTranslationWithVariables();
  const { getSearchResults } = useSearchData();
  const { searchState, setSearchState } = useContext(SearchContext);
  const searchResultsRef = useRef();
  const searchInputRef = useRef(); // Add a ref for the search input
  const isRTL = useRtlDirection();
  const [inputValue, setInputValue] = useState("");

  // Local state for search results to make the component more independent
  const [localSearchResults, setLocalSearchResults] = useState([]);
  const [noResultsFound, setNoResultsFound] = useState(false);

  const [resultsBundleCount, setResultsBundleCount] = useState(
    SEARCH_RESULTS_FIRST_BUNDLE
  );

  const handleScroll = useCallback(() => {
    if (!searchResultsRef.current) return;

    const { bottom: resultsElementBottom } =
      searchResultsRef.current.getBoundingClientRect();

    if (
      typeof window !== "undefined" &&
      resultsElementBottom < window.innerHeight
    ) {
      setResultsBundleCount((prevBundleCount) => prevBundleCount + 1);
    }
  }, []);

  // Initialize search from URL
  useEffect(() => {
    const searchParamValue = getUrlParamValue(SEARCH_PARAM_NAME);
    if (!searchParamValue) {
      setInputValue("");
      setLocalSearchResults([]);
      setNoResultsFound(false);
      return;
    }

    const query = decodeURI(searchParamValue);

    // Always set the input value to the query from URL
    setInputValue(query);

    if (query.length >= SEARCH_MIN_QUERY_LENGTH) {
      setResultsBundleCount(SEARCH_RESULTS_FIRST_BUNDLE);
      const results = getSearchResults(query);

      // Update local state
      setLocalSearchResults(results);
      setNoResultsFound(!results.length);

      // Don't update context to avoid bidirectional sync issues
    } else {
      setLocalSearchResults([]);
      setNoResultsFound(false);

      // Don't update context to avoid bidirectional sync issues
    }
  }, [getSearchResults]); // Remove setSearchState from dependencies

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  const getSearchMinQueryLocale = useCallback(() => {
    return isRTL
      ? ArabicNumbers(SEARCH_MIN_QUERY_LENGTH)
      : SEARCH_MIN_QUERY_LENGTH;
  }, [isRTL]);

  const handleSearch = (e) => {
    const query = e.target.value || "";

    // Always update the input value first
    setInputValue(query);

    if (query.length >= SEARCH_MIN_QUERY_LENGTH) {
      setResultsBundleCount(SEARCH_RESULTS_FIRST_BUNDLE);
      const results = getSearchResults(query);

      // Update local state
      setLocalSearchResults(results);
      setNoResultsFound(!results.length);

      // Don't update context to avoid bidirectional sync issues

      // Update URL without page reload
      const newUrl = new URL(window.location);
      newUrl.searchParams.set(SEARCH_PARAM_NAME, query);
      window.history.replaceState({}, "", newUrl);
    } else {
      // Update local state
      setLocalSearchResults([]);
      setNoResultsFound(false);

      // Don't update context to avoid bidirectional sync issues

      // Update URL - only remove parameter if search is empty
      const newUrl = new URL(window.location);
      if (query) {
        newUrl.searchParams.set(SEARCH_PARAM_NAME, query);
      } else {
        newUrl.searchParams.delete(SEARCH_PARAM_NAME);
      }
      window.history.replaceState({}, "", newUrl);
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();

    // Process the search with the current input value
    if (inputValue.length >= SEARCH_MIN_QUERY_LENGTH) {
      setResultsBundleCount(SEARCH_RESULTS_FIRST_BUNDLE);
      const results = getSearchResults(inputValue);

      // Update local state
      setLocalSearchResults(results);
      setNoResultsFound(!results.length);

      // Don't update context to avoid bidirectional sync issues

      // Update URL without page reload
      const newUrl = new URL(window.location);
      newUrl.searchParams.set(SEARCH_PARAM_NAME, inputValue);
      window.history.replaceState({}, "", newUrl);

      // Don't clear the input after submission on the search page
      // This allows users to see what they searched for

      // Focus the input field for better UX
      if (searchInputRef.current) {
        searchInputRef.current.focus();
      }
    } else {
      // Show message for too short queries
      // Update local state
      setLocalSearchResults([]);
      setNoResultsFound(false);

      // Don't update context to avoid bidirectional sync issues

      // Update URL without page reload
      const newUrl = new URL(window.location);
      if (inputValue) {
        newUrl.searchParams.set(SEARCH_PARAM_NAME, inputValue);
      } else {
        newUrl.searchParams.delete(SEARCH_PARAM_NAME);
      }
      window.history.replaceState({}, "", newUrl);

      // Focus the input field for better UX
      if (searchInputRef.current) {
        searchInputRef.current.focus();
      }
    }
  };

  const handleResultClick = (e, url) => {
    e.preventDefault();

    // Clear local state before navigation
    setInputValue("");
    setLocalSearchResults([]);
    setNoResultsFound(false);

    // Don't update context to avoid bidirectional sync issues

    // Navigate to the result URL
    navigate(url);
  };

  // Cleanup search state on unmount
  useEffect(() => {
    return () => {
      // Don't reset context state to avoid bidirectional sync issues

      // Reset local state
      setInputValue("");
      setLocalSearchResults([]);
      setNoResultsFound(false);
    };
  }, []); // Remove setSearchState from dependencies

  return (
    <section className="search-page__container" dir={isRTL ? DIR_RTL : DIR_LTR}>
      <form
        className={cn("search-page__form", {
          "search-page__form--rtl": isRTL,
        })}
        onSubmit={handleFormSubmit}
      >
        <SearchIcon className="search-page__form-icon" />

        <input
          className="search-page__form-input"
          placeholder={t("search-placeholder")}
          onChange={handleSearch}
          value={inputValue}
          autoComplete="off"
          autoFocus
          ref={searchInputRef}
        />
      </form>

      <div className="search-page__results">
        {noResultsFound ? (
          <div className="search-page__no-results">
            <SearchNoResultsImg className="search-page__no-results-img" />
            <h2 className="search-page__no-results-title">
              {t("search-no-results-title")}
            </h2>
            <p className="search-page__note">{t("search-no-results-text")}</p>
            <ButtonLink
              link={HOME_PAGE_LINK}
              className="button-link button-link--ghost-red search-page__no-results-btn"
            >
              {t("search-go-back-btn")}
            </ButtonLink>
          </div>
        ) : (
          <>
            {localSearchResults.length ? (
              <ul className="search-page__results-list" ref={searchResultsRef}>
                {localSearchResults
                  .slice(0, resultsBundleCount * SEARCH_RESULTS_BUNDLE_SIZE)
                  .map((page, i) => (
                    <li key={`search-page-${i}`} className="search-page__item">
                      <InternalLink
                        to={`${page.url}`}
                        className="search-page__link"
                        onClick={(e) => handleResultClick(e, page.url)}
                      >
                        <div className="search-page__icon-wrapper">
                          <Logo className="search-page__icon" />
                        </div>

                        <div className="search-page__caption">
                          <h2 className="search-page__title">{page.content}</h2>
                          <p className="search-page__ref">
                            {`${window.location.origin}${page.url}`}
                          </p>
                        </div>
                      </InternalLink>

                      <p className="search-page__text">{page.content}</p>

                      <ButtonLink
                        link={`${page.url}`}
                        className="search-page__btn button-link--ghost-red"
                      >
                        {t("search-submit-btn")}
                      </ButtonLink>
                    </li>
                  ))}
              </ul>
            ) : (
              inputValue.length > 0 &&
              inputValue.length < SEARCH_MIN_QUERY_LENGTH && (
                <p className="search-page__note">
                  {`${t(
                    "search-min-query-part1"
                  )} ${getSearchMinQueryLocale()} ${t(
                    "search-min-query-part2"
                  )}`}
                </p>
              )
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default SearchPageContent;
