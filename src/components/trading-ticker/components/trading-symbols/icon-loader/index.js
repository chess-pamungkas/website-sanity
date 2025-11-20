// Manual icon imports for trading ticker icons
// This approach is more reliable than dynamic imports

// Flags
import aud from "../../../../../assets/images/icons/trading-ticker/aud.svg";
import usd from "../../../../../assets/images/icons/trading-ticker/usd.svg";
import eur from "../../../../../assets/images/icons/trading-ticker/eur.svg";
import jpy from "../../../../../assets/images/icons/trading-ticker/jpy.svg";
import gbp from "../../../../../assets/images/icons/trading-ticker/gbp.svg";
import cad from "../../../../../assets/images/icons/trading-ticker/cad.svg";
import nzd from "../../../../../assets/images/icons/trading-ticker/nzd.svg";
import chf from "../../../../../assets/images/icons/trading-ticker/chf.svg";

// Crypto icons
import btc from "../../../../../assets/images/icons/trading-ticker/btc.svg";
import eth from "../../../../../assets/images/icons/trading-ticker/eth.svg";
import doge from "../../../../../assets/images/icons/trading-ticker/doge.svg";
import ltc from "../../../../../assets/images/icons/trading-ticker/ltc.svg";
import dot from "../../../../../assets/images/icons/trading-ticker/dot.svg";
import lnk from "../../../../../assets/images/icons/trading-ticker/lnk.svg";
import ada from "../../../../../assets/images/icons/trading-ticker/ada.svg";
import eos from "../../../../../assets/images/icons/trading-ticker/eos.svg";
import xrp from "../../../../../assets/images/icons/trading-ticker/xrp.svg";
import uni from "../../../../../assets/images/icons/trading-ticker/uni.svg";

// Metal icons
import xau from "../../../../../assets/images/icons/trading-ticker/xau.svg";
import xag from "../../../../../assets/images/icons/trading-ticker/xag.svg";
import xpt from "../../../../../assets/images/icons/trading-ticker/xpt.svg";

// Energy icons
import xbr from "../../../../../assets/images/icons/trading-ticker/xbr.svg";
import xti from "../../../../../assets/images/icons/trading-ticker/xti.svg";
import xng from "../../../../../assets/images/icons/trading-ticker/xng.svg";

// Company/Index icons
import aapl from "../../../../../assets/images/icons/trading-ticker/aapl.svg";
import msft from "../../../../../assets/images/icons/trading-ticker/msft.svg";
import tsla from "../../../../../assets/images/icons/trading-ticker/tsla.svg";
import amzn from "../../../../../assets/images/icons/trading-ticker/amzn.svg";
import meta from "../../../../../assets/images/icons/trading-ticker/meta.svg";
import nvda from "../../../../../assets/images/icons/trading-ticker/nvda.svg";
import nflx from "../../../../../assets/images/icons/trading-ticker/nflx.svg";
import uber from "../../../../../assets/images/icons/trading-ticker/uber.svg";
import abnb from "../../../../../assets/images/icons/trading-ticker/abnb.svg";
import shop from "../../../../../assets/images/icons/trading-ticker/shop.svg";
import nke from "../../../../../assets/images/icons/trading-ticker/nke.svg";
import pfe from "../../../../../assets/images/icons/trading-ticker/pfe.svg";
import pg from "../../../../../assets/images/icons/trading-ticker/pg.svg";
import dell from "../../../../../assets/images/icons/trading-ticker/dell.svg";
import sq from "../../../../../assets/images/icons/trading-ticker/sq.svg";
import xpev from "../../../../../assets/images/icons/trading-ticker/xpev.svg";
import zto from "../../../../../assets/images/icons/trading-ticker/zto.svg";
import zgn from "../../../../../assets/images/icons/trading-ticker/zgn.svg";
import zm from "../../../../../assets/images/icons/trading-ticker/zm.svg";
import bkng from "../../../../../assets/images/icons/trading-ticker/bkng.svg";
import mstr from "../../../../../assets/images/icons/trading-ticker/mstr.svg";
import mmm from "../../../../../assets/images/icons/trading-ticker/mmm.svg";
import nio from "../../../../../assets/images/icons/trading-ticker/nio.svg";
import bbby from "../../../../../assets/images/icons/trading-ticker/bbby.svg";
import abde from "../../../../../assets/images/icons/trading-ticker/abde.svg";
import amd from "../../../../../assets/images/icons/trading-ticker/amd.svg";
import nas from "../../../../../assets/images/icons/trading-ticker/nas.svg";
import nys from "../../../../../assets/images/icons/trading-ticker/nys.svg";

// Indices
import uk100 from "../../../../../assets/images/icons/trading-ticker/uk100.svg";
import ger40 from "../../../../../assets/images/icons/trading-ticker/ger40.svg";
import us30 from "../../../../../assets/images/icons/trading-ticker/us30.svg";
import us500 from "../../../../../assets/images/icons/trading-ticker/us500.svg";
import nas100 from "../../../../../assets/images/icons/trading-ticker/nas100.svg";
import aus200 from "../../../../../assets/images/icons/trading-ticker/aus200.svg";
import fra40 from "../../../../../assets/images/icons/trading-ticker/fra40.svg";
import hk50 from "../../../../../assets/images/icons/trading-ticker/hk50.svg";
import eustx50 from "../../../../../assets/images/icons/trading-ticker/eustx50.svg";
import us2000 from "../../../../../assets/images/icons/trading-ticker/us2000.svg";
import tw88 from "../../../../../assets/images/icons/trading-ticker/tw88.svg";

// Icon mapping object
const iconMap = {
  // Flags
  aud,
  usd,
  eur,
  jpy,
  gbp,
  cad,
  nzd,
  chf,

  // Crypto
  btc,
  eth,
  doge,
  ltc,
  dot,
  lnk,
  ada,
  eos,
  xrp,
  uni,

  // Metals
  xau,
  xag,
  xpt,

  // Energies
  xbr,
  xti,
  xng,

  // Companies
  aapl,
  msft,
  tsla,
  amzn,
  meta,
  nvda,
  nflx,
  uber,
  abnb,
  shop,
  nke,
  pfe,
  pg,
  dell,
  sq,
  xpev,
  zto,
  zgn,
  zm,
  bkng,
  mstr,
  mmm,
  nio,
  bbby,
  abde,
  amd,
  nas,
  nys,

  // Indices
  uk100,
  ger40,
  us30,
  us500,
  nas100,
  aus200,
  fra40,
  hk50,
  eustx50,
  us2000,
  tw88,
};

export const getIcon = (iconName) => {
  const icon = iconMap[iconName.toLowerCase()];
  if (!icon) {
    // console.warn(`Icon not found for: ${iconName}`);
  }
  return icon || null;
};

export const getAllIcons = () => {
  return iconMap;
};
