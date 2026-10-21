export function gaMeasurementId() {
  const value = (process.env.GA_MEASUREMENT_ID || "").trim();
  return /^G-[A-Z0-9]+$/i.test(value) ? value : "";
}

export function googleSiteVerification() {
  const value = (process.env.GOOGLE_SITE_VERIFICATION || "").trim();
  if (!value || /[<>"']/.test(value)) return "";
  return value.slice(0, 200);
}
