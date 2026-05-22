import React from "react";
import PropTypes from "prop-types";
import Hero from "../../shared/hero";
// import FaqSearchBar from "./faq-search-bar";

const FaqHero = ({ className, setSearchResults, setNoSearchResult }) => {
  return (
    <div className={className}>
      <Hero
        heroType="faq-hero"
        showWarning={false}
        showHandImage={false}
        showHeroImage={false}
        showTrustPilot={true}
        setSearchResults={setSearchResults}
        setNoSearchResult={setNoSearchResult}
      />
    </div>
  );
};

FaqHero.propTypes = {
  className: PropTypes.string,
  setSearchResults: PropTypes.func.isRequired,
  setNoSearchResult: PropTypes.func.isRequired,
};

export default FaqHero;
