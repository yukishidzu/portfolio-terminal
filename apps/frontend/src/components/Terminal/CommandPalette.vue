<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import { useUiStore } from '../../stores/ui';
import { useTerminalStore } from '../../stores/terminal';
import { getRegistry } from '../../commands/registry';

const ui = useUiStore();
const terminal = useTerminalStore();

const query = ref('');
const selectedIndex = ref(0);

// Предопределенные команды для быстрого доступа
const quickCommands = [
  { label: '📋 Help', cmd: 'help' },
  { label: '👤 About', cmd: 'about' },
  { label: '💼 Projects', cmd: 'projects' },
  { label: '🎯 Skills', cmd: 'skills' },
  { label: '📧 Contact', cmd: 'contact' },
  { label: '🎮 Play Snake', cmd: 'play snake' },
  { label: '🎨 Theme', cmd: 'theme' },
  { label: '🌍 Language', cmd: 'lang' },
];

// Все доступные команды
const allCommands = computed(() => {
  const registry = getRegistry();
  const commands = registry.getAvailable();
  return [
    ...quickCommands,
    ...commands
      .filter(c => !quickCommands.some(q => q.cmd === c.name))
      .map(c => ({ label: c.name, cmd: c.name }))
  ];
});

// Фильтрованные команды
const filteredCommands = computed(() => {
  if (!query.value) return quickCommands;
  const q = query.value.toLowerCase();
  return allCommands.value.filter(c => 
    c.label.toLowerCase().includes(q) || 
    c.cmd.toLowerCase().includes(q)
  );
});

// Сброс при открытии/закрытии
watch(() => ui.paletteOpen, (open) => {
  if (!open) {
    query.value = '';
    selectedIndex.value = 0;
  }
});

// Обработка клавиатуры
function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'ArrowDown') {
    e.preventDefault();
    selectedIndex.value = Math.min(selectedIndex.value + 1, filteredCommands.value.length - 1);
  } else if (e.key === 'ArrowUp') {
    e.preventDefault();
    selectedIndex.value = Math.max(selectedIndex.value - 1, 0);
  } else if (e.key === 'Enter') {
    e.preventDefault();
    if (filteredCommands.value[selectedIndex.value]) {
      choose(filteredCommands.value[selectedIndex.value].cmd);
    }
  } else if (e.key === 'Escape') {
    e.preventDefault();
    ui.closePalette();
  }
}

async function choose(cmd: string) {
  terminal.pushHistory(cmd);
  terminal.print(`$ ${cmd}`, 'system');
  const result = await getRegistry().execute(cmd);
  if (Array.isArray(result)) {
    for (const line of result) terminal.print(String(line));
  }
  ui.closePalette();
}
</script>

<template>
  <Transition name="palette">
    <div 
      v-if="ui.paletteOpen" 
      class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-start justify-center p-4 z-50"
      @click.self="ui.closePalette()"
      role="dialog"
      aria-modal="true"
      aria-label="Command palette"
    >
      <div class="bg-bg border-2 border-primary rounded-lg w-full max-w-xl mt-20 shadow-2xl overflow-hidden">
        <!-- Header with input -->
        <div class="border-b border-border p-3">
          <input 
            v-model="query" 
            class="w-full bg-transparent outline-none text-text placeholder-text-muted text-lg"
            placeholder="Type command or search..." 
            @keydown="handleKeydown"
            autofocus
            aria-label="Search commands"
            role="searchbox"
          />
        </div>
        
        <!-- Commands list -->
        <div class="max-h-96 overflow-auto" role="listbox">
          <div 
            v-for="(cmd, idx) in filteredCommands"
            :key="cmd.cmd"
            class="px-4 py-3 hover:bg-primary/10 cursor-pointer transition-colors flex items-center justify-between"
            :class="{ 'bg-primary/20': idx === selectedIndex }"
            @click="choose(cmd.cmd)"
            @mouseenter="selectedIndex = idx"
            role="option"
            :aria-selected="idx === selectedIndex"
          >
            <span class="text-text">{{ cmd.label }}</span>
            <code class="text-sm text-text-muted bg-bg-secondary px-2 py-1 rounded">{{ cmd.cmd }}</code>
          </div>
          
          <!-- Empty state -->
          <div v-if="filteredCommands.length === 0" class="px-4 py-8 text-center text-text-muted">
            No commands found
          </div>
        </div>
        
        <!-- Footer -->
        <div class="border-t border-border px-4 py-2 text-xs text-text-muted flex items-center justify-between">
          <span>↑↓ Navigate • Enter Select • ESC Close</span>
          <span>{{ filteredCommands.length }} commands</span>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.palette-enter-active,
.palette-leave-active {
  transition: opacity 0.2s ease;
}

.palette-enter-from,
.palette-leave-to {
  opacity: 0;
}

.palette-enter-active > div,
.palette-leave-active > div {
  transition: transform 0.2s ease;
}

.palette-enter-from > div {
  transform: translateY(-20px) scale(0.95);
}

.palette-leave-to > div {
  transform: translateY(-20px) scale(0.95);
}
</style>


