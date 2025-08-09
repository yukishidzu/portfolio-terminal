import type { Command } from './index';
import { useFilesystemStore } from '../stores/filesystem';
import { useTerminalStore } from '../stores/terminal';

function joinPath(base: string, segment: string): string {
  if (segment === '..') {
    const parts = base.split('/').filter(Boolean);
    parts.pop();
    return '/' + parts.join('/');
  }
  if (segment === '.' || segment === '') return base;
  if (segment.startsWith('/')) return segment;
  const slash = base === '/' ? '' : base;
  return `${slash}/${segment}`.replace(/\/+/g, '/');
}

export function createFsCommands(): Command[] {
  const fs = useFilesystemStore();
  const term = useTerminalStore();

  const ls: Command = {
    name: 'ls',
    description: 'List directory contents',
    async execute(args) {
      const showHidden = args.includes('-la') || args.includes('-a');
      const target = args.find((a) => !a.startsWith('-')) || term.currentPath.replace('~', '/home');
      const list = fs.list(target, showHidden);
      if (!list) return `ls: cannot access '${target}': No such file or directory`;
      // two-column layout
      const names = list.map((f) => (f.type === 'directory' ? f.name + '/' : f.name));
      const colWidth = Math.max(...names.map((n) => n.length)) + 2;
      let out = '';
      for (let i = 0; i < names.length; i += 2) {
        const left = names[i] ?? '';
        const right = names[i + 1] ?? '';
        out += left.padEnd(colWidth, ' ') + right + '\n';
      }
      return out.trimEnd();
    },
  };

  const cd: Command = {
    name: 'cd',
    description: 'Change directory',
    async execute(args) {
      const to = args[0];
      if (!to) return 'Usage: cd <path>';
      const base = term.currentPath === '~' ? '/home' : term.currentPath;
      const nextPath = joinPath(base, to);
      const node = fs.findNode(nextPath);
      if (!node) return `cd: no such file or directory: ${to}`;
      if (node.type !== 'directory') return `cd: not a directory: ${to}`;
      term.setPath(nextPath === '/home' ? '~' : nextPath);
    },
  };

  const cat: Command = {
    name: 'cat',
    description: 'Print file content',
    async execute(args) {
      const target = args[0];
      if (!target) return 'Usage: cat <file>';
      const base = term.currentPath === '~' ? '/home' : term.currentPath;
      const full = joinPath(base, target);
      const content = fs.readFile(full);
      if (content == null) return `cat: ${target}: No such file`;
      return content.split('\n');
    },
  };

  const pwd: Command = {
    name: 'pwd',
    description: 'Print working directory',
    async execute() {
      return term.currentPath;
    },
  };

  return [ls, cd, cat, pwd];
}


