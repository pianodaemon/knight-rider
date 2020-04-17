// @flow
import enTranslationMessages from './en';
import esTranslationMessages from './es';

// should take locale as param and return the correct config.
const locale = 'es';

const languages = {
  en: enTranslationMessages,
  es: esTranslationMessages,
};

export const translations = languages[locale];
