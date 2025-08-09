import type { Command } from './index';
import { useSettingsStore } from '../stores/settings';

export function createUnixCommands(): Command[] {
  const settings = useSettingsStore();

  const whoami: Command = {
    name: 'whoami',
    description: 'Show current user',
    async execute() { return settings.username; },
  };

  const date: Command = {
    name: 'date',
    description: 'Current date/time',
    async execute() { return new Date().toString(); },
  };

  const echo: Command = {
    name: 'echo',
    description: 'Echo arguments',
    async execute(args) { return args.join(' '); },
  };

  const history: Command = {
    name: 'history',
    description: 'Show last commands',
    async execute() {
      const entries = JSON.parse(localStorage.getItem('history') || '[]') as string[];
      return entries.map((c, i) => `${String(i + 1).padStart(3, ' ')}  ${c}`);
    },
  };

  return [whoami, date, echo, history];
}


