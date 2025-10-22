import React, { cloneElement, createElement } from "react";
import Layout from "./src/components/shared/layout";

export const onRenderBody = ({
  setPostBodyComponents,
  setHeadComponents,
  setPreBodyComponents,
}) => {
  setPreBodyComponents([
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
  ]);
  setPostBodyComponents([
    <script
      key="live-chat"
      defer
      id="convrs-webchat"
      src={process.env.GATSBY_CONVRS_LIVECHAT}
    />,
    <script
      key="livechat-debug"
      dangerouslySetInnerHTML={{
        __html: `
          // Debug livechat loading
          (function() {
            const checkLivechat = setInterval(function() {
              const livechatScript = document.getElementById('convrs-webchat');
              const livechatElements = document.querySelectorAll('[id*="convrs"], [class*="convrs"]');
              
              if (livechatScript) {
                console.log('✅ Livechat script element found');
              }
              
              if (livechatElements.length > 0) {
                console.log('✅ Livechat elements found:', livechatElements.length);
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
            // Manage livechat z-index and behavior to prevent conflicts with burger menu
            function manageLivechatZIndex() {
              try {
                const livechatElements = document.querySelectorAll('[id*="convrs"], [class*="convrs"]');
                
                if (livechatElements.length === 0) {
                  return; // No livechat elements yet, skip management
                }
                
                livechatElements.forEach(el => {
                  if (el && el.style) {
                    // Check if livechat is hidden by burger menu
                    const isBurgerMenuHidden = el.getAttribute('data-burger-menu-hidden') === 'true';
                    if (isBurgerMenuHidden) {
                      // Don't modify if burger menu has hidden it
                      return;
                    }
                    
                    // Check if burger menu is open
                    const burgerMenuCheckbox = document.getElementById('bmt');
                    const isBurgerMenuOpen = burgerMenuCheckbox && burgerMenuCheckbox.checked;
                    
                    if (isBurgerMenuOpen) {
                      // Hide livechat when burger menu is open
                      el.style.setProperty('display', 'none', 'important');
                      el.style.setProperty('visibility', 'hidden', 'important');
                      el.style.setProperty('pointer-events', 'none', 'important');
                      return;
                    }
                    
                    // Check if we're on a webtrader page
                    const currentPath = window.location.pathname;
                    const isWebtraderPage = currentPath.includes('webtrader');
                    
                    if (isWebtraderPage) {
                      // Hide livechat on webtrader pages
                      el.style.setProperty('display', 'none', 'important');
                      el.style.setProperty('visibility', 'hidden', 'important');
                      el.style.setProperty('pointer-events', 'none', 'important');
                      return;
                    }
                    
                    // For normal pages, ensure livechat is visible and properly z-indexed
                    // Only set z-index, don't touch display/visibility to let livechat show naturally
                    el.style.setProperty('z-index', '21', 'important');
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
                        console.log('🔵 Livechat element detected, managing...');
                        setTimeout(manageLivechatZIndex, 100);
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
            document.addEventListener('click', function(e) {
              const burgerTrigger = e.target.closest('.burger-menu__trigger');
              if (burgerTrigger) {
                setTimeout(manageLivechatZIndex, 100);
              }
            });
            
            // Run immediately after a delay to let livechat load
            setTimeout(manageLivechatZIndex, 2000);
            
            // Run on DOM ready
            if (document.readyState === 'loading') {
              document.addEventListener('DOMContentLoaded', function() {
                setTimeout(manageLivechatZIndex, 2000);
              });
            }
          })();
        `,
      }}
    />,
    <script
      key="mt-widget"
      type="text/javascript"
      src="https://metatraderweb.app/trade/widget.js"
    />,
  ]);
  setHeadComponents([
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
