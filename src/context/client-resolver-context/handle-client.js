const handleClient = (clientConfig, setIsPopupShown) => {
  // Banned-country popup: all environments (local, dev, staging, production).
  // EU redirect popup removed from oqtima.com.
  if (clientConfig.banned) {
    setIsPopupShown(true);
  }
};

export default handleClient;
