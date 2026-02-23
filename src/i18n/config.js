export const SUPPORTED_LOCALES = ["uz", "ru", "en", "ja"];
export const DEFAULT_LOCALE = "uz";
export const LOCALE_STORAGE_KEY = "mirai_locale";
export const LOCALE_COOKIE_KEY = "NEXT_LOCALE";

export const LOCALE_LABELS = {
  uz: "O'zb",
  ru: "Рус",
  en: "Eng",
  ja: "日本語",
};

export function isValidLocale(locale) {
  return SUPPORTED_LOCALES.includes(locale);
}

export function normalizeLocale(locale) {
  return isValidLocale(locale) ? locale : DEFAULT_LOCALE;
}
