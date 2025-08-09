<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
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

// Autocomplete suggestions
const suggestions = computed(() => {
  if (!input.value) return [];
  const query = input.value.toLowerCase();
  const commands = registry.getAvailable();
  return commands
    .filter(cmd => cmd.name.toLowerCase().startsWith(query))
    .slice(0, 5);
});

// Ghost text for autocomplete
const ghostText = computed(() => {
  if (!input.value || suggestions.value.length === 0) return '';
  const firstSuggestion = suggestions.value[0];
  if (firstSuggestion.name.startsWith(input.value)) {
    return firstSuggestion.name.slice(input.value.length);
  }
  return '';
});
</script>

<template>
  <div class="flex items-center gap-2">
    <span class="text-accent select-none">{{ settings.username }}@{{ settings.hostname }}</span>
    <span class="text-primary select-none">{{ terminal.currentPath }}</span>
    <span class="text-text select-none">$</span>
    <div class="flex-1 relative">
      <input
        ref="inputEl"
        v-model="input"
        type="text"
        class="w-full bg-bg outline-none text-text placeholder-text-muted px-3 py-2 rounded border border-border focus:border-accent shadow-sm"
        placeholder="Type a command (help)"
        @keydown="onKeydown"
        aria-label="Terminal input"
      />
      <!-- Ghost text for autocomplete -->
      <span 
        v-if="ghostText" 
        class="absolute left-0 top-0 pointer-events-none px-3 py-2 text-text-muted/50"
        style="left: 3px; top: 2px;"
      >
        {{ input }}{{ ghostText }}
      </span>
    </div>
  </div>
  
  <!-- Autocomplete suggestions -->
  <div v-if="suggestions.length > 0 && input" class="mt-2 p-2 bg-bg-secondary/50 rounded border border-border">
    <div class="text-xs text-text-muted mb-1">Suggestions:</div>
    <div class="flex flex-wrap gap-1">
      <button
        v-for="suggestion in suggestions"
        :key="suggestion.name"
        @click="input = suggestion.name + ' '"
        class="px-2 py-1 text-xs bg-primary/20 hover:bg-primary/30 rounded border border-primary/30 transition-colors"
      >
        {{ suggestion.name }}
      </button>
    </div>
  </div>
  
  <p class="text-xs opacity-70 mt-2">Try: help | theme dracula | theme solarized-light | play snake</p>
</template>

<style scoped>
</style>


