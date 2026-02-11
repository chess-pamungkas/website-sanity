const handleClient = (clientConfig, setIsPopupShown) => {
  // Only show popup for banned (restricted) countries; EU redirect popup removed from oqtima.com
  if (clientConfig.banned) {
    setIsPopupShown(true);
  }
};

export default handleClient;
