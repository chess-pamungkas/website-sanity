import React, { cloneElement, createElement } from "react";
import Layout from "./src/components/shared/layout";

// Critical font assets (importing ensures hashed URLs are available at build time)
import SofiaProRegularWoff2 from "./src/assets/fonts/SofiaProRegular.woff2";
import SofiaProMediumWoff2 from "./src/assets/fonts/SofiaProMedium.woff2";
import SofiaProBoldWoff2 from "./src/assets/fonts/SofiaProBold.woff2";
import SofiaProBlackWoff2 from "./src/assets/fonts/SofiaProBlack.woff2";
import RobotoMediumTtf from "./src/assets/fonts/Roboto-Medium.ttf";
// Critical LCP images (globe image is the LCP element)
// Using static folder path for WebP (more reliable in Gatsby)
const GlobeImage = "/images/globe.webp";
const HandImage = "/images/hand.webp";

export const onRenderBody = ({
  setPostBodyComponents,
  setHeadComponents,
  setPreBodyComponents,
  pathname,
}) => {
  const preBodyComponents = [
    // // Default content for Google bot fast mode (Hidden for users)
    <section
      key="default-nojs-content"
      id="default-nojs"
      className="main-promotion"
    >
      <div className="main-promotion__wrapper">
        <div className="main-promotion__block">
          <h1 className="main-promotion__title-wrapper">
            <span className="main-promotion__title">
              A Perfectly optimised trading experience for YOU
            </span>
          </h1>
        </div>
      </div>
      <div className="promotion">
        <div className="promotion__wrapper">
          <div className="promotion__block">
            <div className="promotion__description">
              Start building your trading portfolio with as little as $20 USD or
              equivalent, with 8 base currencies available. Trade EURUSD, XAUUSD
              and many other assets with one of the lowest average spreads in
              the industry, starting at 0.0 pips. Your money, your way, enjoy
              instant withdrawals with multiple withdrawal methods and multiple
              trusted funding channels with no fees.
            </div>
          </div>
          <div className="promotion__block">
            <img src="" alt="" className="promotion__img" />
          </div>
        </div>
      </div>
    </section>,
    ,
    <script
      key="clean-bis-attributes"
      dangerouslySetInnerHTML={{
        __html: `(function(){try{var nodes=document.querySelectorAll('[bis_skin_checked]');for(var i=0;i<nodes.length;i++){nodes[i].removeAttribute('bis_skin_checked');}}catch(e){}})();`,
      }}
    />,
  ];

  // CRITICAL: Script to ensure LCP image is visible IMMEDIATELY, even before React hydration
  // This runs as early as possible to reduce element render delay to near zero
  if (pathname === "/" || (pathname && pathname.match(/^\/[a-z]{2}\/?$/))) {
    preBodyComponents.push(
      <script
        key="lcp-image-optimizer"
        dangerouslySetInnerHTML={{
          __html: `
            (function() {
              // CRITICAL: Ensure LCP image is visible IMMEDIATELY
              // This function runs multiple times to catch image as soon as it appears in DOM
              function ensureLCPImageVisible() {
                // Find image container and element
                var heroImg = document.querySelector('.main-promotion__hero-img');
                var heroImgElement = document.querySelector('.main-promotion__hero-img-element');
                
                // Force container visibility immediately
                if (heroImg) {
                  heroImg.style.setProperty('display', 'block', 'important');
                  heroImg.style.setProperty('visibility', 'visible', 'important');
                  heroImg.style.setProperty('opacity', '0.62', 'important');
                  heroImg.style.setProperty('position', 'absolute', 'important');
                  heroImg.style.setProperty('bottom', '0', 'important');
                  heroImg.style.setProperty('right', '-50px', 'important');
                  heroImg.style.setProperty('width', '734px', 'important');
                  heroImg.style.setProperty('height', '734px', 'important');
                  heroImg.style.setProperty('z-index', '1', 'important');
                }
                
                // Force image element visibility immediately
                if (heroImgElement) {
                  heroImgElement.style.setProperty('display', 'block', 'important');
                  heroImgElement.style.setProperty('visibility', 'visible', 'important');
                  heroImgElement.style.setProperty('width', '100%', 'important');
                  heroImgElement.style.setProperty('height', '100%', 'important');
                  heroImgElement.style.setProperty('object-fit', 'contain', 'important');
                  heroImgElement.style.setProperty('object-position', 'bottom center', 'important');
                }
              }
              
              // Run IMMEDIATELY (synchronous execution)
              ensureLCPImageVisible();
              
              // Run on DOM ready
              if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', ensureLCPImageVisible, { once: true });
              } else {
                ensureLCPImageVisible();
              }
              
              // Run multiple times to catch image as soon as React renders it
              // Use requestAnimationFrame for immediate execution
              if (window.requestAnimationFrame) {
                requestAnimationFrame(ensureLCPImageVisible);
                requestAnimationFrame(function() {
                  requestAnimationFrame(ensureLCPImageVisible);
                });
              }
              
              // Also use setTimeout as fallback
              setTimeout(ensureLCPImageVisible, 0);
              setTimeout(ensureLCPImageVisible, 10);
              setTimeout(ensureLCPImageVisible, 50);
              setTimeout(ensureLCPImageVisible, 100);
              
              // Monitor DOM for image appearance (MutationObserver)
              if (window.MutationObserver) {
                var observer = new MutationObserver(function(mutations) {
                  var found = false;
                  mutations.forEach(function(mutation) {
                    if (mutation.addedNodes.length > 0) {
                      mutation.addedNodes.forEach(function(node) {
                        if (node.nodeType === 1) {
                          var img = node.querySelector && node.querySelector('.main-promotion__hero-img-element');
                          if (img || (node.classList && node.classList.contains('main-promotion__hero-img-element'))) {
                            found = true;
                          }
                        }
                      });
                    }
                  });
                  if (found) {
                    ensureLCPImageVisible();
                  }
                });
                
                if (document.body) {
                  observer.observe(document.body, {
                    childList: true,
                    subtree: true,
                    attributes: true,
                    attributeFilter: ['style', 'class']
                  });
                  
                  // Stop observing after 3 seconds (image should be visible by then)
                  setTimeout(function() {
                    observer.disconnect();
                  }, 3000);
                }
              }
            })();
          `,
        }}
      />
    );
  }

  setPreBodyComponents(preBodyComponents);
  setPostBodyComponents([
    <script
      key="live-chat"
      defer
      async
      id="convrs-webchat"
      src={process.env.GATSBY_CONVRS_LIVECHAT}
    />,
    <script
      key="livechat-debug"
      dangerouslySetInnerHTML={{
        __html: `
          // Debug livechat loading (silent - no console logs)
          (function() {
            const checkLivechat = setInterval(function() {
              const livechatScript = document.getElementById('convrs-webchat');
              const livechatElements = document.querySelectorAll('[id*="convrs"], [class*="convrs"]');
              
              if (livechatElements.length > 0) {
                clearInterval(checkLivechat);
              }
            }, 2000);
            
            // Stop checking after 30 seconds
            setTimeout(function() {
              clearInterval(checkLivechat);
            }, 30000);
          })();
        `,
      }}
    />,
    <script
      key="livechat-management"
      dangerouslySetInnerHTML={{
        __html: `
          (function() {
            // Add global styles to ensure livechat is above header
            const addLivechatStyles = function() {
              if (document.getElementById('livechat-z-index-fix')) return;
              
              const style = document.createElement('style');
              style.id = 'livechat-z-index-fix';
              style.textContent = \`
                /* Ensure livechat is above header-wrapper (z-index: 1000) and header (z-index: 1001) */
                #convrs-shadow-host,
                [id*="convrs-shadow-host"] {
                  z-index: 1002 !important;
                  position: relative !important;
                  pointer-events: auto !important;
                }
                
                /* Ensure livechat container is above header */
                .convrs-chat-webchat-container-full,
                [id*="convrs-chat-webchat-container"] {
                  z-index: 1002 !important;
                }
                
                /* Ensure livechat header is above header-wrapper - most important for close button */
                .convrs-chat-header-full,
                [id*="convrs-chat-header"] {
                  z-index: 1003 !important;
                  position: relative !important;
                  pointer-events: auto !important;
                }
                
                /* On mobile, ensure livechat full screen mode is above header */
                @media only screen and (max-width: 480px) {
                  .convrs-chat-webchat-container-full {
                    z-index: 2147483647 !important;
                  }
                  .convrs-chat-header-full {
                    z-index: 2147483647 !important;
                    pointer-events: auto !important;
                  }
                }
              \`;
              document.head.appendChild(style);
            };
            
            // Add styles immediately
            if (document.head) {
              addLivechatStyles();
            } else {
              document.addEventListener('DOMContentLoaded', addLivechatStyles);
            }
            
            // Manage livechat z-index and behavior to prevent conflicts with burger menu
            function manageLivechatZIndex() {
              try {
                const livechatElements = document.querySelectorAll('[id*="convrs"], [class*="convrs"]');
                
                if (livechatElements.length === 0) {
                  return; // No livechat elements yet, skip management
                }
                
                // Check if registration popup is open
                const registrationPopup = document.querySelector('.popup-registration');
                const isRegistrationPopupOpen = registrationPopup && 
                  (registrationPopup.style.display !== 'none' && 
                   registrationPopup.style.visibility !== 'hidden');
                
                // Check if we're on mobile
                const isMobileDevice = window.innerWidth <= 767;
                
                // Check if burger menu is open
                // Check both checkbox state and CSS class (more reliable)
                const burgerMenuCheckbox = document.getElementById('bmt');
                const burgerMenuTrigger = document.querySelector('.burger-menu__trigger');
                const isBurgerMenuOpenByCheckbox = burgerMenuCheckbox && burgerMenuCheckbox.checked;
                const isBurgerMenuOpenByClass = burgerMenuTrigger && burgerMenuTrigger.classList.contains('burger-menu__trigger--open');
                const isBurgerMenuOpen = isBurgerMenuOpenByCheckbox || isBurgerMenuOpenByClass;
                
                // Check if we're on a webtrader page
                const currentPath = window.location.pathname;
                const isWebtraderPage = currentPath.includes('webtrader');
                
                livechatElements.forEach(el => {
                  if (el && el.style) {
                    // Priority 1: Check if registration popup is open on mobile
                    if (isRegistrationPopupOpen && isMobileDevice) {
                      // Hide livechat when registration popup is open on mobile
                      el.style.setProperty('display', 'none', 'important');
                      el.style.setProperty('visibility', 'hidden', 'important');
                      el.style.setProperty('pointer-events', 'none', 'important');
                      el.setAttribute('data-registration-popup-hidden', 'true');
                      return;
                    }
                    
                    // Priority 2: Check if burger menu is open
                    // Use same pattern as popup registration: if condition, then hide and set attribute
                    if (isBurgerMenuOpen) {
                      // Hide livechat when burger menu is open
                      el.style.setProperty('display', 'none', 'important');
                      el.style.setProperty('visibility', 'hidden', 'important');
                      el.style.setProperty('pointer-events', 'none', 'important');
                      el.setAttribute('data-burger-menu-hidden', 'true');
                    } else {
                      // Burger menu is closed - use same pattern as popup registration
                      // Show livechat when burger menu is closed
                      // Only restore if it wasn't hidden by registration popup or other reasons
                      const isBurgerMenuHidden = el.getAttribute('data-burger-menu-hidden') === 'true';
                      const isRegistrationPopupHidden = el.getAttribute('data-registration-popup-hidden') === 'true';
                      
                      if (isBurgerMenuHidden && !isRegistrationPopupHidden && !isWebtraderPage) {
                        // Force remove all hiding styles - be more aggressive
                        // First remove the important styles
                        el.style.removeProperty('display');
                        el.style.removeProperty('visibility');
                        el.style.removeProperty('pointer-events');
                        // Remove attribute immediately
                        el.removeAttribute('data-burger-menu-hidden');
                        // Ensure z-index is set correctly after restore
                        el.style.setProperty('z-index', '1002', 'important');
                        // Force a reflow to ensure changes take effect
                        void el.offsetHeight;
                      }
                    }
                    
                    // Priority 3: Check if we're on a webtrader page
                    if (isWebtraderPage) {
                      // Hide livechat on webtrader pages
                      el.style.setProperty('display', 'none', 'important');
                      el.style.setProperty('visibility', 'hidden', 'important');
                      el.style.setProperty('pointer-events', 'none', 'important');
                      return;
                    }
                    
                    // If livechat was hidden by registration popup, restore it when popup is closed
                    // Use same pattern as popup registration: check attribute, then restore if conditions allow
                    const isRegistrationPopupHidden = el.getAttribute('data-registration-popup-hidden') === 'true';
                    if (isRegistrationPopupHidden && !isRegistrationPopupOpen) {
                      // Show livechat when popup is closed
                      // Only restore if it wasn't hidden by burger menu or other reasons
                      const isBurgerMenuHiddenCheck = el.getAttribute('data-burger-menu-hidden') === 'true';
                      if (!isBurgerMenuHiddenCheck && !isWebtraderPage) {
                        el.style.removeProperty('display');
                        el.style.removeProperty('visibility');
                        el.style.removeProperty('pointer-events');
                        el.removeAttribute('data-registration-popup-hidden');
                      }
                    }
                    
                    // For normal pages, ensure livechat is visible and properly z-indexed
                    // Set z-index higher than header-wrapper (1000) and header (1001)
                    el.style.setProperty('z-index', '1002', 'important');
                    
                    // Also ensure livechat container and header are above header-wrapper
                    // Use querySelectorAll to find all nested elements
                    try {
                      // Find shadow host and shadow root elements
                      const shadowHost = el.querySelector && el.querySelector('#convrs-shadow-host');
                      if (shadowHost) {
                        shadowHost.style.setProperty('z-index', '1002', 'important');
                        shadowHost.style.setProperty('position', 'relative', 'important');
                        shadowHost.style.setProperty('pointer-events', 'auto', 'important');
                      }
                      
                      // Find chat container (may be in shadow DOM, so we try direct query)
                      const chatContainers = el.querySelectorAll && el.querySelectorAll('.convrs-chat-webchat-container-full, [id*="convrs-chat-webchat-container"]');
                      if (chatContainers && chatContainers.length > 0) {
                        chatContainers.forEach(container => {
                          container.style.setProperty('z-index', '1002', 'important');
                          container.style.setProperty('position', 'fixed', 'important');
                        });
                      }
                      
                      // Find chat header (most important - this is what user clicks to close)
                      const chatHeaders = el.querySelectorAll && el.querySelectorAll('.convrs-chat-header-full, [id*="convrs-chat-header"]');
                      if (chatHeaders && chatHeaders.length > 0) {
                        chatHeaders.forEach(header => {
                          header.style.setProperty('z-index', '1003', 'important');
                          header.style.setProperty('position', 'relative', 'important');
                          header.style.setProperty('pointer-events', 'auto', 'important');
                        });
                      }
                    } catch (e) {
                      // Silent fail if querySelector fails
                    }
                    
                    // Force LTR direction for live chat widget in RTL pages
                    const isRTL = document.documentElement.getAttribute('dir') === 'rtl' || 
                                 document.body.getAttribute('dir') === 'rtl' ||
                                 document.documentElement.dir === 'rtl';
                    if (isRTL) {
                      el.style.setProperty('direction', 'ltr', 'important');
                      el.setAttribute('dir', 'ltr');
                      
                      // Apply LTR to all child elements
                      const allChildren = el.querySelectorAll('*');
                      allChildren.forEach(child => {
                        if (child.style) {
                          child.style.setProperty('direction', 'ltr', 'important');
                          child.style.setProperty('text-align', 'left', 'important');
                        }
                        if (child.setAttribute) {
                          child.setAttribute('dir', 'ltr');
                        }
                      });
                    }
                  }
                });
              } catch (error) {
                // Silent fail to avoid console spam
              }
            }
            
            // Monitor for dynamically added livechat elements
            let observer;
            try {
              observer = new MutationObserver(function(mutations) {
                mutations.forEach(function(mutation) {
                  if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach(function(node) {
                      if (node.nodeType === 1 && (node.id && node.id.includes('convrs') || 
                          (node.className && typeof node.className === 'string' && node.className.includes('convrs')))) {
                        setTimeout(manageLivechatZIndex, 100);
                        
                        // Also apply LTR styling immediately for new elements
                        const isRTL = document.documentElement.getAttribute('dir') === 'rtl' || 
                                     document.body.getAttribute('dir') === 'rtl' ||
                                     document.documentElement.dir === 'rtl';
                        if (isRTL && node.style) {
                          node.style.setProperty('direction', 'ltr', 'important');
                          if (node.setAttribute) {
                            node.setAttribute('dir', 'ltr');
                          }
                        }
                      }
                    });
                  }
                });
              });
              
              // Start observing
              if (document.body) {
                observer.observe(document.body, {
                  childList: true,
                  subtree: true
                });
              }
            } catch (error) {
              // Silent fail
            }
            
            // Run management on burger menu state change
            // Listen for clicks on burger menu trigger (including when it has --open class)
            document.addEventListener('click', function(e) {
              const burgerTrigger = e.target.closest('.burger-menu__trigger');
              const burgerCheckbox = e.target.closest('#bmt');
              const burgerBar = e.target.closest('.burger-menu__bar');
              // Also check if clicking on any element inside burger menu
              if (burgerTrigger || burgerCheckbox || burgerBar || 
                  (e.target.closest && e.target.closest('.burger-menu'))) {
                // Use multiple timeouts to ensure we catch the state change
                setTimeout(manageLivechatZIndex, 50);
                setTimeout(manageLivechatZIndex, 150);
                setTimeout(manageLivechatZIndex, 300);
              }
            }, true); // Use capture phase to catch earlier
            
            // Also listen for change events on the checkbox (more reliable)
            document.addEventListener('change', function(e) {
              if (e.target && e.target.id === 'bmt') {
                setTimeout(manageLivechatZIndex, 50);
                setTimeout(manageLivechatZIndex, 150);
              }
            }, true);
            
            // Use MutationObserver to watch for checkbox state changes AND class changes
            try {
              const burgerObserver = new MutationObserver(function(mutations) {
                let shouldCheck = false;
                mutations.forEach(function(mutation) {
                  // Check for checkbox checked attribute changes
                  if (mutation.type === 'attributes' && mutation.attributeName === 'checked') {
                    shouldCheck = true;
                  }
                  // Check for class changes on trigger button
                  if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                    const target = mutation.target;
                    if (target && (target.classList.contains('burger-menu__trigger') || 
                        target.id === 'bmt')) {
                      shouldCheck = true;
                    }
                  }
                  // Check for class changes in childList (when trigger is added/removed)
                  if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach(function(node) {
                      if (node.nodeType === 1 && 
                          (node.classList && node.classList.contains('burger-menu__trigger') ||
                           node.id === 'bmt')) {
                        shouldCheck = true;
                      }
                    });
                  }
                });
                if (shouldCheck) {
                  setTimeout(manageLivechatZIndex, 100);
                }
              });
              
              // Observe the checkbox and trigger when they become available
              const observeBurger = setInterval(function() {
                const burgerCheckbox = document.getElementById('bmt');
                const burgerTrigger = document.querySelector('.burger-menu__trigger');
                
                if (burgerCheckbox) {
                  burgerObserver.observe(burgerCheckbox, {
                    attributes: true,
                    attributeFilter: ['checked', 'class']
                  });
                }
                
                if (burgerTrigger) {
                  burgerObserver.observe(burgerTrigger, {
                    attributes: true,
                    attributeFilter: ['class']
                  });
                }
                
                if (burgerCheckbox || burgerTrigger) {
                  // Also observe body for class changes on trigger (in case it's dynamically added)
                  if (document.body) {
                    burgerObserver.observe(document.body, {
                      childList: true,
                      subtree: true,
                      attributes: true,
                      attributeFilter: ['class']
                    });
                  }
                  clearInterval(observeBurger);
                }
              }, 500);
              
              // Stop trying after 10 seconds
              setTimeout(function() {
                clearInterval(observeBurger);
              }, 10000);
            } catch (error) {
              // Silent fail
            }
            
            // Monitor for registration popup open/close
            // Use MutationObserver to detect when popup is added/removed or visibility changes
            let popupObserver;
            try {
              popupObserver = new MutationObserver(function(mutations) {
                let shouldCheck = false;
                mutations.forEach(function(mutation) {
                  if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach(function(node) {
                      if (node.nodeType === 1 && 
                          (node.classList && node.classList.contains('popup-registration'))) {
                        shouldCheck = true;
                      }
                    });
                    mutation.removedNodes.forEach(function(node) {
                      if (node.nodeType === 1 && 
                          (node.classList && node.classList.contains('popup-registration'))) {
                        shouldCheck = true;
                      }
                    });
                  }
                  if (mutation.type === 'attributes' && 
                      (mutation.attributeName === 'style' || mutation.attributeName === 'class')) {
                    const target = mutation.target;
                    if (target && target.classList && target.classList.contains('popup-registration')) {
                      shouldCheck = true;
                    }
                  }
                });
                if (shouldCheck) {
                  setTimeout(manageLivechatZIndex, 100);
                }
              });
              
              if (document.body) {
                popupObserver.observe(document.body, {
                  childList: true,
                  subtree: true,
                  attributes: true,
                  attributeFilter: ['style', 'class']
                });
              }
            } catch (error) {
              // Silent fail
            }
            
            // Run immediately after a delay to let livechat load
            setTimeout(manageLivechatZIndex, 2000);
            
            // Run on DOM ready
            if (document.readyState === 'loading') {
              document.addEventListener('DOMContentLoaded', function() {
                setTimeout(manageLivechatZIndex, 2000);
              });
            }
            
            // Add polling to check burger menu state periodically (similar to popup registration useEffect)
            // This ensures we catch state changes even if events don't fire
            let lastBurgerMenuState = null;
            const burgerMenuPollInterval = setInterval(function() {
              const burgerCheckbox = document.getElementById('bmt');
              const burgerTrigger = document.querySelector('.burger-menu__trigger');
              const currentState = (burgerCheckbox && burgerCheckbox.checked) || 
                                   (burgerTrigger && burgerTrigger.classList.contains('burger-menu__trigger--open'));
              
              // Only call manageLivechatZIndex if state changed
              if (currentState !== lastBurgerMenuState) {
                lastBurgerMenuState = currentState;
                manageLivechatZIndex();
              }
            }, 200); // Check every 200ms for faster response
            
            // Clean up interval after 5 minutes (should be enough for page session)
            setTimeout(function() {
              clearInterval(burgerMenuPollInterval);
            }, 300000);
          })();
        `,
      }}
    />,
    <script
      key="mt-widget"
      type="text/javascript"
      defer
      async
      src="https://metatraderweb.app/trade/widget.js"
    />,
  ]);

  /*
   * NOTE: Preconnect hints are now added in onPreRenderHTML to ensure they're
   * at the very beginning of <head> for optimal performance.
   *
   * Third-party resource limitations (cannot be fixed directly):
   *
   * 1. Cache lifetimes for third-party resources:
   *    - Trustpilot widgets (widget.trustpilot.com) - Cache headers controlled by Trustpilot
   *    - MetaTrader widget (metatraderweb.app) - Cache headers controlled by MetaTrader
   *    - Conv.rs livechat (webchat.conv.rs) - Cache headers controlled by Conv.rs
   *    These resources are served by third-party servers, so we cannot set cache headers.
   *    Preconnect hints are added in onPreRenderHTML to reduce connection latency.
   *
   * 2. Font display for Google Fonts:
   *    - Google Fonts loaded by third-party scripts (e.g., Trustpilot) don't have font-display
   *    - We cannot add font-display to fonts loaded by third-party scripts
   *    - Our own fonts (Sofia Pro, Roboto) already have font-display: swap in typography.scss
   *    - Preconnect hints are added in onPreRenderHTML to help with font loading performance
   *    - To fully resolve this, contact TrustPilot to request font-display support
   *
   * 3. Image delivery optimization:
   *    - Account Comparison Background SVG (3.6 MB) - Optimized with lazy loading and low priority
   *      TODO: Optimize SVG file by removing embedded bitmap images and using SVG paths
   *    - Conv.rs avatar image (53 KiB) - Third-party image, cannot optimize directly
   *      Contact Conv.rs to request image optimization (WebP/AVIF format, responsive sizing)
   *
   * To improve these metrics, contact the third-party providers:
   * - Trustpilot: Request better cache headers and font-display support for Google Fonts
   * - MetaTrader: Request better cache headers
   * - Conv.rs: Request better cache headers (currently Cache TTL: None) and image optimization
   */

  setHeadComponents([
    // Preload critical fonts used above the fold
    <link
      key="preload-font-sofia-regular"
      rel="preload"
      href={SofiaProRegularWoff2}
      as="font"
      type="font/woff2"
      crossOrigin="anonymous"
    />,
    <link
      key="preload-font-sofia-medium"
      rel="preload"
      href={SofiaProMediumWoff2}
      as="font"
      type="font/woff2"
      crossOrigin="anonymous"
    />,
    <link
      key="preload-font-sofia-bold"
      rel="preload"
      href={SofiaProBoldWoff2}
      as="font"
      type="font/woff2"
      crossOrigin="anonymous"
    />,
    <link
      key="preload-font-sofia-black"
      rel="preload"
      href={SofiaProBlackWoff2}
      as="font"
      type="font/woff2"
      crossOrigin="anonymous"
    />,
    <link
      key="preload-font-roboto-medium"
      rel="preload"
      href={RobotoMediumTtf}
      as="font"
      type="font/ttf"
      crossOrigin="anonymous"
    />,
    // Default title and description for Google bot fast mode
    <title key="default-title">
      Forex & CFD Trading on Stocks, Indices, Oil, Gold by OQtima™
    </title>,
    <meta
      key="default-description"
      name="description"
      content="Forex, cfd trading on stocks, indices, oil and gold with the most advanced trading platforms. Trade with OQtima™, a licensed forex broker."
    />,
    <meta key="og-type" property="og:type" content="website" />,
    <meta
      key="og-title"
      property="og:title"
      content="Forex & CFD Trading on Stocks, Indices, Oil, Gold by OQtima™"
    />,
    <meta
      key="og-desc"
      property="og:description"
      content="Forex, cfd trading on stocks, indices, oil and gold with the most advanced trading platforms. Trade with OQtima™, a licensed forex broker."
    />,
    <meta key="og-img" property="og:image" content="/preview.jpeg" />,
    <meta key="tw-card" name="twitter:card" content="summary_large_image" />,
    <meta
      key="tw-title"
      name="twitter:title"
      content="Forex & CFD Trading on Stocks, Indices, Oil, Gold by OQtima™"
    />,
    <meta
      key="tw-desc"
      name="twitter:description"
      content="Forex, cfd trading on stocks, indices, oil and gold with the most advanced trading platforms. Trade with OQtima™, a licensed forex broker."
    />,
    <meta key="tw-img" name="twitter:image" content="/preview.jpeg" />,
  ]);
};

