// @flow
import enTranslationMessages from './en.json';
import esTranslationMessages from './es.json';

// should take locale as param and return the correct config.
const locale = 'en';

const languages = {
  en: enTranslationMessages,
  es: esTranslationMessages,
};

export const translations = languages[locale];
