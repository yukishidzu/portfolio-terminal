<script setup lang="ts">
import { useKeyboardShortcuts } from '../composables/useKeyboardShortcuts';

const { shortcuts } = useKeyboardShortcuts();

const formatKey = (shortcut: any) => {
  let keys = [];
  if (shortcut.ctrl) keys.push('Ctrl');
  if (shortcut.alt) keys.push('Alt');
  if (shortcut.shift) keys.push('Shift');
  keys.push(shortcut.key);
  return keys.join('+');
};
</script>

<template>
  <div class="fixed bottom-4 right-4 z-40">
    <details class="group">
      <summary class="cursor-pointer px-3 py-2 bg-bg-secondary border border-border rounded hover:bg-primary/10 transition-colors">
        <span class="text-sm text-text-muted">⌨️ Shortcuts</span>
      </summary>
      <div class="absolute bottom-full right-0 mb-2 p-3 bg-bg-secondary border border-border rounded-lg shadow-lg min-w-[250px]">
        <h3 class="text-sm font-semibold mb-2 text-text">Keyboard Shortcuts</h3>
        <div class="space-y-1">
          <div 
            v-for="shortcut in shortcuts"
            :key="formatKey(shortcut)"
            class="flex items-center justify-between text-xs"
          >
            <span class="text-text-muted">{{ shortcut.description }}</span>
            <kbd class="px-2 py-1 bg-bg border border-border rounded text-accent font-mono">
              {{ formatKey(shortcut) }}
            </kbd>
          </div>
        </div>
      </div>
    </details>
  </div>
</template>