// Preload LCP images early in HTML head for optimal performance
// This ensures images are discoverable in initial document (required by PageSpeed Insights)
// Globe image is the LCP element, so it must be preloaded first in initial HTML
export const onPreRenderHTML = ({
  getHeadComponents,
  replaceHeadComponents,
  pathname,
}) => {
  const headComponents = getHeadComponents();
  const earlyHints = [];

  // Preconnect hints - MUST be at the very beginning of head for optimal performance
  // These establish connections early to reduce critical path latency
  const apiUrl = process.env.GATSBY_OQTIMA_API_URL;
  const preconnectLinks = [];

  // CRITICAL: Preconnect to API backend (dev-back.oqt-ima.com) - 600ms LCP savings (highest priority!)
  // Always add this preconnect regardless of environment variable to ensure it's always present
  const apiOrigins = new Set();

  // Add from environment variable if available
  if (apiUrl) {
    try {
      apiOrigins.add(new URL(apiUrl).origin);
    } catch (e) {
      // Invalid URL, ignore
    }
  }

  // Also add common API origins to ensure preconnect is always present
  // This ensures preconnect works even if env var is missing
  apiOrigins.add("https://dev-back.oqt-ima.com");
  apiOrigins.add("https://back.oqt-ima.com");
  apiOrigins.add("https://back.oqtima.com");

  // Add preconnect for all API origins
  apiOrigins.forEach((origin) => {
    preconnectLinks.push(
      <link
        key={`preconnect-api-${origin}`}
        rel="preconnect"
        href={origin}
        crossOrigin="anonymous"
      />,
      <link
        key={`dns-prefetch-api-${origin}`}
        rel="dns-prefetch"
        href={origin}
      />
    );
  });

  // Preconnect to Trustpilot widget - 190ms LCP savings (highest priority)
  preconnectLinks.push(
    <link
      key="preconnect-trustpilot"
      rel="preconnect"
      href="https://widget.trustpilot.com"
      crossOrigin="anonymous"
    />,
    <link
      key="dns-prefetch-trustpilot"
      rel="dns-prefetch"
      href="https://widget.trustpilot.com"
    />
  );

  // Preconnect to Google (www.google.com) - 80ms LCP savings (for reCAPTCHA)
  preconnectLinks.push(
    <link
      key="preconnect-google"
      rel="preconnect"
      href="https://www.google.com"
      crossOrigin="anonymous"
    />,
    <link
      key="dns-prefetch-google"
      rel="dns-prefetch"
      href="https://www.google.com"
    />
  );

  // Preconnect to Google reCAPTCHA API
  preconnectLinks.push(
    <link
      key="preconnect-google-recaptcha"
      rel="preconnect"
      href="https://www.gstatic.com"
      crossOrigin="anonymous"
    />,
    <link
      key="dns-prefetch-google-recaptcha"
      rel="dns-prefetch"
      href="https://www.gstatic.com"
    />
  );

  // Preconnect to MetaTrader widget (for /trade/widget.js)
  preconnectLinks.push(
    <link
      key="preconnect-metatrader"
      rel="preconnect"
      href="https://metatraderweb.app"
      crossOrigin="anonymous"
    />,
    <link
      key="dns-prefetch-metatrader"
      rel="dns-prefetch"
      href="https://metatraderweb.app"
    />
  );

  // Preconnect to Google Fonts (used by third-party widgets)
  preconnectLinks.push(
    <link
      key="preconnect-google-fonts"
      rel="preconnect"
      href="https://fonts.gstatic.com"
      crossOrigin="anonymous"
    />,
    <link
      key="dns-prefetch-google-fonts"
      rel="dns-prefetch"
      href="https://fonts.gstatic.com"
    />
  );

  // Preconnect to Conv.rs livechat (webchat.conv.rs and conv.rs)
  // CRITICAL: These resources have Cache TTL: None, so preconnect is essential
  preconnectLinks.push(
    <link
      key="preconnect-convrs-webchat"
      rel="preconnect"
      href="https://webchat.conv.rs"
      crossOrigin="anonymous"
    />,
    <link
      key="dns-prefetch-convrs-webchat"
      rel="dns-prefetch"
      href="https://webchat.conv.rs"
    />,
    <link
      key="preconnect-convrs"
      rel="preconnect"
      href="https://conv.rs"
      crossOrigin="anonymous"
    />,
    <link key="dns-prefetch-convrs" rel="dns-prefetch" href="https://conv.rs" />
  );

  // CRITICAL: Preconnect links MUST be added for ALL pages, not just homepage
  // These reduce critical path latency significantly (600ms + 90ms savings)
  earlyHints.push(...preconnectLinks);

  // Preload LCP images for homepage/main promotion pages
  // These must be in initial HTML, not added later by React/Helmet
  if (pathname === "/" || pathname.match(/^\/[a-z]{2}\/?$/)) {
    // Globe image is the LCP element - must be preloaded first
    earlyHints.push(
      <link
        key="preload-globe-image"
        rel="preload"
        as="image"
        href={GlobeImage}
        fetchpriority="high"
      />
    );
    // Hand image is also important for hero section
    earlyHints.push(
      <link
        key="preload-hand-image"
        rel="preload"
        as="image"
        href={HandImage}
        fetchpriority="high"
      />
    );
    // Add critical CSS inline to ensure LCP image container is visible immediately
    earlyHints.push(
      <style
        key="lcp-critical-css"
        dangerouslySetInnerHTML={{
          __html: `
            /* Critical CSS for LCP image - ensures immediate visibility */
            .main-promotion__hero-img {
              position: absolute !important;
              bottom: 0 !important;
              right: -50px !important;
              width: 734px !important;
              height: 734px !important;
              opacity: 0.62 !important;
              z-index: 1 !important;
              display: block !important;
              visibility: visible !important;
            }
            .main-promotion__hero-img-element {
              width: 100% !important;
              height: 100% !important;
              object-fit: contain !important;
              object-position: bottom center !important;
              display: block !important;
            }
          `,
        }}
      />
    );
  }

  // CRITICAL: Always replace head components with preconnect links at the beginning
  // Preconnect links MUST be at the very start of <head> to be effective
  // This ensures they're discovered early and connections are established before resources are requested
  replaceHeadComponents([...earlyHints, ...headComponents]);
};

export const wrapPageElement = ({ element }) => {
  // Don't remove the if statement, it will break everything!!!
  // Workaround to apply localization to layout content, plugin doesn't do this by default
  if (Object.keys(element.props).length !== 0) {
    const newElement = cloneElement(
      element,
      element.props,
      cloneElement(
        element.props.children,
        element.props.children.props,
        createElement(Layout, undefined, element.props.children.props.children)
      )
    );
    return newElement;
  }

  return element;
};
