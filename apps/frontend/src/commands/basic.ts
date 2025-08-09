import type { Command } from './index';
import { useSettingsStore } from '../stores/settings';
import { useTerminalStore } from '../stores/terminal';
import { getRegistry } from './registry';
import i18n from '../i18n';

export function createBasicCommands(): Command[] {
  const settings = useSettingsStore();
  const terminal = useTerminalStore();

  const help: Command = {
    name: 'help',
    description: 'Show available commands',
    async execute() {
      const t = i18n.global.t;
      const cmds = Array.from(new Set(getRegistry().getAvailable().map(c => c.name)));
      return [t('help.output'), cmds.sort().join(', ')];
    },
  };

  const clear: Command = {
    name: 'clear',
    description: 'Clear terminal output',
    async execute() {
      terminal.clearOutput();
    },
  };

  const pwd: Command = {
    name: 'pwd',
    description: 'Print working directory',
    async execute() {
      return terminal.currentPath;
    },
  };

  const theme: Command = {
    name: 'theme',
    description: 'Change theme',
    async execute(args) {
      const next = args[0] as 'dracula' | 'solarized-light' | undefined;
      if (!next) return 'Usage: theme <dracula|solarized-light>';
      if (next !== 'dracula' && next !== 'solarized-light') return 'Unknown theme';
      settings.setTheme(next);
      return `Theme set to ${next}`;
    },
  };

  const sound: Command = {
    name: 'sound',
    description: 'Toggle sound on/off',
    async execute(args) {
      const val = args[0];
      if (!val) return 'Usage: sound <on|off>';
      if (val === 'on') settings.soundEnabled = true;
      else if (val === 'off') settings.soundEnabled = false;
      else return 'Usage: sound <on|off>';
      localStorage.setItem('sound', settings.soundEnabled ? 'on' : 'off');
      return `Sound ${settings.soundEnabled ? 'enabled' : 'disabled'}`;
    },
  };

  const lang: Command = {
    name: 'lang',
    description: 'Change language / Сменить язык',
    async execute(args) {
      const next = args[0] as 'en' | 'ru' | undefined;
      if (!next) return 'Usage: lang <en|ru>';
      if (next !== 'en' && next !== 'ru') return 'Unknown language. Use: en or ru';
      settings.setLanguage(next);
      return `Language set to ${next.toUpperCase()}`;
    },
  };

  return [help, clear, pwd, theme, sound, lang];
}


