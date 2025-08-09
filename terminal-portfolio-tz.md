# Техническое задание: Terminal Portfolio v3.0

## 📋 Общее описание проекта

### Концепция
Интерактивный веб-сайт портфолио, стилизованный под терминал с элементами геймификации, пасхалками и дружелюбным интерфейсом для пользователей без опыта работы с командной строкой.

### Технологический стек

#### Frontend
- **Framework:** Vue 3 (Composition API)
- **Build Tool:** Vite
- **State Management:** Pinia
- **Styling:** Tailwind CSS
- **Язык:** TypeScript (обязательно)
- **Анимации:** GSAP (для сложных эффектов)
- **Звуки:** Howler.js
- **Игры:** Canvas API
- **Локализация:** vue-i18n (с Этапа 1)

#### Backend (с Этапа 2)
- **Runtime:** Node.js + Express
- **База данных:** PostgreSQL
- **ORM:** Prisma
- **Валидация:** Zod (единственный источник истины)
- **Rate Limiting:** express-rate-limit
- **Real-time:** SSE (нативная реализация)

### Ключевые характеристики
- ✅ Гибридное приложение (клиент + API с Этапа 2)
- ✅ Desktop-first дизайн
- ✅ Прогрессивная геймификация
- ✅ Мультиязычность RU/EN (базовая с MVP)
- ✅ Расширяемая архитектура
- ✅ Полноцветные темы

---

## 🎨 Дизайн и UI/UX

### Цветовые схемы по этапам

#### MVP (Этап 1) - 2 темы
1. **Dracula** (темная, контраст текста ≥ 4.5:1)
2. **Solarized Light** (светлая, контраст текста ≥ 4.5:1)

#### Основной релиз (Этап 2) - +4 темы
3. **Catppuccin Mocha**
4. **Tokyo Night**
5. **Nord**
6. **High Contrast** (гарантированный контраст ≥ 7:1)

#### Полная версия (Этап 3) - +4 темы
7. **Gruvbox Dark**
8. **One Dark Pro**
9. **Monokai**
10. **Retro** (разблокируется через Konami Code)

### Токены цветов (CSS переменные)
```css
:root {
  --bg: /* основной фон */
  --bg-secondary: /* вторичный фон */
  --text: /* основной текст */
  --text-muted: /* приглушенный текст */
  --primary: /* основной акцент */
  --accent: /* дополнительный акцент */
  --success: /* зеленый */
  --warning: /* желтый */
  --error: /* красный */
  --info: /* синий */
  --border: /* границы */
  --shadow: /* тени */
}
```

---

## 💻 Функционал терминала

### Команды MVP (Этап 1)

| Команда | Описание | Локализация |
|---------|----------|-------------|
| `help` | Список доступных команд | RU/EN |
| `ls` | Показать содержимое директории | - |
| `cd` | Перейти в директорию | - |
| `cat` | Прочитать файл | - |
| `pwd` | Показать текущую директорию | - |
| `clear` | Очистить терминал | - |
| `about` | Информация о разработчике | RU/EN |
| `skills` | Технологии и навыки | RU/EN |
| `projects` | Список проектов | RU/EN |
| `contact` | Контактная информация | RU/EN |
| `theme` | Переключить тему | - |
| `sound` | Вкл/выкл звуки | - |
| `play snake` | Запустить Snake | - |

### Команды Основного релиза (Этап 2)

| Команда | Описание |
|---------|----------|
| `play tetris` | Запустить Tetris |
| `play pong` | Запустить Pong |
| `scores` | Таблица рекордов |
| `achievements` | Список достижений |
| `history` | История команд |

### Команды Полной версии (Этап 3)

| Команда | Описание |
|---------|----------|
| `resume` | Скачать CV |
| `experience` | Опыт работы |
| `education` | Образование |
| `lang` | Переключить язык RU/EN |
| `settings` | Wizard настроек терминала |
| `echo` | Вывести текст |
| `whoami` | Информация о владельце |
| `date` | Текущая дата и время |

**Для недоступных команд:**
```
Command 'tetris' will be available in version 2.0
Stay tuned for updates!
```

---

## 🎮 Мини-игры (Canvas реализация)

