<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useTerminalStore } from '../../stores/terminal';
import { sanitizeHtml } from '../../utils/sanitize';

const terminal = useTerminalStore();
const { output } = storeToRefs(terminal);
</script>

<template>
  <div class="space-y-1 font-mono text-base leading-relaxed" aria-live="polite">
    <div
      v-for="line in output"
      :key="line.id"
      class="whitespace-pre-wrap break-words"
      :class="{
        'text-text': line.role === 'stdout',
        'text-error': line.role === 'stderr',
        'text-text-muted': line.role === 'system',
      }"
    >
      <span v-html="sanitizeHtml(line.text)"></span>
    </div>
  </div>
  
</template>

<style scoped>
</style>


