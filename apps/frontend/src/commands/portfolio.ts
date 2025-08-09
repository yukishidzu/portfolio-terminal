import type { Command } from './index';
import i18n from '../i18n';

export function createPortfolioCommands(): Command[] {
  const about: Command = {
    name: 'about',
    description: 'About the developer',
    async execute() {
      const t = i18n.global.t;
      return (t('about.output') as unknown as string[]);
    },
  };

  const skills: Command = {
    name: 'skills',
    description: 'Skills overview',
    async execute() {
      const t = i18n.global.t;
      const lines = t('skills.output') as unknown as string[];
      return ['Skills:', ...lines];
    },
  };

  const projects: Command = {
    name: 'projects',
    description: 'Projects list',
    async execute() {
      const t = i18n.global.t;
      return (t('projects.output') as unknown as string[]);
    },
  };

  const contact: Command = {
    name: 'contact',
    description: 'Contact info',
    async execute() {
      const t = i18n.global.t;
      return (t('contact.output') as unknown as string[]);
    },
  };

  return [about, skills, projects, contact];
}


