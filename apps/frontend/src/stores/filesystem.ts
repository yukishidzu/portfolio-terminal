import { defineStore } from 'pinia';

export type FileType = 'file' | 'directory';

export interface VirtualFile {
  name: string;
  type: FileType;
  content?: string;
  children?: VirtualFile[];
  hidden?: boolean;
  encrypted?: boolean;
  permissions?: string;
}

function createInitialTree(): VirtualFile {
  return {
    name: '/',
    type: 'directory',
    children: [
      {
        name: 'home',
        type: 'directory',
        children: [
          {
            name: 'about.txt',
            type: 'file',
            content: `Full Stack Developer | 5+ years experience
Passionate about creating elegant solutions to complex problems.
Specializing in modern web technologies and cloud architecture.

Location: Your City
Languages: English (Fluent), Russian (Native)`
          },
          {
            name: 'skills.json',
            type: 'file',
            content: JSON.stringify({
              frontend: ['Vue.js', 'React', 'TypeScript', 'Tailwind CSS', 'Vite'],
              backend: ['Node.js', 'Express', 'PostgreSQL', 'Prisma', 'Redis'],
              tools: ['Docker', 'Git', 'CI/CD', 'AWS', 'Linux'],
              languages: ['JavaScript', 'TypeScript', 'Python', 'Go']
            }, null, 2)
          },
          {
            name: 'experience.md',
            type: 'file',
            content: `# Work Experience

## Senior Full Stack Developer
**TechCorp Inc.** | 2021 - Present
- Led development of microservices architecture
- Reduced API response time by 40%
- Mentored team of 5 junior developers

## Full Stack Developer  
**StartupXYZ** | 2019 - 2021
- Built real-time collaboration features
- Implemented CI/CD pipeline
- Improved test coverage from 20% to 80%`
          },
          {
            name: 'education.md',
            type: 'file',
            content: `# Education

## Bachelor of Computer Science
**University Name** | 2015 - 2019
- GPA: 3.8/4.0
- Focus: Software Engineering & AI

## Certifications
- AWS Certified Solutions Architect (2022)
- Google Cloud Professional Developer (2021)`
          },
          {
            name: '.secrets',
            type: 'file',
            hidden: true,
            content: 'You found a secret! Type "konami" for a surprise...'
          }
        ],
      },
      {
        name: 'projects',
        type: 'directory',
        children: [
          {
            name: 'terminal-portfolio',
            type: 'directory',
            children: [
              {
                name: 'README.md',
                type: 'file',
                content: `# Terminal Portfolio
Interactive terminal-style portfolio website.
Built with Vue 3, TypeScript, and love for terminals.

## Features
- Fully functional terminal emulator
- Multiple themes support
- Mini-games included
- Real-time command execution

[Demo](https://terminal-portfolio.example.com)
[GitHub](https://github.com/username/terminal-portfolio)`
              },
              {
                name: 'stack.txt',
                type: 'file',
                content: 'Vue 3 | TypeScript | Vite | Tailwind CSS | Canvas API'
              },
            ],
          },
          {
            name: 'ecommerce-platform',
            type: 'directory',
            children: [
              {
                name: 'README.md',
                type: 'file',
                content: `# E-Commerce Platform
Scalable e-commerce solution with 100k+ daily users.

## Tech Stack
- React + Next.js
- Node.js + GraphQL
- PostgreSQL + Redis
- Stripe Integration

[Live Demo](https://demo.example.com)`
              },
            ],
          },
          {
            name: 'ai-assistant',
            type: 'directory',
            children: [
              {
                name: 'README.md',
                type: 'file',
                content: `# AI Assistant Bot
Intelligent chat assistant using OpenAI API.

## Features
- Natural language processing
- Context-aware responses
- Multi-language support

[Try it](https://bot.example.com)`
              }
            ]
          }
        ],
      },
      {
        name: 'games',
        type: 'directory',
        children: [
          { name: 'snake.exe', type: 'file', content: 'binary' },
          { name: 'tetris.exe', type: 'file', content: 'binary', encrypted: true },
          { name: 'pong.exe', type: 'file', content: 'binary', encrypted: true },
          { name: '.highscores', type: 'file', hidden: true, content: 'SNAKE:1337\nTETRIS:9999' }
        ],
      },
      {
        name: 'contact',
        type: 'directory',
        children: [
          {
            name: 'email.txt',
            type: 'file',
            content: 'your.email@example.com'
          },
          {
            name: 'social.json',
            type: 'file',
            content: JSON.stringify({
              github: 'https://github.com/yourusername',
              linkedin: 'https://linkedin.com/in/yourprofile',
              telegram: '@yourtelegram',
              twitter: '@yourtwitter'
            }, null, 2)
          }
        ]
      }
    ],
  };
}

function resolvePathSegments(path: string): string[] {
  return path
    .replace(/\\/g, '/')
    .split('/')
    .filter(Boolean);
}

export const useFilesystemStore = defineStore('filesystem', {
  state: () => ({
    root: createInitialTree(),
  }),
  actions: {
    findNode(path: string): VirtualFile | null {
      if (path === '/' || path === '') return this.root;
      const segments = resolvePathSegments(path);
      let current: VirtualFile | undefined = this.root;
      for (const segment of segments) {
        if (!current || current.type !== 'directory' || !current.children) return null;
        current = current.children.find((c) => c.name === segment);
      }
      return current || null;
    },
    list(path: string, showHidden = false): VirtualFile[] | null {
      const node = this.findNode(path);
      if (!node || node.type !== 'directory' || !node.children) return null;
      let items = node.children;
      if (!showHidden) items = items.filter((f) => !f.hidden);
      return items
        .slice()
        .sort((a, b) => (a.type === b.type ? a.name.localeCompare(b.name) : a.type === 'directory' ? -1 : 1));
    },
    readFile(path: string): string | null {
      const node = this.findNode(path);
      if (!node || node.type !== 'file') return null;
      return node.content || '';
    },
    exists(path: string): boolean {
      return this.findNode(path) !== null;
    },
  },
});


