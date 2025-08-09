<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useSettingsStore } from './stores/settings';
import TerminalShell from './components/Terminal/TerminalShell.vue';
import { useUiStore } from './stores/ui';
import MobileToolbar from './components/MobileToolbar.vue';

const settings = useSettingsStore();
const ui = useUiStore();
const soundLabel = computed(() => (settings.soundEnabled ? '🔊' : '🔇'));
const langLabel = computed(() => settings.language.toUpperCase());
function toggleSound() {
  settings.toggleSound();
}
function toggleLang() {
  settings.setLanguage(settings.language === 'en' ? 'ru' : 'en');
}

const time = ref('');
function updateTime() {
  time.value = new Date().toLocaleTimeString();
}
onMounted(() => {
  updateTime();
  setInterval(updateTime, 1000);
  window.addEventListener('keydown', (e) => {
    if (e.key.toLowerCase() === 'm') settings.toggleSound();
    if (e.key === 'Escape') ui.closeGame();
  });
});
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <header class="flex items-center justify-between px-4 py-2 border-b border-border text-sm sticky top-0 bg-bg/80 backdrop-blur">
      <div class="flex items-center gap-2">
        <button
          class="px-2 py-1 rounded border border-border hover:bg-bg-secondary"
          type="button"
          @click="toggleSound"
          :aria-label="$t(settings.soundEnabled ? 'status.sound_off' : 'status.sound_on') as string"
        >
          {{ soundLabel }}
        </button>
        <button
          class="px-2 py-1 rounded border border-border hover:bg-bg-secondary"
          type="button"
          @click="toggleLang"
          aria-label="Language"
        >
          {{ langLabel }}
        </button>
        <button class="px-2 py-1 rounded border border-border hover:bg-bg-secondary" @click="ui.openPalette()">/</button>
      </div>
      <div class="opacity-70 flex items-center gap-2">
        <span>{{ settings.theme === 'dracula' ? 'Dracula' : 'Solarized Light' }}</span>
        <button class="px-2 py-1 rounded border border-border hover:bg-bg-secondary" @click="settings.setTheme(settings.theme === 'dracula' ? 'solarized-light' : 'dracula')">switch</button>
      </div>
      <div class="opacity-70">{{ time }}</div>
    </header>

    <main class="flex-1 p-4">
      <TerminalShell />
    </main>
    
    <!-- Mobile toolbar -->
    <MobileToolbar />
  </div>
  
</template>

<style scoped>
</style>
