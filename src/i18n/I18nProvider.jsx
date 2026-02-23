"use client";

import { createContext, useContext, useMemo } from "react";
import { DEFAULT_LOCALE } from "@/i18n/config";

const I18nContext = createContext({
  locale: DEFAULT_LOCALE,
  messages: {},
  t: () => "",
});

function getByPath(obj, path) {
  return path.split(".").reduce((acc, key) => (acc && acc[key] !== undefined ? acc[key] : undefined), obj);
}

export function I18nProvider({ locale, messages, children }) {
  const value = useMemo(() => {
    const t = (path, fallback = path) => {
      const valueFromPath = getByPath(messages, path);
      return valueFromPath === undefined ? fallback : valueFromPath;
    };

    return {
      locale,
      messages,
      t,
    };
  }, [locale, messages]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  return useContext(I18nContext);
}
