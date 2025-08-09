<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { getRegistry } from '../../commands/registry';
import { useSettingsStore } from '../../stores/settings';
import { useTerminalStore } from '../../stores/terminal';
import { AutocompleteEngine, type Suggestion } from '../../utils/autocomplete';

const registry = getRegistry();
const terminal = useTerminalStore();
const settings = useSettingsStore();

const input = ref('');
const inputEl = ref<HTMLInputElement | null>(null);
const historyIndex = ref(-1);
const suggestions = ref<Suggestion[]>([]);
const selectedSuggestion = ref(0);
const showSuggestions = ref(false);

const autocomplete = new AutocompleteEngine();

// Автодополнение при изменении input
function updateSuggestions() {
  if (!input.value.trim()) {
    suggestions.value = [];
    showSuggestions.value = false;
    return;
  }
  
  suggestions.value = autocomplete.getSuggestions(input.value, terminal.currentPath);
  showSuggestions.value = suggestions.value.length > 0;
  selectedSuggestion.value = 0;
}

// Выполнение команды
async function execute() {
  const raw = input.value.trim();
  if (!raw) return;
  
  showSuggestions.value = false;
  terminal.pushHistory(raw);
  terminal.print(`$ ${raw}`, 'system');
  historyIndex.value = -1;
  
  const result = await registry.execute(raw);
  if (Array.isArray(result)) {
    for (const line of result) terminal.print(String(line));
  }
  
  input.value = '';
  suggestions.value = [];
}

// Применение автодополнения
function applySuggestion(suggestion?: Suggestion) {
  const s = suggestion || suggestions.value[selectedSuggestion.value];
  if (!s) return;
  
  const parts = input.value.trim().split(/\s+/);
  if (parts.length <= 1) {
    // Completing command
    input.value = s.value + ' ';
  } else {
    // Completing argument
    parts[parts.length - 1] = s.value;
    input.value = parts.join(' ') + ' ';
  }
  
  showSuggestions.value = false;
  suggestions.value = [];
  inputEl.value?.focus();
}

// Обработка клавиатуры
function onKeydown(e: KeyboardEvent) {
  // Enter - выполнить команду
  if (e.key === 'Enter') {
    e.preventDefault();
    if (showSuggestions.value && suggestions.value.length > 0) {
      applySuggestion();
    } else {
      execute();
    }
    return;
  }
  
  // Tab - автодополнение
  if (e.key === 'Tab') {
    e.preventDefault();
    if (!showSuggestions.value) {
      updateSuggestions();
    } else if (suggestions.value.length === 1) {
      applySuggestion();
    } else if (suggestions.value.length > 1) {
      selectedSuggestion.value = (selectedSuggestion.value + 1) % suggestions.value.length;
    }
    return;
  }
  
  // Escape - закрыть подсказки
  if (e.key === 'Escape') {
    e.preventDefault();
    if (showSuggestions.value) {
      showSuggestions.value = false;
    } else {
      input.value = '';
    }
    return;
  }
  
  // История команд
  if (e.key === 'ArrowUp') {
    e.preventDefault();
    if (showSuggestions.value) {
      selectedSuggestion.value = Math.max(0, selectedSuggestion.value - 1);
    } else {
      const list = terminal.history;
      historyIndex.value = Math.min(historyIndex.value + 1, list.length - 1);
      input.value = historyIndex.value >= 0 ? list[historyIndex.value] : '';
    }
    return;
  }
  
  if (e.key === 'ArrowDown') {
    e.preventDefault();
    if (showSuggestions.value) {
      selectedSuggestion.value = Math.min(suggestions.value.length - 1, selectedSuggestion.value + 1);
    } else {
      const list = terminal.history;
      historyIndex.value = Math.max(historyIndex.value - 1, -1);
      input.value = historyIndex.value >= 0 ? list[historyIndex.value] : '';
    }
    return;
  }
  
  // Ctrl+L - очистить экран
  if (e.ctrlKey && e.key === 'l') {
    e.preventDefault();
    terminal.clearOutput();
    return;
  }
  
  // Ctrl+C - отмена ввода
  if (e.ctrlKey && e.key === 'c') {
    e.preventDefault();
    input.value = '';
    showSuggestions.value = false;
    terminal.print('^C', 'system');
    return;
  }
}

// При вводе обновляем подсказки
function onInput() {
  historyIndex.value = -1;
  updateSuggestions();
}

onMounted(() => {
  inputEl.value?.focus();
  
  // Глобальный фокус на input при клике в любом месте терминала
  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    if (!target.closest('button') && !target.closest('a')) {
      inputEl.value?.focus();
    }
  });
});

// Computed для отображения prompt
const promptText = computed(() => {
  return `${settings.username}@${settings.hostname}:${terminal.currentPath}$`;
});
</script>

<template>
  <div class="relative">
    <!-- Input line -->
    <div class="flex items-center gap-2">
      <span class="text-accent select-none">{{ settings.username }}@{{ settings.hostname }}</span>
      <span class="text-primary select-none">{{ terminal.currentPath }}</span>
      <span class="text-text select-none">$</span>
      <input
        ref="inputEl"
        v-model="input"
        type="text"
        class="flex-1 bg-transparent outline-none text-text placeholder-text-muted"
        :placeholder="$t('terminal.placeholder')"
        @keydown="onKeydown"
        @input="onInput"
        aria-label="Terminal input"
        aria-describedby="terminal-help"
        autocomplete="off"
        spellcheck="false"
        role="textbox"
      />
    </div>
    
    <!-- Autocomplete suggestions -->
    <Transition name="suggestions">
      <div 
        v-if="showSuggestions && suggestions.length > 0"
        class="absolute bottom-full left-0 right-0 mb-2 bg-bg-secondary border border-border rounded-lg shadow-lg overflow-hidden"
      >
        <div class="max-h-48 overflow-y-auto">
          <div
            v-for="(s, idx) in suggestions"
            :key="s.value"
            class="px-3 py-2 hover:bg-primary/10 cursor-pointer flex items-center justify-between"
            :class="{ 'bg-primary/20': idx === selectedSuggestion }"
            @click="applySuggestion(s)"
          >
            <div class="flex items-center gap-2">
              <span class="text-text">{{ s.value }}</span>
              <span 
                v-if="s.type"
                class="text-xs px-1 py-0.5 rounded"
                :class="{
                  'bg-primary/20 text-primary': s.type === 'command',
                  'bg-accent/20 text-accent': s.type === 'directory',
                  'bg-info/20 text-info': s.type === 'file',
                  'bg-warning/20 text-warning': s.type === 'argument'
                }"
              >
                {{ s.type }}
              </span>
            </div>
            <span v-if="s.description" class="text-xs text-text-muted">
              {{ s.description }}
            </span>
          </div>
        </div>
        <div class="px-3 py-1 border-t border-border text-xs text-text-muted">
          Tab to complete • ↑↓ to navigate • Enter to select
        </div>
      </div>
    </Transition>
    
    <!-- Help text -->
    <p id="terminal-help" class="text-xs opacity-70 mt-2" role="note">
      Try: help | about | projects | theme | play snake | Ctrl+L to clear
    </p>
  </div>
</template>

<style scoped>
.suggestions-enter-active,
.suggestions-leave-active {
  transition: all 0.15s ease;
}

.suggestions-enter-from,
.suggestions-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>

<style scoped>
</style>


