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
import { Logo, SearchIcon, SearchNoResultsImg } from "../../shared/icons";
import { ArabicNumbers } from "react-native-arabic-numbers";
import { useRtlDirection } from "../../../helpers/hooks/use-rtl-direction";
import cn from "classnames";
import InternalLink from "../../shared/internal-link";

const SearchPageContent = () => {
  const { t } = useTranslationWithVariables();
  const { getSearchResults } = useSearchData();
  const { searchState, setSearchState } = useContext(SearchContext);
  const searchResultsRef = useRef();
  const isRTL = useRtlDirection();
  const [inputValue, setInputValue] = useState("");

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
      setSearchState(INITIAL_SEARCH_STATE);
      return;
    }

    const query = decodeURI(searchParamValue);
    setInputValue(query);

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
  }, []); // Only run on mount

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
    setInputValue(query);

    if (query.length >= SEARCH_MIN_QUERY_LENGTH) {
      setResultsBundleCount(SEARCH_RESULTS_FIRST_BUNDLE);
      const results = getSearchResults(query);
      setSearchState({
        query,
        results,
        noResultsFound: !results.length,
      });

      // Update URL without page reload
      const newUrl = new URL(window.location);
      newUrl.searchParams.set(SEARCH_PARAM_NAME, query);
      window.history.replaceState({}, "", newUrl);
    } else {
      setSearchState({
        query,
        results: [],
        noResultsFound: false,
      });

      // Remove query parameter if search is empty
      const newUrl = new URL(window.location);
      newUrl.searchParams.delete(SEARCH_PARAM_NAME);
      window.history.replaceState({}, "", newUrl);
    }
  };

  // Cleanup search state on unmount
  useEffect(() => {
    return () => {
      setSearchState(INITIAL_SEARCH_STATE);
      setInputValue("");
    };
  }, [setSearchState]);

  return (
    <section className="search-page__container" dir={isRTL ? DIR_RTL : DIR_LTR}>
      <form
        className={cn("search-page__form", {
          "search-page__form--rtl": isRTL,
        })}
        onSubmit={(e) => e.preventDefault()}
      >
        <SearchIcon className="search-page__form-icon" />

        <input
          className="search-page__form-input"
          placeholder={t("search-placeholder")}
          onChange={handleSearch}
          value={inputValue}
          autoComplete="off"
        />
      </form>

      <div className="search-page__results">
        {searchState.noResultsFound ? (
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
            {searchState.results.length ? (
              <ul className="search-page__results-list" ref={searchResultsRef}>
                {searchState.results
                  .slice(0, resultsBundleCount * SEARCH_RESULTS_BUNDLE_SIZE)
                  .map((page, i) => (
                    <li key={`search-page-${i}`} className="search-page__item">
                      <InternalLink
                        to={`${page.url}`}
                        className="search-page__link"
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
              <p className="search-page__note">
                {`${t(
                  "search-min-query-part1"
                )} ${getSearchMinQueryLocale()} ${t("search-min-query-part2")}`}
              </p>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default SearchPageContent;
