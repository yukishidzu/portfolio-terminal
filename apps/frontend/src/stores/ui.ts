import { defineStore } from 'pinia';

export type ActiveGame = 'snake' | null;

interface UiState {
  activeGame: ActiveGame;
  paletteOpen: boolean;
}

export const useUiStore = defineStore('ui', {
  state: (): UiState => ({
    activeGame: null,
    paletteOpen: false,
  }),
  actions: {
    openGame(game: Exclude<ActiveGame, null>) {
      this.activeGame = game;
    },
    closeGame() {
      this.activeGame = null;
    },
    togglePalette() {
      this.paletteOpen = !this.paletteOpen;
    },
    openPalette() {
      this.paletteOpen = true;
    },
    closePalette() {
      this.paletteOpen = false;
    },
  },
});