### Техническая реализация
```javascript
// Рендеринг в стиле терминала
class TerminalGameRenderer {
  constructor(canvas, theme) {
    this.ctx = canvas.getContext('2d');
    this.theme = theme;
    this.charWidth = 10;
    this.charHeight = 20;
  }
  
  drawBlock(x, y, color) {
    this.ctx.fillStyle = color || this.theme.primary;
    this.ctx.fillRect(
      x * this.charWidth,
      y * this.charHeight,
      this.charWidth - 1,
      this.charHeight - 1
    );
  }
}
```

### Игры по этапам
- **Этап 1:** Snake (локальные рекорды)
- **Этап 2:** Tetris, Pong (глобальные рекорды)
- **Backlog:** 2048, Breakout, Raycaster demo

---

## 🗄️ Backend и База данных (с Этапа 2)

### API Endpoints

#### Игровые рекорды
- `GET /api/scores/:game` - Топ-10 для игры
- `POST /api/scores` - Отправить рекорд
- `GET /api/scores/nonce` - Получить nonce для HMAC

#### Real-time (SSE)
```javascript
// Endpoint
GET /api/scores/stream?game=snake

// Формат событий
event: score
data: {"name":"ALEX","score":1337,"position":1}

event: heartbeat
data: {"time":1234567890}

// Клиент
const source = new EventSource('/api/scores/stream?game=snake');
source.addEventListener('score', (e) => {
  const data = JSON.parse(e.data);
  updateHighScores(data);
});
```

### Схема базы данных (Prisma)

```prisma
model GameScore {
  id           Int      @id @default(autoincrement())
  gameType     String   @db.VarChar(50)
  playerName   String   @db.VarChar(8)
  score        Int
  durationMs   Int      // milliseconds
  sessionId    String   @db.VarChar(255)
  ipHash       String   @db.VarChar(64)
  playedAt     DateTime @default(now()) @db.Timestamptz
  
  @@index([gameType, score(sort: Desc)])
}

model UserAchievement {
  id            Int      @id @default(autoincrement())
  sessionId     String   @db.VarChar(255)
  achievementId String   @db.VarChar(100)
  unlockedAt    DateTime @default(now()) @db.Timestamptz
  
  @@unique([sessionId, achievementId])
}

model UserSession {
  id         String   @id @db.VarChar(255)
  settings   Json     @db.JsonB
  createdAt  DateTime @default(now()) @db.Timestamptz
  lastActive DateTime @default(now()) @db.Timestamptz
}
```

### Античит система

```typescript
// 1. Клиент запрашивает nonce
GET /api/scores/nonce
Response: { nonce: "abc123", ttl: 120 }

// 2. HMAC подпись
const payload = `${game}:${score}:${durationMs}:${sessionId}:${nonce}`;
const signature = HMAC_SHA256(clientSecret, payload);

// 3. Валидация на сервере
- Nonce не истек (TTL 120 сек)
- Nonce не использован
- Подпись корректна
- Лимиты: Snake ≤9999, Tetris ≤99999, Pong ≤21
- Минимальная длительность: durationMs ≥ 5000
- Score/duration ratio в пределах разумного
```

### Обработка имен
1. Транслитерация RU→EN (библиотека transliteration)
2. toUpperCase()
3. Только A-Z0-9, длина 3-8
4. Profanity check (bad-words)

---

## 🥚 Пасхалки (Этап 3)

### Konami Code
- Комбинация: ↑↑↓↓←→←→BA
- Эффект: Разблокировка Retro темы
- Анимация: Глитч-эффект GSAP
- Достижение: "Back to the 80s"

### Скрытые команды
- `sudo rm -rf /` - юмористические ответы
- `matrix` - эффект падающих символов
- `coffee` - ASCII арт с анимацией
- `lo-fi` - фоновая музыка (после клика)

---

## 🚀 Этапы разработки

### 📦 MVP (Этап 1)

**Функционал:**
- Базовый терминал с командами
- 2 темы с контрастом ≥ 4.5:1
- Snake на Canvas (локальные рекорды)
- Виртуальная файловая система
- История и автодополнение
- Базовая RU/EN локализация для контента
- DOMPurify санитизация

