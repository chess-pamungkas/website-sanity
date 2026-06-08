/** Single dynamic import for react-google-recaptcha-v3 (avoids duplicate chunks in Lighthouse). */
let recaptchaModulePromise;

export function importRecaptchaV3Module() {
  if (!recaptchaModulePromise) {
    recaptchaModulePromise = import("react-google-recaptcha-v3");
  }
  return recaptchaModulePromise;
}
