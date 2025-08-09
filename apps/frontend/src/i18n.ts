import { createI18n } from 'vue-i18n';
import en from './locales/en.json';
import ru from './locales/ru.json';

function detectInitialLocale(): 'en' | 'ru' {
  const stored = (localStorage.getItem('lang') as 'en' | 'ru' | null);
  if (stored === 'en' || stored === 'ru') return stored;
  return navigator.language.toLowerCase().startsWith('ru') ? 'ru' : 'en';
}

const i18n = createI18n({
  legacy: false,
  locale: detectInitialLocale(),
  fallbackLocale: 'en',
  messages: { en, ru },
});

export default i18n;


