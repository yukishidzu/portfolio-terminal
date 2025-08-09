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

  const resume: Command = {
    name: 'resume',
    description: 'Download CV / Скачать резюме',
    async execute(args) {
      const t = i18n.global.t;
      const lang = (args[0] as 'en' | 'ru' | undefined) || 'en';
      const link = document.createElement('a');
      link.href = `/cv-${lang}.pdf`;
      link.download = `resume-${lang}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      return t('resume.downloading') as string;
    },
  };

  const experience: Command = {
    name: 'experience',
    description: 'Work experience / Опыт работы',
    async execute() {
      const t = i18n.global.t;
      return (t('experience.output') as unknown as string[]);
    },
  };

  const education: Command = {
    name: 'education',
    description: 'Education / Образование',
    async execute() {
      const t = i18n.global.t;
      return (t('education.output') as unknown as string[]);
    },
  };

  return [about, skills, projects, contact, resume, experience, education];
}


