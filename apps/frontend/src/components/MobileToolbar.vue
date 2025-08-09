<script setup lang="ts">
import { useTerminalStore } from '../stores/terminal';
import { useUiStore } from '../stores/ui';

const terminal = useTerminalStore();
const ui = useUiStore();

const quickButtons = [
  { label: 'Help', cmd: 'help', icon: '?' },
  { label: 'About', cmd: 'about', icon: '👤' },
  { label: 'Projects', cmd: 'projects', icon: '📂' },
  { label: 'Clear', cmd: 'clear', icon: '🗑️' },
];

async function executeQuick(cmd: string) {
  terminal.pushHistory(cmd);
  terminal.print(`$ ${cmd}`, 'system');
  const { getRegistry } = await import('../commands/registry');
  const result = await getRegistry().execute(cmd);
  if (Array.isArray(result)) {
    for (const line of result) terminal.print(String(line));
  }
}
</script>

<template>
  <div class="lg:hidden fixed bottom-0 left-0 right-0 bg-bg/95 backdrop-blur border-t border-border">
    <div class="flex items-center justify-around py-2 px-2">
      <button 
        v-for="btn in quickButtons"
        :key="btn.cmd"
        @click="executeQuick(btn.cmd)"
        class="flex flex-col items-center gap-1 px-3 py-2 rounded active:bg-bg-secondary"
      >
        <span class="text-lg">{{ btn.icon }}</span>
        <span class="text-xs text-text-muted">{{ btn.label }}</span>
      </button>
      <button 
        @click="ui.openPalette()"
        class="flex flex-col items-center gap-1 px-3 py-2 rounded active:bg-bg-secondary"
      >
        <span class="text-lg">/</span>
        <span class="text-xs text-text-muted">More</span>
      </button>
    </div>
  </div>
</template>
