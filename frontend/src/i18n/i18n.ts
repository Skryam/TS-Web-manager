import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { z } from 'zod';

import ru from '../locales/ru';
import en from '../locales/en';

i18n
  .use(initReactI18next)
  .init({
    lng: 'ru',
    fallbackLng: 'en',
    resources: {
      ru,
      en
    },
    interpolation: { escapeValue: false }
  });

z.config(z.locales.ru());

i18n.on('languageChanged', (lng) => {
  if (lng === 'ru') {
    z.config(z.locales.ru());
  } else {
    z.config(z.locales.en());
  }
})


  export default i18n;