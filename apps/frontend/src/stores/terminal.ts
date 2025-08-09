import { defineStore } from 'pinia';

export interface OutputLine {
  id: string;
  text: string;
  role: 'stdout' | 'stderr' | 'system';
}

interface TerminalState {
  history: string[]; // last 20
  currentPath: string;
  output: OutputLine[];
  isProcessing: boolean;
}

export const useTerminalStore = defineStore('terminal', {
  state: (): TerminalState => ({
    history: JSON.parse(localStorage.getItem('history') || '[]'),
    currentPath: '~',
    output: [],
    isProcessing: false,
  }),
  actions: {
    pushHistory(command: string) {
      this.history.unshift(command);
      if (this.history.length > 20) this.history.pop();
      localStorage.setItem('history', JSON.stringify(this.history));
    },
    setPath(path: string) {
      this.currentPath = path;
    },
    print(text: string, role: OutputLine['role'] = 'stdout') {
      this.output.push({ id: crypto.randomUUID(), text, role });
    },
    clearOutput() {
      this.output = [];
    },
    setProcessing(val: boolean) {
      this.isProcessing = val;
    },
  },
});


