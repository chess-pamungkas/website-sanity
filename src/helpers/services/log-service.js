import axios from "axios";
import { isBrowser } from "./is-browser";

const API_URL = process.env.GATSBY_OQTIMA_API_URL;

const getEnv = () => {
  if (isBrowser() && window.location.hostname === "localhost") return "local";
  return process.env.GATSBY_ENV;
};

export const sendLog = (errorData) => {
  // Only send logs in browser, not during SSR
  if (!isBrowser() || !API_URL) {
    return;
  }

  const userAgent = navigator.userAgent;
  const source = window.location.href;
  const data = {
    env: getEnv(),
    content: [{ ...errorData, userAgent, source }],
  };
  axios.post(`${API_URL}log`, data).catch((response) => console.log(response));
};
