<script setup lang="ts">
import { ref, watch } from 'vue';
import { useTerminalStore } from '../stores/terminal';

const terminal = useTerminalStore();
const announcement = ref('');

// Announce new output for screen readers
watch(() => terminal.output, (newOutput, oldOutput) => {
  if (newOutput.length > oldOutput.length) {
    const newLines = newOutput.slice(oldOutput.length);
    const text = newLines.map(l => l.text).join('. ');
    announcement.value = text;
    
    // Clear after announcement
    setTimeout(() => {
      announcement.value = '';
    }, 100);
  }
}, { deep: true });
</script>

<template>
  <!-- Screen reader only announcements -->
  <div class="sr-only" aria-live="polite" aria-atomic="true">
    {{ announcement }}
  </div>
</template>

<style>
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}
</style>
