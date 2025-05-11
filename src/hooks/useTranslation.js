import { useRouter } from 'next/router';
import { translations } from '../i18n/config';

export const useTranslation = () => {
  const router = useRouter();
  const { locale = 'pt-BR' } = router;

  const t = (key) => {
    const keys = key.split('.');
    let value = translations[locale];

    for (const k of keys) {
      if (value && value[k]) {
        value = value[k];
      } else {
        console.warn(`Translation key not found: ${key}`);
        return key;
      }
    }

    return value;
  };

  return {
    t,
    locale,
  };
}; 