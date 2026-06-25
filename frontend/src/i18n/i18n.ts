import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { z } from 'zod';

i18n
  .use(initReactI18next)
  .init({
    lng: 'ru',
    fallbackLng: 'en',
    resources: {
      ru: {
        translation: {
          submit: 'Отправить',
          title: 'Регистрация'
        }
      },
      en: {
        translation: {
          submit: 'Submit',
          title: 'Sign up'
        }
      }
    }
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