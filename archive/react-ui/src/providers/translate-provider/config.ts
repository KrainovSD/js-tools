import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import ruConfig from "./ru.json";

const resources = {
  ru: {
    translation: ruConfig,
  },
};

const DEFAULT_LANGUAGE = "ru";

void i18n.use(initReactI18next).init({
  resources,
  lng: DEFAULT_LANGUAGE,
  fallbackLng: DEFAULT_LANGUAGE,

  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
