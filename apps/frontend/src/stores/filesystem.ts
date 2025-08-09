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
          { name: 'about.txt', type: 'file', content: 'Hello! This is a placeholder ABOUT. RU/EN will be added later.' },
          { name: 'skills.json', type: 'file', content: '{"skills":["Vue","TypeScript","Node.js"]}' },
          { name: 'experience.md', type: 'file', content: '# Experience\n\nPlaceholder' },
          { name: 'education.md', type: 'file', content: '# Education\n\nPlaceholder' },
        ],
      },
      {
        name: 'projects',
        type: 'directory',
        children: [
          {
            name: 'project1',
            type: 'directory',
            children: [
              { name: 'README.md', type: 'file', content: '# Project 1\nDemo placeholder' },
              { name: 'demo.link', type: 'file', content: 'https://example.com' },
            ],
          },
          { name: 'project2', type: 'directory', children: [] },
        ],
      },
      {
        name: 'games',
        type: 'directory',
        children: [
          { name: 'snake.exe', type: 'file', content: 'binary' },
          { name: 'tetris.exe', type: 'file', content: 'binary' },
          { name: 'pong.exe', type: 'file', content: 'binary' },
        ],
      },
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


