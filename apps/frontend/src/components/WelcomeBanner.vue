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
  <Transition name="welcome">
    <div v-if="visible" class="mb-3 border border-primary/30 rounded bg-primary/10 p-4 text-sm">
      <div class="flex items-start justify-between">
        <div>
          <div class="font-semibold text-primary mb-2">🎉 Welcome to Terminal Portfolio!</div>
          <div class="text-text-muted mb-3">
            Type <code class="bg-bg-secondary px-1 rounded">help</code> to see available commands.
          </div>
          <div class="text-text-muted space-y-1 text-xs">
            <div>• Try <code class="bg-bg-secondary px-1 rounded">about</code> to learn about me</div>
            <div>• Use <code class="bg-bg-secondary px-1 rounded">projects</code> to see my work</div>
            <div>• Play <code class="bg-bg-secondary px-1 rounded">play snake</code> for some fun</div>
            <div>• Change theme with <code class="bg-bg-secondary px-1 rounded">theme</code></div>
            <div>• Mobile users: use the toolbar at the bottom</div>
          </div>
        </div>
        <button 
          @click="close"
          class="text-text-muted hover:text-text transition-colors p-1 rounded hover:bg-bg-secondary"
          aria-label="Dismiss welcome message"
        >
          ✕
        </button>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.welcome-enter-active,
.welcome-leave-active {
  transition: all 0.3s ease;
}

.welcome-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.welcome-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>



