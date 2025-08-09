import { defineStore } from 'pinia';
import i18n from '../i18n';

export type Language = 'en' | 'ru';
export type ThemeName = 'dracula' | 'solarized-light';

interface SettingsState {
  theme: ThemeName;
  soundEnabled: boolean;
  language: Language;
  fontSize: number; // px
  username: string;
  hostname: string;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export const useSettingsStore = defineStore('settings', {
  state: (): SettingsState => ({
    theme: (localStorage.getItem('theme') as ThemeName) || 'dracula',
    soundEnabled: localStorage.getItem('sound') !== 'off',
    language: (localStorage.getItem('lang') as Language) || 'en',
    fontSize: Number(localStorage.getItem('fontSize') || 16),
    username: localStorage.getItem('username') || 'guest',
    hostname: 'portfolio',
  }),
  actions: {
    setTheme(theme: ThemeName) {
      this.theme = theme;
      document.documentElement.setAttribute('data-theme', theme);
      localStorage.setItem('theme', theme);
    },
    setUsername(name: string) {
      this.username = name || 'guest';
      localStorage.setItem('username', this.username);
    },
    toggleSound() {
      this.soundEnabled = !this.soundEnabled;
      localStorage.setItem('sound', this.soundEnabled ? 'on' : 'off');
    },
    setLanguage(lang: Language) {
      this.language = lang;
      localStorage.setItem('lang', lang);
      // switch i18n and html lang
      (i18n.global as any).locale.value = lang;
      document.documentElement.setAttribute('lang', lang);
    },
    setFontSize(size: number) {
      const next = clamp(size, 12, 24);
      this.fontSize = next;
      localStorage.setItem('fontSize', String(next));
      document.documentElement.style.setProperty('--font-size', `${next}px`);
    },
    initFromStorage() {
      // Apply theme and font size on load
      document.documentElement.setAttribute('data-theme', this.theme);
      document.documentElement.style.setProperty('--font-size', `${this.fontSize}px`);
    },
  },
});


