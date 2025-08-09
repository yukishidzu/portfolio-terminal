import { onMounted, onUnmounted } from 'vue';
import { useTerminalStore } from '../stores/terminal';
import { useSettingsStore } from '../stores/settings';
import { useUiStore } from '../stores/ui';

export interface Shortcut {
  key: string;
  ctrl?: boolean;
  alt?: boolean;
  shift?: boolean;
  description: string;
  action: () => void;
}

export function useKeyboardShortcuts() {
  const terminal = useTerminalStore();
  const settings = useSettingsStore();
  const ui = useUiStore();
  
  const shortcuts: Shortcut[] = [
    {
      key: 'l',
      ctrl: true,
      description: 'Clear terminal',
      action: () => terminal.clearOutput()
    },
    {
      key: 'k',
      ctrl: true,
      description: 'Open command palette',
      action: () => ui.openPalette()
    },
    {
      key: '/',
      ctrl: true,
      description: 'Open command palette',
      action: () => ui.openPalette()
    },
    {
      key: 'm',
      description: 'Toggle sound',
      action: () => settings.toggleSound()
    },
    {
      key: 'Escape',
      description: 'Close game/palette',
      action: () => {
        if (ui.activeGame) ui.closeGame();
        if (ui.paletteOpen) ui.closePalette();
      }
    },
    {
      key: '+',
      ctrl: true,
      alt: true,
      description: 'Increase font size',
      action: () => settings.setFontSize(settings.fontSize + 1)
    },
    {
      key: '-',
      ctrl: true,
      alt: true,
      description: 'Decrease font size',
      action: () => settings.setFontSize(settings.fontSize - 1)
    },
    {
      key: '0',
      ctrl: true,
      alt: true,
      description: 'Reset font size',
      action: () => settings.setFontSize(16)
    },
    {
      key: 't',
      ctrl: true,
      alt: true,
      description: 'Toggle theme',
      action: () => {
        const next = settings.theme === 'dracula' ? 'solarized-light' : 'dracula';
        settings.setTheme(next);
      }
    }
  ];
  
  function handleKeydown(e: KeyboardEvent) {
    // Don't handle shortcuts when typing in input fields
    if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
      return;
    }
    
    for (const shortcut of shortcuts) {
      const matchesKey = e.key === shortcut.key || e.key.toLowerCase() === shortcut.key.toLowerCase();
      const matchesCtrl = shortcut.ctrl ? e.ctrlKey : !e.ctrlKey;
      const matchesAlt = shortcut.alt ? e.altKey : !e.altKey;
      const matchesShift = shortcut.shift ? e.shiftKey : !e.shiftKey;
      
      if (matchesKey && matchesCtrl && matchesAlt && matchesShift) {
        e.preventDefault();
        shortcut.action();
        break;
      }
    }
  }
  
  onMounted(() => {
    window.addEventListener('keydown', handleKeydown);
  });
  
  onUnmounted(() => {
    window.removeEventListener('keydown', handleKeydown);
  });
  
  return { shortcuts };
}
