export const CLERK_PUBLISHABLE_KEY =
  process.env.PLASMO_PUBLIC_CLERK_PUBLISHABLE_KEY;
export const KODEPAY_APPLICATION_ID =
  process.env.PLASMO_PUBLIC_KODEPAY_APPLICATION_ID;
export const KODEPAY_CLIENT_ID = process.env.PLASMO_PUBLIC_KODEPAY_CLIENT_ID;
export const KODEPAY_MODE = process.env.PLASMO_PUBLIC_KODEPAY_MODE;
export const KODEPAY_PLAN_ID = process.env.PLASMO_PUBLIC_KODEPAY_PLAN_ID;
export const SMARTPOST_API_URL = process.env.PLASMO_PUBLIC_SMARTPOST_API_URL;

export const EXTENSION_URL = chrome.runtime.getURL("/");
export const POPUP_URL = chrome.runtime.getURL("/popup.html");
export const OPTIONS_URL = chrome.runtime.getURL("/options.html");
