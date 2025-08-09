<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';

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

function randFood() {
  food = { x: Math.floor(Math.random() * cols), y: Math.floor(Math.random() * rows) };
}

function reset() {
  snake = [{ x: 5, y: 10 }];
  dir = { x: 1, y: 0 };
  scoreRef.value = 0;
  randFood();
}

function step() {
  if (!ctx) return;
  const head = { x: snake[0].x + dir.x, y: snake[0].y + dir.y };
  // wrap
  head.x = (head.x + cols) % cols;
  head.y = (head.y + rows) % rows;

  // collision with self
  if (snake.some((s) => s.x === head.x && s.y === head.y)) {
    reset();
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
  step();
}

function onKey(e: KeyboardEvent) {
  if (e.key === 'ArrowUp' && dir.y !== 1) dir = { x: 0, y: -1 };
  else if (e.key === 'ArrowDown' && dir.y !== -1) dir = { x: 0, y: 1 };
  else if (e.key === 'ArrowLeft' && dir.x !== 1) dir = { x: -1, y: 0 };
  else if (e.key === 'ArrowRight' && dir.x !== -1) dir = { x: 1, y: 0 };
}

onMounted(() => {
  const canvas = canvasRef.value!;
  canvas.width = cols * cell;
  canvas.height = rows * cell;
  ctx = canvas.getContext('2d');
  reset();
  timer = window.setInterval(loop, 120);
  window.addEventListener('keydown', onKey);
  // Ensure score starts from 0
  scoreRef.value = 0;
});

onUnmounted(() => {
  if (timer) clearInterval(timer);
  window.removeEventListener('keydown', onKey);
  const best = Number(localStorage.getItem('snake_best') || '0');
  if (scoreRef.value > best) localStorage.setItem('snake_best', String(scoreRef.value));
});
</script>

<template>
  <div class="relative">
    <canvas ref="canvasRef" class="block mx-auto border border-border rounded"></canvas>
    <div class="absolute right-2 top-2 text-sm bg-bg-secondary/70 px-2 py-1 rounded border border-border">
      Score: {{ scoreRef }}
    </div>
  </div>
</template>

<style scoped>
</style>


