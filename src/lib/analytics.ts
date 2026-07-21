const GOOGLE_MEASUREMENT_ID = "G-WVWXTCFVS2";

const getPagePath = () =>
  typeof window !== "undefined"
    ? `${window.location.pathname}${window.location.search}`
    : "";

export const trackPageView = (pagePath = getPagePath()) => {
  if (typeof window === "undefined" || typeof window.gtag !== "function") {
    return;
  }

  window.gtag("config", GOOGLE_MEASUREMENT_ID, {
    page_path: pagePath,
  });
};
