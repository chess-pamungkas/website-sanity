import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const keys =
  "aud,usd,eur,jpy,gbp,cad,nzd,chf,btc,eth,doge,ltc,dot,lnk,ada,eos,xrp,uni,xau,xag,xpt,xbr,xti,xng,aapl,msft,tsla,amzn,meta,nvda,nflx,uber,abnb,shop,nke,pfe,pg,dell,sq,xpev,zto,zgn,zm,bkng,mstr,mmm,nio,bbby,abde,amd,nas,nys,uk100,ger40,us30,us500,nas100,aus200,fra40,hk50,eustx50,us2000,tw88".split(
    ","
  );

const lines = keys.map(
  (k) =>
    `  ${k}: () => import(/* webpackChunkName: "tt-icon-${k}" */ "../../../../assets/images/icons/trading-ticker/${k}.svg"),`
);

const body = `/**
 * Per-icon async loads for the streaming ticker (smaller/long-task spread vs one giant chunk).
 * Regenerate after adding ticker SVGs: \`node scripts/gen-icon-loader-async.mjs\`
 */

const iconLoaders = {
${lines.join("\n")}
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
`;

const out = path.join(
  __dirname,
  "../src/components/trading-ticker/components/trading-symbols/icon-loader-async.js"
);
fs.writeFileSync(out, body);
console.log("Wrote", out, keys.length);
