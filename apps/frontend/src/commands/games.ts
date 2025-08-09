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
      return `Game not available: ${game}. Try: snake`;
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

  const scores: Command = {
    name: 'scores',
    description: 'Show high scores',
    async execute() {
      const snakeBest = Number(localStorage.getItem('snake_best') || '0');
      
      return [
        '🏆 Local High Scores',
        '═══════════════════',
        `Snake: ${snakeBest > 0 ? snakeBest : 'No scores yet'}`,
        '',
        'Play games to set high scores!',
        'Try: play snake'
      ];
    },
  };

  return [play, exit, scores];
}


