/**
 * Per-icon async loads for the streaming ticker (smaller/long-task spread vs one giant chunk).
 * Regenerate after adding ticker SVGs: `node scripts/gen-icon-loader-async.mjs`
 */

const iconLoaders = {
  aud: () => import(/* webpackChunkName: "tt-icon-aud" */ "../../../../assets/images/icons/trading-ticker/aud.svg"),
  usd: () => import(/* webpackChunkName: "tt-icon-usd" */ "../../../../assets/images/icons/trading-ticker/usd.svg"),
  eur: () => import(/* webpackChunkName: "tt-icon-eur" */ "../../../../assets/images/icons/trading-ticker/eur.svg"),
  jpy: () => import(/* webpackChunkName: "tt-icon-jpy" */ "../../../../assets/images/icons/trading-ticker/jpy.svg"),
  gbp: () => import(/* webpackChunkName: "tt-icon-gbp" */ "../../../../assets/images/icons/trading-ticker/gbp.svg"),
  cad: () => import(/* webpackChunkName: "tt-icon-cad" */ "../../../../assets/images/icons/trading-ticker/cad.svg"),
  nzd: () => import(/* webpackChunkName: "tt-icon-nzd" */ "../../../../assets/images/icons/trading-ticker/nzd.svg"),
  chf: () => import(/* webpackChunkName: "tt-icon-chf" */ "../../../../assets/images/icons/trading-ticker/chf.svg"),
  btc: () => import(/* webpackChunkName: "tt-icon-btc" */ "../../../../assets/images/icons/trading-ticker/btc.svg"),
  eth: () => import(/* webpackChunkName: "tt-icon-eth" */ "../../../../assets/images/icons/trading-ticker/eth.svg"),
  doge: () => import(/* webpackChunkName: "tt-icon-doge" */ "../../../../assets/images/icons/trading-ticker/doge.svg"),
  ltc: () => import(/* webpackChunkName: "tt-icon-ltc" */ "../../../../assets/images/icons/trading-ticker/ltc.svg"),
  dot: () => import(/* webpackChunkName: "tt-icon-dot" */ "../../../../assets/images/icons/trading-ticker/dot.svg"),
  lnk: () => import(/* webpackChunkName: "tt-icon-lnk" */ "../../../../assets/images/icons/trading-ticker/lnk.svg"),
  ada: () => import(/* webpackChunkName: "tt-icon-ada" */ "../../../../assets/images/icons/trading-ticker/ada.svg"),
  eos: () => import(/* webpackChunkName: "tt-icon-eos" */ "../../../../assets/images/icons/trading-ticker/eos.svg"),
  xrp: () => import(/* webpackChunkName: "tt-icon-xrp" */ "../../../../assets/images/icons/trading-ticker/xrp.svg"),
  uni: () => import(/* webpackChunkName: "tt-icon-uni" */ "../../../../assets/images/icons/trading-ticker/uni.svg"),
  xau: () => import(/* webpackChunkName: "tt-icon-xau" */ "../../../../assets/images/icons/trading-ticker/xau.svg"),
  xag: () => import(/* webpackChunkName: "tt-icon-xag" */ "../../../../assets/images/icons/trading-ticker/xag.svg"),
  xpt: () => import(/* webpackChunkName: "tt-icon-xpt" */ "../../../../assets/images/icons/trading-ticker/xpt.svg"),
  xbr: () => import(/* webpackChunkName: "tt-icon-xbr" */ "../../../../assets/images/icons/trading-ticker/xbr.svg"),
  xti: () => import(/* webpackChunkName: "tt-icon-xti" */ "../../../../assets/images/icons/trading-ticker/xti.svg"),
  xng: () => import(/* webpackChunkName: "tt-icon-xng" */ "../../../../assets/images/icons/trading-ticker/xng.svg"),
  aapl: () => import(/* webpackChunkName: "tt-icon-aapl" */ "../../../../assets/images/icons/trading-ticker/aapl.svg"),
  msft: () => import(/* webpackChunkName: "tt-icon-msft" */ "../../../../assets/images/icons/trading-ticker/msft.svg"),
  tsla: () => import(/* webpackChunkName: "tt-icon-tsla" */ "../../../../assets/images/icons/trading-ticker/tsla.svg"),
  amzn: () => import(/* webpackChunkName: "tt-icon-amzn" */ "../../../../assets/images/icons/trading-ticker/amzn.svg"),
  meta: () => import(/* webpackChunkName: "tt-icon-meta" */ "../../../../assets/images/icons/trading-ticker/meta.svg"),
  nvda: () => import(/* webpackChunkName: "tt-icon-nvda" */ "../../../../assets/images/icons/trading-ticker/nvda.svg"),
  nflx: () => import(/* webpackChunkName: "tt-icon-nflx" */ "../../../../assets/images/icons/trading-ticker/nflx.svg"),
  uber: () => import(/* webpackChunkName: "tt-icon-uber" */ "../../../../assets/images/icons/trading-ticker/uber.svg"),
  abnb: () => import(/* webpackChunkName: "tt-icon-abnb" */ "../../../../assets/images/icons/trading-ticker/abnb.svg"),
  shop: () => import(/* webpackChunkName: "tt-icon-shop" */ "../../../../assets/images/icons/trading-ticker/shop.svg"),
  nke: () => import(/* webpackChunkName: "tt-icon-nke" */ "../../../../assets/images/icons/trading-ticker/nke.svg"),
  pfe: () => import(/* webpackChunkName: "tt-icon-pfe" */ "../../../../assets/images/icons/trading-ticker/pfe.svg"),
  pg: () => import(/* webpackChunkName: "tt-icon-pg" */ "../../../../assets/images/icons/trading-ticker/pg.svg"),
  dell: () => import(/* webpackChunkName: "tt-icon-dell" */ "../../../../assets/images/icons/trading-ticker/dell.svg"),
  sq: () => import(/* webpackChunkName: "tt-icon-sq" */ "../../../../assets/images/icons/trading-ticker/sq.svg"),
  xpev: () => import(/* webpackChunkName: "tt-icon-xpev" */ "../../../../assets/images/icons/trading-ticker/xpev.svg"),
  zto: () => import(/* webpackChunkName: "tt-icon-zto" */ "../../../../assets/images/icons/trading-ticker/zto.svg"),
  zgn: () => import(/* webpackChunkName: "tt-icon-zgn" */ "../../../../assets/images/icons/trading-ticker/zgn.svg"),
  zm: () => import(/* webpackChunkName: "tt-icon-zm" */ "../../../../assets/images/icons/trading-ticker/zm.svg"),
  bkng: () => import(/* webpackChunkName: "tt-icon-bkng" */ "../../../../assets/images/icons/trading-ticker/bkng.svg"),
  mstr: () => import(/* webpackChunkName: "tt-icon-mstr" */ "../../../../assets/images/icons/trading-ticker/mstr.svg"),
  mmm: () => import(/* webpackChunkName: "tt-icon-mmm" */ "../../../../assets/images/icons/trading-ticker/mmm.svg"),
  nio: () => import(/* webpackChunkName: "tt-icon-nio" */ "../../../../assets/images/icons/trading-ticker/nio.svg"),
  bbby: () => import(/* webpackChunkName: "tt-icon-bbby" */ "../../../../assets/images/icons/trading-ticker/bbby.svg"),
  abde: () => import(/* webpackChunkName: "tt-icon-abde" */ "../../../../assets/images/icons/trading-ticker/abde.svg"),
  amd: () => import(/* webpackChunkName: "tt-icon-amd" */ "../../../../assets/images/icons/trading-ticker/amd.svg"),
  nas: () => import(/* webpackChunkName: "tt-icon-nas" */ "../../../../assets/images/icons/trading-ticker/nas.svg"),
  nys: () => import(/* webpackChunkName: "tt-icon-nys" */ "../../../../assets/images/icons/trading-ticker/nys.svg"),
  uk100: () => import(/* webpackChunkName: "tt-icon-uk100" */ "../../../../assets/images/icons/trading-ticker/uk100.svg"),
  ger40: () => import(/* webpackChunkName: "tt-icon-ger40" */ "../../../../assets/images/icons/trading-ticker/ger40.svg"),
  us30: () => import(/* webpackChunkName: "tt-icon-us30" */ "../../../../assets/images/icons/trading-ticker/us30.svg"),
  us500: () => import(/* webpackChunkName: "tt-icon-us500" */ "../../../../assets/images/icons/trading-ticker/us500.svg"),
  nas100: () => import(/* webpackChunkName: "tt-icon-nas100" */ "../../../../assets/images/icons/trading-ticker/nas100.svg"),
  aus200: () => import(/* webpackChunkName: "tt-icon-aus200" */ "../../../../assets/images/icons/trading-ticker/aus200.svg"),
  fra40: () => import(/* webpackChunkName: "tt-icon-fra40" */ "../../../../assets/images/icons/trading-ticker/fra40.svg"),
  hk50: () => import(/* webpackChunkName: "tt-icon-hk50" */ "../../../../assets/images/icons/trading-ticker/hk50.svg"),
  eustx50: () => import(/* webpackChunkName: "tt-icon-eustx50" */ "../../../../assets/images/icons/trading-ticker/eustx50.svg"),
  us2000: () => import(/* webpackChunkName: "tt-icon-us2000" */ "../../../../assets/images/icons/trading-ticker/us2000.svg"),
  tw88: () => import(/* webpackChunkName: "tt-icon-tw88" */ "../../../../assets/images/icons/trading-ticker/tw88.svg"),
};

