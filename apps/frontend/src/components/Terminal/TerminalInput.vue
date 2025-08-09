<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { getRegistry } from '../../commands/registry';
import { useSettingsStore } from '../../stores/settings';
import { useTerminalStore } from '../../stores/terminal';

const registry = getRegistry();

const terminal = useTerminalStore();
const settings = useSettingsStore();
const input = ref('');
let historyIndex = -1; // -1 means current line

async function execute() {
  const raw = input.value.trim();
  if (!raw) return;
  terminal.pushHistory(raw);
  terminal.print(`$ ${raw}`, 'system');
  historyIndex = -1;
  const result = await registry.execute(raw);
  if (Array.isArray(result)) {
    for (const line of result) terminal.print(String(line));
  }
  input.value = '';
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Enter') {
    e.preventDefault();
    execute();
  }
  if (e.key === 'ArrowUp') {
    e.preventDefault();
    const list = terminal.history;
    historyIndex = Math.min(historyIndex + 1, list.length - 1);
    input.value = historyIndex >= 0 ? list[historyIndex] : '';
  }
  if (e.key === 'ArrowDown') {
    e.preventDefault();
    const list = terminal.history;
    historyIndex = Math.max(historyIndex - 1, -1);
    input.value = historyIndex >= 0 ? list[historyIndex] : '';
  }
  // simple Tab completion by command names
  if (e.key === 'Tab') {
    e.preventDefault();
    const current = input.value.trim();
    if (!current) return;
    const names = new Set(registry.getAvailable().map(c => c.name));
    const candidates = Array.from(names).filter(n => n.startsWith(current));
    if (candidates.length === 1) {
      input.value = candidates[0] + ' ';
    } else if (candidates.length > 1) {
      const colWidth = Math.max(...candidates.map(c => c.length)) + 2;
      let out = '';
      for (let i = 0; i < candidates.length; i += 3) {
        const a = candidates[i] ?? '';
        const b = candidates[i+1] ?? '';
        const c = candidates[i+2] ?? '';
        out += a.padEnd(colWidth, ' ') + b.padEnd(colWidth, ' ') + c + '\n';
      }
      terminal.print(out.trimEnd());
    }
  }
}

const inputEl = ref<HTMLInputElement | null>(null);
onMounted(() => inputEl.value?.focus());
</script>

<template>
  <div class="flex items-center gap-2">
    <span class="text-accent select-none">{{ settings.username }}@{{ settings.hostname }}</span>
    <span class="text-primary select-none">{{ terminal.currentPath }}</span>
    <span class="text-text select-none">$</span>
    <input
      ref="inputEl"
      v-model="input"
      type="text"
      class="flex-1 bg-bg outline-none text-text placeholder-text-muted px-3 py-2 rounded border border-border focus:border-accent shadow-sm"
      placeholder="Type a command (help)"
      @keydown="onKeydown"
      aria-label="Terminal input"
    />
  </div>
  <p class="text-xs opacity-70 mt-2">Try: help | theme dracula | theme solarized-light | play snake</p>
</template>

<style scoped>
</style>


