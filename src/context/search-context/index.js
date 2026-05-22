import React, { createContext, useState } from "react";
import PropTypes from "prop-types";
import { INITIAL_SEARCH_STATE } from "../../helpers/constants";

const SearchContext = createContext();

export const SearchProvider = ({ children }) => {
  const [searchState, setSearchState] = useState(INITIAL_SEARCH_STATE);

  return (
    <SearchContext.Provider
      value={{
        searchState,
        setSearchState,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};

SearchProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

/** Stub for deferred hydration (Layout uses after timer). */
export const SEARCH_STUB_VALUE = {
  searchState: INITIAL_SEARCH_STATE,
  setSearchState: () => {},
};

export default SearchContext;
