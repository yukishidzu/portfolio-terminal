import { getRegistry } from '../commands/registry';
import { useFilesystemStore } from '../stores/filesystem';

export interface Suggestion {
  value: string;
  type: 'command' | 'file' | 'directory' | 'argument';
  description?: string;
}

export class AutocompleteEngine {
  private fs = useFilesystemStore();
  
  getSuggestions(input: string, currentPath: string): Suggestion[] {
    const parts = input.trim().split(/\s+/);
    const command = parts[0]?.toLowerCase() || '';
    const lastArg = parts[parts.length - 1] || '';
    
    // If typing first word, suggest commands
    if (parts.length <= 1) {
      return this.getCommandSuggestions(command);
    }
    
    // Context-aware suggestions based on command
    switch (command) {
      case 'cd':
        return this.getDirectorySuggestions(lastArg, currentPath);
      case 'cat':
      case 'less':
      case 'more':
        return this.getFileSuggestions(lastArg, currentPath);
      case 'theme':
        return this.getThemeSuggestions(lastArg);
      case 'lang':
        return this.getLanguageSuggestions(lastArg);
      case 'play':
        return this.getGameSuggestions(lastArg);
      default:
        return [];
    }
  }
  
  private getCommandSuggestions(prefix: string): Suggestion[] {
    const registry = getRegistry();
    const commands = registry.getAvailable();
    
    return commands
      .filter(cmd => cmd.name.startsWith(prefix))
      .map(cmd => ({
        value: cmd.name,
        type: 'command' as const,
        description: cmd.description
      }));
  }
  
  private getDirectorySuggestions(prefix: string, currentPath: string): Suggestion[] {
    const path = currentPath === '~' ? '/home' : currentPath;
    const items = this.fs.list(path, false);
    if (!items) return [];
    
    return items
      .filter(item => item.type === 'directory')
      .filter(item => item.name.startsWith(prefix))
      .map(item => ({
        value: item.name,
        type: 'directory' as const,
        description: 'directory'
      }));
  }
  
  private getFileSuggestions(prefix: string, currentPath: string): Suggestion[] {
    const path = currentPath === '~' ? '/home' : currentPath;
    const items = this.fs.list(path, false);
    if (!items) return [];
    
    return items
      .filter(item => item.type === 'file')
      .filter(item => item.name.startsWith(prefix))
      .map(item => ({
        value: item.name,
        type: 'file' as const,
        description: 'file'
      }));
  }
  
  private getThemeSuggestions(prefix: string): Suggestion[] {
    const themes = ['dracula', 'solarized-light'];
    return themes
      .filter(t => t.startsWith(prefix))
      .map(t => ({
        value: t,
        type: 'argument' as const,
        description: 'theme'
      }));
  }
  
  private getLanguageSuggestions(prefix: string): Suggestion[] {
    const langs = ['en', 'ru'];
    return langs
      .filter(l => l.startsWith(prefix))
      .map(l => ({
        value: l,
        type: 'argument' as const,
        description: 'language'
      }));
  }
  
  private getGameSuggestions(prefix: string): Suggestion[] {
    const games = ['snake', 'tetris', 'pong'];
    return games
      .filter(g => g.startsWith(prefix))
      .map(g => ({
        value: g,
        type: 'argument' as const,
        description: g === 'snake' ? 'available' : 'coming in v2.0'
      }));
  }
}
