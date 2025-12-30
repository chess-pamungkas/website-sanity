import React, { useState, useEffect, useRef } from "react";
import cn from "classnames";
import PropTypes from "prop-types";
import { stringTransformToKebabCase } from "../../../helpers/services/string-service";
import { useWindowSize } from "../../../helpers/hooks/use-window-size";
import { useTranslationWithVariables } from "../../../helpers/hooks/use-translation-with-vars";
import { PLATFORM_SELECTION_CONFIG } from "../../../helpers/platforms.config";
import {
  MT4_DOWNLOAD_LINKS,
  MT5_DOWNLOAD_LINKS,
} from "../../../helpers/platforms.config";
import Dropdown from "../dropdown";
import Tab from "./components/tab";
import TabPanel from "./components/tab-panel";
import { ChevronDownIcon, ChevronUpIcon } from "../icons";

// Import MT4 platform images
import androidDesktop from "../../../assets/images/mt4/mt4-for-android-desktop.svg";
import androidMobile from "../../../assets/images/mt4/mt4-for-android-mobile.svg";
import iosDesktop from "../../../assets/images/mt4/mt4-for-ios-desktop.svg";
import iosMobile from "../../../assets/images/mt4/mt4-for-ios-mobile.svg";
import huaweiDesktop from "../../../assets/images/mt4/mt4-for-huawei-desktop.svg";
import huaweiMobile from "../../../assets/images/mt4/mt4-for-huawei-mobile.svg";
import macosDesktop from "../../../assets/images/mt4/mt4-for-macos-desktop.svg";
import macosMobile from "../../../assets/images/mt4/mt4-for-macos-mobile.svg";
import windowsDesktop from "../../../assets/images/mt4/mt4-for-windows-desktop.svg";
import windowsMobile from "../../../assets/images/mt4/mt4-for-windows-mobile.svg";
import webTraderDesktop from "../../../assets/images/mt4/mt4-webtrader-desktop.svg";
import webTraderMobile from "../../../assets/images/mt4/mt4-webtrader-mobile.svg";

// Import MT5 platform images
import mt5AndroidDesktop from "../../../assets/images/mt5/mt5-for-android-desktop.svg";
import mt5AndroidMobile from "../../../assets/images/mt5/mt5-for-android-mobile.svg";
import mt5IosDesktop from "../../../assets/images/mt5/mt5-for-ios-desktop.svg";
import mt5IosMobile from "../../../assets/images/mt5/mt5-for-ios-mobile.svg";
import mt5HuaweiDesktop from "../../../assets/images/mt5/mt5-for-huawei-desktop.svg";
import mt5HuaweiMobile from "../../../assets/images/mt5/mt5-for-huawei-mobile.svg";
import mt5MacosDesktop from "../../../assets/images/mt5/mt5-for-macos-desktop.svg";
import mt5MacosMobile from "../../../assets/images/mt5/mt5-for-macos-mobile.svg";
import mt5WindowsDesktop from "../../../assets/images/mt5/mt5-for-windows-desktop.svg";
import mt5WindowsMobile from "../../../assets/images/mt5/mt5-for-windows-mobile.svg";
import mt5WebTraderDesktop from "../../../assets/images/mt5/mt5-webtrader-desktop.svg";
import mt5WebTraderMobile from "../../../assets/images/mt5/mt5-webtrader-mobile.svg";

