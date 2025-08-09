<script setup lang="ts">
import { ref, watch } from 'vue';
import { useUiStore } from '../../stores/ui';
import { useTerminalStore } from '../../stores/terminal';
import { getRegistry } from '../../commands/registry';

const ui = useUiStore();
const terminal = useTerminalStore();

const query = ref('');
const suggestions = ref<string[]>(['help', 'about', 'skills', 'projects', 'contact', 'theme dracula', 'theme solarized-light', 'play snake']);

watch(() => ui.paletteOpen, (open) => {
  if (!open) query.value = '';
});

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
  <div v-if="ui.paletteOpen" class="fixed inset-0 bg-black/50 flex items-start justify-center p-4">
    <div class="bg-bg border border-border rounded w-full max-w-xl">
      <input v-model="query" class="w-full p-3 bg-transparent outline-none border-b border-border" placeholder="Type a command..." />
      <ul class="max-h-80 overflow-auto">
        <li
          v-for="s in suggestions.filter(s=>s.includes(query))"
          :key="s"
          class="px-3 py-2 hover:bg-bg-secondary cursor-pointer"
          @click="choose(s)"
        >{{ s }}</li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
</style>


