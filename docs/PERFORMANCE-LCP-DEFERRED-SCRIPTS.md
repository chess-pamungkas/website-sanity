# LCP timing and deferred scripts (SSR vs production HTML)

This document maps **why Lighthouse sometimes reports large `element render delay`** for the all-markets hero image, and where **JavaScript/CSS deferral** runs in **two different implementations** depending on whether you inspect `gatsby-ssr` HTML or the **post-build** output.

## What “element render delay” means here

Chrome splits LCP into subparts (`lcp-breakdown-insight`). When **resource download is cheap** (e.g. localhost) but **`elementRenderDelay` is hundreds of milliseconds**, typical causes include:

1. Main thread busy with **style/layout** before the hero image subtree can paint  
2. **Deferred global CSS**: main stylesheets intentionally start as `media="print"` until the defer loader **flips them to `media="all"`**  
3. **Deferred bundles**: webpack runtime / framework / app scripts run after the defer gate, hydration and layout passes can follow  
4. **Fonts**: late font swap/reflow affecting text + surrounding layout  

The hero `<img>` (`all-markets__hero-bg-lcp`) itself can be fetched quickly while the **paint** is still gated by CSS/JS/fonts.

---

## Pipeline A — `gatsby-ssr.js` (`onPreRenderHTML`, production **pre** post-build script)

Rough order for routes that participate in deferral:

1. **Head** receives **non-blocking stylesheets**: main links get `media="print"`  
2. **Inline critical snippets** may exist for homepage / heroes (route-specific rules in SSR)  
3. **Body end**: a single **delayed-app-loader** inline script bundles three concerns (see excerpt in repo around `delayed-app-loader`):  
   - Optional **four-second fallback** timer  
   - On **mobile viewport** (`max-width: 768px`): **`PerformanceObserver` for `largest-contentful-paint`** fires `doWork` on first buffered LCP entry (then disconnects).  
   - On **desktop** or empty URL list / special cases: **double `requestIdleCallback`/raf** shortcut without waiting on LCP.  
   - **`doWork`**: sequentially **flip print→all CSS** (`flipThen`), then **afterFlip** idle/raf choreography, **`inj()`** appends deferred script URLs with **stagger** (`injNext`), then optional inline bundles.  

### How to inspect this behavior

- View **Saved `public/page-path/index.html` after full build**: this repo invokes **`scripts/defer-global-css-html.js`** at the end of **`scripts/gatsby-build.js`**, replacing the SSR loader described below.  
- In **Chrome Performance**: mark the navigation, find **Paint** near LCP marker, correlate with **`evaluateScript`** spikes for the inlined loader vs first party JS.

---

## Pipeline B — `scripts/defer-global-css-html.js` (mutates **`public/**/*.html`** after build)

The post-build step **replaces** the three **`async` script tags** with a compact inline loader (`makeLcpLoader`):

- **Flip `link[media="print"]` to `all` synchronously** when the inline loader runs, so trading-product LCP `<img>` heroes get correct layout before paint.
- **Double `requestAnimationFrame`** then **inject** `[webpack-runtime, framework, app]` — defers heavyweight JS parse/eval slightly without gating stylesheet activation.

**Without** synchronous flip, very fast cached image downloads can coincide with **`elementRenderDelay` ~multi‑second**: bytes are ready before screen CSS applies (`media="print"` does not style the viewport).

So **SSR source of truth in `gatsby-ssr.js` is not identical to shipped HTML** after this script. When profiling “why LCP behaves differently locally vs PSI”, verify which loader is actually in the HTML:

```bash
# After full build pipeline
grep -o "delayed-app-loader\|performance\.now\\|inject" public/id/all-markets/index.html | head
```

---

## Practical profiling checklist

1. **Serve built `public`** (same as Lighthouse target), not necessarily `develop`.  
2. Open **Chrome DevTools → Performance** → record reload; align **Experience → LCP** with **Main** thread **Raster / Layout / Evaluate script**.  
3. In **Coverage** tab (optional): confirm deferred chunks execute after flip.  
4. Compare **`elementRenderDelay`** between **cold** vs **warm** cache runs; script timing differences often narrow on repeat visits.  

---

## Related files

| Area | Path |
|------|------|
| SSR body loader (LCP observer + idle stagger on mobile) | `gatsby-ssr.js` (`delayed-app-loader`, `flipThen`, `scheduleDoWorkAfterLcp`) |
| Post-build replacement (double‑rAF flip + inject) | `scripts/defer-global-css-html.js` (`makeLcpLoader`) |
| Global CSS deferral helper | Same script (`replaceInlineGlobalCss`) |

For **CLS** tied to hydration layout flips below the hero, see **`market-item`** refactor: unified `market-item__shell` grid avoids SSR→client branch changes on viewport activation.
