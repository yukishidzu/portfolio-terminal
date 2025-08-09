<script setup lang="ts">
import TerminalOutput from './TerminalOutput.vue';
import TerminalInput from './TerminalInput.vue';
import TerminalPrompt from './TerminalPrompt.vue';
import CommandPalette from './CommandPalette.vue';
import Snake from '../../games/Snake.vue';
import { useUiStore } from '../../stores/ui';
import { storeToRefs } from 'pinia';
import WelcomeBanner from '../WelcomeBanner.vue';

const ui = useUiStore();
const { activeGame } = storeToRefs(ui);
</script>

<template>
  <div class="w-full max-w-6xl mx-auto">
    <WelcomeBanner />
    <div class="min-h-[70vh] border border-border rounded bg-bg-secondary/30 p-4 overflow-auto shadow-[0_0_0_1px_var(--shadow)]">
      <TerminalOutput />
    </div>
    <div class="mt-3">
      <div class="flex items-center gap-2">
        <TerminalPrompt />
        <div class="flex-1">
          <TerminalInput />
        </div>
      </div>
    </div>
    <CommandPalette />
    <div v-if="activeGame" class="fixed inset-0 bg-black/70 flex items-center justify-center p-4">
      <div class="relative bg-bg p-4 border border-border rounded w-fit max-w-full max-h-full overflow-auto">
        <button class="absolute top-2 right-2 border border-border rounded px-2 py-1" @click="ui.closeGame()">X</button>
        <Snake v-if="activeGame === 'snake'" />
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>


