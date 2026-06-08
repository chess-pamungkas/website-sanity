import React, {
  useState,
  useContext,
  useEffect,
  lazy,
  Suspense,
} from "react";
import PropTypes from "prop-types";
import { useTranslationWithVariables } from "../../helpers/hooks/use-translation-with-vars";
import { ShowRegistrationPopup } from "../../helpers/constants";
import { useWindowSize } from "../../helpers/hooks/use-window-size";
import LanguageContext from "../../context/language-context";
import Hero from "../shared/hero";
import BreadcrumbsTab from "../shared/breadcrumbs-tab";
import ContainerWrapper from "../shared/container-wrapper";

/** Below the fold: split so initial JS parse/hydration does not include 7× MarketItem + ticker graph. */
const MarketItemsListLazy = lazy(() => import("./components/market-items-list"));

/** End of page CTA block: defer parse until after market list chunk + scroll/navigation. */
const OurCommunityLazy = lazy(() => import("../shared/our-community"));

const AllMarkets = ({ className, isShowHero = true }) => {
  const { t } = useTranslationWithVariables();
  const { isMobile } = useWindowSize();
  const [viewportLayoutReady, setViewportLayoutReady] = useState(false);
  useEffect(() => {
    setViewportLayoutReady(true);
  }, []);
  // SSR is "desktop" (no viewport). Client mobile must not change wrapper tree on first paint — #418.
  const mobileLayout = viewportLayoutReady && isMobile;
  const { selectedLanguage } = useContext(LanguageContext);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const handleClosePopup = () => {
    setIsPopupOpen(false);
  };

  return (
    <>
      <Hero
        className={className}
        isShowHero={isShowHero}
        heroType="all-markets"
        showWarning={false}
        showHandImage={false}
        showHeroImage={false}
      />

      <BreadcrumbsTab
        className="breadcrumbs-tab--all-markets-hero-tight"
        currentPage={t("all-markets_badge-text")}
        activeTab="all-markets"
      />

      <Suspense
        fallback={
          <section
            className="market-items-list market-items-list--deferred"
            aria-busy="true"
          />
        }
      >
        <MarketItemsListLazy />
      </Suspense>

      <Suspense
        fallback={
          <div
            className="our-community-content our-community-content--lazy-placeholder"
            aria-busy="true"
          />
        }
      >
        {mobileLayout ? (
          <OurCommunityLazy />
        ) : (
          <ContainerWrapper className="our-community-page-shell">
            <OurCommunityLazy />
          </ContainerWrapper>
        )}
      </Suspense>

      {isPopupOpen && (
        <ShowRegistrationPopup
          isOpen={isPopupOpen}
          onClose={handleClosePopup}
          langParam={selectedLanguage.id}
        />
      )}
    </>
  );
};

AllMarkets.propTypes = {
  className: PropTypes.string,
  isShowHero: PropTypes.bool,
};
export default AllMarkets;
