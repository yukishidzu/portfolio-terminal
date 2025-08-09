import type { Command } from './index';
import { useUiStore } from '../stores/ui';

export function createGameCommands(): Command[] {
  const ui = useUiStore();

  const play: Command = {
    name: 'play',
    description: 'Play a game',
    async execute(args) {
      const game = (args[0] || '').toLowerCase();
      if (game === 'snake') {
        ui.openGame('snake');
        return 'Launching Snake... (ESC to exit)';
      }
      return `Game not available: ${game}`;
    },
  };

  const exit: Command = {
    name: 'exit',
    description: 'Exit current game',
    async execute() {
      ui.closeGame();
      return 'Exited game.';
    },
  };

  return [play, exit];
}


