<script setup lang="ts">
import { onMounted, onUnmounted, ref, computed } from 'vue';

const canvasRef = ref<HTMLCanvasElement | null>(null);
let ctx: CanvasRenderingContext2D | null = null;

interface Point { x: number; y: number }
let snake: Point[] = [];
let dir: Point = { x: 1, y: 0 };
let food: Point = { x: 10, y: 10 };
let timer = 0 as number | undefined;
let cell = 18;
let cols = 30;
let rows = 20;
const scoreRef = ref(0);
const bestScoreRef = ref(0);
const gameState = ref<'playing' | 'paused' | 'gameover'>('playing');

function randFood() {
  food = { x: Math.floor(Math.random() * cols), y: Math.floor(Math.random() * rows) };
}

function loadBestScore() {
  bestScoreRef.value = Number(localStorage.getItem('snake_best') || '0');
}

function saveBestScore() {
  if (scoreRef.value > bestScoreRef.value) {
    bestScoreRef.value = scoreRef.value;
    localStorage.setItem('snake_best', String(scoreRef.value));
    return true; // new record
  }
  return false;
}

function reset() {
  const isNewRecord = saveBestScore();
  snake = [{ x: 5, y: 10 }];
  dir = { x: 1, y: 0 };
  scoreRef.value = 0;
  gameState.value = 'playing';
  randFood();
  return isNewRecord;
}

function step() {
  if (!ctx) return;
  const head = { x: snake[0].x + dir.x, y: snake[0].y + dir.y };
  // wrap
  head.x = (head.x + cols) % cols;
  head.y = (head.y + rows) % rows;

  // collision with self
  if (snake.some((s) => s.x === head.x && s.y === head.y)) {
    gameState.value = 'gameover';
    return;
  }

  snake.unshift(head);
  if (head.x === food.x && head.y === food.y) {
    scoreRef.value += 1;
    randFood();
  } else {
    snake.pop();
  }

  // draw
  ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--bg');
  ctx.fillRect(0, 0, cols * cell, rows * cell);

  // grid (subtle)
  ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--border');
  ctx.globalAlpha = 0.3;
  for (let x = 0; x < cols; x++) {
    ctx.beginPath();
    ctx.moveTo(x * cell + 0.5, 0);
    ctx.lineTo(x * cell + 0.5, rows * cell);
    ctx.stroke();
  }
  for (let y = 0; y < rows; y++) {
    ctx.beginPath();
    ctx.moveTo(0, y * cell + 0.5);
    ctx.lineTo(cols * cell, y * cell + 0.5);
    ctx.stroke();
  }
  ctx.globalAlpha = 1;

  // snake
  ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--primary');
  for (const p of snake) {
    ctx.fillRect(p.x * cell + 1, p.y * cell + 1, cell - 2, cell - 2);
  }
  // food
  ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--accent');
  ctx.beginPath();
  ctx.arc(food.x * cell + cell / 2, food.y * cell + cell / 2, cell / 2 - 2, 0, Math.PI * 2);
  ctx.fill();
}

function loop() {
  if (gameState.value === 'playing') {
    step();
  }
}

function onKey(e: KeyboardEvent) {
  if (gameState.value === 'gameover' && (e.key === ' ' || e.key === 'Enter' || e.key === 'r')) {
    reset();
    return;
  }
  
  if (gameState.value !== 'playing') return;
  
  if (e.key === 'ArrowUp' && dir.y !== 1) dir = { x: 0, y: -1 };
  else if (e.key === 'ArrowDown' && dir.y !== -1) dir = { x: 0, y: 1 };
  else if (e.key === 'ArrowLeft' && dir.x !== 1) dir = { x: -1, y: 0 };
  else if (e.key === 'ArrowRight' && dir.x !== -1) dir = { x: 1, y: 0 };
  else if (e.key === ' ') {
    gameState.value = gameState.value === 'playing' ? 'paused' : 'playing';
  }
}

onMounted(() => {
  const canvas = canvasRef.value!;
  canvas.width = cols * cell;
  canvas.height = rows * cell;
  ctx = canvas.getContext('2d');
  loadBestScore();
  reset();
  timer = window.setInterval(loop, 120);
  window.addEventListener('keydown', onKey);
});

onUnmounted(() => {
  if (timer) clearInterval(timer);
  window.removeEventListener('keydown', onKey);
  saveBestScore();
});

const speedLevel = computed(() => Math.floor(scoreRef.value / 5) + 1);
const gameStatus = computed(() => {
  if (gameState.value === 'gameover') return 'Game Over - Press R to restart';
  if (gameState.value === 'paused') return 'Paused - Press Space to continue';
  return `Speed: ${speedLevel.value}x`;
});
</script>

<template>
  <div class="relative">
    <canvas ref="canvasRef" class="block mx-auto border border-border rounded"></canvas>
    
    <!-- Score display -->
    <div class="absolute right-2 top-2 text-sm bg-bg-secondary/90 px-3 py-2 rounded border border-border space-y-1">
      <div class="flex justify-between gap-4">
        <span>Score:</span>
        <span class="font-mono text-accent">{{ scoreRef }}</span>
      </div>
      <div class="flex justify-between gap-4">
        <span>Best:</span>
        <span class="font-mono text-primary">{{ bestScoreRef }}</span>
      </div>
    </div>
    
    <!-- Game status -->
    <div class="absolute left-2 top-2 text-sm bg-bg-secondary/90 px-3 py-2 rounded border border-border">
      {{ gameStatus }}
    </div>
    
    <!-- Game over overlay -->
    <div v-if="gameState === 'gameover'" class="absolute inset-0 bg-black/50 flex items-center justify-center">
      <div class="bg-bg border border-border rounded p-6 text-center space-y-4">
        <h3 class="text-xl font-bold text-error">Game Over!</h3>
        <div class="space-y-2">
          <div>Final Score: <span class="text-accent font-mono">{{ scoreRef }}</span></div>
          <div v-if="scoreRef > 0 && scoreRef === bestScoreRef" class="text-primary">🎉 New Record!</div>
          <div v-else>Best: <span class="text-primary font-mono">{{ bestScoreRef }}</span></div>
        </div>
        <div class="text-sm text-text-muted">
          Press <kbd class="px-2 py-1 bg-bg-secondary rounded">R</kbd> or <kbd class="px-2 py-1 bg-bg-secondary rounded">Enter</kbd> to restart
        </div>
      </div>
    </div>
    
    <!-- Controls -->
    <div class="mt-4 text-center text-sm text-text-muted space-y-1">
      <div>Use arrow keys to move • <kbd class="px-2 py-1 bg-bg-secondary rounded">Space</kbd> to pause</div>
      <div>Eat food to grow and increase score</div>
    </div>
  </div>
</template>

<style scoped>
</style>