**Accessibility:**
- Клавиатурная навигация
- aria-live="polite"
- Горячая клавиша M для mute
- ESC для отмены (Ctrl+C альтернатива)

**Mobile:**
- Command Palette (иконка "/")
- Фокус/расфокус input для клавиатуры
- Быстрые кнопки команд

### 🎮 Основной релиз (Этап 2)

**Добавляем:**
- 4 новые темы (включая High Contrast)
- Tetris и Pong
- Backend с PostgreSQL
- SSE для real-time
- HMAC античит
- 10 базовых достижений
- Глобальные таблицы рекордов

### 🌟 Полная версия (Этап 3)

**Добавляем:**
- 4 финальные темы
- Konami Code и пасхалки
- Wizard настроек
- 20+ достижений
- Звуковые эффекты (Howler.js)
- Полная RU/EN локализация
- Расширенные команды портфолио

### 🚧 Backlog

- GUI режим для новичков
- Tutorial с подсказками
- Дополнительные игры
- Raycaster 3D demo
- GitHub API интеграция
- PWA функционал

---

## ✅ Критерии приемки по этапам

### MVP (Этап 1)
- [ ] Базовые команды работают
- [ ] 2 темы с контрастом текста ≥ 4.5:1
- [ ] Snake игра с Canvas
- [ ] История команд в localStorage
- [ ] Клавиатурная навигация полная
- [ ] aria-live для screen readers
- [ ] M для глобального mute
- [ ] Базовая RU/EN локализация контента
- [ ] Mobile Command Palette

### Основной релиз (Этап 2)
- [ ] 6 тем (включая High Contrast ≥ 7:1)
- [ ] 3 игры с Canvas рендерингом
- [ ] Backend API с PostgreSQL
- [ ] SSE real-time обновления
- [ ] HMAC + nonce античит
- [ ] 10 достижений с анимациями
- [ ] Глобальные таблицы рекордов

### Полная версия (Этап 3)
- [ ] Все 10 тем
- [ ] Konami Code работает
- [ ] 20+ достижений
- [ ] Минимум 5 пасхалок
- [ ] Wizard настроек
- [ ] Звуковые эффекты
- [ ] Полная локализация всех элементов

### Производительность (все этапы)
- [ ] FCP < 1.5s
- [ ] TTI < 3s
- [ ] Lighthouse > 90
- [ ] 60 FPS в играх
- [ ] Виртуализация при 1000+ строк

---

## 🔧 Технические решения

### Управление
- **ESC** - основная отмена
- **Ctrl+C** - альтернативная отмена
- **M** - глобальный mute
- **Ctrl+Alt+Plus/Minus** - масштаб шрифта
- **Ctrl+K** - поиск в истории (вместо Ctrl+R)
- **Tab** - автодополнение

### Mobile
- Фокус/расфокус input (не обещаем "показ" клавиатуры)
- Command Palette для быстрого ввода
- Touch-friendly кнопки

### Приватность
- sessionId через nanoid
- IP как SHA256(salt + IP)
- Только localStorage, без cookies

### Аудио
- Разблокировка после первого клика
- Lo-fi только после явного действия

---

## 📦 Финальный стек

```json
{
  "frontend": {
    "core": ["Vue 3.4+", "TypeScript 5+", "Vite 5+", "Pinia"],
    "ui": ["Tailwind CSS 3.4"],
    "animations": ["GSAP 3.12"],
    "games": ["Canvas API"],
    "audio": ["Howler.js 2.2"],
    "utilities": [
      "vue-i18n",
      "vue-virtual-scroller",
      "DOMPurify",
      "nanoid",
      "transliteration"
    ]
  },
  "backend": {
    "core": ["Node.js 20+", "Express 4.19"],
    "database": ["PostgreSQL 16", "Prisma 5.7"],
    "security": [
      "helmet",
      "cors",
      "express-rate-limit",
      "bad-words"
    ],
    "utilities": ["zod", "crypto", "dotenv"]
  },
  "development": {
    "linting": ["ESLint", "Prettier"],
    "packageManager": "pnpm"
  }
}
```

---

*Версия ТЗ: 3.0.0 (финальная)*  
*Полнота: 100%*