const urlCache = new Map();
const inflight = new Map();

function normalize(key) {
  return typeof key === "string" ? key.toLowerCase() : "";
}

/**
 * @param {string} iconName
 * @returns {Promise<string | null>}
 */
export async function loadIconUrl(iconName) {
  const key = normalize(iconName);
  if (!key) return null;
  if (urlCache.has(key)) return urlCache.get(key);
  let p = inflight.get(key);
  if (!p) {
    const loader = iconLoaders[key];
    if (!loader) {
      urlCache.set(key, null);
      return null;
    }
    p = loader()
      .then((mod) => (mod?.default ?? mod) || null)
      .catch(() => null);
    inflight.set(key, p);
  }
  const url = await p;
  inflight.delete(key);
  urlCache.set(key, url);
  return url;
}

/** @param {string} iconName */
export function getCachedIconUrl(iconName) {
  const key = normalize(iconName);
  if (!key || !urlCache.has(key)) return null;
  return urlCache.get(key);
}

async function yieldToMainThread() {
  if (typeof scheduler !== "undefined" && scheduler?.yield) {
    await scheduler.yield();
    return;
  }
  await new Promise((r) => setTimeout(r, 0));
}

/**
 * Loads icons for visible ticker symbols only; yields every 8 imports to spread main-thread work.
 * @param {Iterable<string>} iconNames
 */
export async function preloadTradingTickerIcons(iconNames) {
  const unique = [...new Set([...iconNames].map(normalize).filter(Boolean))];
  for (let i = 0; i < unique.length; i++) {
    await loadIconUrl(unique[i]);
    if ((i & 7) === 7) {
      await yieldToMainThread();
    }
  }
}
