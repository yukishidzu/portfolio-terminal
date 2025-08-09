<script setup lang="ts">
import { useSettingsStore } from '../../stores/settings';
import { useTerminalStore } from '../../stores/terminal';

const settings = useSettingsStore();
const term = useTerminalStore();

// prompt component renders user@host path $
</script>

<template>
  <div class="flex items-center gap-2 select-none">
    <span class="text-accent">{{ settings.username }}@{{ settings.hostname }}</span>
    <span class="text-primary">{{ term.currentPath }}</span>
    <span class="text-text">$</span>
  </div>
</template>

<style scoped>
</style>


