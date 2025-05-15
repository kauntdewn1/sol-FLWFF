export const defaultLocale = 'pt-BR';
export const locales = ['pt-BR', 'en'] as const;
export type Locale = (typeof locales)[number];

export const languages = {
  'pt-BR': {
    name: 'Português',
    flag: '🇧🇷',
  },
  'en': {
    name: 'English',
    flag: '🇺🇸',
  },
} as const;

export const defaultNS = 'common';
export const cookieName = 'i18next';

export function getOptions(lng = defaultLocale, ns = defaultNS) {
  return {
    supportedLngs: locales,
    fallbackLng: defaultLocale,
    lng,
    fallbackNS: defaultNS,
    defaultNS,
    ns,
  };
} 