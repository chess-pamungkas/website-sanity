import { isNonProductionBuild } from "../../helpers/is-non-production-build";

const handleClient = (clientConfig, setIsPopupShown) => {
  // Dev/staging: skip geo popup (GTmetrix US lab IP triggers "Please Read" and tanks TTI/Speed Index).
  if (isNonProductionBuild()) return;
  // Only show popup for banned (restricted) countries; EU redirect popup removed from oqtima.com
  if (clientConfig.banned) {
    setIsPopupShown(true);
  }
};

export default handleClient;
