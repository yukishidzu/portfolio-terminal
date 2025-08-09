import DOMPurify from 'dompurify';

const urlRegex = /(https?:\/\/[^\s]+)/g;

export function linkify(text: string): string {
  return text.replace(urlRegex, (url) => `<a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a>`);
}

export function sanitizeHtml(text: string): string {
  const withLinks = linkify(text);
  return DOMPurify.sanitize(withLinks, { ALLOWED_TAGS: ['b','i','em','strong','a','code','pre','span','br'], ALLOWED_ATTR: ['href','target','rel','class'] });
}



