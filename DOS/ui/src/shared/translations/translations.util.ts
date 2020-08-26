// @flow
import enTranslationMessages from './en';
import esTranslationMessages from './es';

// should take locale as param and return the correct config.
const locale = 'es';

const languages: any = {
  en: enTranslationMessages,
  es: esTranslationMessages,
};

export const translations = languages[locale];