const Tabs = ({
  classname,
  tabList = [],
  activeTabIndex = 0,
  isMobileDropdown = false,
  images,
  isPlatformSelection = false,
  platformType = "mt4", // "mt4" or "mt5"
}) => {
  const [currentTabIndex, setCurrentTabIndex] = useState(activeTabIndex);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { isTablet, isMobile } = useWindowSize();
  const { t } = useTranslationWithVariables();
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    if (isMobile && isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMobile, isDropdownOpen]);

  const handleTabClick = (index) => {
    setCurrentTabIndex(index);
  };

  // Platform selection specific data
  const platformConfig = PLATFORM_SELECTION_CONFIG();
  const platformTabs = platformConfig.tabs;

  // Get download links based on platform type
  const downloadLinks =
    platformType === "mt5" ? MT5_DOWNLOAD_LINKS : MT4_DOWNLOAD_LINKS;
  const platformPrefix = platformType.toUpperCase();

  // Get platform images based on platform type
  const getPlatformImages = () => {
    if (platformType === "mt5") {
      return {
        androidDesktop: mt5AndroidDesktop,
        androidMobile: mt5AndroidMobile,
        iosDesktop: mt5IosDesktop,
        iosMobile: mt5IosMobile,
        huaweiDesktop: mt5HuaweiDesktop,
        huaweiMobile: mt5HuaweiMobile,
        macosDesktop: mt5MacosDesktop,
        macosMobile: mt5MacosMobile,
        windowsDesktop: mt5WindowsDesktop,
        windowsMobile: mt5WindowsMobile,
        webTraderDesktop: mt5WebTraderDesktop,
        webTraderMobile: mt5WebTraderMobile,
      };
    }
    return {
      androidDesktop,
      androidMobile,
      iosDesktop,
      iosMobile,
      huaweiDesktop,
      huaweiMobile,
      macosDesktop,
      macosMobile,
      windowsDesktop,
      windowsMobile,
      webTraderDesktop,
      webTraderMobile,
    };
  };

  const platformImages = getPlatformImages();

  // For MT5, hide Huawei option (no Huawei link available)
  const filteredMobilePlatforms = platformConfig.mobilePlatforms.filter(
    (platform) => !(platformType === "mt5" && platform.id === "huawei")
  );

  const mobilePlatforms = filteredMobilePlatforms.map((platform) => ({
    ...platform,
    name: `${platformPrefix} for ${platform.name.split(" for ")[1]}`,
    icon: isMobile
      ? platform.id === "android"
        ? platformImages.androidMobile
        : platform.id === "ios"
        ? platformImages.iosMobile
        : platformImages.huaweiMobile
      : platform.id === "android"
      ? platformImages.androidDesktop
      : platform.id === "ios"
      ? platformImages.iosDesktop
      : platformImages.huaweiDesktop,
    link:
      platform.id === "android"
        ? downloadLinks.getAndroidLink()
        : platform.id === "ios"
        ? downloadLinks.getIOSLink()
        : downloadLinks.getHuaweiLink && downloadLinks.getHuaweiLink(),
  }));

  const desktopPlatforms = [
    {
      id: "windows",
      name: `${platformPrefix} for Windows`,
      icon: isMobile
        ? platformImages.windowsMobile
        : platformImages.windowsDesktop,
      link: downloadLinks.getWindowsLink(),
    },
    {
      id: "macos",
      name: `${platformPrefix} for macOS`,
      icon: isMobile ? platformImages.macosMobile : platformImages.macosDesktop,
      link: downloadLinks.getMacLink(),
    },
  ];

  const webtraderPlatforms = [
    {
      id: "webtrader",
      name: `${platformPrefix} WebTrader`,
      icon: isMobile
        ? platformImages.webTraderMobile
        : platformImages.webTraderDesktop,
      link: downloadLinks.getWebTraderLink(),
    },
  ];

  // If this is platform selection, render the new structure
  if (isPlatformSelection) {
    return (
      <div className={cn("platform-selection", classname)} ref={dropdownRef}>
        {/* Platform Tabs */}
        <div
          className="platform-selection__tabs"
          onClick={(e) => {
            if (
              isMobile &&
              !e.target.closest(".platform-selection__tab-dropdown")
            ) {
              setIsDropdownOpen(!isDropdownOpen);
            }
          }}
        >
          {isMobile ? (
            // Mobile dropdown
            <button className="platform-selection__tab platform-selection__tab--active">
              {platformTabs[currentTabIndex].label}
              {isDropdownOpen ? (
                <ChevronUpIcon
                  className="platform-selection__dropdown-icon"
                  color="#ffffff"
                />
              ) : (
                <ChevronDownIcon
                  className="platform-selection__dropdown-icon"
                  color="#ffffff"
                />
              )}
            </button>
          ) : (
            // Desktop tabs
            platformTabs.map((tab, index) => (
              <button
                key={tab.id}
                className={cn("platform-selection__tab", {
                  "platform-selection__tab--active": currentTabIndex === index,
                })}
                onClick={() => setCurrentTabIndex(index)}
              >
                {tab.label}
              </button>
            ))
          )}

          {/* Tab Dropdown for Mobile */}
          {isMobile && (
            <div
              ref={dropdownRef}
              className={cn("platform-selection__tab-dropdown", {
                show: isDropdownOpen,
              })}
              style={{ display: isDropdownOpen ? "block" : "none" }}
            >
              {platformTabs.map((tab, index) => (
                <button
                  key={tab.id}
                  className="platform-selection__tab-option"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setCurrentTabIndex(index);
                    setIsDropdownOpen(false);
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Platform Cards */}
        {isMobile ? (
          // Mobile platform cards - always show current tab's platforms
          <>
            {currentTabIndex === 0 && (
              <div
                className="platform-selection__cards"
                style={{ display: "flex" }}
              >
                {mobilePlatforms.map((platform) => (
                  <a
                    key={platform.id}
                    href={platform.link}
                    target="_blank"
                    rel="noreferrer"
                    className="platform-selection__card"
                    style={{
                      backgroundImage: `url(${platform.icon})`,
                      backgroundSize: "contain",
                      backgroundPosition: "center",
                      backgroundRepeat: "no-repeat",
                    }}
                  />
                ))}
              </div>
            )}

            {currentTabIndex === 1 && (
              <div
                className="platform-selection__cards"
                style={{ display: "flex" }}
              >
                {desktopPlatforms.map((platform) => (
                  <a
                    key={platform.id}
                    href={platform.link}
                    target="_blank"
                    rel="noreferrer"
                    className="platform-selection__card"
                    style={{
                      backgroundImage: `url(${platform.icon})`,
                      backgroundSize: "contain",
                      backgroundPosition: "center",
                      backgroundRepeat: "no-repeat",
                    }}
                  />
                ))}
              </div>
            )}

            {currentTabIndex === 2 && (
              <div
                className="platform-selection__cards"
                style={{ display: "flex" }}
              >
                {webtraderPlatforms.map((platform) => (
                  <a
                    key={platform.id}
                    href={platform.link}
                    target="_blank"
                    rel="noreferrer"
                    className="platform-selection__card"
                    style={{
                      backgroundImage: `url(${platform.icon})`,
                      backgroundSize: "contain",
                      backgroundPosition: "center",
                      backgroundRepeat: "no-repeat",
                    }}
                  />
                ))}
              </div>
            )}
          </>
        ) : (
          // Desktop cards
          <>
            {currentTabIndex === 0 && (
              <div className="platform-selection__cards">
                {mobilePlatforms.map((platform) => (
                  <a
                    key={platform.id}
                    href={platform.link}
                    target="_blank"
                    rel="noreferrer"
                    className="platform-selection__card"
                    style={{
                      backgroundImage: `url(${platform.icon})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      backgroundRepeat: "no-repeat",
                    }}
                  />
                ))}
              </div>
            )}

            {currentTabIndex === 1 && (
              <div className="platform-selection__cards">
                {desktopPlatforms.map((platform) => (
                  <a
                    key={platform.id}
                    href={platform.link}
                    target="_blank"
                    rel="noreferrer"
                    className="platform-selection__card"
                    style={{
                      backgroundImage: `url(${platform.icon})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      backgroundRepeat: "no-repeat",
                    }}
                  />
                ))}
              </div>
            )}

            {currentTabIndex === 2 && (
              <div className="platform-selection__cards">
                {webtraderPlatforms.map((platform) => (
                  <a
                    key={platform.id}
                    href={platform.link}
                    target="_blank"
                    rel="noreferrer"
                    className="platform-selection__card"
                    style={{
                      backgroundImage: `url(${platform.icon})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      backgroundRepeat: "no-repeat",
                    }}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    );
  }

  // Original tabs functionality
  return (
    <div className={cn("tabs", classname)} data-tabs="true">
      <div className="tabs__tablist-wrapper">
        {isTablet && isMobileDropdown ? (
          <Dropdown
            className="tabs__dropdown"
            selectedItem={{
              title: tabList[currentTabIndex].title,
              value: currentTabIndex,
            }}
            items={tabList.map(({ id, title, onClick }, tabIndex) => {
              return {
                title,
                value: tabIndex,
                onClick,
              };
            })}
            setSelectedItem={({ value }) => {
              setCurrentTabIndex(value);
            }}
            isDropdownShown
          />
        ) : (
          <ul role="tablist" className="tabs__tablist">
            {tabList.map(
              ({ title, isTitleWithIcon, icon, onClick }, tabIndex) => (
                <Tab
                  key={`${stringTransformToKebabCase(title)}_tab`}
                  tabIndex={tabIndex}
                  isSelected={currentTabIndex === tabIndex}
                  onTabClick={() => {
                    if (onClick) {
                      onClick();
                    }
                    handleTabClick(tabIndex);
                  }}
                >
                  {isTitleWithIcon && icon}
                  <span>{title}</span>
                </Tab>
              )
            )}
          </ul>
        )}
      </div>
      <div className="tabs__panels">
        {tabList.map(({ content }, tabIndex) => (
          <TabPanel
            key={`${stringTransformToKebabCase(
              tabList[tabIndex].title
            )}_tabPanel`}
            tabIndex={tabIndex}
            isSelected={currentTabIndex === tabIndex}
          >
            {content}
          </TabPanel>
        ))}
        {images && (
          <div className="tabs__images">
            {images.map((imageItem, key) => (
              <img
                key={`tabs-img-${key}`}
                src={imageItem.logo}
                alt={imageItem.alt}
                className="tabs__img"
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

Tabs.propTypes = {
  classname: PropTypes.string,
  tabList: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      isTitleWithIcon: PropTypes.bool,
      icon: PropTypes.node,
      onClick: PropTypes.func,
      content: PropTypes.node.isRequired,
    })
  ),
  activeTabIndex: PropTypes.number,
  isMobileDropdown: PropTypes.bool,
  images: PropTypes.arrayOf(
    PropTypes.shape({
      logo: PropTypes.string.isRequired,
      alt: PropTypes.string.isRequired,
    })
  ),
  isPlatformSelection: PropTypes.bool,
  platformType: PropTypes.oneOf(["mt4", "mt5"]),
};

export default Tabs;
