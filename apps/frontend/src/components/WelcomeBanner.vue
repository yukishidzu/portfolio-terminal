<script setup lang="ts">
import { ref, onMounted } from 'vue';

const visible = ref(false);
onMounted(() => {
  const seen = localStorage.getItem('welcome_seen');
  if (!seen) {
    visible.value = true;
    localStorage.setItem('welcome_seen', '1');
  }
});

function close() { visible.value = false; }
</script>

<template>
  <div v-if="visible" class="mb-3 border border-border rounded bg-bg-secondary/40 p-3 text-sm">
    <div class="flex items-center justify-between">
      <div>
        <div class="font-semibold">Welcome to Terminal Portfolio</div>
        <div class="text-text-muted">Type <span class="text-accent">help</span> to see commands. Try <span class="text-accent">about</span> or <span class="text-accent">play snake</span>.</div>
      </div>
      <button class="border border-border rounded px-2 py-1" @click="close">×</button>
    </div>
  </div>
</template>

<style scoped>
</style>



